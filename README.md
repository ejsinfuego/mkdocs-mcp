# MkDocs MCP Server

An MCP (Model Context Protocol) server for managing MkDocs documentation programmatically. Use it as a standalone server or import it as a library in any Node.js project.

## Features

- **File Management**: Create, read, update, and delete markdown documentation files
- **Search**: Full-text search across all documentation files with regex support
- **Navigation Management**: View and update the navigation structure in `mkdocs.yml`
- **Git Integration**: Commit and push changes to GitHub for automatic GitHub Pages deployment
- **Frontmatter Support**: Read and write YAML frontmatter in documentation files
- **Reusable Library**: Import as npm package in any project
- **CLI Executable**: Use as command-line tool

## Installation

### As a Library

```bash
npm install @silent-partner/mkdocs-mcp
```

### For Development

```bash
git clone <repo>
cd mkdocs-mcp-server
npm install
npm run build
```

## Usage

### As a Library (Recommended)

Use in any Node.js project:

```typescript
import { MkDocsMCPServer } from '@silent-partner/mkdocs-mcp';

// Create server instance with custom paths
const server = new MkDocsMCPServer({
  docsPath: '/path/to/your/docs',
  configPath: '/path/to/your/mkdocs.yml',
  serverName: 'my-docs-mcp',
  serverVersion: '1.0.0',
});

// Start the MCP server
await server.start();

// Or get the underlying server for advanced usage
const mcpServer = server.getServer();
```

### As CLI (Standalone)

Set environment variables and run:

```bash
export MKDOCS_DOCS_PATH=/path/to/docs
export MKDOCS_CONFIG_PATH=/path/to/mkdocs.yml

# Via npm
npm start

# Or via npx
npx mkdocs-mcp

# Or via installed bin
mkdocs-mcp
```

### With Docker

```bash
docker run -e MKDOCS_DOCS_PATH=/docs -e MKDOCS_CONFIG_PATH=/mkdocs.yml \
  -v /path/to/docs:/docs \
  @silent-partner/mkdocs-mcp
```

## Configuration

### Required Environment Variables

- `MKDOCS_DOCS_PATH` - Path to your docs directory
- `MKDOCS_CONFIG_PATH` - Path to your mkdocs.yml file

### Constructor Options

```typescript
interface MkDocsMCPServerConfig {
  docsPath?: string;           // Docs directory path
  configPath?: string;         // mkdocs.yml path
  serverName?: string;         // MCP server name (default: 'mkdocs-mcp')
  serverVersion?: string;      // MCP server version (default: '1.0.0')
}
```

## Available Tools

### `list_docs`
List all markdown documentation files.

```json
{
  "tool": "list_docs",
  "arguments": { "pattern": "api/**/*.md" }
}
```

### `read_doc`
Read a specific documentation file.

```json
{
  "tool": "read_doc",
  "arguments": { "filePath": "getting-started/installation.md" }
}
```

### `create_doc`
Create a new documentation file.

```json
{
  "tool": "create_doc",
  "arguments": {
    "filePath": "api/users.md",
    "content": "# Users API\n\n...",
    "frontmatter": { "title": "Users API" }
  }
}
```

### `update_doc`
Update an existing documentation file.

```json
{
  "tool": "update_doc",
  "arguments": {
    "filePath": "api/users.md",
    "content": "# Users API (Updated)\n\n..."
  }
}
```

### `delete_doc`
Delete a documentation file.

```json
{
  "tool": "delete_doc",
  "arguments": { "filePath": "api/deprecated.md" }
}
```

### `search_docs`
Search across all documentation files.

```json
{
  "tool": "search_docs",
  "arguments": { "query": "authentication", "caseSensitive": false }
}
```

### `get_navigation`
Get the navigation structure.

```json
{
  "tool": "get_navigation",
  "arguments": {}
}
```

### `update_navigation`
Update the navigation structure.

```json
{
  "tool": "update_navigation",
  "arguments": {
    "navigation": [
      { "Home": "index.md" },
      { "API": [
          { "Auth": "api/auth.md" },
          { "Users": "api/users.md" }
        ]
      }
    ]
  }
}
```

### `commit_and_push`
Commit changes and push to GitHub.

```json
{
  "tool": "commit_and_push",
  "arguments": { "message": "docs: Update API documentation" }
}
```

## Advanced Usage

### Integrate with Claude/LLM

```typescript
import { MkDocsMCPServer } from '@silent-partner/mkdocs-mcp';

const server = new MkDocsMCPServer({
  docsPath: './docs',
  configPath: './mkdocs.yml',
});

// Use with Claude SDK or any MCP client
// The server exposes all tools via MCP protocol
await server.start();
```

### Batch Documentation Updates

```typescript
const docs = [
  { filePath: 'api/v1/users.md', content: 'Users V1...' },
  { filePath: 'api/v1/posts.md', content: 'Posts V1...' },
  { filePath: 'api/v2/users.md', content: 'Users V2...' },
];

for (const doc of docs) {
  // Each call will queue and execute
  await updateDocViaServer(doc);
}

// Then commit all at once
await server.getServer().call(/* ... */);
```

## Scripts

```bash
# Development with auto-rebuild
npm run build:watch

# Build
npm run build

# Run CLI
npm start

# Dev mode with ts-node
npm run dev
```

## Integration Examples

### With GitHub Actions

```yaml
name: Update Docs

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install @silent-partner/mkdocs-mcp
      - run: npx mkdocs-mcp
        env:
          MKDOCS_DOCS_PATH: ./docs
          MKDOCS_CONFIG_PATH: ./mkdocs.yml
```

## Benefits

✅ **Reusable** - Use as library in any project
✅ **No API Limits** - Direct file operations
✅ **Full Control** - Complete documentation structure access
✅ **Auto-deployment** - Automatic GitHub Pages updates
✅ **Git Integration** - Version control built-in
✅ **Search** - Regex-based content matching
✅ **AI-friendly** - MCP-compliant tool definitions
✅ **TypeScript** - Full type safety

## Publishing to npm

```bash
npm version patch
npm publish --access public
```

## Current Status

- **Package name**: `@silent-partner/mkdocs-mcp`
- **Main entry**: `dist/index.js`
- **Types**: `dist/index.d.ts`
- **CLI bin**: `mkdocs-mcp`
- **Build status**: ✅ Ready

## License

MIT

## Support

- **Issues**: GitHub Issues
- **Documentation**: See README and inline documentation
- **Examples**: Check MCP client implementations
