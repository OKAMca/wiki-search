# ADR: Integrating Outline Wiki Search in Raycast Extension

[... existing content unchanged ...]

## New Feature: Collection-based Search Filtering

### Context
To enhance the search functionality, we want to allow users to filter their search results by selecting a specific collection. This will provide more targeted and relevant search results.

### Decision
We will implement a feature to query and display Outline collections, allowing users to select a collection before performing a search. The search will then be limited to the selected collection.

### Technical Details
- Collections Endpoint: POST /collections.list
  - Request format: JSON
  - Parameters:
    * limit: Number of collections to return (e.g., 25)
  - Response format: JSON
    * data: Array of collection objects
    * pagination: Object containing offset and limit
- Search Endpoint (updated): POST /documents.search
  - New parameter: `collectionId` (optional)

### Collection Object Structure
```json
{
  "id": string,
  "name": string,
  "description": string,
  "sort": {
    "field": string,
    "direction": string
  },
  "index": string,
  "color": string,
  "icon": string,
  "permission": string,
  "createdAt": string (ISO 8601 date),
  "updatedAt": string (ISO 8601 date),
  "deletedAt": string (ISO 8601 date) | null
}
```

### Requirements

1. Collection Querying:
   - Implement a function to fetch collections from the Outline API using the POST /collections.list endpoint.
   - Handle pagination using the provided pagination object in the response.
   - Store relevant collection data, primarily `id` and `name`, for use in the UI and search queries.
   - Implement error handling for collection fetching.

2. User Interface Updates:
   - Add a dropdown or list for collection selection before the search input.
   - Display collection names to the user, using the `name` field from the collection object.
   - Use the `id` field when passing the selected collection to the search query.
   - Include an "All Collections" option as the default.
   - Consider using the `color` field to enhance the visual representation of collections in the UI.

3. Search Functionality Update:
   - Modify the search function to include the selected collection `id` in the API request.
   - Update the `useSearchDocuments` hook to accept an optional `collectionId` parameter.

4. Performance Considerations:
   - Implement caching for the collections list to minimize API calls.
   - Implement pagination or lazy loading for collections, utilizing the pagination object in the API response.

### Implementation Steps

1. Update the API module to include a function for fetching collections using the POST /collections.list endpoint.
2. Implement pagination logic for fetching all collections, using the pagination object in the response.
3. Create interfaces or types for the collection and pagination objects.
4. Implement a new React component for collection selection, considering how to handle a potentially large number of collections.
5. Modify the search command to incorporate collection selection.
6. Update the `useSearchDocuments` hook to handle the optional `collectionId`.
7. Implement caching for the collections list.
8. Update error handling to account for collection-related errors.
9. Update tests to cover the new functionality, including pagination of collections.
10. Update user documentation to explain the new feature and any limitations related to the number of collections.

[... rest of the existing content unchanged ...]
