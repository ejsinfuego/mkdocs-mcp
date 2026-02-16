# Tools Overview

The MkDocs MCP Server provides 8 specialized tools for managing your documentation.

## File Operations

### list_docs

List all markdown documentation files in your project.

**Parameters:**
- `pattern` (optional): Glob pattern to filter files (default: `**/*.md`)

**Example:**
```json
{
  "pattern": "api/**/*.md"
}
```

**Returns:**
```json
{
  "count": 3,
  "files": [
    {
      "path": "api/users.md",
      "size": 1234,
      "modified": 1708123456.0,
      "title": "Users API",
      "has_metadata": true
    }
  ]
}
```

### read_doc

Read the content of a specific documentation file.

**Parameters:**
- `file_path` (required): Relative path to the file

**Example:**
```json
{
  "file_path": "getting-started/installation.md"
}
```

**Returns:**
```json
{
  "path": "getting-started/installation.md",
  "frontmatter": {
    "title": "Installation Guide",
    "description": "How to install"
  },
  "content": "# Installation\n\n..."
}
```

### create_doc

Create a new documentation file.

**Parameters:**
- `file_path` (required): Relative path for the new file
- `content` (required): Markdown content
- `frontmatter` (optional): YAML frontmatter metadata

**Example:**
```json
{
  "file_path": "api/new-endpoint.md",
  "content": "# New Endpoint\n\nDocumentation...",
  "frontmatter": {
    "title": "New API Endpoint",
    "tags": ["api", "v2"]
  }
}
```

### update_doc

Update an existing documentation file.

**Parameters:**
- `file_path` (required): Relative path to the file
- `content` (required): New markdown content
- `frontmatter` (optional): New/updated YAML frontmatter

**Example:**
```json
{
  "file_path": "api/users.md",
  "content": "# Users API (Updated)\n\n...",
  "frontmatter": {
    "title": "Users API",
    "updated": "2026-02-16"
  }
}
```

### delete_doc

Delete a documentation file.

**Parameters:**
- `file_path` (required): Relative path to the file

**Example:**
```json
{
  "file_path": "api/deprecated.md"
}
```

## Search

### search_docs

Search across all documentation files with regex support.

**Parameters:**
- `query` (required): Search query (supports regex)
- `case_sensitive` (optional): Whether search is case-sensitive (default: false)

**Example:**
```json
{
  "query": "authentication|auth",
  "case_sensitive": false
}
```

**Returns:**
```json
{
  "query": "authentication|auth",
  "total_files": 2,
  "results": [
    {
      "file": "api/auth.md",
      "match_count": 5,
      "matches": [
        {
          "line": 10,
          "content": "Authentication is handled via JWT tokens"
        }
      ]
    }
  ]
}
```

## Navigation Management

### get_navigation

Get the current navigation structure from `mkdocs.yml`.

**Parameters:** None

**Returns:**
```json
{
  "site_name": "My Documentation",
  "nav": [
    { "Home": "index.md" },
    {
      "API": [
        { "Auth": "api/auth.md" },
        { "Users": "api/users.md" }
      ]
    }
  ],
  "theme": "material"
}
```

### update_navigation

Update the navigation structure in `mkdocs.yml`.

**Parameters:**
- `navigation` (required): New navigation structure

**Example:**
```json
{
  "navigation": [
    { "Home": "index.md" },
    {
      "Getting Started": [
        { "Installation": "getting-started/installation.md" },
        { "Quick Start": "getting-started/quick-start.md" }
      ]
    },
    {
      "API": [
        { "Auth": "api/auth.md" },
        { "Users": "api/users.md" }
      ]
    }
  ]
}
```

## Tool Usage Tips

1. **Always use relative paths** - Paths should be relative to the docs directory
2. **Preserve frontmatter** - When updating, frontmatter is preserved unless explicitly changed
3. **Use glob patterns** - Filter files efficiently with patterns like `api/**/*.md`
4. **Regex search** - The search tool supports full regex for powerful queries
5. **Navigation hierarchy** - Use nested dictionaries for multi-level navigation

## Next Steps

- [File Operations Details](file-operations.md)
- [Search Guide](search.md)
- [Navigation Management](navigation.md)
