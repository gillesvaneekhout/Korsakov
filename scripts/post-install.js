#!/usr/bin/env node

/**
 * Korsakov Post-Install Script
 * Vendor-agnostic installation with adapter pattern
 *
 * Default install: Copy canonical files to ai-tools/, generate all vendors
 * With --foreground-scripts: Interactive vendor selection
 */

const path = require('path');
const fs = require('fs');
const { colors, log, info, success, warn, error, getProjectRoot, getTemplatesDir } = require('./core/utils');
const { createConfig, saveConfig, loadConfig } = require('./core/config');
const { copyCanonicalFiles, createMemoryBankStructure } = require('./install/copy-canonical');
const { generateForVendors, getVendorIds } = require('./adapters/adapter-factory');
const {
  runInteractiveSetup,
  isInteractiveMode,
  isForegroundScripts,
  displayNonInteractiveSummary,
  displaySuccessMessage
} = require('./core/prompts');

/**
 * Get version from package.json
 */
function getVersion() {
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return pkg.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Main installation function
 */
async function main() {
  const version = getVersion();

  try {
    // Find project root
    const projectRoot = getProjectRoot();

    if (!projectRoot) {
      // Running in development or not from npm install
      log(`Korsakov v${version} - Your AI Development Team, Orchestrated`, colors.bold + colors.blue);
      log('Run "npm install github:gillesvaneekhout/korsakov" in your project to install.', colors.cyan);
      return;
    }

    const templatesDir = getTemplatesDir();

    // Check if templates directory exists
    if (!fs.existsSync(templatesDir)) {
      error(`Templates directory not found: ${templatesDir}`);
      error('This may indicate a corrupted installation. Try reinstalling Korsakov.');
      process.exit(1);
    }

    console.log('');
    log('╔════════════════════════════════════════════════════════════╗', colors.blue);
    log(`║          Korsakov AI Team Framework v${version.padEnd(23)}║`, colors.blue);
    log('╚════════════════════════════════════════════════════════════╝', colors.blue);
    console.log('');

    // Step 1: Copy canonical files to ai-tools/
    info('Copying canonical files to ai-tools/...');
    const copyResult = copyCanonicalFiles(projectRoot, templatesDir);

    if (!copyResult.success) {
      error(`Failed to copy canonical files: ${copyResult.error}`);
      process.exit(1);
    }

    for (const file of copyResult.copied) {
      log(`  → ${file}`, colors.dim);
    }

    if (copyResult.warnings) {
      for (const warning of copyResult.warnings) {
        warn(`  ${warning}`);
      }
    }

    success('Canonical files copied to ai-tools/');
    console.log('');

    // Step 2: Create Memory Bank structure if it doesn't exist
    const memoryBankResult = createMemoryBankStructure(projectRoot);
    if (memoryBankResult.created && memoryBankResult.created.length > 0) {
      info('Created Memory Bank structure:');
      for (const item of memoryBankResult.created.slice(0, 5)) {
        log(`  → ${item}`, colors.dim);
      }
      if (memoryBankResult.created.length > 5) {
        log(`  → ... and ${memoryBankResult.created.length - 5} more`, colors.dim);
      }
      console.log('');
    }

    // Step 3: Check if interactive mode (--foreground-scripts or --configure)
    if ((isForegroundScripts() || process.argv.includes('--configure')) && isInteractiveMode()) {
      // Interactive installation
      info('Interactive mode detected');
      console.log('');

      try {
        const selections = await runInteractiveSetup();

        // Create configuration from selections
        const config = createConfig({
          vendors: selections.vendors,
          primaryVendor: selections.primaryVendor,
          agentPreset: selections.agentPreset
        });

        // Save configuration
        saveConfig(projectRoot, config);
        success('Configuration saved to ai-tools/config.json');
        console.log('');

        // Generate vendor-specific files
        if (selections.vendors && selections.vendors.length > 0) {
          info('Generating vendor configurations...');

          const results = await generateForVendors(
            selections.vendors,
            config,
            templatesDir,
            projectRoot
          );

          // Display results
          displaySuccessMessage(selections, results);
        } else {
          displayNonInteractiveSummary();
        }

      } catch (err) {
        if (err.message && err.message.includes('readline')) {
          // Readline closed unexpectedly - user might have cancelled
          warn('Installation cancelled');
          process.exit(0);
        }
        throw err;
      }

    } else {
      // Non-interactive installation - default to all vendors
      const allVendors = getVendorIds();

      info('Non-interactive mode: Installing all vendors by default');
      console.log('');

      const config = createConfig({
        vendors: allVendors,
        agentPreset: 'all'
      });

      saveConfig(projectRoot, config);
      success('Configuration saved to ai-tools/config.json');
      console.log('');

      // Generate vendor-specific files for all vendors
      info('Generating vendor configurations...');

      const results = await generateForVendors(
        allVendors,
        config,
        templatesDir,
        projectRoot
      );

      // Display results
      displaySuccessMessage({
        vendors: allVendors,
        agentPreset: 'all'
      }, results);
    }

  } catch (err) {
    error(`Installation failed: ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// Run the installer
main();
