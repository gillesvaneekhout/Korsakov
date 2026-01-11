#!/usr/bin/env node

/**
 * Xavier Adapter Factory
 * Creates and manages vendor-specific adapters
 */

const path = require('path');

/**
 * Vendor metadata - available without loading adapter code
 */
const VENDOR_INFO = {
  claude: {
    id: 'claude',
    name: 'Claude Code',
    description: 'Anthropic Claude Code CLI with native slash commands and skills',
    outputPath: '.claude',
    supportsSymlinks: true,
    supportsSlashCommands: true,
    supportsSkillTool: true
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered code editor with .cursorrules',
    outputPath: '.cursorrules',
    supportsSymlinks: false,
    supportsSlashCommands: false,
    supportsSkillTool: false
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'AI development environment with .windsurf/ rules',
    outputPath: '.windsurf',
    supportsSymlinks: false,
    supportsSlashCommands: false,
    supportsSkillTool: false
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini CLI',
    description: 'Google Gemini CLI with .gemini/ configuration',
    outputPath: '.gemini',
    supportsSymlinks: false,
    supportsSlashCommands: true,  // Via TOML commands
    supportsSkillTool: false
  },
  opencode: {
    id: 'opencode',
    name: 'OpenCode',
    description: 'OpenCode AI coding agent with .opencode/ configuration',
    outputPath: '.opencode',
    supportsSymlinks: false,
    supportsSlashCommands: true,  // Via command/ directory
    supportsSkillTool: false
  }
};

/**
 * Lazy-load adapter class
 */
function loadAdapterClass(vendorId) {
  switch (vendorId) {
    case 'claude':
      return require('./claude-adapter').ClaudeAdapter;
    case 'cursor':
      return require('./cursor-adapter').CursorAdapter;
    case 'windsurf':
      return require('./windsurf-adapter').WindsurfAdapter;
    case 'gemini':
      return require('./gemini-adapter').GeminiAdapter;
    case 'opencode':
      return require('./opencode-adapter').OpenCodeAdapter;
    default:
      throw new Error(`Unknown vendor: ${vendorId}`);
  }
}

/**
 * Create a single adapter instance
 */
function createAdapter(vendorId, templatesDir) {
  const AdapterClass = loadAdapterClass(vendorId);
  return new AdapterClass(templatesDir);
}

/**
 * Create multiple adapter instances
 */
function createAdapters(vendorIds, templatesDir) {
  return vendorIds.map(id => createAdapter(id, templatesDir));
}

/**
 * Create all adapter instances
 */
function createAllAdapters(templatesDir) {
  return createAdapters(Object.keys(VENDOR_INFO), templatesDir);
}

/**
 * Get vendor metadata without loading adapter
 */
function getVendorInfo(vendorId) {
  return VENDOR_INFO[vendorId] || null;
}

/**
 * Get all vendor IDs
 */
function getVendorIds() {
  return Object.keys(VENDOR_INFO);
}

/**
 * Get vendor choices for CLI prompts
 */
function getVendorChoices() {
  return Object.values(VENDOR_INFO).map(v => ({
    value: v.id,
    label: v.name,
    description: v.description
  }));
}

/**
 * Generate configurations for multiple vendors
 */
async function generateForVendors(vendorIds, config, templatesDir, projectRoot) {
  const results = {};

  for (const vendorId of vendorIds) {
    try {
      const adapter = createAdapter(vendorId, templatesDir);
      results[vendorId] = await adapter.generate(config, projectRoot);
    } catch (err) {
      results[vendorId] = {
        success: false,
        error: err.message
      };
    }
  }

  return results;
}

/**
 * Clean up configurations for multiple vendors
 */
function cleanupVendors(vendorIds, templatesDir, projectRoot) {
  const results = {};

  for (const vendorId of vendorIds) {
    try {
      const adapter = createAdapter(vendorId, templatesDir);
      results[vendorId] = adapter.cleanup(projectRoot);
    } catch (err) {
      results[vendorId] = {
        success: false,
        error: err.message
      };
    }
  }

  return results;
}

module.exports = {
  VENDOR_INFO,
  createAdapter,
  createAdapters,
  createAllAdapters,
  getVendorInfo,
  getVendorIds,
  getVendorChoices,
  generateForVendors,
  cleanupVendors
};
