#!/usr/bin/env node

/**
 * Xavier Configuration Management
 * Manages ai-tools/config.json - the source of truth for installations
 */

const fs = require('fs');
const path = require('path');

const CONFIG_VERSION = '1.0.0';

/**
 * Agent presets for quick selection
 */
const AGENT_PRESETS = {
  core: [
    'product-partner',
    'tech-lead',
    'work-orchestrator'
  ],
  fullstack: [
    'product-partner',
    'tech-lead',
    'work-orchestrator',
    'frontend-engineer',
    'backend-engineer',
    'qa-release'
  ],
  data: [
    'product-partner',
    'tech-lead',
    'work-orchestrator',
    'data-analytics-engineer',
    'data-pipeline-engineer',
    'analytics-engineer',
    'data-platform-engineer'
  ],
  all: [
    'product-partner',
    'tech-lead',
    'work-orchestrator',
    'frontend-engineer',
    'backend-engineer',
    'data-analytics-engineer',
    'data-pipeline-engineer',
    'analytics-engineer',
    'data-platform-engineer',
    'qa-release'
  ]
};

/**
 * Get the path to config.json
 */
function getConfigPath(projectRoot) {
  return path.join(projectRoot, 'ai-tools', 'config.json');
}

/**
 * Check if config exists
 */
function configExists(projectRoot) {
  return fs.existsSync(getConfigPath(projectRoot));
}

/**
 * Load configuration from file
 */
function loadConfig(projectRoot) {
  const configPath = getConfigPath(projectRoot);

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(content);
    return validateAndMigrate(config);
  } catch (err) {
    return null;
  }
}

/**
 * Save configuration to file
 */
function saveConfig(projectRoot, config) {
  const configPath = getConfigPath(projectRoot);
  const aiToolsDir = path.dirname(configPath);

  // Ensure ai-tools directory exists
  if (!fs.existsSync(aiToolsDir)) {
    fs.mkdirSync(aiToolsDir, { recursive: true });
  }

  // Add metadata
  config.version = CONFIG_VERSION;
  config.installedAt = config.installedAt || new Date().toISOString();
  config.updatedAt = new Date().toISOString();

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Create a new configuration object
 */
function createConfig(options = {}) {
  const {
    vendors = ['claude'],
    primaryVendor = vendors[0] || 'claude',
    agentPreset = 'all',
    customAgents = null
  } = options;

  const selectedAgents = customAgents || AGENT_PRESETS[agentPreset] || AGENT_PRESETS.all;

  return {
    version: CONFIG_VERSION,
    vendors: {
      enabled: vendors,
      primary: primaryVendor
    },
    agents: {
      preset: agentPreset,
      selected: selectedAgents
    },
    installedAt: new Date().toISOString()
  };
}

/**
 * Validate and migrate config to current version
 */
function validateAndMigrate(config) {
  if (!config) {
    return null;
  }

  // Ensure required fields exist
  if (!config.vendors) {
    config.vendors = { enabled: ['claude'], primary: 'claude' };
  }

  if (!config.agents) {
    config.agents = { preset: 'all', selected: AGENT_PRESETS.all };
  }

  return config;
}

/**
 * Update specific fields in config
 */
function updateConfig(projectRoot, updates) {
  let config = loadConfig(projectRoot);

  if (!config) {
    config = createConfig();
  }

  // Deep merge updates
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      config[key] = { ...config[key], ...value };
    } else {
      config[key] = value;
    }
  }

  saveConfig(projectRoot, config);
  return config;
}

/**
 * Check if a vendor is enabled
 */
function isVendorEnabled(projectRoot, vendorId) {
  const config = loadConfig(projectRoot);
  return config?.vendors?.enabled?.includes(vendorId) || false;
}

/**
 * Get the primary vendor
 */
function getPrimaryVendor(projectRoot) {
  const config = loadConfig(projectRoot);
  return config?.vendors?.primary || 'claude';
}

/**
 * Get all enabled vendors
 */
function getEnabledVendors(projectRoot) {
  const config = loadConfig(projectRoot);
  return config?.vendors?.enabled || ['claude'];
}

/**
 * Get selected agent IDs
 */
function getSelectedAgents(projectRoot) {
  const config = loadConfig(projectRoot);
  return config?.agents?.selected || AGENT_PRESETS.all;
}

/**
 * Get agent preset IDs
 */
function getPresetAgentIds(presetName) {
  return AGENT_PRESETS[presetName] || AGENT_PRESETS.all;
}

/**
 * Get all available presets
 */
function getAvailablePresets() {
  return Object.keys(AGENT_PRESETS);
}

module.exports = {
  CONFIG_VERSION,
  AGENT_PRESETS,
  getConfigPath,
  configExists,
  loadConfig,
  saveConfig,
  createConfig,
  validateAndMigrate,
  updateConfig,
  isVendorEnabled,
  getPrimaryVendor,
  getEnabledVendors,
  getSelectedAgents,
  getPresetAgentIds,
  getAvailablePresets
};
