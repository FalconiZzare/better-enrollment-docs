"use client";

import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { DOC_VERSIONS, type DocVersion, pathInVersion, versionOfPath } from "@/lib/versions";

/** "v0.8.0" -> "0.8.0", the way the switcher prints version numbers. */
const number = (v: DocVersion) => v.label.replace(/^v/, "");

/**
 * Version switcher at the top of the docs sidebar. Switching keeps the
 * reader on the same page when it exists in the other version, and falls
 * back to that version's introduction otherwise.
 */
export function VersionSwitcher({ pages }: { pages: string[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { version: current, rest } = versionOfPath(pathname);
  const known = new Set(pages);

  const hrefFor = (v: DocVersion) => {
    const same = pathInVersion(v, rest);
    return known.has(same) ? same : pathInVersion(v, "");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "border-fd-border bg-fd-secondary/50 -mx-4 flex items-center gap-2 border-y px-4 py-2.5 text-start",
          "hover:bg-fd-accent data-[popup-open]:bg-fd-accent transition-colors",
          "focus-visible:ring-fd-ring focus-visible:ring-2 focus-visible:outline-none"
        )}
        aria-label={`Documentation version: ${current.title} ${number(current)}`}
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-fd-foreground text-sm leading-tight font-medium">
            {current.title}
          </span>
          <span className="text-fd-muted-foreground font-mono text-xs leading-tight">
            {number(current)}
          </span>
        </span>
        <ChevronsUpDown className="text-fd-muted-foreground ms-auto size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="border-fd-border flex w-(--anchor-width) flex-col gap-0.5 rounded-none border p-1"
      >
        {DOC_VERSIONS.map((v) => {
          const active = v.tag === current.tag;
          return (
            <Link
              key={v.tag}
              href={hrefFor(v)}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 px-3 py-2 transition-colors",
                "hover:bg-fd-accent hover:text-fd-accent-foreground",
                active && "bg-fd-accent/60"
              )}
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm leading-tight font-medium">{v.title}</span>
                <span className="text-fd-muted-foreground font-mono text-xs leading-tight">
                  {number(v)}
                </span>
              </span>
              <Check
                className={cn("text-fd-primary ms-auto size-3.5 shrink-0", !active && "invisible")}
              />
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
