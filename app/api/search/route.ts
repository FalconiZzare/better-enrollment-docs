import { source } from "@/lib/source";
import { versionTagOf } from "@/lib/versions";
import { createFromSource } from "fumadocs-core/search/server";

// Every page is tagged with its docs version; the search dialog filters by
// tag, defaulting to the latest version.
export const { GET } = createFromSource(source, {
  buildIndex: (page) => ({
    id: page.url,
    title: page.data.title ?? page.path,
    description: page.data.description,
    url: page.url,
    tag: versionTagOf(page.slugs),
    structuredData: page.data.structuredData
  })
});
