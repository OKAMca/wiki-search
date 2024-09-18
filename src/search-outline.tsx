import { List, ActionPanel, Action, showToast, Toast, Detail, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { useSearchDocuments, Document, SearchResponseItem, Collection, useFetchCollections } from "./api/outline";

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
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const debouncedSearchText = useDebounce(searchText, 100);
  const { outlineUrl } = getPreferenceValues<{ outlineUrl: string }>();

  const { data: collectionsData, isLoading: isLoadingCollections, error: collectionsError } = useFetchCollections();
  const { data, isLoading, error } = useSearchDocuments(debouncedSearchText, selectedCollection?.id || null, {
    execute: debouncedSearchText.trim().length > 0,
  });

  useEffect(() => {
    if (collectionsError) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch collections",
        message: collectionsError.message,
      });
    }
  }, [collectionsError]);

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
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Collection"
          storeValue={true}
          onChange={(id) => setSelectedCollection(collectionsData?.data.find((c) => c.id === id) || null)}
        >
          <List.Dropdown.Item key="all" title="All Collections" value="" />
          {collectionsData?.data.map((collection) => (
            <List.Dropdown.Item
              key={collection.id}
              title={collection.name}
              value={collection.id}
              icon={{ source: Icon.Circle, tintColor: collection.color }}
            />
          ))}
        </List.Dropdown>
      }
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
