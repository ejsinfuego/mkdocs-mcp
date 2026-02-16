# Navigation Management

Manage your MkDocs site navigation structure programmatically.

## Overview

The navigation tools allow you to view and modify the navigation structure defined in `mkdocs.yml`.

## get_navigation

Retrieve the current navigation structure.

**Signature:**
```python
get_navigation() -> str
```

**Parameters:** None

**Response:**
```json
{
  "site_name": "My Documentation",
  "nav": [
    { "Home": "index.md" },
    {
      "Getting Started": [
        { "Installation": "getting-started/installation.md" },
        { "Quick Start": "getting-started/quick-start.md" }
      ]
    },
    {
      "API": [
        { "Authentication": "api/auth.md" },
        { "Users": "api/users.md" }
      ]
    }
  ],
  "theme": "material"
}
```

**Response Fields:**

- `site_name`: Name of the documentation site
- `nav`: Navigation structure (array of items)
- `theme`: Theme name (if configured)

## update_navigation

Modify the navigation structure.

**Signature:**
```python
update_navigation(navigation: List[Any]) -> str
```

**Parameters:**

- `navigation` (required): New navigation structure

**Example:**
```json
{
  "navigation": [
    { "Home": "index.md" },
    {
      "Documentation": [
        { "Guide": "guide.md" },
        { "Reference": "reference.md" }
      ]
    }
  ]
}
```

## Navigation Structure

### Simple Item

Single page:
```python
{ "Page Title": "path/to/file.md" }
```

### Section with Pages

Nested structure:
```python
{
  "Section Name": [
    { "Page 1": "section/page1.md" },
    { "Page 2": "section/page2.md" }
  ]
}
```

### Deeply Nested

Multiple levels:
```python
{
  "API": [
    { "Overview": "api/index.md" },
    {
      "Endpoints": [
        { "Users": "api/endpoints/users.md" },
        { "Posts": "api/endpoints/posts.md" }
      ]
    },
    {
      "Authentication": [
        { "OAuth2": "api/auth/oauth2.md" },
        { "JWT": "api/auth/jwt.md" }
      ]
    }
  ]
}
```

### Multiple Root Sections

```python
[
  { "Home": "index.md" },
  {
    "Getting Started": [...]
  },
  {
    "Guides": [...]
  },
  {
    "API Reference": [...]
  },
  {
    "Examples": [...]
  }
]
```

## Common Operations

### Operation 1: Add a New Page

**Before:**
```json
{
  "nav": [
    { "Home": "index.md" },
    { "Guide": "guide.md" }
  ]
}
```

**Ask AI:**
> Add tutorials.md to the navigation after Guide

**After:**
```json
{
  "nav": [
    { "Home": "index.md" },
    { "Guide": "guide.md" },
    { "Tutorials": "tutorials.md" }
  ]
}
```

### Operation 2: Create a New Section

**Ask AI:**
> Create a new "API Reference" section with auth.md and users.md

**Result:**
```json
{
  "nav": [
    { "Home": "index.md" },
    {
      "API Reference": [
        { "Authentication": "api/auth.md" },
        { "Users": "api/users.md" }
      ]
    }
  ]
}
```

### Operation 3: Reorder Sections

**Before:**
```json
[
  { "Home": "index.md" },
  { "API": [...] },
  { "Getting Started": [...] }
]
```

**Ask AI:**
> Move "Getting Started" before "API"

**After:**
```json
[
  { "Home": "index.md" },
  { "Getting Started": [...] },
  { "API": [...] }
]
```

### Operation 4: Rename Section

**Ask AI:**
> Rename "Guides" section to "Tutorials"

Navigation structure updated with new name.

### Operation 5: Remove Item

**Ask AI:**
> Remove the deprecated.md page from navigation

Item removed from structure.

### Operation 6: Flatten Section

**Before:**
```json
{
  "Simple Guides": [
    { "Guide 1": "guides/guide1.md" }
  ]
}
```

**Ask AI:**
> Flatten the "Simple Guides" section since it only has one item

**After:**
```json
{ "Guide 1": "guides/guide1.md" }
```

### Operation 7: Add Subsection

**Ask AI:**
> Under API section, create an "Advanced" subsection with caching.md and rate-limiting.md

