 # ADR: Integrating Outline Wiki Search in Raycast Extension

 ## Context
 We need to implement a feature in our Raycast Extension that allows users to search and display documents from an Outline Wiki
 instance. The primary goal is to enable employees to quickly lookup internal documentation without context switching.

 ## Decision
 We will integrate the Outline Wiki API's search endpoint into our Raycast Extension to enable document search and display
 functionality.

 ## Consequences
 - Positive: Users can quickly search and access Outline Wiki documents from Raycast.
 - Positive: Leverages existing Outline Wiki API, reducing development time.
 - Negative: Requires handling API authentication and potential rate limiting.

 ## Technical Details
 - Search Endpoint: POST /documents.search
 - Request Format: JSON
 - Authentication: Bearer token

 ## Requirements

 1. Configuration:
    - Allow users to input their Outline Wiki URL and API token in Raycast preferences.
    - Implement secure storage for these credentials.
    - If possible, add a "Test Connection" action in the settings view.

 2. Search Functionality:
    - Develop a search command that accepts user input.
    - Send search queries to the Outline Wiki API using the following parameters:
      * query: The user's search term
      * limit: Set to 100 results
    - Parse and format the API response for display in Raycast.

 3. Result Display:
    - Create a list view to display search results, showing:
      * Document title
      * Context snippet from the API response
    - Implement a detail view for selected documents, including:
      * Markdown content displayed on the left
      * Sidebar with metadata (e.g., collection, last updated, author)

 4. Error Handling:
    - Implement checks to ensure proper configuration of URL and token.
    - Generate appropriate alerts for authentication failures.
    - Provide user-friendly error messages for network issues or unexpected responses.

 5. User Experience:
    - Limit search results to 100 items for this initial version.
    - Provide an action to open the selected document in a web browser for editing.

 6. Performance:
    - No local caching or indexing in this initial version.

 ## Future Considerations (v1.1)
 - Implement advanced search features (filtering by collection, date range).
 - Consider local indexing for faster initial results.
 - Explore caching mechanisms to improve performance.

 ## Implementation Steps

 1. Set up the basic Raycast Extension structure.
 2. Implement configuration management for Outline Wiki URL and API token.
 3. Create an API module to handle Outline Wiki API requests.
 4. Develop the search command using the Outline API.
 5. Implement the results list view.
 6. Create the document detail view with markdown rendering and metadata sidebar.
 7. Add error handling and user-friendly messages.
 8. Implement the "open in browser" action for search results.
 9. If possible, add the "Test Connection" feature in settings.
 10. Conduct testing and refinement.
 11. Update documentation and prepare for release.
