#!/usr/bin/env node

/**
 * MkDocs MCP Server CLI
 * 
 * Standalone entry point for running the MkDocs MCP server
 * 
 * Usage:
 *   mkdocs-mcp-server
 *   MKDOCS_DOCS_PATH=/path/to/docs MKDOCS_CONFIG_PATH=/path/to/mkdocs.yml mkdocs-mcp-server
 */

import { MkDocsMCPServer } from './index.js';

async function main() {
  try {
    const config = {
      docsPath: process.env.MKDOCS_DOCS_PATH,
      configPath: process.env.MKDOCS_CONFIG_PATH,
    };

    // Validate required paths
    if (!config.docsPath) {
      console.error('❌ Error: MKDOCS_DOCS_PATH environment variable is required');
      console.error('   Usage: MKDOCS_DOCS_PATH=/path/to/docs MKDOCS_CONFIG_PATH=/path/to/mkdocs.yml mkdocs-mcp-server');
      process.exit(1);
    }
    if (!config.configPath) {
      console.error('❌ Error: MKDOCS_CONFIG_PATH environment variable is required');
      console.error('   Usage: MKDOCS_DOCS_PATH=/path/to/docs MKDOCS_CONFIG_PATH=/path/to/mkdocs.yml mkdocs-mcp-server');
      process.exit(1);
    }

    const server = new MkDocsMCPServer(config);
    await server.start();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Server error: ${message}`);
    process.exit(1);
  }
}

main();
