# Quick Start

This guide walks you through using the MkDocs MCP Server for the first time.

## Step 1: Verify Connection

After installation, ask your AI assistant:

```
Can you list my documentation files?
```

The assistant will use the `list_docs` tool to show all markdown files in your docs directory.

## Step 2: Create Your First Doc

Ask your assistant to create a new documentation page:

```
Create a new documentation page at api/users.md about the Users API endpoint.
Include a title in the frontmatter.
```

The assistant will use the `create_doc` tool to create the file with proper structure.

## Step 3: Search Documentation

Search across all your documentation:

```
Search my docs for "authentication"
```

The assistant will use the `search_docs` tool to find all mentions.

## Step 4: Update Navigation

Reorganize your documentation structure:

```
Add the new Users API page to the navigation under an API section
```

The assistant will use `get_navigation` and `update_navigation` tools to modify your `mkdocs.yml`.

## Common Tasks

### Creating Multiple Pages

```
Create the following documentation pages:
- getting-started/installation.md
- getting-started/quick-start.md
- api/authentication.md
```

### Updating Existing Content

```
Update the installation.md file to add a new prerequisite: Docker
```

### Searching and Replacing

```
Search for all mentions of "Python 3.7" and help me update them to "Python 3.8"
```

### Managing Navigation

```
Show me the current navigation structure
```

```
Reorganize the navigation to put Getting Started before API docs
```

## Next Steps

- [Tools Overview](../tools/overview.md) - Learn about all 8 available tools
- [Examples](../examples/basic.md) - See more usage examples
