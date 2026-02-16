# FastMCP Cloud Deployment

Deploy your MkDocs MCP Server to FastMCP Cloud for free and share with your team.

## Why FastMCP Cloud?

- ✅ **Free** - Currently in beta with free hosting
- ✅ **Easy** - Deploy directly from GitHub
- ✅ **Fast** - Auto-deploys on every push
- ✅ **Shareable** - One URL, unlimited users
- ✅ **Managed** - No server maintenance required

## Deployment Steps

### 1. Fork the Repository

Fork [mkdocs-mcp](https://github.com/ejsinfuego/mkdocs-mcp) to your GitHub account.

### 2. Sign in to FastMCP Cloud

1. Go to [fastmcp.cloud](https://fastmcp.cloud/)
2. Sign in with your GitHub account
3. Authorize FastMCP to access your repositories

### 3. Create a New Project

1. Click **"New Project"**
2. Configure your project:
   - **Name**: `mkdocs-mcp` (or your choice)
   - **Repository**: Select your forked repository
   - **Entrypoint**: `server.py:mcp`
   - **Branch**: `main`

3. Click **"Create Project"**

### 4. Get Your Server URL

FastMCP Cloud will:
- Build your project
- Deploy to a unique URL
- Give you a shareable endpoint

Your URL will be: `https://your-project-name.fastmcp.app/mcp`

### 5. Share with Your Team

Give team members:
- Your server URL
- Instructions to configure their local paths

Example team message:
```
Our MkDocs MCP Server is live!

URL: https://our-team-docs.fastmcp.app/mcp

Configuration:
{
  "mcpServers": {
    "mkdocs": {
      "url": "https://our-team-docs.fastmcp.app/mcp",
      "env": {
        "MKDOCS_DOCS_PATH": "YOUR_LOCAL_DOCS_PATH",
        "MKDOCS_CONFIG_PATH": "YOUR_LOCAL_MKDOCS_YML_PATH"
      }
    }
  }
}

Replace YOUR_LOCAL_* with your local project paths.
```

## Auto-Deployment

FastMCP Cloud automatically redeploys when you push to your repository:

```bash
git add .
git commit -m "Update server"
git push origin main
```

Your changes will be live in ~30 seconds!

## Authentication

Enable authentication to restrict access to your team:

1. In project settings, enable **Authentication**
2. Only users in your GitHub organization can access
3. Share the URL only with team members

## Monitoring

View your server status at: `https://fastmcp.cloud/projects/your-project`

Monitor:
- Deployment status
- Request logs
- Error rates
- Uptime

## Troubleshooting

### Build Failures

Check that:
- `requirements.txt` includes all dependencies
- `server.py:mcp` is the correct entrypoint
- Python version is compatible (3.8+)

### Connection Issues

Verify:
- Users have configured environment variables correctly
- The server URL is correct (includes `/mcp` suffix)
- FastMCP Cloud status page shows "Running"

## Custom Domains

Contact FastMCP support to configure a custom domain:
- `docs-mcp.yourcompany.com`

## Cost

Currently **free during beta**. Pricing will be announced before general availability.

## Next Steps

- [Local Development](local.md) - Test changes locally before deploying
- [Team Setup Example](../examples/team-setup.md) - Real-world team configuration
