# Local Development

Run the MkDocs MCP Server locally for development and testing.

## Prerequisites

- Python 3.8 or higher
- pip
- FastMCP CLI

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ejsinfuego/mkdocs-mcp.git
cd mkdocs-mcp
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables

```bash
export MKDOCS_DOCS_PATH=/path/to/your/docs
export MKDOCS_CONFIG_PATH=/path/to/your/mkdocs.yml
```

Or create a `.env` file:

```bash
# .env
MKDOCS_DOCS_PATH=/Users/you/my-project/docs
MKDOCS_CONFIG_PATH=/Users/you/my-project/mkdocs.yml
```

### 4. Run the Server

```bash
fastmcp run server.py:mcp
```

Output:
```
✅ MkDocs MCP Server ready for deployment
📁 Documentation path: /Users/you/my-project/docs
⚙️  Config path: /Users/you/my-project/mkdocs.yml
🚀 Server running at http://localhost:8000/mcp
```

## Configure MCP Client

Point your MCP client to the local server:

### Claude Desktop

```json
{
  "mcpServers": {
    "mkdocs-local": {
      "url": "http://localhost:8000/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/you/project/docs",
        "MKDOCS_CONFIG_PATH": "/Users/you/project/mkdocs.yml"
      }
    }
  }
}
```

### Cursor

```json
{
  "mcpServers": {
    "mkdocs-local": {
      "url": "http://localhost:8000/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/you/workspace/docs",
        "MKDOCS_CONFIG_PATH": "/Users/you/workspace/mkdocs.yml"
      }
    }
  }
}
```

## Development Workflow

### 1. Make Changes

Edit `server.py` to add features or fix bugs.

### 2. Test Changes

```bash
# Restart the server
fastmcp run server.py:mcp
```

Test with your MCP client by asking the AI to use the tools.

### 3. Run Type Checks (Optional)

```bash
pip install mypy
mypy server.py
```

### 4. Format Code (Optional)

```bash
pip install black
black server.py
```

## Testing Individual Tools

You can test tools manually using the FastMCP CLI:

```bash
# Test list_docs
fastmcp test server.py:mcp list_docs

# Test with parameters
fastmcp test server.py:mcp search_docs '{"query": "test"}'
```

## Hot Reload

FastMCP supports hot reload during development:

```bash
fastmcp dev server.py:mcp
```

Changes to `server.py` will automatically reload the server.

## Debugging

### Enable Verbose Logging

```bash
export FASTMCP_LOG_LEVEL=DEBUG
fastmcp run server.py:mcp
```

### Check Tool Responses

Add print statements in your tool functions:

```python
@mcp.tool()
def list_docs(pattern: str = "**/*.md") -> str:
    print(f"DEBUG: pattern={pattern}")  # Debug output
    # ... rest of function
```

### Validate Paths

Test path resolution:

```python
if __name__ == "__main__":
    docs_dir, config_file, error = get_paths()
    print(f"Docs: {docs_dir}")
    print(f"Config: {config_file}")
    print(f"Error: {error}")
```

Run with:
```bash
python server.py
```

## Project Structure

```
mkdocs-mcp/
├── server.py          # Main MCP server
├── requirements.txt   # Python dependencies
├── mkdocs.yml        # MkDocs config (for project docs)
├── docs/             # Project documentation
└── README.md         # Project README
```

## Common Issues

### Import Errors

```bash
pip install --upgrade fastmcp pyyaml
```

### Path Not Found

Verify environment variables:
```bash
echo $MKDOCS_DOCS_PATH
echo $MKDOCS_CONFIG_PATH
```

### Port Already in Use

Change the port:
```bash
fastmcp run server.py:mcp --port 8001
```

## Next Steps

- [FastMCP Cloud Deployment](fastmcp-cloud.md) - Deploy to production
- [Tools Overview](../tools/overview.md) - Learn about available tools
