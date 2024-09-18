import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Preferences {
  outlineUrl: string;
  apiToken: string;
}

export interface Document {
  id: string;
  urlId: string;
  url: string;
  title: string;
  text: string;
}

export interface SearchResponseItem {
  ranking: number;
  context: string;
  document: Document;
}

export interface Collection {
  id: string;
  name: string;
  color: string;
}

export interface Collection {
  id: string;
  name: string;
  color: string;
}

export interface CollectionsResponse {
  data: Collection[];
  pagination: {
    offset: number;
    limit: number;
  };
}

export async function fetchCollections(): Promise<Collection[]> {
  const response = await fetch(`${preferences.outlineUrl}/api/collections.list`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${preferences.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ limit: 100 }), // Adjust the limit as needed
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch collections: ${response.statusText}`);
  }

  const data: CollectionsResponse = await response.json();
  return data.data;
}

interface SearchResponse {
  pagination: {
    limit: number;
    offset: number;
    nextPath: string;
    total: number;
  };
  data: SearchResponseItem[];
}

export function useSearchDocuments(query: string, collectionId: string | null, options?: { execute?: boolean }) {
  const { outlineUrl, apiToken } = getPreferenceValues<Preferences>();
  const searchUrl = `${outlineUrl}/api/documents.search`;

  console.log(`Searching Outline at URL: ${searchUrl}`);
  console.log(`Search query: ${query}`);
  console.log(`Collection ID: ${collectionId}`);

  const body: { query: string; limit: number; collectionId?: string } = {
    query: query,
    limit: 100,
  };

  if (collectionId) {
    body.collectionId = collectionId;
  }

  return useFetch<SearchResponse>(
    searchUrl,
    {
      ...options,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      onData: (data) => {
        console.log("API Response:", JSON.stringify(data, null, 2));
      },
      onError: (error) => {
        console.error("Error in useSearchDocuments:", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Search Error",
          message: `Failed to search documents: ${error.message}`,
        });
      },
    }
  );
}
