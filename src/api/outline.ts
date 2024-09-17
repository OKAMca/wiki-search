import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  outlineUrl: string;
  apiToken: string;
}

export interface Document {
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

export async function searchDocuments(query: string): Promise<Document[]> {
  const { outlineUrl, apiToken } = getPreferenceValues<Preferences>();

  const response = await fetch(`${outlineUrl}/api/documents.search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      limit: 100,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to search documents: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}
