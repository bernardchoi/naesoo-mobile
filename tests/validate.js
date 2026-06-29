const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const archive = JSON.parse(fs.readFileSync(path.join(root, "archive.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const archiveHtml = fs.readFileSync(path.join(root, "archive.html"), "utf8");

assert(Array.isArray(archive.issues) && archive.issues.length > 0, "archive issues are required");
assert(archive.issues.some((issue) => issue.id === archive.current), "archive current issue is missing");

for (const issue of archive.issues) {
  const jsonPath = path.join(root, issue.json.replace(/^\.\//, ""));
  assert(fs.existsSync(jsonPath), `missing bulletin JSON: ${issue.json}`);
  const bulletin = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  for (const key of ["church", "issue", "worship", "weekly", "news", "sermon", "meetings", "directions"]) {
    assert(bulletin[key], `${issue.id}: missing ${key}`);
  }
  assert.strictEqual(bulletin.worship.times.length, 3, `${issue.id}: worship times must have three services`);
  assert(bulletin.worship.rows.every((row) => row.label && Object.hasOwn(row, "first")), `${issue.id}: invalid worship row`);
}

for (const route of ["home", "worship", "news", "sermon", "meeting", "guide"]) {
  assert(html.includes(`data-view="${route}"`), `missing route: ${route}`);
}
assert(html.includes('aria-live="polite"'), "live regions are required");
assert(html.includes("history.pushState"), "tab navigation must create browser history");
assert(html.includes("data-update-notice"), "service-worker update notice is required");
assert(html.includes("자주 찾는 항목"), "home quick links are required");
assert(html.includes("data-target=\"sermon-questions\""), "sermon question shortcut is required");
assert(html.includes("collapsible-card"), "secondary guide content must be collapsible");
assert(html.includes("search-location"), "search results must show location context");
assert(sw.includes('event.request.mode === "navigate"'), "offline fallback must be navigation-only");
assert(archiveHtml.includes("./bulletins/${issue}.json"), "archive must load bulletin JSON dynamically");
assert(archive.issues.filter((issue) => issue.id !== archive.current).every((issue) => issue.url.includes("archive.html?issue=")), "past issues must use the shared archive shell");

for (const icon of manifest.icons) {
  assert(fs.existsSync(path.join(root, icon.src.replace(/^\.\//, ""))), `missing icon: ${icon.src}`);
}

console.log(`Validated ${archive.issues.length} bulletins, 6 routes, PWA assets, and accessibility hooks.`);
