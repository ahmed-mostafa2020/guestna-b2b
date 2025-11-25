#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const nextDir = join(process.cwd(), ".next");
const buildDir = join(nextDir, "build");

// Check if Next.js build exists
const hasBuild = existsSync(buildDir) || existsSync(nextDir);

if (hasBuild) {
  console.log("🔄 Generating sitemap...");
  try {
    execSync("next-sitemap", { stdio: "inherit" });
    console.log("✅ Sitemap generated successfully");
  } catch (error) {
    console.warn("⚠️  Sitemap generation failed, continuing...");
    process.exit(0); // Don't fail the dev process
  }
} else {
  console.log(
    '⏭️  Skipping sitemap generation (no build found). Run "npm run build" first or use "npm run dev"'
  );
  process.exit(0);
}
