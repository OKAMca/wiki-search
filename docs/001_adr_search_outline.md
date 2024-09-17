# ADR: Integrating Outline Wiki Search in Raycast Extension

## Context
We need to implement a feature in our Raycast Extension that allows users to search and display documents from an Outline Wiki instance. The Outline API provides a specific endpoint for document search.

## Decision
We will integrate the Outline Wiki API's search endpoint into our Raycast Extension to enable document search and display functionality.

## Consequences
- Positive: Users can quickly search and access Outline Wiki documents from Raycast.
- Positive: Leverages existing Outline Wiki API, reducing development time.
- Negative: Requires handling API authentication and potential rate limiting.
- Negative: May need to manage caching to improve performance.

## Technical Details
- Search Endpoint: POST /documents.search
- Request Format: JSON
- Authentication: Bearer token

## Requirements

1. API Integration:
   - Implement a function to authenticate with the Outline Wiki API using a bearer token.
   - Create a module to handle API requests to the Outline Wiki search endpoint.

2. Search Functionality:
   - Develop a search command that accepts user input.
   - Send search queries to the Outline Wiki API using the following parameters:
     * query: The user's search term
     * limit: Number of results per page (default 25)
     * offset: For pagination
     * includeArchived and includeDrafts: Configurable options
   - Parse and format the API response for display in Raycast.

3. Result Display:
   - Create a list view to display search results, showing:
     * Document title
     * Context snippet from the API response
     * Relevance ranking (optional)
   - Implement a detail view for selected documents.

4. Local Indexing (for faster initial results):
   - Create a local database or file-based storage for document metadata.
   - Store essential information: document ID, title, and possibly a short snippet or tags.
   - Implement a background sync process to keep the local index updated.

5. Hybrid Search:
   - Develop a two-stage search process:
     a. First, search the local index for quick results based on titles and metadata.
     b. If needed or requested, perform a full search using the Outline Wiki API.
   - Provide an option for users to force a full API search.

6. User Experience:
   - Provide feedback during search (loading indicators).
   - Implement error handling for failed requests or no results.
   - Add keyboard shortcuts for efficient navigation.

7. Configuration:
   - Allow users to input their Outline Wiki URL and API token in Raycast preferences.
   - Store these credentials securely.

8. Performance:
   - Implement caching for recent searches to reduce API calls.
   - Use pagination for large result sets.

## Implementation Steps

1. Set up the basic Raycast Extension structure.
2. Create an API module (src/api/outline.ts) to handle Outline Wiki API requests.
3. Implement the local storage module (src/storage/localIndex.ts) for the document index.
4. Develop the index sync mechanism.
5. Create the hybrid search function that combines local and API searches.
6. Implement the search command (src/commands/search-outline.tsx) using the hybrid search.
7. Develop the results list and detail views.
8. Add configuration options for API credentials and index management.
9. Implement caching and performance optimizations.
10. Create commands for manual index updates and management.
11. Write documentation and update README.md.
