# Basic Usage Examples

Learn how to use the MkDocs MCP Server with practical examples.

## Example 1: Creating Documentation

**Ask your AI:**
> Create a new page at docs/api/authentication.md explaining JWT authentication. Add frontmatter with title and tags.

**What happens:**
1. AI uses `create_doc` tool
2. Creates file with frontmatter
3. Adds markdown content

**Result:**
```markdown
---
title: Authentication
tags: [api, security]
---

# Authentication

This API uses JWT (JSON Web Tokens) for authentication...
```

## Example 2: Searching and Updating

**Ask your AI:**
> Search my docs for mentions of "Python 3.7" and update them to "Python 3.8"

**What happens:**
1. AI uses `search_docs` with query "Python 3.7"
2. Identifies files with matches
3. Uses `read_doc` to read each file
4. Uses `update_doc` to update content
5. Reports changes made

## Example 3: Reorganizing Navigation

**Ask your AI:**
> Show me the current navigation, then add a new "Tutorials" section with these pages:
> - tutorials/basic.md
> - tutorials/advanced.md

**What happens:**
1. AI uses `get_navigation` to see current structure
2. Modifies the navigation structure
3. Uses `update_navigation` to save changes
4. Updates `mkdocs.yml`

**Result in mkdocs.yml:**
```yaml
nav:
  - Home: index.md
  - Getting Started: getting-started/index.md
  - Tutorials:
      - Basic Tutorial: tutorials/basic.md
      - Advanced Tutorial: tutorials/advanced.md
  - API Reference: api/index.md
```

## Example 4: Batch File Creation

**Ask your AI:**
> Create a complete API documentation structure:
> - api/index.md (overview)
> - api/authentication.md
> - api/users.md
> - api/posts.md
> - api/comments.md

**What happens:**
1. AI uses `create_doc` multiple times
2. Creates each file with appropriate content
3. Reports completion

## Example 5: Finding Broken Links

**Ask your AI:**
> Search for all links to "/old-api/" in my documentation

**What happens:**
1. AI uses `search_docs` with regex pattern
2. Finds all occurrences
3. Lists files and line numbers

**Sample output:**
```json
{
  "total_files": 3,
  "results": [
    {
      "file": "getting-started/quick-start.md",
      "match_count": 1,
      "matches": [
        {
          "line": 45,
          "content": "See [Old API](/old-api/) for legacy endpoints"
        }
      ]
    }
  ]
}
```

## Example 6: Documentation Cleanup

**Ask your AI:**
> List all files in the deprecated/ folder, then delete them and remove the Deprecated section from navigation

**What happens:**
1. AI uses `list_docs` with pattern "deprecated/**/*.md"
2. Uses `delete_doc` for each file
3. Uses `get_navigation` and `update_navigation` to clean up nav

## Example 7: Adding Metadata

**Ask your AI:**
> Add frontmatter to all files in the api/ folder with:
> - type: api-reference
> - version: 2.0

**What happens:**
1. AI uses `list_docs` with pattern "api/**/*.md"
2. For each file:
   - Uses `read_doc` to get content
   - Uses `update_doc` to add/update frontmatter

## Example 8: Content Validation

**Ask your AI:**
> Check if all pages in the navigation actually exist as files

**What happens:**
1. AI uses `get_navigation` to get nav structure
2. Extracts all file paths
3. Uses `list_docs` to get existing files
4. Compares and reports missing files

## Complex Workflow Example

**Ask your AI:**
> Help me create a new feature documentation section:
> 1. Create feature/index.md as an overview
> 2. Create feature/setup.md with setup instructions
> 3. Create feature/examples.md with code examples
> 4. Add a "Features" section to navigation after "Getting Started"
> 5. Search for any existing mentions of "features" and let me know where they are

**What the AI does:**
1. Creates three new files with `create_doc`
2. Reads current navigation with `get_navigation`
3. Modifies navigation structure
4. Updates navigation with `update_navigation`
5. Searches with `search_docs`
6. Reports comprehensive results

## Tips for Working with AI

### Be Specific
❌ "Update the docs"  
✅ "Update getting-started/installation.md to add Docker as a prerequisite"

### Use Patterns
❌ "List API files"  
✅ "List all files matching api/**/*.md"

### Describe Structure
❌ "Fix navigation"  
✅ "In navigation, move the API section before Tutorials"

### Request Verification
✅ "After creating the files, show me what you created"  
✅ "Search for the term to confirm it was updated everywhere"

## Next Steps

- [Team Setup Example](team-setup.md) - How teams collaborate
- [Tools Overview](../tools/overview.md) - All available tools
