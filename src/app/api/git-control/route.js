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

// POST: Execute git checkout or git pull
export async function POST(request) {
  if (!PROJECT_PATH) {
    return NextResponse.json(
      { error: "Missing PROJECT_PATH in environment variables" },
      { status: 500 }
    );
  }

  try {
    const { action, branchName } = await request.json();

    if (!action || !branchName) {
      return NextResponse.json(
        { error: "Missing action or branchName" },
        { status: 400 }
      );
    }

    if (!["checkout", "pull"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'checkout' or 'pull'" },
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

    // Always fetch latest refs first
    await execAsync("git fetch --all --prune", {
      cwd: PROJECT_PATH,
      timeout: 30000,
    });

    let stdout = "";
    let stderr = "";

    if (action === "checkout") {
      try {
        // Try normal checkout (local branch exists)
        const result = await execAsync(`git checkout ${safeBranch}`, {
          cwd: PROJECT_PATH,
          timeout: 30000,
        });
        stdout = result.stdout;
        stderr = result.stderr;
      } catch {
        // Branch doesn't exist locally, create from remote
        const result = await execAsync(
          `git checkout -b ${safeBranch} origin/${safeBranch}`,
          { cwd: PROJECT_PATH, timeout: 30000 }
        );
        stdout = result.stdout;
        stderr = result.stderr;
      }
    } else if (action === "pull") {
      const result = await execAsync(`git pull origin ${safeBranch}`, {
        cwd: PROJECT_PATH,
        timeout: 60000,
      });
      stdout = result.stdout;
      stderr = result.stderr;
    }

    // Get updated current branch after action
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
      action,
      branch: safeBranch,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
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
