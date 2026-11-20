// Freeze the latest docs as an archived version before a release.
//
//   node scripts/snapshot-docs.mjs v0.8.0
//
// Copies content/docs/(latest) to content/docs/<slug>, re-roots internal
// /docs links into /docs/<slug>, and marks the copy as a root folder so it
// shows in the version dropdown. Afterwards: delete the older archived
// folder (only two versions are kept), list the new folder in
// content/docs/meta.json, and update DOC_VERSIONS in lib/versions.ts.
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug || !/^v\d+\.\d+\.\d+$/.test(slug)) {
  console.error("usage: node scripts/snapshot-docs.mjs v<major>.<minor>.<patch>");
  process.exit(1);
}

const root = join(process.cwd(), "content", "docs");
const from = join(root, "(latest)");
const to = join(root, slug);
if (existsSync(to)) {
  console.error(`${to} already exists`);
  process.exit(1);
}
cpSync(from, to, { recursive: true });

const link = /(\]\(|href=")\/docs(\/|\)|"|#)/g;
for (const name of readdirSync(to)) {
  const file = join(to, name);
  const text = readFileSync(file, "utf8");
  if (name === "meta.json") {
    const meta = JSON.parse(text);
    meta.title = slug;
    meta.description = `Better Enrollment ${slug}`;
    meta.root = true;
    writeFileSync(file, `${JSON.stringify(meta, null, 2)}\n`);
  } else if (name.endsWith(".mdx")) {
    writeFileSync(
      file,
      text.replace(link, (_, a, b) => `${a}/docs/${slug}${b}`)
    );
  }
}
console.log(`Archived (latest) as ${slug}. Now update meta.json and lib/versions.ts.`);
