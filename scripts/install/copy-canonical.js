#!/usr/bin/env node

/**
 * Xavier Copy Canonical Files
 * Copies ai-tools/ templates to the project
 */

const fs = require('fs');
const path = require('path');
const { copyDir, ensureDir, log, colors } = require('../core/utils');

/**
 * Get the ai-tools directory path in a project
 */
function getAiToolsDir(projectRoot) {
  return path.join(projectRoot, 'ai-tools');
}

/**
 * Check if ai-tools directory exists
 */
function aiToolsDirExists(projectRoot) {
  return fs.existsSync(getAiToolsDir(projectRoot));
}

/**
 * Copy canonical files from templates to project
 */
function copyCanonicalFiles(projectRoot, templatesDir) {
  const targetDir = getAiToolsDir(projectRoot);
  const copied = [];
  const warnings = [];

  try {
    // Ensure target directory exists
    ensureDir(targetDir);

    // Directories to copy
    const directories = ['agents', 'commands', 'skills'];

    for (const dir of directories) {
      const sourceDir = path.join(templatesDir, dir);
      const destDir = path.join(targetDir, dir);

      if (fs.existsSync(sourceDir)) {
        // Check if destination exists and has modifications
        if (fs.existsSync(destDir)) {
          warnings.push(`${dir}/ exists - merging (existing files preserved)`);
          // Merge: copy only missing files
          mergeDirectory(sourceDir, destDir, copied);
        } else {
          copyDir(sourceDir, destDir);
          copied.push(`${dir}/`);
        }
      }
    }

    // Files to copy (only if they don't exist)
    const files = [
      'README.md',
      'AGENTIC-GUIDELINES.md'
    ];

    for (const file of files) {
      const sourceFile = path.join(templatesDir, file);
      const destFile = path.join(targetDir, file);

      if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
        fs.copyFileSync(sourceFile, destFile);
        copied.push(file);
      }
    }

    return {
      success: true,
      copied,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Merge source directory into destination (preserving existing files)
 */
function mergeDirectory(sourceDir, destDir, copiedList, relativePath = '') {
  ensureDir(destDir);

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      mergeDirectory(sourcePath, destPath, copiedList, relPath);
    } else if (!fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      copiedList.push(relPath);
    }
  }
}

/**
 * Verify what canonical files are present/missing
 */
function verifyCanonicalFiles(projectRoot) {
  const targetDir = getAiToolsDir(projectRoot);
  const present = [];
  const missing = [];

  const expectedDirs = ['agents', 'commands', 'skills'];
  const expectedFiles = ['README.md'];

  for (const dir of expectedDirs) {
    const dirPath = path.join(targetDir, dir);
    if (fs.existsSync(dirPath)) {
      present.push(`${dir}/`);
    } else {
      missing.push(`${dir}/`);
    }
  }

  for (const file of expectedFiles) {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
      present.push(file);
    } else {
      missing.push(file);
    }
  }

  return { present, missing };
}

/**
 * Clean the ai-tools directory
 */
function cleanAiToolsDir(projectRoot) {
  const targetDir = getAiToolsDir(projectRoot);

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true });
    return { success: true };
  }

  return { success: true, message: 'Nothing to clean' };
}

/**
 * Create the docs/ai/ Memory Bank structure
 */
function createMemoryBankStructure(projectRoot) {
  const docsAiDir = path.join(projectRoot, 'docs', 'ai');
  const created = [];

  try {
    // Create main docs/ai directory
    if (!fs.existsSync(docsAiDir)) {
      ensureDir(docsAiDir);
      created.push('docs/ai/');
    }

    // Create subdirectories
    const subdirs = ['work', 'decisions'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(docsAiDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        ensureDir(subdirPath);
        created.push(`docs/ai/${subdir}/`);
      }
    }

    // Create template files if they don't exist
    const templates = {
      'project-overview.md': `# Project Overview

## Vision
[What is this project trying to achieve?]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Non-Goals
- What we're explicitly NOT trying to do

## Success Metrics
- How will we measure success?
`,
      'tech-stack.md': `# Technology Stack

## Frontend
- Framework:
- Styling:

## Backend
- Language:
- Framework:

## Database
- Type:

## Infrastructure
- Hosting:
- CI/CD:
`,
      'current-work.md': `# Current Work

## Active Tasks
None currently.

## Recent Completions
None yet.

## Blocked Items
None currently.
`,
      'working-agreements.md': `# Working Agreements

## Code Style
- Follow existing patterns in the codebase
- Use meaningful variable names
- Add comments for complex logic

## Git Workflow
- Feature branches from main
- PR required for all changes
- Squash merge to main

## Quality Gates
- All tests must pass
- No TypeScript errors
- Code review required
`
    };

    for (const [filename, content] of Object.entries(templates)) {
      const filePath = path.join(docsAiDir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        created.push(`docs/ai/${filename}`);
      }
    }

    // Create .gitkeep in work/ and decisions/
    for (const subdir of ['work', 'decisions']) {
      const gitkeepPath = path.join(docsAiDir, subdir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
      }
    }

    return {
      success: true,
      created
    };

  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = {
  getAiToolsDir,
  aiToolsDirExists,
  copyCanonicalFiles,
  verifyCanonicalFiles,
  cleanAiToolsDir,
  createMemoryBankStructure
};
