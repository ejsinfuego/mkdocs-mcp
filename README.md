# MkDocs MCP Server

An MCP (Model Context Protocol) server for managing MkDocs documentation programmatically. Built with FastMCP for easy deployment to FastMCP Cloud.

## Features

- **File Management**: Create, read, update, and delete markdown documentation files
- **Search**: Full-text search across all documentation files with regex support
- **Navigation Management**: View and update the navigation structure in `mkdocs.yml`
- **Git Integration**: Commit and push changes to GitHub for automatic GitHub Pages deployment
- **Frontmatter Support**: Read and write YAML frontmatter in documentation files
- **Free Deployment**: Deploy to FastMCP Cloud for free (currently in beta)
- **AI-friendly**: MCP-compliant tool definitions

## Quick Start

### Deploy to FastMCP Cloud (Recommended - Free)

1. Fork or connect this repo to your GitHub account
2. Go to [fastmcp.cloud](https://fastmcp.cloud/)
3. Sign in with GitHub
4. Create a project:
   - **Name**: `mkdocs-mcp`
   - **Entrypoint**: `server.py:mcp`
   - **Authentication**: Optional
5. FastMCP Cloud will automatically:
   - Clone your repo
   - Install dependencies from `requirements.txt`
   - Deploy your server
   - Provide a unique URL: `https://your-project.fastmcp.app/mcp`

Your server is now live and accessible to Claude, Cursor, and any MCP client!

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MKDOCS_DOCS_PATH=/path/to/your/docs
export MKDOCS_CONFIG_PATH=/path/to/your/mkdocs.yml

# Run locally
fastmcp run server.py:mcp
```

## Available Tools

### `list_docs`
List all markdown documentation files.

```json
{
  "pattern": "api/**/*.md"
}
```

### `read_doc`
Read a specific documentation file with frontmatter.

```json
{
  "file_path": "getting-started/installation.md"
}
```

### `create_doc`
Create a new documentation file.

```json
{
  "file_path": "api/users.md",
  "content": "# Users API\n\n...",
  "frontmatter": { "title": "Users API", "description": "..." }
}
```

### `update_doc`
Update an existing documentation file.

```json
{
  "file_path": "api/users.md",
  "content": "# Users API (Updated)\n\n...",
  "frontmatter": { "title": "Users API" }
}
```

### `delete_doc`
Delete a documentation file.

```json
{
  "file_path": "api/deprecated.md"
}
```

### `search_docs`
Search across all documentation files.

```json
{
  "query": "authentication",
  "case_sensitive": false
}
```

### `get_navigation`
Get the current navigation structure.

```json
{}
```

### `update_navigation`
Update the navigation structure in mkdocs.yml.

```json
{
  "navigation": [
    { "Home": "index.md" },
    { "API": [
        { "Auth": "api/auth.md" },
        { "Users": "api/users.md" }
      ]
    }
  ]
}
```

### `commit_and_push`
Commit changes and push to GitHub.

```json
{
  "message": "docs: Update API documentation"
}
```

## Configuration

Set these environment variables:

- `MKDOCS_DOCS_PATH` - Path to your docs directory (default: `./docs`)
- `MKDOCS_CONFIG_PATH` - Path to your mkdocs.yml file (default: `./mkdocs.yml`)

FastMCP Cloud will automatically use these from your repository.

## Deployment Platforms

### FastMCP Cloud (Recommended - Free)
- ✅ Free while in beta
- ✅ Automatic GitHub integration
- ✅ Auto-redeploy on push
- ✅ Instant URL generation
- URL format: `https://your-project.fastmcp.app/mcp`

### Docker (Any Cloud Provider)
```bash
docker build -t mkdocs-mcp .
docker run -e MKDOCS_DOCS_PATH=/docs -e MKDOCS_CONFIG_PATH=/mkdocs.yml \
  -v /path/to/docs:/docs mkdocs-mcp
```

Deploy to: AWS ECS, Google Cloud Run, Heroku, Railway, DigitalOcean, etc.

## Usage with Claude/Cursor

Once deployed, connect to your FastMCP Cloud server:

```json
{
  "mcpServers": {
    "mkdocs": {
      "url": "https://your-project.fastmcp.app/mcp"
    }
  }
}
```

## Project Structure

```
server.py          # Main FastMCP server implementation
requirements.txt   # Python dependencies
Dockerfile         # For containerized deployment
```

## Development

This is a FastMCP 2.0 server that works with both FastMCP Cloud and the FastMCP SDK.

### Testing Command
```bash
fastmcp inspect server.py:mcp
```

## Benefits

✅ **Free Deployment** - FastMCP Cloud beta is free
✅ **Easy Setup** - 3 steps to production
✅ **Zero Maintenance** - Auto-redeploy on push
✅ **Full Control** - Complete documentation structure access
✅ **Auto-deployment** - Automatic GitHub Pages updates
✅ **Search** - Regex-based content matching
✅ **AI-friendly** - MCP-compliant tool definitions

## Support

- **FastMCP Cloud Issues**: [fastmcp.cloud support](https://discord.gg/aGsSC3yDF4)
- **FastMCP Docs**: [fastmcp.wiki](https://fastmcp.wiki/)
- **GitHub Issues**: Report issues here

## License

MIT

## Differences from TypeScript Version

This Python version is optimized for FastMCP Cloud deployment while maintaining full feature parity with the TypeScript version. Key differences:

- Uses FastMCP framework instead of MCP SDK
- Deployed as Python server (not Node.js)
- Automatic dependency detection from `requirements.txt`
- Direct FastMCP Cloud integration
