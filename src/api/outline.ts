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

interface SearchResponse {
  pagination: {
    limit: number;
    offset: number;
    nextPath: string;
    total: number;
  };
  data: SearchResponseItem[];
}

export function useSearchDocuments(query: string, options?: { execute?: boolean }) {
  const { outlineUrl, apiToken } = getPreferenceValues<Preferences>();
  const searchUrl = `${outlineUrl}/api/documents.search`;

  console.log(`Searching Outline at URL: ${searchUrl}`);
  console.log(`Search query: ${query}`);

  return useFetch<SearchResponse>(
    searchUrl,
    {
      ...options,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        limit: 100,
      }),
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
