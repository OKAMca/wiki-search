import { List, ActionPanel, Action, showToast, Toast, Detail, getPreferenceValues } from "@raycast/api";
import { useState, useEffect, useCallback } from "react";
import { useSearchDocuments, Document, SearchResponseItem } from "./api/outline";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchOutline() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 100);
  const { outlineUrl } = getPreferenceValues<{ outlineUrl: string }>();

  const { data, isLoading, error } = useSearchDocuments(debouncedSearchText, {
    execute: debouncedSearchText.trim().length > 0,
  });

  if (error && debouncedSearchText.trim().length > 0) {
    showToast({
      style: Toast.Style.Failure,
      title: "Failed to search documents",
      message: error.message,
    });
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Outline documents..."
      throttle
    >
      {data?.data.map((item: SearchResponseItem) => (
        <List.Item
          key={item.document.id}
          title={item.document.title || "Untitled Document"}
          subtitle={item.context}
          actions={
            <ActionPanel>
              <Action.Push title="View Document" target={<DocumentDetail document={item.document} />} />
              <Action.OpenInBrowser url={`${outlineUrl}${item.document.url}`} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function DocumentDetail({ document }: { document: Document }) {
  return (
    <Detail
      markdown={document.text}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="ID" text={document.urlId} />
          <Detail.Metadata.Label title="URL" text={document.url} />
        </Detail.Metadata>
      }
    />
  );
}
