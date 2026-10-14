#!/usr/bin/env node
// Compares src/app/messages/ar.json and en.json and reports keys missing from
// either file, plus empty values. Usage: node .claude/skills/i18n/scripts/check-keys.js [prefix]
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../../..");
const load = (locale) =>
  JSON.parse(
    fs.readFileSync(
      path.join(root, "src/app/messages", `${locale}.json`),
      "utf8"
    )
  );

const flatten = (obj, prefix = "", out = {}) => {
  for (const [key, val] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val))
      flatten(val, full, out);
    else out[full] = val;
  }
  return out;
};

const filter = process.argv[2] || "";
const ar = flatten(load("ar"));
const en = flatten(load("en"));
const keep = (k) => k.startsWith(filter);

const missingInEn = Object.keys(ar).filter((k) => keep(k) && !(k in en));
const missingInAr = Object.keys(en).filter((k) => keep(k) && !(k in ar));
const empty = [...new Set([...Object.keys(ar), ...Object.keys(en)])].filter(
  (k) => keep(k) && ((k in ar && ar[k] === "") || (k in en && en[k] === ""))
);

const report = (title, list) => {
  console.log(`\n${title}: ${list.length}`);
  list.slice(0, 200).forEach((k) => console.log(`  ${k}`));
  if (list.length > 200) console.log(`  ... ${list.length - 200} more`);
};

report("Missing in en.json", missingInEn);
report("Missing in ar.json", missingInAr);
report("Empty values", empty);
process.exitCode = missingInEn.length || missingInAr.length ? 1 : 0;
