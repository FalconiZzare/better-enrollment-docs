import { getPageMarkdownUrl, latestPages, source } from "@/lib/source";
import { appDescription, appName, siteUrl } from "@/lib/shared";

export const revalidate = false;

type TreeNode = {
  type: string;
  name?: unknown;
  url?: string;
  children?: TreeNode[];
};

const firstPageUrl = (node: TreeNode): string | undefined => {
  if (node.type === "page") return node.url;
  for (const child of node.children ?? []) {
    const url = firstPageUrl(child);
    if (url) return url;
  }
  return undefined;
};

export function GET() {
  // Latest docs only: archived versions are frozen copies.
  const pagesByUrl = new Map(latestPages().map((page) => [page.url, page]));
  const lines: string[] = [`# ${appName}`, "", `> ${appDescription}`];

  const walk = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.type === "folder") {
        const url = firstPageUrl(node);
        if (url && !pagesByUrl.has(url)) continue;
      }
      if (node.type === "separator" && typeof node.name === "string") {
        lines.push("", `## ${node.name}`, "");
      } else if (node.type === "page" && node.url) {
        const page = pagesByUrl.get(node.url);
        if (!page) continue;
        const markdownUrl = `${siteUrl}${getPageMarkdownUrl(page).url}`;
        const description = page.data.description ? `: ${page.data.description}` : "";
        lines.push(`- [${page.data.title}](${markdownUrl})${description}`);
      } else if (node.children) {
        walk(node.children);
      }
    }
  };
  walk(source.getPageTree().children as TreeNode[]);

  return new Response(lines.join("\n") + "\n");
}
