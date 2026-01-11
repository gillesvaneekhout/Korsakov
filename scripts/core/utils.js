#!/usr/bin/env node

/**
 * Korsakov Core Utilities
 * Common functions for file operations, markdown parsing, and console output
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Console output helpers
 */
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function warn(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function error(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function info(message) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

/**
 * Find the project root directory
 * Looks for package.json or .git to determine project root
 */
function getProjectRoot() {
  // INIT_CWD is set by npm during install scripts
  if (process.env.INIT_CWD) {
    // Verify it's not the korsakov package itself
    const packageJsonPath = path.join(process.env.INIT_CWD, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.name !== '@indiecampers/korsakov') {
          return process.env.INIT_CWD;
        }
      } catch {
        return process.env.INIT_CWD;
      }
    }
    return process.env.INIT_CWD;
  }

  // Fallback: walk up from cwd looking for package.json
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    const packageJsonPath = path.join(dir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.name !== '@indiecampers/korsakov') {
          return dir;
        }
      } catch {
        // Continue searching
      }
    }
    dir = path.dirname(dir);
  }

  return null;
}

/**
 * Get the templates directory (ai-tools in korsakov package)
 */
function getTemplatesDir() {
  return path.join(__dirname, '..', '..', 'ai-tools');
}

/**
 * Check if a directory is the korsakov package itself
 */
function isSelfPackage(dir) {
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return pkg.name === '@indiecampers/korsakov';
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML parsing (key: value pairs)
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Array item
    if (trimmed.startsWith('- ') && currentKey) {
      if (!currentArray) {
        currentArray = [];
        frontmatter[currentKey] = currentArray;
      }
      currentArray.push(trimmed.slice(2).trim());
      continue;
    }

    // Key-value pair
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      currentKey = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();
      currentArray = null;

      if (value) {
        // Remove quotes if present
        frontmatter[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Read and parse a markdown file
 */
function readMarkdownFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return parseFrontmatter(content);
}

/**
 * Get all markdown files in a directory
 */
function getMarkdownFiles(dirPath, exclude = []) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') && !exclude.includes(file))
    .map(file => path.join(dirPath, file));
}

/**
 * Extract the first heading from markdown body
 */
function extractFirstHeading(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Create a symlink or copy if symlinks not supported
 */
function createSymlinkOrCopy(target, linkPath) {
  try {
    // Remove existing file/symlink
    if (fs.existsSync(linkPath)) {
      const stat = fs.lstatSync(linkPath);
      if (stat.isSymbolicLink() || stat.isFile()) {
        fs.unlinkSync(linkPath);
      } else if (stat.isDirectory()) {
        fs.rmSync(linkPath, { recursive: true });
      }
    }

    // Ensure parent directory exists
    const parentDir = path.dirname(linkPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // Try to create symlink
    fs.symlinkSync(target, linkPath);
    return { success: true, method: 'symlink' };
  } catch (symlinkError) {
    // Fallback to copy
    try {
      if (fs.statSync(target).isDirectory()) {
        copyDir(target, linkPath);
      } else {
        fs.copyFileSync(target, linkPath);
      }
      return { success: true, method: 'copy' };
    } catch (copyError) {
      return { success: false, error: copyError.message };
    }
  }
}

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Ensure a directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = {
  colors,
  log,
  success,
  warn,
  error,
  info,
  getProjectRoot,
  getTemplatesDir,
  isSelfPackage,
  parseFrontmatter,
  readMarkdownFile,
  getMarkdownFiles,
  extractFirstHeading,
  createSymlinkOrCopy,
  copyDir,
  ensureDir
};
