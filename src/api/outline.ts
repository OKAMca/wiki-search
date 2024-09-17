import { getPreferenceValues } from "@raycast/api";
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
  });
}
