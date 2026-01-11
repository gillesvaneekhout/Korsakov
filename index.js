#!/usr/bin/env node

/**
 * Korsakov - Your AI Development Team, Orchestrated
 *
 * This is the main entry point for the Korsakov package.
 * The actual functionality is in the scripts/ directory.
 */

const path = require('path');

// Export utilities for programmatic use
module.exports = {
  // Core utilities
  utils: require('./scripts/core/utils'),
  config: require('./scripts/core/config'),

  // Adapters
  adapters: require('./scripts/adapters/adapter-factory'),

  // Installation
  install: require('./scripts/install/copy-canonical'),

  // Version
  version: require('./package.json').version
};
