/**
 * Documented versions, newest first. Only the two latest are kept:
 *
 * - the latest lives in `content/docs/(latest)` and is served at `/docs`
 * - the previous one is a frozen copy in `content/docs/<slug>`, served at
 *   `/docs/<slug>`, with its internal links pointing into itself
 *
 * Each folder is a Fumadocs root folder (`"root": true` in its meta.json),
 * which is what renders the version dropdown at the top of the sidebar.
 *
 * Releasing a new version: copy `(latest)` into a folder named after the
 * outgoing version (`node scripts/snapshot-docs.mjs <slug>`), delete the
 * older archived folder, and update this list. Archived versions are kept
 * out of the sitemap, llms.txt and search engines, and show a banner.
 */
export const DOC_VERSIONS = [
  { label: "v0.8.0", title: "Latest Version", slug: null, tag: "latest" },
  { label: "v0.7.0", title: "Version 0.7", slug: "v0.7.0", tag: "v0.7.0" }
] as const;

export type DocVersion = (typeof DOC_VERSIONS)[number];

/** The version a docs URL belongs to, and the page path inside it. */
export function versionOfPath(pathname: string): { version: DocVersion; rest: string } {
  const rest = pathname.replace(/^\/docs/, "");
  for (const v of archived) {
    const prefix = `/${v.slug}`;
    if (rest === prefix || rest.startsWith(`${prefix}/`)) {
      return { version: v, rest: rest.slice(prefix.length) };
    }
  }
  return { version: LATEST_VERSION, rest };
}

/** The same page in another version. */
export function pathInVersion(version: DocVersion, rest: string): string {
  return `/docs${version.slug ? `/${version.slug}` : ""}${rest}`;
}

export const LATEST_VERSION = DOC_VERSIONS[0];

const archived = DOC_VERSIONS.filter((v) => v.slug !== null);

/** The archived version a page belongs to, or null for the latest docs. */
export function archivedVersionOf(slugs: readonly string[] | undefined) {
  const first = slugs?.[0];
  return archived.find((v) => v.slug === first) ?? null;
}

/** Search tag for a page's version. */
export function versionTagOf(slugs: readonly string[] | undefined): string {
  return archivedVersionOf(slugs)?.tag ?? LATEST_VERSION.tag;
}

/** Search filter options, latest first. */
export const SEARCH_VERSION_TAGS = DOC_VERSIONS.map((v) => ({
  name: v.slug === null ? `${v.label} (latest)` : v.label,
  value: v.tag
}));
