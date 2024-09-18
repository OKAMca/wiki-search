import { List, ActionPanel, Action, showToast, Toast, getPreferenceValues, Icon, Detail } from "@raycast/api";
import { useState, useEffect } from "react";
import { useSearchDocuments, Document, SearchResponseItem, Collection, useFetchCollections } from "./api/outline";

function DocumentDetailView({ document }: { document: Document }) {
  const { outlineUrl } = getPreferenceValues<{ outlineUrl: string }>();

  return (
    <Detail
      markdown={document.text}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Title" text={document.title} />
          <Detail.Metadata.Label title="Collection" text={document.collectionName || "Unknown Collection"} />
          <Detail.Metadata.Link title="Open in Browser" target={`${outlineUrl}${document.url}`} text="Open" />
        </Detail.Metadata>
      }
    />
  );
}

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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const debouncedSearchText = useDebounce(searchText, 100);
  const { outlineUrl } = getPreferenceValues<{ outlineUrl: string }>();

  const { data: collectionsData, isLoading: isLoadingCollections, error: collectionsError } = useFetchCollections();
  const { data, isLoading, error } = useSearchDocuments(
    debouncedSearchText,
    selectedCollection?.id || null,
    collectionsData,
    {
      execute: debouncedSearchText.trim().length > 0,
    },
  );

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
      isShowingDetail
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
      <List.Section title="Search Results">
        {data?.data.map((item: SearchResponseItem) => (
          <List.Item
            key={item.document.id}
            title={item.document.title || "Untitled Document"}
            accessories={[{ text: item.document.collectionName || "Unknown Collection" }]}
            detail={
              <List.Item.Detail
                markdown={selectedDocument?.text || "Select a document to preview"}
                metadata={
                  selectedDocument ? (
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Title" text={selectedDocument.title} />
                      <List.Item.Detail.Metadata.Label
                        title="Collection"
                        text={selectedDocument.collectionName || "Unknown Collection"}
                      />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Browser"
                        target={`${outlineUrl}${selectedDocument.url}`}
                        text="Open"
                      />
                    </List.Item.Detail.Metadata>
                  ) : null
                }
              />
            }
            actions={
              <ActionPanel>
                <Action.Push
                  title="Preview Document"
                  target={<DocumentDetailView document={item.document} />}
                />
                <Action.OpenInBrowser url={`${outlineUrl}${item.document.url}`} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
