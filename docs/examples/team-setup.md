# Team Setup Example

Real-world example of how teams use the MkDocs MCP Server.

## Scenario: Acme Corp Documentation Team

**Team Size**: 5 developers  
**Project**: Company documentation site  
**Repository**: github.com/acme-corp/docs  
**Static Site**: docs.acme-corp.com (GitHub Pages)

## Initial Setup

### 1. Team Lead Deploys to FastMCP Cloud

**Dev Lead (Alice)** deploys once:

```bash
# Fork mkdocs-mcp to acme-corp GitHub org
# Deploy to FastMCP Cloud
# Name: acme-docs-mcp
# Result: https://acme-docs-mcp.fastmcp.app/mcp
```

### 2. Share Configuration with Team

Alice posts in Slack:

```markdown
## MkDocs MCP is Live! 🎉

Our AI-powered docs management is ready.

**Server URL:** https://acme-docs-mcp.fastmcp.app/mcp

**Setup Instructions:**

### For Claude Desktop
Add to `~/.claude/claude_desktop_config.json`:

{
  "mcpServers": {
    "acme-docs": {
      "url": "https://acme-docs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/YOUR/PATH/TO/docs-repo/docs",
        "MKDOCS_CONFIG_PATH": "/YOUR/PATH/TO/docs-repo/mkdocs.yml"
      }
    }
  }
}

Replace `/YOUR/PATH/TO/` with your local clone path.

### For Cursor
Add to `.cursor/mcp_config.json` in your docs project.

Restart your AI assistant after configuration.
```

## Team Member Configurations

### Developer A (Bob) - macOS

Bob clones the docs repo:
```bash
cd ~/Projects
git clone git@github.com:acme-corp/docs.git
cd docs
```

Claude Desktop config:
```json
{
  "mcpServers": {
    "acme-docs": {
      "url": "https://acme-docs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/Users/bob/Projects/docs/docs",
        "MKDOCS_CONFIG_PATH": "/Users/bob/Projects/docs/mkdocs.yml"
      }
    }
  }
}
```

### Developer B (Carol) - Linux

Carol's setup:
```bash
cd /home/carol/work
git clone git@github.com:acme-corp/docs.git
```

Cursor config:
```json
{
  "mcpServers": {
    "acme-docs": {
      "url": "https://acme-docs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "/home/carol/work/docs/docs",
        "MKDOCS_CONFIG_PATH": "/home/carol/work/docs/mkdocs.yml"
      }
    }
  }
}
```

### Developer C (Dave) - Windows

Dave's configuration:
```json
{
  "mcpServers": {
    "acme-docs": {
      "url": "https://acme-docs-mcp.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "C:/Users/dave/repos/docs/docs",
        "MKDOCS_CONFIG_PATH": "C:/Users/dave/repos/docs/mkdocs.yml"
      }
    }
  }
}
```

## Daily Workflows

### Workflow 1: Feature Documentation (Bob)

Bob is implementing a new authentication feature:

**Ask Claude:**
> Create documentation for the new OAuth2 authentication at api/oauth2.md. Include setup, configuration, and examples. Add it to the API section of navigation.

**Claude does:**
1. Creates `api/oauth2.md` with comprehensive content
2. Adds proper frontmatter
3. Updates navigation structure

**Bob completes:**
```bash
git add docs/api/oauth2.md mkdocs.yml
git commit -m "docs: add OAuth2 authentication guide"
git push origin feature/oauth2-docs
# Creates PR
```

### Workflow 2: Documentation Audit (Carol)

Carol needs to update Python version references:

**Ask Cursor:**
> Search all docs for "Python 3.8" and update to "Python 3.10". Show me each file you update.

**Cursor does:**
1. Searches with `search_docs`
2. Finds 7 files with matches
3. Updates each file
4. Reports changes

**Carol reviews and commits:**
```bash
git add docs/
git commit -m "docs: update Python version to 3.10"
git push
```

### Workflow 3: New Product Launch (Dave)

Dave is documenting a new product line:

**Ask Claude:**
> Create a new product documentation section:
> - product/overview.md
> - product/getting-started.md
> - product/api-reference.md
> - product/examples.md
> Add a "Product" navigation section before "API Reference"

**Claude creates all files and updates navigation.**

**Dave commits:**
```bash
git add docs/product/ mkdocs.yml
git commit -m "docs: add new product documentation section"
git push
```

## Collaboration Benefits

### Before MCP

❌ Manual file creation and editing  
❌ Typos in file paths  
❌ Inconsistent formatting  
❌ Forgot to update navigation  
❌ Time-consuming documentation tasks

### After MCP

✅ AI creates files with consistent structure  
✅ Automatic navigation updates  
✅ Fast bulk operations (search/replace)  
✅ Reduced documentation burden  
✅ More time for actual development

## Team Statistics (After 3 Months)

- **Documentation pages created**: 147
- **Average time saved per documentation task**: 15 minutes
- **Team satisfaction**: ⭐⭐⭐⭐⭐
- **Documentation quality**: Improved (consistent structure)
- **Update frequency**: 3x higher

## Best Practices

### 1. Use Conventional Commits

```bash
git commit -m "docs: add feature X documentation"
git commit -m "docs: update API reference"
git commit -m "docs: fix typo in setup guide"
```

### 2. Review AI-Generated Content

Always review content before committing:
- Check accuracy
- Verify code examples
- Test links
- Validate formatting

### 3. Create PR Templates

Include checklist:
```markdown
## Documentation Checklist
- [ ] Content reviewed for accuracy
- [ ] Code examples tested
- [ ] Links validated
- [ ] Navigation updated
- [ ] Frontmatter includes title
```

### 4. Regular Documentation Sprints

Monthly team documentation day:
- Update outdated content
- Fill documentation gaps
- Reorganize structure
- Add examples

### 5. Use AI for Discovery

**Regular queries:**
- "Find all pages without frontmatter"
- "List all broken internal links"
- "Show pages not in navigation"
- "Find duplicate content"

## Troubleshooting

### Different Paths Across Team

**Problem**: Team members have different local paths  
**Solution**: Each person configures their own `MKDOCS_DOCS_PATH` and `MKDOCS_CONFIG_PATH`

### Merge Conflicts

**Problem**: Multiple people update navigation  
**Solution**: Communicate in team chat before major restructuring

### Server Downtime

**Problem**: FastMCP Cloud maintenance  
**Solution**: Fall back to manual editing or run local server

## Scaling Up

As the team grows:

1. **Add more developers**: Just share the URL
2. **Multiple projects**: Configure different MCP instances
3. **Custom workflows**: Enhance server with custom tools
4. **Analytics**: Track documentation usage and quality

## Next Steps

- [Tools Overview](../tools/overview.md) - Master all 8 tools
- [FastMCP Cloud](../deployment/fastmcp-cloud.md) - Deploy your own instance
