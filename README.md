# MkDocs MCP Server

An MCP (Model Context Protocol) server for managing MkDocs documentation programmatically. Built with FastMCP for easy deployment to FastMCP Cloud.

Deploy once on FastMCP Cloud, then share with your entire team! Each developer simply configures their own docs path and config path.

## Features

- **File Management**: Create, read, update, and delete markdown documentation files
- **Search**: Full-text search across all documentation files with regex support
- **Navigation Management**: View and update the navigation structure in `mkdocs.yml`
- **Frontmatter Support**: Read and write YAML frontmatter in documentation files
- **Free Deployment**: Deploy to FastMCP Cloud for free (currently in beta)
- **Shared Server**: Deploy once, share with unlimited team members
- **AI-friendly**: MCP-compliant tool definitions
- **Separation of Concerns**: Focuses on documentation operations, letting other tools handle Git

## Quick Start for Users

### Use a Pre-Deployed Server (Easiest)

If someone has already deployed this to FastMCP Cloud, you can use their shared instance:

1. Get the server URL from them (e.g., `https://mkdocs-mcp.fastmcp.app/mcp`)
2. Add to your Claude Desktop or Cursor config:

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

3. That's it! Claude/Cursor can now manage your documentation

### Deploy Your Own to FastMCP Cloud

1. Fork this repo to your GitHub account
2. Go to [fastmcp.cloud](https://fastmcp.cloud/)
3. Sign in with GitHub
4. Create a project:
   - **Name**: `mkdocs-mcp` (or your choice)
   - **Entrypoint**: `server.py:mcp`
   - **Authentication**: Enable for team-only access
5. FastMCP Cloud auto-deploys and gives you a URL to share

Now you can give your URL to teammates and they configure their own environment variables!

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

## Configuration

Each developer/team using the shared server needs to configure these environment variables:

- `MKDOCS_DOCS_PATH` - **Required** - Path to your documentation directory (e.g., `/path/to/my-project/docs`)
- `MKDOCS_CONFIG_PATH` - **Required** - Path to your `mkdocs.yml` file (e.g., `/path/to/my-project/mkdocs.yml`)

**Note**: Git operations (commit, push) are intentionally not included. Use your preferred Git workflow or a dedicated Git MCP server.

### Example Configurations

**Claude Desktop** (~/.claude/claude_desktop_config.json):
```json
{
  "mcpServers": {
    "docs": {
      "url": "https://mkdocs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/you/project/docs",
        "MKDOCS_CONFIG_PATH": "/Users/you/project/mkdocs.yml"
      }
    }
  }
}
```

**Cursor** (.cursor/mcp_config.json):
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

**Local FastMCP CLI**:
```bash
export MKDOCS_DOCS_PATH=/path/to/docs
export MKDOCS_CONFIG_PATH=/path/to/mkdocs.yml
fastmcp run server.py:mcp
```

## How Teams Use This

### Scenario: Shared Team Server

1. **Team Lead** deploys to FastMCP Cloud once:
   ```bash
   # Deploy from their repo
   # Get URL: https://team-docs-mcp.fastmcp.app/mcp
   ```

2. **Team Lead** shares URL with team:
   ```
   Server URL: https://team-docs-mcp.fastmcp.app/mcp
   ```

3. **Each Team Member** configures for their own docs:
   
   **Member A** (Project Alpha):
   ```json
   {
     "url": "https://team-docs-mcp.fastmcp.app/mcp",
     "env": {
       "MKDOCS_DOCS_PATH": "/home/membera/alpha/docs",
       "MKDOCS_CONFIG_PATH": "/home/membera/alpha/mkdocs.yml"
     }
   }
   ```

   **Member B** (Project Beta):
   ```json
   {
     "url": "https://team-docs-mcp.fastmcp.app/mcp",
     "env": {
       "MKDOCS_DOCS_PATH": "/home/memberb/beta/docs",
       "MKDOCS_CONFIG_PATH": "/home/memberb/beta/mkdocs.yml"
     }
   }
   ```

4. **Result**: Both team members use the same server URL, just with different local paths

### Benefits

- ✅ Deploy once, share with unlimited users
- ✅ No duplicate servers
- ✅ Single maintenance point
- ✅ Each developer manages their own docs path
- ✅ All use the same MCP tools
- ✅ Free and fast (FastMCP Cloud)

## Deployment Platforms

## Deployment Platforms

### FastMCP Cloud (Recommended)
- ✅ Free while in beta
- ✅ Automatic GitHub integration
- ✅ Auto-redeploy on push
- ✅ Shareable URL for entire team
- ✅ Easy collaboration
- URL format: `https://your-project.fastmcp.app/mcp`

Deploy at: https://fastmcp.cloud/

### Docker (Self-Hosted Alternative)

For teams wanting self-hosted deployment:

```bash
docker build -t mkdocs-mcp .
docker run -p 8000:8000 \
  -e MKDOCS_DOCS_PATH=/docs \
  -e MKDOCS_CONFIG_PATH=/mkdocs.yml \
  -v /path/to/docs:/docs \
  mkdocs-mcp
```

Deploy to:
- Railway.app (free tier)
- Fly.io (free tier)
- Google Cloud Run (free tier)
- Heroku
- DigitalOcean
- AWS ECS

## Project Structure

```
server.py          # FastMCP server with 8 documentation tools
requirements.txt   # Python dependencies (fastmcp, pyyaml)
Dockerfile         # For containerized deployment
```

This is a FastMCP 2.0 server compatible with both FastMCP Cloud and the FastMCP SDK.

## Git Workflow

This MCP intentionally does not handle Git operations. Use your preferred workflow:
- Manual `git add`, `git commit`, `git push` commands
- GitHub Desktop, Tower, or other Git GUI tools
- A dedicated Git MCP server for version control operations
- GitHub Actions or CI/CD for automatic deployments

## Support & Community

- **FastMCP Docs**: https://fastmcp.wiki/
- **FastMCP Discord**: https://discord.gg/aGsSC3yDF4
- **Issues**: GitHub Issues on this repo
- **Questions**: Ask in FastMCP community
