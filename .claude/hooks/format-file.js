// PostToolUse hook: format + lint-fix only the file Claude just edited.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let file;
  try {
    file = JSON.parse(input).tool_input?.file_path;
  } catch {
    return;
  }
  if (!file || !fs.existsSync(file)) return;

  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const rel = path.relative(root, file);
  if (rel.startsWith("..") || /node_modules|\.next/.test(rel)) return;

  // Call the tool's JS entry with node directly: no shell, so paths with spaces are safe.
  const run = (entry, args) => {
    const script = path.join(root, "node_modules", entry);
    if (!fs.existsSync(script)) return;
    try {
      execFileSync(process.execPath, [script, ...args], {
        cwd: root,
        stdio: "pipe",
      });
    } catch (e) {
      // Surface remaining lint errors to Claude without failing the edit.
      const out = `${e.stdout || ""}${e.stderr || ""}`.trim();
      if (out) process.stderr.write(out.slice(0, 2000) + "\n");
    }
  };

  if (/\.(jsx?|mjs|cjs|json|css|md)$/.test(file))
    run("prettier/bin/prettier.cjs", ["--write", file]);
  if (/\.(jsx?|mjs|cjs)$/.test(file))
    run("eslint/bin/eslint.js", ["--fix", file]);
});
