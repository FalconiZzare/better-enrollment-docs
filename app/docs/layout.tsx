import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { VersionSwitcher } from "@/components/version-switcher";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const base = baseOptions();
  // Every docs URL, so switching versions can stay on the same page.
  const pages = source.getPages().map((page) => page.url);

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      links={[...(base.links ?? []), { text: "llms.txt", url: "/llms.txt" }]}
      // The version root folders render as our own switcher instead.
      tabs={false}
      sidebar={{ banner: <VersionSwitcher pages={pages} /> }}
    >
      {children}
    </DocsLayout>
  );
}
