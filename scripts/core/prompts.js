#!/usr/bin/env node

/**
 * Korsakov Interactive Prompts
 * Handles interactive setup and user prompts
 */

const readline = require('readline');
const { colors, log, success, info } = require('./utils');
const { AGENT_PRESETS } = require('./config');

/**
 * Check if running in interactive mode
 */
function isInteractiveMode() {
  return process.stdin.isTTY && process.stdout.isTTY;
}

/**
 * Check if npm --foreground-scripts flag was used
 */
function isForegroundScripts() {
  return process.env.npm_config_foreground_scripts === 'true' ||
         process.argv.includes('--configure') ||
         process.argv.includes('--foreground-scripts');
}

/**
 * Create readline interface
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Ask a question and get user input
 */
async function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Display a menu and get selection
 */
async function showMenu(rl, title, options) {
  console.log('');
  log(title, colors.bold + colors.cyan);
  console.log('');

  options.forEach((option, index) => {
    console.log(`  ${colors.bold}${index + 1}.${colors.reset} ${option.label}`);
    if (option.description) {
      console.log(`     ${colors.dim}${option.description}${colors.reset}`);
    }
  });

  console.log('');

  while (true) {
    const answer = await askQuestion(rl, `${colors.cyan}Select (1-${options.length}): ${colors.reset}`);
    const num = parseInt(answer, 10);

    if (num >= 1 && num <= options.length) {
      return options[num - 1].value;
    }

    log('Invalid selection, please try again.', colors.yellow);
  }
}

/**
 * Display multi-select menu
 */
async function showMultiSelect(rl, title, options) {
  console.log('');
  log(title, colors.bold + colors.cyan);
  log('(Enter comma-separated numbers, e.g., 1,2,3)', colors.dim);
  console.log('');

  options.forEach((option, index) => {
    console.log(`  ${colors.bold}${index + 1}.${colors.reset} ${option.label}`);
    if (option.description) {
      console.log(`     ${colors.dim}${option.description}${colors.reset}`);
    }
  });

  console.log('');

  while (true) {
    const answer = await askQuestion(rl, `${colors.cyan}Select: ${colors.reset}`);
    const nums = answer.split(',').map(s => parseInt(s.trim(), 10));

    if (nums.every(n => n >= 1 && n <= options.length)) {
      return nums.map(n => options[n - 1].value);
    }

    log('Invalid selection, please try again.', colors.yellow);
  }
}

/**
 * Run the interactive setup wizard
 */
async function runInteractiveSetup() {
  const rl = createReadlineInterface();

  try {
    // Step 1: Select vendors
    const vendors = await showMultiSelect(rl, 'Which AI tools do you use?', [
      { value: 'claude', label: 'Claude Code', description: 'Anthropic CLI with native slash commands' },
      { value: 'cursor', label: 'Cursor', description: 'AI-powered code editor' },
      { value: 'windsurf', label: 'Windsurf', description: 'AI development environment' },
      { value: 'gemini', label: 'Gemini CLI', description: 'Google Gemini CLI' },
      { value: 'opencode', label: 'OpenCode', description: 'OpenCode AI coding agent' }
    ]);

    // Step 2: Select primary vendor
    let primaryVendor = vendors[0];
    if (vendors.length > 1) {
      const vendorLabels = {
        claude: 'Claude Code',
        cursor: 'Cursor',
        windsurf: 'Windsurf',
        gemini: 'Gemini CLI',
        opencode: 'OpenCode'
      };

      primaryVendor = await showMenu(rl, 'Which is your primary tool?',
        vendors.map(v => ({ value: v, label: vendorLabels[v] }))
      );
    }

    // Step 3: Select agent preset
    const agentPreset = await showMenu(rl, 'Which agent configuration?', [
      { value: 'all', label: 'All Agents (10)', description: 'Full AI team with all specializations' },
      { value: 'fullstack', label: 'Fullstack (6)', description: 'Frontend, backend, and QA' },
      { value: 'data', label: 'Data Engineering (7)', description: 'Analytics, pipelines, and data platform' },
      { value: 'core', label: 'Core Only (3)', description: 'Just strategy: PM, Tech Lead, Orchestrator' }
    ]);

    rl.close();

    return {
      vendors,
      primaryVendor,
      agentPreset
    };

  } catch (err) {
    rl.close();
    throw err;
  }
}

/**
 * Display non-interactive summary
 */
function displayNonInteractiveSummary() {
  console.log('');
  log('╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║                    Installation Complete                    ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);
  console.log('');

  info('Korsakov installed with default configuration (all vendors)');
  console.log('');
  log('To customize, run:', colors.dim);
  log('  npm run korsakov:configure', colors.cyan);
  console.log('');
}

/**
 * Display success message after installation
 */
function displaySuccessMessage(selections, results) {
  console.log('');
  log('╔════════════════════════════════════════════════════════════╗', colors.green);
  log('║                    Korsakov Installed! 🎉                     ║', colors.green);
  log('╚════════════════════════════════════════════════════════════╝', colors.green);
  console.log('');

  // Show what was generated
  info('Generated configurations for:');
  for (const vendorId of selections.vendors || []) {
    const result = results?.[vendorId];
    if (result?.success) {
      success(`  ${vendorId}`);
    }
  }

  console.log('');

  // Show agent count
  const agentCount = AGENT_PRESETS[selections.agentPreset]?.length || 10;
  info(`${agentCount} agents ready to assist`);

  console.log('');
  log('Quick Start:', colors.bold);
  console.log('');

  // Show vendor-specific instructions
  if (selections.vendors?.includes('claude')) {
    log('  Claude Code:', colors.cyan);
    log('    claude .', colors.dim);
    log('    /start "Add a new feature"', colors.dim);
  }

  if (selections.vendors?.includes('cursor')) {
    log('  Cursor:', colors.cyan);
    log('    Open project in Cursor - .cursorrules loaded automatically', colors.dim);
  }

  if (selections.vendors?.includes('windsurf')) {
    log('  Windsurf:', colors.cyan);
    log('    Open project in Windsurf - .windsurf/rules.md loaded automatically', colors.dim);
  }

  if (selections.vendors?.includes('gemini')) {
    log('  Gemini CLI:', colors.cyan);
    log('    gemini -p "Read .gemini/GEMINI.md and help me build"', colors.dim);
  }

  if (selections.vendors?.includes('opencode')) {
    log('  OpenCode:', colors.cyan);
    log('    opencode', colors.dim);
    log('    Agents and commands in .opencode/ loaded automatically', colors.dim);
  }

  console.log('');
  log('Documentation:', colors.bold);
  log('  ai-tools/README.md         - Quick reference', colors.dim);
  log('  ai-tools/agents/           - Agent definitions', colors.dim);
  log('  ai-tools/commands/         - Available commands', colors.dim);
  log('  ai-tools/skills/           - Reusable skills', colors.dim);
  console.log('');
}

module.exports = {
  isInteractiveMode,
  isForegroundScripts,
  runInteractiveSetup,
  displayNonInteractiveSummary,
  displaySuccessMessage
};
