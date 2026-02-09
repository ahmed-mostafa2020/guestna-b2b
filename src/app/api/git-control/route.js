import { NextResponse } from "next/server";

// Force dynamic rendering — never cache this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

// Helper: GitHub API request
async function ghFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...HEADERS, ...options.headers },
    cache: "no-store",
  });
  const data = res.status === 204 ? null : await res.json();
  return { ok: res.ok, status: res.status, data };
}

// Helper: get time ago string from ISO date
function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

// Helper: extract branch name from merge commit message
function extractBranchFromMessage(message) {
  if (!message) return null;
  const patterns = [
    /Merge pull request #\d+ from [^/]+\/(\S+)/,
    /Merge branch '([^']+)'/,
    /Merge remote-tracking branch '(?:origin\/)?([^']+)'/,
    /Merge (\S+) into/,
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// GET: Fetch branches + last merge info on main (all via GitHub API)
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
      const { ok, data, status } = await ghFetch(
        `/branches?per_page=100&page=${page}`
      );

      if (!ok) {
        return NextResponse.json(
          { error: data?.message || "Failed to fetch branches" },
          { status }
        );
      }

      branches.push(...data);
      hasMore = data.length === 100;
      page++;
    }

    // Get latest commit on main + last merge commit via GitHub API
    let lastMergeInfo = null;
    try {
      const { ok, data } = await ghFetch(`/commits?sha=main&per_page=20`);
      if (ok && data?.length) {
        // Latest commit on main (first in the list)
        const latest = data[0];
        const latestMessage = latest.commit?.message || "";
        const latestDate =
          latest.commit?.committer?.date || latest.commit?.author?.date;
        const isMerge = latest.parents && latest.parents.length === 2;

        lastMergeInfo = {
          hash: latest.sha,
          message: latestMessage,
          timeAgo: timeAgo(latestDate),
          branch: isMerge ? extractBranchFromMessage(latestMessage) : null,
          isMerge,
        };
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      branches: branches.map((b) => ({
        name: b.name,
        sha: b.commit.sha,
        protected: b.protected,
      })),
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

// POST: merge_to_main or unmerge (all via GitHub API — works on Vercel + localhost)
export async function POST(request) {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "Missing GitHub configuration in environment variables" },
      { status: 500 }
    );
  }

  try {
    const { action, branchName } = await request.json();
    const steps = [];

    // ─── MERGE TO MAIN: merge a branch into main via GitHub API ───
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

      // Use GitHub Merge API: POST /repos/{owner}/{repo}/merges
      const { ok, status, data } = await ghFetch("/merges", {
        method: "POST",
        body: JSON.stringify({
          base: "main",
          head: safeBranch,
          commit_message: `Merge branch '${safeBranch}' into main`,
        }),
      });

      if (status === 204) {
        steps.push(`Branch ${safeBranch} is already up to date with main`);
        return NextResponse.json({
          success: true,
          action: "merge_to_main",
          branch: safeBranch,
          stdout: steps.join("\n"),
        });
      }

      if (status === 409) {
        return NextResponse.json(
          {
            success: false,
            error: `Merge conflict merging ${safeBranch} into main. Resolve conflicts and try again.`,
            steps: ["Merge: CONFLICT"],
          },
          { status: 409 }
        );
      }

      if (status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: `Branch "${safeBranch}" or "main" not found.`,
          },
          { status: 404 }
        );
      }

      if (!ok) {
        return NextResponse.json(
          {
            success: false,
            error: data?.message || "Merge failed",
          },
          { status: status || 500 }
        );
      }

      steps.push(`Merge ${safeBranch} into main: OK`);
      steps.push(`Commit: ${data?.sha?.slice(0, 8)}`);
      steps.push("Pushed to main — Vercel deployment triggered");

      return NextResponse.json({
        success: true,
        action: "merge_to_main",
        branch: safeBranch,
        stdout: steps.join("\n"),
        sha: data?.sha,
      });
    }

    // ─── UNMERGE: revert the last merge commit on main via GitHub API ───
    if (action === "unmerge") {
      // Step 1: Get recent commits on main to find last merge
      const { ok: commitsOk, data: commits } = await ghFetch(
        `/commits?sha=main&per_page=20`
      );

      if (!commitsOk || !commits?.length) {
        return NextResponse.json(
          { success: false, error: "Failed to fetch commits on main." },
          { status: 500 }
        );
      }

      // Find the first merge commit (has 2 parents)
      const mergeCommit = commits.find(
        (c) => c.parents && c.parents.length === 2
      );

      if (!mergeCommit) {
        return NextResponse.json(
          {
            success: false,
            error: "No merge commit found on main to revert.",
          },
          { status: 400 }
        );
      }

      const mergeMessage = mergeCommit.commit?.message || "";
      steps.push(
        `Found merge: ${mergeCommit.sha.slice(0, 8)} — ${mergeMessage}`
      );

      // Step 2: Get the first parent commit (main before merge) to get its tree
      const firstParentSha = mergeCommit.parents[0].sha;
      const { ok: parentOk, data: parentCommit } = await ghFetch(
        `/git/commits/${firstParentSha}`
      );

      if (!parentOk) {
        return NextResponse.json(
          { success: false, error: "Failed to fetch parent commit." },
          { status: 500 }
        );
      }

      const parentTreeSha = parentCommit.tree.sha;
      steps.push(`Parent tree: ${parentTreeSha.slice(0, 8)}`);

      // Step 3: Get current main HEAD sha
      const { ok: refOk, data: refData } = await ghFetch(`/git/ref/heads/main`);

      if (!refOk) {
        return NextResponse.json(
          { success: false, error: "Failed to get main branch ref." },
          { status: 500 }
        );
      }

      const currentMainSha = refData.object.sha;

      // Step 4: Create a new commit that reverts the merge
      const { ok: commitOk, data: newCommit } = await ghFetch(`/git/commits`, {
        method: "POST",
        body: JSON.stringify({
          message: `Revert "${mergeMessage}"`,
          tree: parentTreeSha,
          parents: [currentMainSha],
        }),
      });

      if (!commitOk) {
        return NextResponse.json(
          {
            success: false,
            error: newCommit?.message || "Failed to create revert commit.",
          },
          { status: 500 }
        );
      }

      steps.push(`Revert commit created: ${newCommit.sha.slice(0, 8)}`);

      // Step 5: Update main ref to point to the new revert commit
      const { ok: updateOk, data: updateData } = await ghFetch(
        `/git/refs/heads/main`,
        {
          method: "PATCH",
          body: JSON.stringify({
            sha: newCommit.sha,
            force: false,
          }),
        }
      );

      if (!updateOk) {
        return NextResponse.json(
          {
            success: false,
            error:
              updateData?.message ||
              "Failed to update main branch. The revert commit was created but not applied.",
          },
          { status: 500 }
        );
      }

      steps.push("Main branch updated — Vercel will redeploy");

      return NextResponse.json({
        success: true,
        action: "unmerge",
        branch: "main",
        stdout: steps.join("\n"),
        revertedMerge: mergeMessage,
        sha: newCommit.sha,
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
        error: error.message || "Request failed",
      },
      { status: 500 }
    );
  }
}