**Result:**
```json
{
  "API": [
    { "Overview": "api/index.md" },
    {
      "Advanced": [
        { "Caching": "api/advanced/caching.md" },
        { "Rate Limiting": "api/advanced/rate-limiting.md" }
      ]
    }
  ]
}
```

## Best Practices

### Logical Hierarchy

✅ **Good:**
```
Home
├── Getting Started
│   ├── Installation
│   └── Quick Start
├── Guides
│   ├── Basic
│   └── Advanced
└── API Reference
    ├── Authentication
    └── Endpoints
```

❌ **Avoid:**
```
Home
├── Page 1
├── Section
│   └── Page 2
├── Page 3
└── Another Section
    └── Subsection
        └── Page 4
```

### Consistent Depth

Try to keep similar content at similar nesting levels:

✅ **Good:**
```json
{
  "API": [
    { "Users": "api/users.md" },
    { "Posts": "api/posts.md" },
    { "Comments": "api/comments.md" }
  ]
}
```

❌ **Avoid:**
```json
{
  "API": [
    { "Users": "api/users.md" },
    {
      "Posts": [
        { "Posts": "api/posts.md" }
      ]
    }
  ]
}
```

### Descriptive Labels

✅ **Good:**
- "Getting Started"
- "API Reference"
- "Quick Start Guide"

❌ **Avoid:**
- "Docs"
- "Misc"
- "Other"

### Balanced Sections

Aim for 3-7 items per section:

✅ **Good:**
```
Getting Started (4 items)
├── Installation
├── Configuration
├── Quick Start
└── First Steps
```

❌ **Too many:**
```
Getting Started (15 items)
├── Step 1
├── Step 2
├── ... (13 more items)
```

## Navigation Patterns

### Pattern: Feature-Based

Organize by product features:
```
Home
├── Authentication
├── Data Management  
├── Analytics
├── Integrations
└── Settings
```

### Pattern: User Journey

Organize by user progression:
```
Home
├── Getting Started
├── Basic Usage
├── Intermediate Topics
├── Advanced Topics
└── Reference
```

### Pattern: Audience-Based

Organize by user role:
```
Home
├── For End Users
├── For Developers
├── For Administrators
└── For Contributors
```

### Pattern: Product-Based

Organize by product line:
```
Home
├── Product A
│   ├── Guide
│   └── API
├── Product B
│   ├── Guide
│   └── API
└── Platform
```

## Workflow Examples

### Workflow: Adding New Feature Docs

1. Create files with `create_doc`
2. Get current navigation with `get_navigation`
3. Modify structure to add new section
4. Update with `update_navigation`
5. Verify on docs site

### Workflow: Restructuring

1. Review current structure with `get_navigation`
2. Design new structure
3. Create any missing files
4. Update navigation with new structure
5. Delete obsolete files
6. Verify all links work

### Workflow: Maintaining Consistency

1. Periodically review navigation
2. Compare file tree with navigation
3. Add orphaned files
4. Remove references to deleted files
5. Reorder for logical flow

## Troubleshooting

### Missing Files in Navigation

**Problem:** File exists but not in navigation

**Solution:**
```
1. Get navigation
2. Add file reference to appropriate section
3. Update navigation
```

### Orphaned Navigation Items

**Problem:** Navigation references non-existent file

**Solution:**
```
1. Search navigation for item
2. Either create the file or remove the reference
3. Update navigation
```

### Incorrect Nesting

**Problem:** Pages at wrong depth level

**Solution:**
```
1. Review entire navigation structure
2. Reorganize sections logically
3. Update navigation with corrected structure
```

## Advanced Usage

### Dynamic Navigation

Generate navigation from file structure:

```
1. List all docs: list_docs()
2. Analyze directory structure
3. Generate navigation object
4. Update navigation
```

### Template-Based Navigation

Apply consistent patterns:

```
For each new product:
1. Create docs/products/{name}/
2. Add to navigation under Products section
3. Follow standard subsections: Overview, Setup, API, Examples
```

### Navigation Validation

Check navigation integrity:

```
1. Get navigation
2. Extract all file paths
3. Verify files exist with list_docs
4. Report missing files
5. Report files not in navigation
```

## Next Steps

- [File Operations](file-operations.md) - Create the pages
- [Search](search.md) - Find content to organize
- [Examples](../examples/basic.md) - See navigation in action
