"""
MkDocs MCP Server - Python FastMCP implementation

A Model Context Protocol server for managing MkDocs documentation.
Can be deployed to FastMCP Cloud for free.
"""

import os
import re
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("mkdocs-mcp")

# Configuration from environment variables (validated at runtime, not import time)
DOCS_PATH = os.getenv("MKDOCS_DOCS_PATH", "./docs")
CONFIG_PATH = os.getenv("MKDOCS_CONFIG_PATH", "./mkdocs.yml")


def get_paths():
    """Get and validate documentation paths at runtime."""
    docs_dir = Path(DOCS_PATH)
    config_file = Path(CONFIG_PATH)
    
    if not docs_dir.exists():
        return None, None, f"Documentation path does not exist: {DOCS_PATH}. Set MKDOCS_DOCS_PATH environment variable."
    if not config_file.exists():
        return None, None, f"Config file does not exist: {CONFIG_PATH}. Set MKDOCS_CONFIG_PATH environment variable."
    
    return docs_dir, config_file, None


def extract_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
    """Extract YAML frontmatter from markdown content."""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
                content = parts[2].lstrip("\n")
                return frontmatter, content
            except yaml.YAMLError:
                return {}, content
    return {}, content


def create_frontmatter(metadata: Dict[str, Any]) -> str:
    """Create YAML frontmatter string."""
    if not metadata:
        return ""
    yaml_str = yaml.dump(metadata, default_flow_style=False, sort_keys=False)
    return f"---\n{yaml_str}---\n"


def extract_title(content: str) -> Optional[str]:
    """Extract title from markdown content (first H1)."""
    match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    return match.group(1) if match else None


