import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// Force dynamic rendering — never cache this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// Shared-secret gate. This route can merge to main / revert main, so it MUST
// reject any request without the secret. If the env var is missing the route
// fails closed — never accept an empty secret.
const DASHBOARD_SECRET = process.env.GIT_DASHBOARD_SECRET;

function verifyDashboardSecret(request) {
  if (!DASHBOARD_SECRET) {
    return NextResponse.json(
      { error: "Dashboard secret not configured on server" },
      { status: 503 }
    );
  }
  const supplied = request.headers.get("x-dashboard-secret") || "";
  const a = Buffer.from(supplied);
  const b = Buffer.from(DASHBOARD_SECRET);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

// Helper: GitHub API request with retry on throttle
async function ghFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  let res = await fetch(url, {
    ...options,
    headers: { ...HEADERS, ...options.headers },
    cache: "no-store",
  });

  // Retry once after 2s if throttled
  if (res.status === 403 || res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000));
    res = await fetch(url, {
      ...options,
      headers: { ...HEADERS, ...options.headers },
      cache: "no-store",
    });
  }

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

// Protected files: these must never be deleted by a merge
const PROTECTED_PATHS = [
  "src/app/git-dashboard/GitDashboardContent.js",
  "src/app/git-dashboard/page.js",
  "src/app/git-dashboard/layout.js",
  "src/app/api/git-control/route.js",
  "middleware.js",
];

