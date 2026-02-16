# Configuration

## Environment Variables

The MkDocs MCP Server requires two environment variables to operate:

### MKDOCS_DOCS_PATH

**Required**: Yes  
**Type**: Absolute file path  
**Description**: Path to your MkDocs documentation directory

```bash
export MKDOCS_DOCS_PATH=/Users/you/my-project/docs
```

This directory should contain your markdown files structured according to your MkDocs project.

### MKDOCS_CONFIG_PATH

**Required**: Yes  
**Type**: Absolute file path  
**Description**: Path to your `mkdocs.yml` configuration file

```bash
export MKDOCS_CONFIG_PATH=/Users/you/my-project/mkdocs.yml
```

## Configuration Examples

### Multiple Projects

If you work on multiple projects, you can configure different MCP instances:

```json
{
  "mcpServers": {
    "docs-project-a": {
      "url": "https://mkdocs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/you/project-a/docs",
        "MKDOCS_CONFIG_PATH": "/Users/you/project-a/mkdocs.yml"
      }
    },
    "docs-project-b": {
      "url": "https://mkdocs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/you/project-b/docs",
        "MKDOCS_CONFIG_PATH": "/Users/you/project-b/mkdocs.yml"
      }
    }
  }
}
```

### Team Setup

Each team member configures their own local paths while using the same shared server URL:

**Developer A:**
```json
{
  "MKDOCS_DOCS_PATH": "/home/dev-a/company-docs/docs",
  "MKDOCS_CONFIG_PATH": "/home/dev-a/company-docs/mkdocs.yml"
}
```

**Developer B:**
```json
{
  "MKDOCS_DOCS_PATH": "/Users/dev-b/repos/company-docs/docs",
  "MKDOCS_CONFIG_PATH": "/Users/dev-b/repos/company-docs/mkdocs.yml"
}
```

## Troubleshooting

### Path Errors

If you see `"Documentation path does not exist"` errors:

1. Verify the path is absolute (starts with `/` on Unix or `C:\` on Windows)
2. Check that the directory actually exists
3. Ensure you have read permissions

### Config File Not Found

If you see `"Config file does not exist"` errors:

1. Verify `mkdocs.yml` exists at the specified path
2. Check the file name is exactly `mkdocs.yml` (case-sensitive on Unix)
3. Ensure you have read permissions

## Advanced Configuration

### Using Local Server

For development or self-hosted deployments:

```bash
export MKDOCS_DOCS_PATH=/path/to/docs
export MKDOCS_CONFIG_PATH=/path/to/mkdocs.yml
fastmcp run server.py:mcp
```

Then connect to `http://localhost:8000/mcp` instead of the FastMCP Cloud URL.

## Next Steps

- [Tools Overview](../tools/overview.md) - Learn about available tools
- [FastMCP Cloud Deployment](../deployment/fastmcp-cloud.md) - Deploy your own instance
