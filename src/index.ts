import * as fs from 'fs/promises';
import * as path from 'path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { glob } from 'glob';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface MkDocsMCPServerConfig {
  docsPath?: string;
  configPath?: string;
  serverName?: string;
  serverVersion?: string;
}

/**
 * MkDocs MCP Server - A Model Context Protocol server for managing MkDocs documentation
 * 
 * Can be used as a standalone server or imported as a library in any project
 */
export class MkDocsMCPServer {
  private server: Server;
  private docsPath: string;
  private configPath: string;

  constructor(config: MkDocsMCPServerConfig = {}) {
    const {
      docsPath = process.env.MKDOCS_DOCS_PATH,
      configPath = process.env.MKDOCS_CONFIG_PATH,
      serverName = 'mkdocs-mcp',
      serverVersion = '1.0.0',
    } = config;

    if (!docsPath) {
      throw new Error('docsPath must be provided via config or MKDOCS_DOCS_PATH environment variable');
    }
    if (!configPath) {
      throw new Error('configPath must be provided via config or MKDOCS_CONFIG_PATH environment variable');
    }

    this.server = new Server({
      name: serverName,
      version: serverVersion,
    });

    this.docsPath = docsPath;
    this.configPath = configPath;

    this.setupHandlers();
  }

  private setupHandlers() {
    // List all documentation files
    this.server.setRequestHandler(
      { method: 'tools/list' } as any,
      async () => ({
        tools: [
          {
            name: 'list_docs',
            description: 'List all markdown documentation files in the MkDocs project',
            inputSchema: { 
              type: 'object', 
              properties: {
                pattern: { 
                  type: 'string', 
                  description: 'Optional glob pattern to filter files (e.g., "api/**/*.md")' 
                }
              }
            },
          },
          {
            name: 'read_doc',
            description: 'Read the content of a specific documentation file',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: { 
                  type: 'string', 
                  description: 'Relative path to the file (e.g., "getting-started/installation.md")' 
                },
              },
              required: ['filePath'],
            },
          },
          {
            name: 'create_doc',
            description: 'Create a new documentation file with content',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: { 
                  type: 'string', 
                  description: 'Relative path for the new file (e.g., "api/new-endpoint.md")' 
                },
                content: { 
                  type: 'string', 
                  description: 'Markdown content for the file' 
                },
                frontmatter: {
                  type: 'object',
                  description: 'Optional YAML frontmatter metadata'
                }
              },
              required: ['filePath', 'content'],
            },
          },
          {
            name: 'update_doc',
            description: 'Update the content of an existing documentation file',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: { 
                  type: 'string', 
                  description: 'Relative path to the file to update' 
                },
                content: { 
                  type: 'string', 
                  description: 'New markdown content' 
                },
                frontmatter: {
                  type: 'object',
                  description: 'Optional YAML frontmatter metadata to merge'
                }
              },
              required: ['filePath', 'content'],
            },
          },
          {
            name: 'delete_doc',
            description: 'Delete a documentation file',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: { 
                  type: 'string', 
                  description: 'Relative path to the file to delete' 
                },
              },
              required: ['filePath'],
            },
          },
          {
            name: 'search_docs',
            description: 'Search for content across all documentation files',
            inputSchema: {
              type: 'object',
              properties: {
                query: { 
                  type: 'string', 
                  description: 'Search query (supports regex)' 
                },
                caseSensitive: {
                  type: 'boolean',
                  description: 'Whether search should be case-sensitive (default: false)'
                }
              },
              required: ['query'],
            },
          },
          {
            name: 'get_navigation',
            description: 'Get the current navigation structure from mkdocs.yml',
            inputSchema: { 
              type: 'object', 
              properties: {} 
            },
          },
          {
            name: 'update_navigation',
            description: 'Update the navigation structure in mkdocs.yml',
            inputSchema: {
              type: 'object',
              properties: {
                navigation: { 
                  type: 'array',
                  description: 'New navigation structure array' 
                },
              },
              required: ['navigation'],
            },
          },
          {
            name: 'commit_and_push',
            description: 'Commit changes and push to GitHub (auto-deploys to GitHub Pages)',
            inputSchema: {
              type: 'object',
              properties: {
                message: { 
                  type: 'string', 
                  description: 'Commit message' 
                },
              },
              required: ['message'],
            },
          },
        ]
      })
    );

    this.server.setRequestHandler(
      { method: 'tools/call' } as any,
      async (request: any) => {
        const { name, arguments: args } = request.params;
        return this.processToolCall(name, args || {});
      }
    );
  }

  private async processToolCall(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'list_docs':
        return this.listDocs(args);
      case 'read_doc':
        return this.readDoc(args);
      case 'create_doc':
        return this.createDoc(args);
      case 'update_doc':
        return this.updateDoc(args);
      case 'delete_doc':
        return this.deleteDoc(args);
      case 'search_docs':
        return this.searchDocs(args);
      case 'get_navigation':
        return this.getNavigation();
      case 'update_navigation':
        return this.updateNavigation(args);
      case 'commit_and_push':
        return this.commitAndPush(args);
      default:
        return {
          content: [{ type: 'text' as const, text: `Unknown tool: ${toolName}` }]
        };
    }
  }

  private async listDocs(args: any) {
    try {
      const pattern = args.pattern || '**/*.md';
      const files = await glob(pattern, { 
        cwd: this.docsPath,
        nodir: true 
      });

      const fileInfo = await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(this.docsPath, file);
          const stats = await fs.stat(fullPath);
          const content = await fs.readFile(fullPath, 'utf-8');
          const parsed = matter(content);
          
          return {
            path: file,
            size: stats.size,
            modified: stats.mtime,
            title: parsed.data.title || this.extractTitle(parsed.content) || file,
            hasMetadata: Object.keys(parsed.data).length > 0
          };
        })
      );

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ 
            count: files.length,
            files: fileInfo 
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async readDoc(args: any) {
    try {
      const fullPath = path.join(this.docsPath, args.filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const parsed = matter(content);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            path: args.filePath,
            frontmatter: parsed.data,
            content: parsed.content,
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async createDoc(args: any) {
    try {
      const fullPath = path.join(this.docsPath, args.filePath);
      
      // Check if file already exists
      try {
        await fs.access(fullPath);
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              error: 'File already exists. Use update_doc to modify it.'
            }, null, 2)
          }]
        };
      } catch {
        // File doesn't exist, proceed with creation
      }

      // Create directory if it doesn't exist
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });

      // Build content with frontmatter if provided
      let content = args.content;
      if (args.frontmatter) {
        content = matter.stringify(args.content, args.frontmatter);
      }

      await fs.writeFile(fullPath, content, 'utf-8');

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            path: args.filePath,
            message: `Created ${args.filePath}`
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async updateDoc(args: any) {
    try {
      const fullPath = path.join(this.docsPath, args.filePath);
      
      // Check if file exists
      await fs.access(fullPath);

      let content = args.content;
      
      // If frontmatter is provided, merge with existing or create new
      if (args.frontmatter) {
        const existing = await fs.readFile(fullPath, 'utf-8');
        const parsed = matter(existing);
        const mergedFrontmatter = { ...parsed.data, ...args.frontmatter };
        content = matter.stringify(args.content, mergedFrontmatter);
      }

      await fs.writeFile(fullPath, content, 'utf-8');

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            path: args.filePath,
            message: `Updated ${args.filePath}`
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async deleteDoc(args: any) {
    try {
      const fullPath = path.join(this.docsPath, args.filePath);
      await fs.unlink(fullPath);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            path: args.filePath,
            message: `Deleted ${args.filePath}`
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async searchDocs(args: any) {
    try {
      const files = await glob('**/*.md', { 
        cwd: this.docsPath,
        nodir: true 
      });

      const flags = args.caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(args.query, flags);
      const results: any[] = [];

      for (const file of files) {
        const fullPath = path.join(this.docsPath, file);
        const content = await fs.readFile(fullPath, 'utf-8');
        const parsed = matter(content);
        
        const matches: any[] = [];
        const lines = parsed.content.split('\n');
        
        lines.forEach((line, index) => {
          if (regex.test(line)) {
            matches.push({
              line: index + 1,
              content: line.trim()
            });
          }
        });

        if (matches.length > 0) {
          results.push({
            file,
            matchCount: matches.length,
            matches: matches.slice(0, 10) // Limit to first 10 matches per file
          });
        }
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            query: args.query,
            totalFiles: results.length,
            results
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async getNavigation() {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const config: any = yaml.load(content);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            site_name: config.site_name,
            nav: config.nav || [],
            theme: config.theme?.name
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async updateNavigation(args: any) {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const config: any = yaml.load(content);
      
      config.nav = args.navigation;
      
      const newYaml = yaml.dump(config, {
        indent: 2,
        lineWidth: -1
      });

      await fs.writeFile(this.configPath, newYaml, 'utf-8');

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: 'Navigation updated in mkdocs.yml'
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private async commitAndPush(args: any) {
    try {
      const repoPath = path.dirname(this.docsPath); // Parent of docs/
      
      // Git add all changes
      await execAsync('git add .', { cwd: repoPath });
      
      // Git commit with message
      const { stdout: commitOut } = await execAsync(
        `git commit -m "${args.message}"`, 
        { cwd: repoPath }
      );
      
      // Git push to GitHub
      const { stdout: pushOut } = await execAsync('git push origin main', { cwd: repoPath });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: args.message,
            commit: commitOut.trim(),
            push: pushOut.trim(),
            deployment: 'GitHub Actions will auto-deploy to GitHub Pages in ~30 seconds',
            url: 'https://ejsinfuego.github.io/silent-partner-docs/'
          }, null, 2)
        }]
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
    }
  }

  private extractTitle(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
  }

  /**
   * Start the MCP server and connect to stdio transport
   * Use this to run the server as a standalone MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('✅ MkDocs MCP server running');
    console.error(`📁 Documentation path: ${this.docsPath}`);
    console.error(`⚙️  Config path: ${this.configPath}`);
  }

  /**
   * Get the underlying MCP Server instance for advanced usage
   */
  getServer(): Server {
    return this.server;
  }
}

// Export for use as a library
export { StdioServerTransport };

// Auto-start if run as standalone CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new MkDocsMCPServer();
  server.start().catch((error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
  });
}
