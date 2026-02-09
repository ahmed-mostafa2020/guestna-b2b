import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const PROJECT_PATH = process.env.PROJECT_PATH;

// Helper: stash local changes, returns whether stash was created
async function stashChanges(steps) {
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
  return hasStash;
}

// Helper: pop stash if it was created
async function popStash(hasStash, steps) {
  if (!hasStash) return;
  try {
    await execAsync("git stash pop", { cwd: PROJECT_PATH, timeout: 15000 });
    steps.push("Stash pop: restored local changes");
  } catch {
    steps.push("Stash pop: conflict — run 'git stash pop' manually");
  }
}

// Helper: get current branch name
async function getCurrentBranch() {
  try {
    const result = await execAsync("git rev-parse --abbrev-ref HEAD", {
      cwd: PROJECT_PATH,
    });
    return result.stdout.trim();
  } catch {
    return "";
  }
}

// GET: Fetch branches + last merge info on main
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

    const currentBranch = PROJECT_PATH ? await getCurrentBranch() : "";

    // Get last merge commit on main
    let lastMergeInfo = null;
    if (PROJECT_PATH) {
      try {
        await execAsync("git fetch --all --prune", {
          cwd: PROJECT_PATH,
          timeout: 30000,
        });
        const { stdout: mergeLog } = await execAsync(
          'git log origin/main --merges --oneline -1 --format="%H|%s|%ar"',
          { cwd: PROJECT_PATH }
        );
        if (mergeLog.trim()) {
          const [hash, message, timeAgo] = mergeLog.trim().split("|");
          const branchMatch = message.match(
            /Merge branch '([^']+)'|Merge remote-tracking branch '([^']+)'|Merge (\S+) into/
          );
          const mergedBranch = branchMatch
            ? branchMatch[1] || branchMatch[2] || branchMatch[3]
            : null;
          lastMergeInfo = { hash, message, timeAgo, branch: mergedBranch };
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({
      branches: branches.map((b) => ({
        name: b.name,
        sha: b.commit.sha,
        protected: b.protected,
      })),
      currentBranch,
      lastMergeInfo,
    });
  } catch (error) {
    console.error("Git control GET error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: merge_to_main or unmerge
export async function POST(request) {
  if (!PROJECT_PATH) {
    return NextResponse.json(
      { error: "Missing PROJECT_PATH in environment variables" },
      { status: 500 }
    );
  }

  try {
    const { action, branchName } = await request.json();
    const steps = [];

    // ─── MERGE TO MAIN: merge a branch into main and push ───
    if (action === "merge_to_main") {
      if (!branchName) {
        return NextResponse.json(
          { error: "Missing branchName" },
          { status: 400 }
        );
      }

      const safeBranch = branchName.replace(/[^a-zA-Z0-9_\-/.]/g, "");
      if (safeBranch !== branchName) {
        return NextResponse.json(
          { error: "Invalid branch name characters" },
          { status: 400 }
        );
      }

      // Step 1: Fetch
      await execAsync("git fetch --all --prune", {
        cwd: PROJECT_PATH,
        timeout: 30000,
      });
      steps.push("Fetch: OK");

      // Step 2: Stash
      const hasStash = await stashChanges(steps);

      // Step 3: Checkout main
      try {
        await execAsync("git checkout main", {
          cwd: PROJECT_PATH,
          timeout: 30000,
        });
        steps.push("Checkout main: OK");
      } catch (e) {
        await popStash(hasStash, steps);
        return NextResponse.json(
          {
            success: false,
            error:
              "Failed to checkout main: " + (e.stderr?.trim() || e.message),
            steps,
          },
          { status: 500 }
        );
      }

      // Step 4: Pull latest main
      try {
        await execAsync("git pull origin main", {
          cwd: PROJECT_PATH,
          timeout: 60000,
        });
        steps.push("Pull main: OK");
      } catch (pullErr) {
        steps.push(
          `Pull main warning: ${pullErr.stderr?.trim() || pullErr.message}`
        );
      }

      // Step 5: Merge the feature branch INTO main
      try {
        const mergeResult = await execAsync(
          `git merge origin/${safeBranch} --no-edit`,
          { cwd: PROJECT_PATH, timeout: 60000 }
        );
        steps.push(
          `Merge ${safeBranch} into main: ${mergeResult.stdout.trim() || "OK"}`
        );
      } catch (mergeError) {
        try {
          await execAsync("git merge --abort", { cwd: PROJECT_PATH });
        } catch {
          // ignore
        }
        await popStash(hasStash, steps);
        return NextResponse.json(
          {
            success: false,
            error: `Merge conflict merging ${safeBranch} into main. Merge was aborted.`,
            stderr: mergeError.stderr?.trim() || mergeError.message,
            steps,
          },
          { status: 409 }
        );
      }

      // Step 6: Push main to trigger Vercel deployment
      try {
        await execAsync("git push origin main", {
          cwd: PROJECT_PATH,
          timeout: 60000,
        });
        steps.push("Push main: OK — Vercel deployment triggered");
      } catch (pushErr) {
        steps.push(
          `Push warning: ${pushErr.stderr?.trim() || pushErr.message}`
        );
      }

      // Step 7: Restore stash
      await popStash(hasStash, steps);

      return NextResponse.json({
        success: true,
        action: "merge_to_main",
        branch: safeBranch,
        stdout: steps.join("\n"),
        currentBranch: await getCurrentBranch(),
      });
    }

    // ─── UNMERGE: revert the last merge commit on main ───
    if (action === "unmerge") {
      // Step 1: Fetch
      await execAsync("git fetch --all --prune", {
        cwd: PROJECT_PATH,
        timeout: 30000,
      });
      steps.push("Fetch: OK");

      // Step 2: Stash
      const hasStash = await stashChanges(steps);

      // Step 3: Checkout main
      try {
        await execAsync("git checkout main", {
          cwd: PROJECT_PATH,
          timeout: 30000,
        });
        steps.push("Checkout main: OK");
      } catch (e) {
        await popStash(hasStash, steps);
        return NextResponse.json(
          {
            success: false,
            error:
              "Failed to checkout main: " + (e.stderr?.trim() || e.message),
            steps,
          },
          { status: 500 }
        );
      }

      // Step 4: Pull latest main
      try {
        await execAsync("git pull origin main", {
          cwd: PROJECT_PATH,
          timeout: 60000,
        });
        steps.push("Pull main: OK");
      } catch (pullErr) {
        steps.push(
          `Pull main warning: ${pullErr.stderr?.trim() || pullErr.message}`
        );
      }

      // Step 5: Find last merge commit
      let lastMergeHash = "";
      let lastMergeMessage = "";
      try {
        const { stdout: mergeLog } = await execAsync(
          'git log HEAD --merges --oneline -1 --format="%H|%s"',
          { cwd: PROJECT_PATH }
        );
        if (mergeLog.trim()) {
          const parts = mergeLog.trim().split("|");
          lastMergeHash = parts[0];
          lastMergeMessage = parts.slice(1).join("|");
        }
      } catch {
        // ignore
      }

      if (!lastMergeHash) {
        await popStash(hasStash, steps);
        return NextResponse.json(
          {
            success: false,
            error: "No merge commit found on main to revert.",
            steps,
          },
          { status: 400 }
        );
      }

      // Step 6: Revert the merge
      try {
        const revertResult = await execAsync(
          `git revert -m 1 ${lastMergeHash} --no-edit`,
          { cwd: PROJECT_PATH, timeout: 60000 }
        );
        steps.push(
          `Revert merge: ${revertResult.stdout.trim() || "OK"} (${lastMergeMessage})`
        );
      } catch (revertErr) {
        try {
          await execAsync("git revert --abort", { cwd: PROJECT_PATH });
        } catch {
          // ignore
        }
        await popStash(hasStash, steps);
        return NextResponse.json(
          {
            success: false,
            error: "Revert failed due to conflicts. Revert was aborted.",
            stderr: revertErr.stderr?.trim() || revertErr.message,
            steps,
          },
          { status: 409 }
        );
      }

      // Step 7: Push the revert
      try {
        await execAsync("git push origin main", {
          cwd: PROJECT_PATH,
          timeout: 60000,
        });
        steps.push("Push main: OK — Vercel will redeploy");
      } catch (pushErr) {
        steps.push(
          `Push warning: ${pushErr.stderr?.trim() || pushErr.message}`
        );
      }

      // Step 8: Restore stash
      await popStash(hasStash, steps);

      return NextResponse.json({
        success: true,
        action: "unmerge",
        branch: "main",
        stdout: steps.join("\n"),
        currentBranch: await getCurrentBranch(),
        revertedMerge: lastMergeMessage,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'merge_to_main' or 'unmerge'" },
      { status: 400 }
    );
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
