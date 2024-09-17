import { List, ActionPanel, Action, showToast, Toast, Detail, getPreferenceValues } from "@raycast/api";
import { useState } from "react";
import { useFetch } from "@raycast/utils";

interface Preferences {
  outlineUrl: string;
  apiToken: string;
}

interface Document {
  id: string;
  title: string;
  text: string;
  context: string;
  url: string;
  collectionName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    name: string;
  };
}

export default function SearchOutline() {
  const [searchText, setSearchText] = useState("");
  const { outlineUrl, apiToken } = getPreferenceValues<Preferences>();

  const { data, isLoading, error } = useFetch<{ data: Document[] }>(
    `${outlineUrl}/api/documents.search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchText,
        limit: 100,
      }),
    },
    {
      execute: searchText.length > 0,
    }
  );

  if (error) {
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
      {data?.data.map((doc) => (
        <List.Item
          key={doc.id}
          title={doc.title}
          subtitle={doc.context}
          actions={
            <ActionPanel>
              <Action.Push
                title="View Document"
                target={<DocumentDetail document={doc} />}
              />
              <Action.OpenInBrowser url={`${outlineUrl}${doc.url}`} />
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
          <Detail.Metadata.Label title="Collection" text={document.collectionName} />
          <Detail.Metadata.Label title="Created" text={new Date(document.createdAt).toLocaleString()} />
          <Detail.Metadata.Label title="Updated" text={new Date(document.updatedAt).toLocaleString()} />
          <Detail.Metadata.Label title="Author" text={document.createdBy.name} />
        </Detail.Metadata>
      }
    />
  );
}
