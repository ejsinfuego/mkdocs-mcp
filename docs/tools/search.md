# Search

Powerful search capabilities across your documentation.

## Overview

The `search_docs` tool provides regex-powered full-text search across all markdown files in your documentation.

## search_docs

**Signature:**
```python
search_docs(
    query: str,
    case_sensitive: bool = False
) -> str
```

**Parameters:**

- `query` (required): Search pattern (plain text or regex)
- `case_sensitive` (optional): Enable case-sensitive matching (default: false)

## Basic Search

### Simple Text Search

```json
{
  "query": "authentication"
}
```

Finds all occurrences of "authentication" (case-insensitive by default).

### Case-Sensitive Search

```json
{
  "query": "API",
  "case_sensitive": true
}
```

Only matches "API" (not "api" or "Api").

## Regular Expression Search

### OR Patterns

```json
{
  "query": "authentication|auth|login"
}
```

Matches any of: authentication, auth, or login.

### Word Boundaries

```json
{
  "query": "\\buser\\b"
}
```

Matches "user" as a complete word (not "username" or "users").

### Version Numbers

```json
{
  "query": "Python 3\\.[0-9]+"
}
```

Matches: Python 3.8, Python 3.9, Python 3.10, etc.

### URLs

```json
{
  "query": "https?://[^\\s]+"
}
```

Finds all HTTP/HTTPS URLs.

### Email Addresses

```json
{
  "query": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
}
```

Finds email addresses.

### Code Blocks

```json
{
  "query": "```python[\\s\\S]*?```"
}
```

Finds Python code blocks.

## Response Format

```json
{
  "query": "authentication",
  "total_files": 3,
  "results": [
    {
      "file": "api/auth.md",
      "match_count": 5,
      "matches": [
        {
          "line": 10,
          "content": "Authentication is required for all API endpoints"
        },
        {
          "line": 25,
          "content": "Use JWT tokens for authentication"
        }
      ]
    },
    {
      "file": "getting-started/setup.md",
      "match_count": 2,
      "matches": [
        {
          "line": 42,
          "content": "Configure authentication in settings.py"
        }
      ]
    }
  ]
}
```

**Response Fields:**

- `query`: The search pattern used
- `total_files`: Number of files containing matches
- `results`: Array of file results
  - `file`: Relative path to file
  - `match_count`: Total matches in file
  - `matches`: First 10 matches (to prevent overflow)
    - `line`: Line number (1-indexed)
    - `content`: Trimmed line content

## Common Use Cases

### Use Case 1: Find TODO Items

```json
{
  "query": "TODO|FIXME|XXX"
}
```

Locates all pending work items in documentation.

### Use Case 2: Find Broken Links

```json
{
  "query": "\\[.*?\\]\\(/old-path/"
}
```

Finds links to deprecated paths.

### Use Case 3: Version Audit

```json
{
  "query": "version [0-9]+\\.[0-9]+"
}
```

Finds all version references.

### Use Case 4: Find Empty Sections

```json
{
  "query": "^##.*\\n\\n##"
}
```

Finds sections with no content.

### Use Case 5: API Endpoint References

```json
{
  "query": "(GET|POST|PUT|DELETE|PATCH) /api/"
}
```

Finds all API endpoint documentation.

### Use Case 6: Code Example Language Tags

```json
{
  "query": "```(python|javascript|bash)"
}
```

Finds code blocks by language.

## Advanced Patterns

### Find Headings

```json
{
  "query": "^#{1,6}\\s+.*"
}
```

Matches all markdown headings (H1-H6).

### Find Lists

```json
{
  "query": "^\\s*[\\*\\-\\+]\\s+"
}
```

Matches unordered list items.

### Find Images

```json
{
  "query": "!\\[.*?\\]\\(.*?\\)"
}
```

Matches markdown images.

### Find Tables

```json
{
  "query": "\\|.*\\|"
}
```

Finds markdown table rows.

### Find Frontmatter

```json
{
  "query": "^---[\\s\\S]*?^---"
}
```

Matches YAML frontmatter blocks.

## Search Workflows

### Workflow 1: Search and Replace

```
1. Ask AI: "Search for 'Python 3.7'"
2. Review results
3. Ask AI: "Update all occurrences to 'Python 3.10'"
4. AI updates each file
5. Verify changes
```

### Workflow 2: Content Audit

```
1. Search for TODO items
2. Create issues for each TODO
3. Search for FIXME items
4. Prioritize fixes
5. Clean up after completion
```

### Workflow 3: Link Validation

```
1. Search for links: "\\[.*?\\]\\(.*?\\)"
2. Extract all link targets
3. Check if files exist
4. Report broken links
5. Fix or remove
```

### Workflow 4: Consistency Check

```
1. Search for API endpoint patterns
2. Verify consistent formatting
3. Search for code block languages
4. Ensure proper syntax highlighting
5. Update as needed
```

## Performance Tips

### 1. Be Specific

❌ Too broad:
```json
{"query": "."}
```

✅ Better:
```json
{"query": "authentication|security"}
```

### 2. Use Word Boundaries

❌ Matches too much:
```json
{"query": "api"}
```
Matches: api, APIs, rapid, capability

✅ Exact matches:
```json
{"query": "\\bapi\\b"}
```
Only matches: api

### 3. Limit Scope

For large doc sets, combine search with file filtering:

```
1. List files: list_docs(pattern="api/**/*.md")
2. Then search within that subset
```

### 4. Case Sensitivity

Use case-sensitive search when needed:

```json
{
  "query": "API",
  "case_sensitive": true
}
```

Faster and more precise for acronyms.

## Regex Quick Reference

| Pattern | Matches | Example |
|---------|---------|---------|
| `.` | Any character | `a.c` matches "abc", "adc" |
| `*` | Zero or more | `ab*c` matches "ac", "abc", "abbc" |
| `+` | One or more | `ab+c` matches "abc", "abbc" (not "ac") |
| `?` | Zero or one | `ab?c` matches "ac", "abc" |
| `^` | Start of line | `^#` matches headings |
| `$` | End of line | `\.$` matches lines ending with period |
| `\b` | Word boundary | `\bword\b` matches "word" exactly |
| `[abc]` | Character set | `[aeiou]` matches any vowel |
| `[^abc]` | Negated set | `[^0-9]` matches non-digits |
| `(a\|b)` | OR | `(GET\|POST)` matches either |
| `\s` | Whitespace | `\s+` matches spaces/tabs/newlines |
| `\d` | Digit | `\d{3}` matches three digits |
| `\w` | Word char | `\w+` matches words |

## Limitations

### Match Limit

Only first 10 matches per file are returned to prevent response overflow.

**Workaround:** Use more specific patterns or filter by directory.

### Content-Only Search

Search only operates on markdown content (not file names or paths).

**Workaround:** Use `list_docs` with glob patterns for file name searches.

### Single Line Matches

Each match is one line of content.

**Workaround:** For multi-line searches, use `read_doc` after finding relevant files.

## Next Steps

- [File Operations](file-operations.md) - Update found content
- [Navigation](navigation.md) - Reorganize files
- [Examples](../examples/basic.md) - Real-world search examples
