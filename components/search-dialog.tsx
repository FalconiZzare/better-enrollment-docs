"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
  TagsList,
  TagsListItem
} from "fumadocs-ui/components/dialog/search";
import { useState } from "react";
import { LATEST_VERSION, SEARCH_VERSION_TAGS } from "@/lib/versions";

/**
 * Fumadocs' default dialog renders its footer (the version filter) outside
 * the popup, so it shows on every page even while search is closed. Same
 * parts, with the footer inside the popup.
 */
export function VersionedSearchDialog(props: SharedProps) {
  const [tag, setTag] = useState<string | undefined>(LATEST_VERSION.tag);
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({ api: "/api/search", tag })
  });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter>
          <TagsList tag={tag} onTagChange={setTag}>
            {SEARCH_VERSION_TAGS.map((t) => (
              <TagsListItem key={t.value} value={t.value}>
                {t.name}
              </TagsListItem>
            ))}
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