@mcp.tool()
def list_docs(pattern: str = "**/*.md") -> str:
    """
    List all markdown documentation files in the MkDocs project.
    
    Args:
        pattern: Glob pattern to filter files (e.g., "api/**/*.md")
    
    Returns:
        JSON with file list and metadata
    """
    try:
        docs_dir, _, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        # Handle glob patterns
        if "**" in pattern:
            files = list(docs_dir.glob(pattern))
        else:
            files = list(docs_dir.glob(pattern))
        
        file_info = []
        for file_path in sorted(files):
            if file_path.is_file():
                rel_path = file_path.relative_to(docs_dir)
                content = file_path.read_text(encoding="utf-8")
                frontmatter, _ = extract_frontmatter(content)
                
                file_info.append({
                    "path": str(rel_path),
                    "size": file_path.stat().st_size,
                    "modified": file_path.stat().st_mtime,
                    "title": frontmatter.get("title") or extract_title(content) or str(rel_path),
                    "has_metadata": bool(frontmatter),
                })
        
        return json.dumps({
            "count": len(file_info),
            "files": file_info
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def read_doc(file_path: str) -> str:
    """
    Read the content of a specific documentation file.
    
    Args:
        file_path: Relative path to the file (e.g., "getting-started/installation.md")
    
    Returns:
        JSON with frontmatter and content
    """
    try:
        docs_dir, _, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        full_path = docs_dir / file_path
        if not full_path.exists():
            return json.dumps({"error": f"File not found: {file_path}"})
        
        content = full_path.read_text(encoding="utf-8")
        frontmatter, body = extract_frontmatter(content)
        
        return json.dumps({
            "path": file_path,
            "frontmatter": frontmatter,
            "content": body,
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def create_doc(file_path: str, content: str, frontmatter: Optional[Dict[str, Any]] = None) -> str:
    """
    Create a new documentation file with content.
    
    Args:
        file_path: Relative path for the new file (e.g., "api/new-endpoint.md")
        content: Markdown content
        frontmatter: Optional YAML frontmatter metadata
    
    Returns:
        JSON with success message
    """
    try:
        docs_dir, _, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        full_path = docs_dir / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        if full_path.exists():
            return json.dumps({"error": f"File already exists: {file_path}"})
        
        # Build file content
        file_content = ""
        if frontmatter:
            file_content += create_frontmatter(frontmatter)
        file_content += content
        
        full_path.write_text(file_content, encoding="utf-8")
        
        return json.dumps({
            "success": True,
            "message": f"Created file: {file_path}",
            "path": file_path,
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def update_doc(file_path: str, content: str, frontmatter: Optional[Dict[str, Any]] = None) -> str:
    """
    Update an existing documentation file.
    
    Args:
        file_path: Relative path to the file
        content: New markdown content
        frontmatter: Optional new/updated YAML frontmatter metadata
    
    Returns:
        JSON with success message
    """
    try:
        docs_dir, _, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        full_path = docs_dir / file_path
        if not full_path.exists():
            return json.dumps({"error": f"File not found: {file_path}"})
        
        # If frontmatter not provided, preserve existing
        if frontmatter is None:
            existing_content = full_path.read_text(encoding="utf-8")
            frontmatter, _ = extract_frontmatter(existing_content)
        
        # Build file content
        file_content = ""
        if frontmatter:
            file_content += create_frontmatter(frontmatter)
        file_content += content
        
        full_path.write_text(file_content, encoding="utf-8")
        
        return json.dumps({
            "success": True,
            "message": f"Updated file: {file_path}",
            "path": file_path,
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def delete_doc(file_path: str) -> str:
    """
    Delete a documentation file.
    
    Args:
        file_path: Relative path to the file to delete
    
    Returns:
        JSON with success message
    """
    try:
        docs_dir, _, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        full_path = docs_dir / file_path
        if not full_path.exists():
            return json.dumps({"error": f"File not found: {file_path}"})
        
        full_path.unlink()
        
        return json.dumps({
            "success": True,
            "message": f"Deleted file: {file_path}",
            "path": file_path,
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def search_docs(query: str, case_sensitive: bool = False) -> str:
    """
    Search across all documentation files.
    
    Args:
        query: Search query (supports regex)
        case_sensitive: Whether search is case-sensitive
    
    Returns:
        JSON with search results
    """
    try:
        docs_dir, _, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        flags = 0 if case_sensitive else re.IGNORECASE
        regex = re.compile(query, flags)
        results: List[Dict[str, Any]] = []
        
        for file_path in docs_dir.glob("**/*.md"):
            if file_path.is_file():
                content = file_path.read_text(encoding="utf-8")
                _, body = extract_frontmatter(content)
                
                matches: List[Dict[str, Any]] = []
                for line_num, line in enumerate(body.split("\n"), 1):
                    if regex.search(line):
                        matches.append({
                            "line": line_num,
                            "content": line.strip(),
                        })
                
                if matches:
                    results.append({
                        "file": str(file_path.relative_to(docs_dir)),
                        "match_count": len(matches),
                        "matches": matches[:10],  # Limit to first 10 matches
                    })
        
        return json.dumps({
            "query": query,
            "total_files": len(results),
            "results": results,
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def get_navigation() -> str:
    """
    Get the navigation structure from mkdocs.yml.
    
    Returns:
        JSON with site name, navigation, and theme
    """
    try:
        _, config_file, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        content = config_file.read_text(encoding="utf-8")
        config = yaml.safe_load(content) or {}
        
        return json.dumps({
            "site_name": config.get("site_name"),
            "nav": config.get("nav", []),
            "theme": config.get("theme", {}).get("name"),
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


@mcp.tool()
def update_navigation(navigation: List[Any]) -> str:
    """
    Update the navigation structure in mkdocs.yml.
    
    Args:
        navigation: New navigation structure
    
    Returns:
        JSON with success message
    """
    try:
        _, config_file, error = get_paths()
        if error:
            return json.dumps({"error": error})
        
        content = config_file.read_text(encoding="utf-8")
        config = yaml.safe_load(content) or {}
        
        config["nav"] = navigation
        
        # Write back to file with nice formatting
        with open(config_file, "w", encoding="utf-8") as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        
        return json.dumps({
            "success": True,
            "message": "Navigation updated in mkdocs.yml",
        }, indent=2)
    
    except Exception as e:
        return json.dumps({"error": str(e)})


if __name__ == "__main__":
    print("✅ MkDocs MCP Server ready for deployment")
    print(f"📁 Documentation path: {DOCS_PATH}")
    print(f"⚙️  Config path: {CONFIG_PATH}")
