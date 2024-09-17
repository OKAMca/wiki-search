import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";

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

export function useSearchDocuments(query: string) {
  const { outlineUrl, apiToken } = getPreferenceValues<Preferences>();

  console.log(`Searching Outline at URL: ${outlineUrl}`);
  console.log(`Search query: ${query}`);

  return useFetch<{ data: Document[] }>(`${outlineUrl}/api/documents.search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      limit: 100,
    }),
    onError: (error) => {
      console.error("Error in useSearchDocuments:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Search Error",
        message: `Failed to search documents: ${error.message}`,
      });
    },
    onWillExecute: (url, options) => {
      console.log("Executing search with options:", JSON.stringify(options, null, 2));
    },
    onData: (data) => {
      console.log(`Received ${data.data.length} search results`);
    },
  });
}
