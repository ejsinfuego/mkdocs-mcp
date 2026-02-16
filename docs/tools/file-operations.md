# File Operations

Detailed guide to file management tools in the MkDocs MCP Server.

## Creating Files

### create_doc

Create new documentation files with proper structure.

**Signature:**
```python
create_doc(
    file_path: str,
    content: str,
    frontmatter: Optional[Dict[str, Any]] = None
) -> str
```

**Parameters:**

- `file_path` (required): Relative path from docs directory
- `content` (required): Markdown content for the page
- `frontmatter` (optional): YAML metadata dictionary

**Examples:**

### Simple Page
```json
{
  "file_path": "guides/tutorial.md",
  "content": "# Tutorial\n\nLearn how to use our product..."
}
```

### With Frontmatter
```json
{
  "file_path": "api/users.md",
  "content": "# Users API\n\n## Endpoints\n\n### GET /users\n...",
  "frontmatter": {
    "title": "Users API Reference",
    "description": "User management endpoints",
    "tags": ["api", "users"],
    "version": "2.0"
  }
}
```

### Nested Structure
```json
{
  "file_path": "guides/advanced/performance.md",
  "content": "# Performance Optimization\n\n..."
}
```

Parent directories are created automatically.

## Reading Files

### read_doc

Read file contents including frontmatter.

**Signature:**
```python
read_doc(file_path: str) -> str
```

**Parameters:**

- `file_path` (required): Relative path to the file

**Response Structure:**
```json
{
  "path": "api/users.md",
  "frontmatter": {
    "title": "Users API",
    "tags": ["api"]
  },
  "content": "# Users API\n\nThe markdown content..."
}
```

**Use Cases:**

1. **Review content before editing**
2. **Extract frontmatter metadata**
3. **Check current documentation state**
4. **Validate file content**

## Updating Files

### update_doc

Modify existing documentation files.

**Signature:**
```python
update_doc(
    file_path: str,
    content: str,
    frontmatter: Optional[Dict[str, Any]] = None
) -> str
```

**Parameters:**

- `file_path` (required): Relative path to existing file
- `content` (required): New markdown content
- `frontmatter` (optional): New/updated metadata (preserves existing if not provided)

**Frontmatter Behavior:**

- **Not provided**: Existing frontmatter is preserved
- **Provided**: Replaces entire frontmatter block
- **Empty dict `{}`**: Removes frontmatter

**Examples:**

### Update Content Only
```json
{
  "file_path": "getting-started.md",
  "content": "# Getting Started (Updated)\n\nNew content..."
}
```
*Preserves existing frontmatter*

### Update Content and Frontmatter
```json
{
  "file_path": "api/users.md",
  "content": "# Users API v2\n\n...",
  "frontmatter": {
    "title": "Users API v2",
    "version": "2.0",
    "updated": "2026-02-16"
  }
}
```

### Remove Frontmatter
```json
{
  "file_path": "simple.md",
  "content": "# Simple Page\n\nNo metadata needed.",
  "frontmatter": {}
}
```

## Deleting Files

### delete_doc

Remove documentation files.

**Signature:**
```python
delete_doc(file_path: str) -> str
```

**Parameters:**

- `file_path` (required): Relative path to file

**Example:**
```json
{
  "file_path": "deprecated/old-api.md"
}
```

**Important:**
- File is permanently deleted
- Empty parent directories are not removed
- Update navigation separately if needed

## Listing Files

### list_docs

Discover and filter documentation files.

**Signature:**
```python
list_docs(pattern: str = "**/*.md") -> str
```

**Parameters:**

- `pattern` (optional): Glob pattern (default: all markdown files)

**Glob Pattern Examples:**

```python
"**/*.md"              # All markdown files (default)
"api/**/*.md"          # All files under api/
"getting-started/*.md" # Files directly in getting-started/
"**/*guide*.md"        # Files with 'guide' in name
"*.md"                 # Files in root docs/ only
```

**Response:**
```json
{
  "count": 15,
  "files": [
    {
      "path": "api/authentication.md",
      "size": 2048,
      "modified": 1708123456.0,
      "title": "Authentication Guide",
      "has_metadata": true
    }
  ]
}
```

**Use Cases:**

1. **Discover existing files**
2. **Filter by directory**
3. **Find files by naming pattern**
4. **Audit metadata presence**

## Best Practices

### File Naming

✅ **Good:**
- `getting-started.md`
- `api-reference.md`
- `user-authentication.md`

❌ **Avoid:**
- `Getting Started.md` (spaces)
- `API_Reference.md` (underscores)
- `userAuth.md` (camelCase)

### Directory Structure

```
docs/
├── index.md                 # Home page
├── getting-started/         # User onboarding
│   ├── installation.md
│   └── quick-start.md
├── guides/                  # How-to guides
│   ├── basic.md
│   └── advanced.md
├── api/                     # API reference
│   ├── authentication.md
│   └── endpoints.md
└── examples/                # Code examples
    └── python.md
```

### Frontmatter Guidelines

**Essential metadata:**
```yaml
title: Page Title
description: Brief page description
```

**Enhanced metadata:**
```yaml
title: Advanced Configuration
description: Detailed configuration options
tags: [configuration, advanced]
author: Team Name
date: 2026-02-16
version: 2.0
```

### Content Structure

**Good document structure:**
```markdown
# Main Title (H1)

Brief introduction paragraph.

## Section (H2)

Content...

### Subsection (H3)

Details...

## Next Section (H2)

More content...
```

**Use:**
- One H1 per page
- Hierarchical headings (H2, H3, H4)
- Code blocks with language tags
- Lists for steps/items
- Tables for structured data

## Common Patterns

### Pattern: Bulk File Creation

Create multiple related files:

```python
# Ask AI:
"Create these API documentation pages:
- api/authentication.md
- api/users.md
- api/posts.md
Each should have title frontmatter and basic structure."
```

### Pattern: Template Application

Apply consistent structure:

```python
# Ask AI:
"Create api/products.md using the same structure as api/users.md
but for the Products endpoint"
```

### Pattern: Content Migration

Move content between files:

```python
# Ask AI:
"Read old-guide.md, create a new version at guides/new-guide.md
with improved formatting, then delete the old file"
```

## Error Handling

### File Already Exists
```json
{
  "error": "File already exists: api/users.md"
}
```
**Solution:** Use `update_doc` instead or delete first

### File Not Found
```json
{
  "error": "File not found: api/missing.md"
}
```
**Solution:** Check path, use `list_docs` to verify

### Invalid Path
```json
{
  "error": "Documentation path does not exist: /wrong/path"
}
```
**Solution:** Verify `MKDOCS_DOCS_PATH` environment variable

## Next Steps

- [Search Guide](search.md) - Find content across files
- [Navigation Management](navigation.md) - Organize file structure
- [Examples](../examples/basic.md) - Real-world usage patterns