// Helper: after a merge, check if protected files were deleted and restore them
// preMergeSha = the SHA of main BEFORE the merge happened
// Returns { restored: boolean, newSha: string|null, steps: string[] }
async function restoreProtectedFiles(preMergeSha, steps) {
  // Get current main ref (post-merge)
  const { ok: postRefOk, data: postRef } = await ghFetch(`/git/ref/heads/main`);
  if (!postRefOk) return { restored: false, newSha: null };

  const postMergeSha = postRef.object.sha;

  // Check each protected file in the post-merge tree
  const missing = [];
  for (const filePath of PROTECTED_PATHS) {
    const { ok } = await ghFetch(`/contents/${filePath}?ref=${postMergeSha}`);
    if (!ok) missing.push(filePath);
  }

  if (missing.length === 0) return { restored: false, newSha: null };

  steps.push(`⚠️ Protected files missing after merge: ${missing.join(", ")}`);

  // Get the pre-merge tree to find the original file blobs
  const { ok: preCommitOk, data: preCommit } = await ghFetch(
    `/git/commits/${preMergeSha}`
  );
  if (!preCommitOk) return { restored: false, newSha: null };

  // Get the post-merge commit's tree
  const { ok: postCommitOk, data: postCommit } = await ghFetch(
    `/git/commits/${postMergeSha}`
  );
  if (!postCommitOk) return { restored: false, newSha: null };

  // For each missing file, get its blob SHA from the pre-merge tree
  const treeItems = [];
  for (const filePath of missing) {
    const { ok: fileOk, data: fileData } = await ghFetch(
      `/contents/${filePath}?ref=${preMergeSha}`
    );
    if (fileOk && fileData?.sha) {
      treeItems.push({
        path: filePath,
        mode: "100644",
        type: "blob",
        sha: fileData.sha,
      });
    }
  }

  if (treeItems.length === 0) return { restored: false, newSha: null };

  // Create a new tree based on the post-merge tree + restored files
  const { ok: treeOk, data: newTree } = await ghFetch(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: postCommit.tree.sha,
      tree: treeItems,
    }),
  });

  if (!treeOk) return { restored: false, newSha: null };

  // Create a commit with the restored files
  const { ok: commitOk, data: fixCommit } = await ghFetch(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: `fix: restore protected files deleted by merge`,
      tree: newTree.sha,
      parents: [postMergeSha],
    }),
  });

  if (!commitOk) return { restored: false, newSha: null };

  // Update main ref
  const { ok: updateOk } = await ghFetch(`/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({ sha: fixCommit.sha, force: false }),
  });

  if (!updateOk) return { restored: false, newSha: null };

  steps.push(`✅ Restored ${treeItems.length} protected file(s)`);
  return { restored: true, newSha: fixCommit.sha };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET: Fetch branches + latest commit info on main
// API calls: 1 (branches) + 1 (latest commit) = 2 total
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const unauthorized = verifyDashboardSecret(request);
  if (unauthorized) return unauthorized;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "Missing GitHub configuration in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Fetch branches and latest commit in parallel
    const [branchesRes, commitsRes] = await Promise.all([
      ghFetch(`/branches?per_page=100`),
      ghFetch(`/commits?sha=main&per_page=1`),
    ]);

    if (!branchesRes.ok) {
      return NextResponse.json(
        { error: branchesRes.data?.message || "Failed to fetch branches" },
        { status: branchesRes.status }
      );
    }

    let lastMergeInfo = null;
    if (commitsRes.ok && commitsRes.data?.length) {
      const latest = commitsRes.data[0];
      const msg = latest.commit?.message || "";
      const date =
        latest.commit?.committer?.date || latest.commit?.author?.date;
      const isMerge = latest.parents && latest.parents.length === 2;

      lastMergeInfo = {
        hash: latest.sha,
        message: msg,
        timeAgo: timeAgo(date),
        branch: isMerge ? extractBranchFromMessage(msg) : null,
        isMerge,
      };
    }

    return NextResponse.json({
      branches: branchesRes.data.map((b) => ({
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

// ─────────────────────────────────────────────────────────────────────────────
// POST: merge_to_main or unmerge
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  const unauthorized = verifyDashboardSecret(request);
  if (unauthorized) return unauthorized;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "Missing GitHub configuration in environment variables" },
      { status: 500 }
    );
  }

  try {
    const { action, branchName } = await request.json();
    const steps = [];

    // ─── MERGE TO MAIN ───────────────────────────────────────────────
    // Normal merge: 1 API call
    // Re-merge after revert: 1 + 2 (parallel refs) + 2 (parallel commits) + 1 (create) + 1 (update) = max 5 extra
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

      // Get current main SHA before merge (for protected file restoration)
      const { data: preMergeRef } = await ghFetch(`/git/ref/heads/main`);
      const preMergeSha = preMergeRef?.object?.sha;

      // Try normal merge first (1 API call)
      const mergeRes = await ghFetch("/merges", {
        method: "POST",
        body: JSON.stringify({
          base: "main",
          head: safeBranch,
          commit_message: `Merge branch '${safeBranch}' into main`,
        }),
      });

      // ── Normal merge succeeded (201) ──
      if (mergeRes.ok && mergeRes.status === 201) {
        steps.push(`Merge ${safeBranch} into main: OK`);
        steps.push(`Commit: ${mergeRes.data?.sha?.slice(0, 8)}`);

        // Auto-protect: restore any protected files deleted by the merge
        if (preMergeSha) {
          await restoreProtectedFiles(preMergeSha, steps);
        }

        steps.push("Pushed to main — Vercel deployment triggered");
        return NextResponse.json({
          success: true,
          action: "merge_to_main",
          branch: safeBranch,
          stdout: steps.join("\n"),
          sha: mergeRes.data?.sha,
        });
      }

      // ── 204: "Already up to date" — may need force re-merge after revert ──
      if (mergeRes.status === 204) {
        // Get both refs in parallel (2 calls)
        const [mRef, bRef] = await Promise.all([
          ghFetch(`/git/ref/heads/main`),
          ghFetch(`/git/ref/heads/${safeBranch}`),
        ]);

        if (!mRef.ok || !bRef.ok) {
          return NextResponse.json({
            success: true,
            action: "merge_to_main",
            branch: safeBranch,
            stdout: `Branch ${safeBranch} is already up to date with main`,
          });
        }

        const mSha = mRef.data.object.sha;
        const bSha = bRef.data.object.sha;

        // Get both commit trees in parallel (2 calls)
        const [mCommit, bCommit] = await Promise.all([
          ghFetch(`/git/commits/${mSha}`),
          ghFetch(`/git/commits/${bSha}`),
        ]);

        if (!mCommit.ok || !bCommit.ok) {
          return NextResponse.json({
            success: true,
            action: "merge_to_main",
            branch: safeBranch,
            stdout: `Branch ${safeBranch} is already up to date with main`,
          });
        }

        // Compare trees
        if (mCommit.data.tree.sha === bCommit.data.tree.sha) {
          return NextResponse.json({
            success: true,
            action: "merge_to_main",
            branch: safeBranch,
            stdout: `Branch ${safeBranch} is already up to date with main`,
          });
        }

        // Trees differ — force re-merge (2 calls: create commit + update ref)
        steps.push(`Branch was previously reverted — force re-merging`);

        const createRes = await ghFetch(`/git/commits`, {
          method: "POST",
          body: JSON.stringify({
            message: `Merge branch '${safeBranch}' into main`,
            tree: bCommit.data.tree.sha,
            parents: [mSha, bSha],
          }),
        });

        if (!createRes.ok) {
          return NextResponse.json(
            {
              success: false,
              error:
                createRes.data?.message || "Failed to create merge commit.",
            },
            { status: 500 }
          );
        }

        const updateRes = await ghFetch(`/git/refs/heads/main`, {
          method: "PATCH",
          body: JSON.stringify({ sha: createRes.data.sha, force: false }),
        });

        if (!updateRes.ok) {
          return NextResponse.json(
            {
              success: false,
              error: "Failed to update main branch.",
            },
            { status: 500 }
          );
        }

        steps.push(`Re-merged ${safeBranch} into main: OK`);
        steps.push(`Commit: ${createRes.data.sha.slice(0, 8)}`);

        // Auto-protect: restore any protected files deleted by the re-merge
        if (preMergeSha) {
          await restoreProtectedFiles(preMergeSha, steps);
        }

        steps.push("Pushed to main — Vercel deployment triggered");

        return NextResponse.json({
          success: true,
          action: "merge_to_main",
          branch: safeBranch,
          stdout: steps.join("\n"),
          sha: createRes.data.sha,
        });
      }

      // ── 409: Conflict ──
      if (mergeRes.status === 409) {
        return NextResponse.json(
          {
            success: false,
            error: `Merge conflict merging ${safeBranch} into main. Resolve conflicts and try again.`,
          },
          { status: 409 }
        );
      }

      // ── 404: Branch not found ──
      if (mergeRes.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: `Branch "${safeBranch}" or "main" not found.`,
          },
          { status: 404 }
        );
      }

      // ── Other error ──
      return NextResponse.json(
        {
          success: false,
          error: mergeRes.data?.message || "Merge failed",
        },
        { status: mergeRes.status || 500 }
      );
    }

    // ─── UNMERGE: revert the latest commit on main ───────────────────
    // API calls: 1 (get ref) + 1 (get HEAD commit — includes parent tree)
    //          + 1 (create revert commit) + 1 (update ref) = 4 total
    if (action === "unmerge") {
      // Step 1: Get main ref (1 call)
      const refRes = await ghFetch(`/git/ref/heads/main`);
      if (!refRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to get main branch ref.",
            details: refRes.data?.message,
          },
          { status: 500 }
        );
      }

      const headSha = refRes.data.object.sha;

      // Step 2: Get HEAD commit details (1 call — gives us parents + tree)
      const headRes = await ghFetch(`/git/commits/${headSha}`);
      if (!headRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to read HEAD commit.",
            details: headRes.data?.message,
          },
          { status: 500 }
        );
      }

      const headMsg = headRes.data.message || "";
      const parentSha = headRes.data.parents?.[0]?.sha;

      if (!parentSha) {
        return NextResponse.json(
          { success: false, error: "HEAD has no parent — cannot revert." },
          { status: 400 }
        );
      }

      steps.push(`HEAD: ${headSha.slice(0, 8)} — ${headMsg}`);

      // Step 3: Get parent commit to get its tree SHA (1 call)
      const parentRes = await ghFetch(`/git/commits/${parentSha}`);
      if (!parentRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch parent commit.",
            details: parentRes.data?.message,
          },
          { status: 500 }
        );
      }

      steps.push(`Reverting to: ${parentSha.slice(0, 8)}`);

      // Step 4: Create revert commit (1 call)
      const revertRes = await ghFetch(`/git/commits`, {
        method: "POST",
        body: JSON.stringify({
          message: `Revert "${headMsg}"`,
          tree: parentRes.data.tree.sha,
          parents: [headSha],
        }),
      });

      if (!revertRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: revertRes.data?.message || "Failed to create revert commit.",
          },
          { status: 500 }
        );
      }

      steps.push(`Revert created: ${revertRes.data.sha.slice(0, 8)}`);

      // Step 5: Update main ref (1 call)
      const updateRes = await ghFetch(`/git/refs/heads/main`, {
        method: "PATCH",
        body: JSON.stringify({ sha: revertRes.data.sha, force: false }),
      });

      if (!updateRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: updateRes.data?.message || "Failed to update main branch.",
          },
          { status: 500 }
        );
      }

      steps.push("Main updated — Vercel will redeploy");

      return NextResponse.json({
        success: true,
        action: "unmerge",
        branch: "main",
        stdout: steps.join("\n"),
        revertedMerge: headMsg,
        sha: revertRes.data.sha,
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
