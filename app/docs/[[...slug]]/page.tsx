import { getPageImageUrl, getPageMarkdownUrl, source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { appName, gitConfig } from "@/lib/shared";
import { JsonLd } from "@/components/json-ld";
import { buildDocsSchema } from "@/lib/schema";
import { getLastModified } from "@/lib/last-modified";
import { archivedVersionOf, LATEST_VERSION } from "@/lib/versions";
import { Callout } from "fumadocs-ui/components/callout";
import Link from "next/link";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const lastUpdate = getLastModified(`content/docs/${page.path}`);
  const archived = archivedVersionOf(page.slugs);
  const latestUrl = `/docs/${page.slugs.slice(1).join("/")}`.replace(/\/$/, "");

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd data={buildDocsSchema(page, source.getPageTree())} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row items-center gap-2 border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      {archived ? (
        <Callout type="warn" title={`You are reading the ${archived.label} docs`}>
          This version is no longer the latest.{" "}
          <Link href={latestUrl}>See this page in the {LATEST_VERSION.label} docs</Link>.
        </Callout>
      ) : null}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page)
          })}
        />
      </DocsBody>
      {lastUpdate ? <PageLastUpdate date={lastUpdate} /> : null}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const archived = archivedVersionOf(page.slugs);
  return {
    title: archived ? `${page.data.title} (${archived.label})` : page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url
    },
    // Archived versions stay reachable but out of search engines.
    ...(archived ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      siteName: appName,
      type: "article",
      images: {
        url: getPageImageUrl(page).url,
        width: 1200,
        height: 630
      }
    }
  };
}
