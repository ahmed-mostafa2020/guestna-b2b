import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const PROJECT_PATH = process.env.PROJECT_PATH;

// GET: Fetch branches from GitHub API
export async function GET() {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "Missing GitHub configuration in environment variables" },
      { status: 500 }
    );
  }

  try {
    const branches = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches?per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.message || "Failed to fetch branches" },
          { status: response.status }
        );
      }

      const data = await response.json();
      branches.push(...data);

      hasMore = data.length === 100;
      page++;
    }

    // Get current branch
    let currentBranch = "";
    if (PROJECT_PATH) {
      try {
        const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD", {
          cwd: PROJECT_PATH,
        });
        currentBranch = stdout.trim();
      } catch {
        currentBranch = "";
      }
    }

    return NextResponse.json({
      branches: branches.map((b) => ({
        name: b.name,
        sha: b.commit.sha,
        protected: b.protected,
      })),
      currentBranch,
    });
  } catch (error) {
    console.error("Git control GET error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Checkout branch, pull, and merge with main
export async function POST(request) {
  if (!PROJECT_PATH) {
    return NextResponse.json(
      { error: "Missing PROJECT_PATH in environment variables" },
      { status: 500 }
    );
  }

  try {
    const { branchName } = await request.json();

    if (!branchName) {
      return NextResponse.json(
        { error: "Missing branchName" },
        { status: 400 }
      );
    }

    // Sanitize branch name to prevent command injection
    const safeBranch = branchName.replace(/[^a-zA-Z0-9_\-/.]/g, "");
    if (safeBranch !== branchName) {
      return NextResponse.json(
        { error: "Invalid branch name characters" },
        { status: 400 }
      );
    }

    const steps = [];

    // Step 1: Fetch latest refs
    await execAsync("git fetch --all --prune", {
      cwd: PROJECT_PATH,
      timeout: 30000,
    });
    steps.push("Fetch: OK");

    // Step 2: Stash local changes so checkout doesn't fail
    let hasStash = false;
    try {
      const stashResult = await execAsync("git stash --include-untracked", {
        cwd: PROJECT_PATH,
        timeout: 15000,
      });
      hasStash = !stashResult.stdout.includes("No local changes to save");
      steps.push(
        hasStash ? "Stash: saved local changes" : "Stash: nothing to stash"
      );
    } catch {
      steps.push("Stash: skipped");
    }

    // Step 3: Checkout the branch
    try {
      const checkoutResult = await execAsync(`git checkout ${safeBranch}`, {
        cwd: PROJECT_PATH,
        timeout: 30000,
      });
      steps.push(
        `Checkout: ${checkoutResult.stdout.trim() || checkoutResult.stderr.trim() || "OK"}`
      );
    } catch {
      // Branch doesn't exist locally, create from remote
      const checkoutResult = await execAsync(
        `git checkout -b ${safeBranch} origin/${safeBranch}`,
        { cwd: PROJECT_PATH, timeout: 30000 }
      );
      steps.push(
        `Checkout (new): ${checkoutResult.stdout.trim() || checkoutResult.stderr.trim() || "OK"}`
      );
    }

    // Step 4: Pull latest for this branch
    try {
      const pullResult = await execAsync(`git pull origin ${safeBranch}`, {
        cwd: PROJECT_PATH,
        timeout: 60000,
      });
      steps.push(`Pull: ${pullResult.stdout.trim() || "OK"}`);
    } catch (pullError) {
      steps.push(
        `Pull warning: ${pullError.stderr?.trim() || pullError.message}`
      );
    }

    // Step 5: Merge main into this branch
    try {
      const mergeResult = await execAsync("git merge origin/main --no-edit", {
        cwd: PROJECT_PATH,
        timeout: 60000,
      });
      steps.push(`Merge main: ${mergeResult.stdout.trim() || "OK"}`);
    } catch (mergeError) {
      // Abort merge on conflict so the repo isn't left in a broken state
      try {
        await execAsync("git merge --abort", { cwd: PROJECT_PATH });
      } catch {
        // ignore abort errors
      }
      // Re-apply stash even on merge failure
      if (hasStash) {
        try {
          await execAsync("git stash pop", {
            cwd: PROJECT_PATH,
            timeout: 15000,
          });
        } catch {
          steps.push("Stash pop: failed — run 'git stash pop' manually");
        }
      }
      return NextResponse.json(
        {
          success: false,
          error: "Merge conflict with main. Merge was aborted.",
          stderr: mergeError.stderr?.trim() || mergeError.message,
          steps,
        },
        { status: 409 }
      );
    }

    // Step 6: Re-apply stashed changes
    if (hasStash) {
      try {
        await execAsync("git stash pop", { cwd: PROJECT_PATH, timeout: 15000 });
        steps.push("Stash pop: restored local changes");
      } catch {
        steps.push("Stash pop: conflict — run 'git stash pop' manually");
      }
    }

    // Get updated current branch
    let currentBranch = "";
    try {
      const result = await execAsync("git rev-parse --abbrev-ref HEAD", {
        cwd: PROJECT_PATH,
      });
      currentBranch = result.stdout.trim();
    } catch {
      currentBranch = "";
    }

    return NextResponse.json({
      success: true,
      branch: safeBranch,
      stdout: steps.join("\n"),
      currentBranch,
    });
  } catch (error) {
    console.error("Git control POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Command execution failed",
        stderr: error.stderr?.trim() || "",
      },
      { status: 500 }
    );
  }
}
