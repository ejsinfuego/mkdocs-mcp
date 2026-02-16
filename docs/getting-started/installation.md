# Installation

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- A MkDocs project (or create one with `mkdocs new my-project`)

## Install Dependencies

```bash
pip install -r requirements.txt
```

The requirements are minimal:

- `fastmcp>=1.0.0` - FastMCP framework for building MCP servers
- `pyyaml>=6.0` - YAML parsing for mkdocs.yml and frontmatter

## Configure Your MCP Client

### Claude Desktop

Edit `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mkdocs": {
      "url": "https://mkdocs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/path/to/your/docs",
        "MKDOCS_CONFIG_PATH": "/path/to/your/mkdocs.yml"
      }
    }
  }
}
```

### Cursor

Edit `.cursor/mcp_config.json` in your project:

```json
{
  "mcpServers": {
    "mkdocs": {
      "url": "https://mkdocs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/you/workspace/docs",
        "MKDOCS_CONFIG_PATH": "/Users/you/workspace/mkdocs.yml"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MKDOCS_DOCS_PATH` | Yes | Path to your documentation directory (e.g., `/path/to/my-project/docs`) |
| `MKDOCS_CONFIG_PATH` | Yes | Path to your `mkdocs.yml` file (e.g., `/path/to/my-project/mkdocs.yml`) |

## Verify Installation

Once configured, restart your MCP client (Claude Desktop or Cursor) and verify the MkDocs MCP tools are available.

## Next Steps

- [Quick Start Guide](quick-start.md) - Learn how to use the MCP tools
- [Configuration Guide](configuration.md) - Advanced configuration options
