#!/bin/bash

# Start the MCP server in the background
echo "🚀 Starting MkDocs MCP server..."
cd /Users/ej/Desktop/work/silent-partner-master/.mcp/servers/gitbook
npm start &
MCP_PID=$!

# Wait for server to start
sleep 2

echo ""
echo "✅ MCP Server started (PID: $MCP_PID)"
echo ""
echo "Available Tools:"
echo "  - list_docs: List all markdown files in the MkDocs project"
echo "  - read_doc: Read a specific documentation file"
echo "  - create_doc: Create a new documentation file"
echo "  - update_doc: Update an existing documentation file"
echo "  - delete_doc: Delete a documentation file"
echo "  - search_docs: Search across all documentation files"
echo "  - get_navigation: Get the navigation structure from mkdocs.yml"
echo "  - update_navigation: Update the navigation in mkdocs.yml"
echo "  - commit_and_push: Commit and push changes to GitHub"
echo ""
echo "📁 Documentation Path: /Users/ej/Desktop/work/silent-partner-docs/docs"
echo "⚙️  Config Path: /Users/ej/Desktop/work/silent-partner-docs/mkdocs.yml"
echo ""
echo "To stop the server, press Ctrl+C or run: kill $MCP_PID"
echo ""

# Keep the server running
wait $MCP_PID
