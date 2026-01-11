#!/usr/bin/env node

/**
 * Korsakov OpenCode Adapter
 * Generates .opencode/ directory with agent and command definitions
 *
 * OpenCode uses:
 * - .opencode/agent/ for custom agent markdown files
 * - .opencode/command/ for custom command markdown files
 * - opencode.json for configuration
 */

const fs = require('fs');
const path = require('path');
const { BaseAdapter } = require('./base-adapter');
const { ensureDir, readMarkdownFile, parseFrontmatter } = require('../core/utils');

class OpenCodeAdapter extends BaseAdapter {
  get vendorName() {
    return 'OpenCode';
  }

  get vendorId() {
    return 'opencode';
  }

  get vendorDescription() {
    return 'OpenCode AI coding agent with .opencode/ configuration';
  }

  getOutputPath(projectRoot) {
    return path.join(projectRoot, '.opencode');
  }

  canUseSymlinks() {
    return false;
  }

  supportsSlashCommands() {
    return true; // Via command/ directory
  }

  /**
   * Generate OpenCode configuration
   */
  async generate(config, projectRoot) {
    const outputDir = this.getOutputPath(projectRoot);
    const generatedFiles = [];

    try {
      // Ensure directories exist
      ensureDir(outputDir);
      ensureDir(path.join(outputDir, 'agent'));
      ensureDir(path.join(outputDir, 'command'));

      // Generate agent markdown files
      const agents = this.getAgents(config);
      for (const agent of agents) {
        const agentContent = this.generateAgentMarkdown(agent);
        const agentPath = path.join(outputDir, 'agent', `${agent.id}.md`);
        fs.writeFileSync(agentPath, agentContent);
        generatedFiles.push(`.opencode/agent/${agent.id}.md`);
      }

      // Generate command markdown files
      const commands = this.getCommands();
      for (const cmd of commands) {
        const cmdContent = this.generateCommandMarkdown(cmd);
        const cmdPath = path.join(outputDir, 'command', `${cmd.id}.md`);
        fs.writeFileSync(cmdPath, cmdContent);
        generatedFiles.push(`.opencode/command/${cmd.id}.md`);
      }

      // Generate opencode.json configuration
      const opencodeConfig = this.generateConfig(config, agents);
      const configPath = path.join(projectRoot, 'opencode.json');
      fs.writeFileSync(configPath, JSON.stringify(opencodeConfig, null, 2));
      generatedFiles.push('opencode.json');

      // Generate AGENTS.md (OpenCode's project context file)
      const agentsMd = this.generateAgentsMd(config, agents);
      const agentsMdPath = path.join(projectRoot, 'AGENTS.md');
      // Only create if it doesn't exist (user may have customized it)
      if (!fs.existsSync(agentsMdPath)) {
        fs.writeFileSync(agentsMdPath, agentsMd);
        generatedFiles.push('AGENTS.md');
      }

      return {
        success: true,
        files: generatedFiles
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Generate agent markdown file content
   */
  generateAgentMarkdown(agent) {
    // Read the original agent file to get the full content
    const originalContent = fs.existsSync(agent.filePath)
      ? fs.readFileSync(agent.filePath, 'utf8')
      : '';

    const { frontmatter, body } = parseFrontmatter(originalContent);

    // Build OpenCode frontmatter
    const opencodeFrontmatter = {
      description: agent.description || agent.name,
      model: this.mapModelToOpenCode(agent.model || 'sonnet'),
      mode: 'all'
    };

    // Convert to YAML-like format
    let content = '---\n';
    content += `description: ${opencodeFrontmatter.description}\n`;
    content += `model: ${opencodeFrontmatter.model}\n`;
    content += `mode: ${opencodeFrontmatter.mode}\n`;
    content += '---\n\n';

    // Add the body (agent instructions)
    if (body) {
      content += body;
    } else {
      content += `# ${agent.name}\n\n`;
      content += `You are ${agent.name}, a specialized AI agent.\n\n`;
      content += `## Your Role\n${agent.description || 'Assist with development tasks.'}\n`;
    }

    return content;
  }

  /**
   * Generate command markdown file content
   */
  generateCommandMarkdown(cmd) {
    // Read the original command file
    const originalContent = fs.existsSync(cmd.filePath)
      ? fs.readFileSync(cmd.filePath, 'utf8')
      : '';

    const { frontmatter, body } = parseFrontmatter(originalContent);

    // Build OpenCode command format
    let content = '---\n';
    content += `description: ${cmd.description || cmd.name}\n`;
    content += '---\n\n';

    // Add the command instructions
    if (body) {
      content += body;
    } else {
      content += `# ${cmd.name}\n\n`;
      content += `${cmd.description || 'Execute this command.'}\n`;
    }

    return content;
  }

  /**
   * Generate opencode.json configuration
   */
  generateConfig(config, agents) {
    const agentConfig = {};

    // Reference agents from .opencode/agent/ directory
    for (const agent of agents) {
      agentConfig[agent.id] = {
        description: agent.description || agent.name
      };
    }

    return {
      // Model configuration
      model: 'anthropic/claude-sonnet-4-5',
      small_model: 'anthropic/claude-haiku-4-5',

      // Agent references
      agent: agentConfig,
      default_agent: 'work-orchestrator',

      // Instructions - point to ai-tools for context
      instructions: [
        'ai-tools/AGENTIC-GUIDELINES.md',
        'ai-tools/README.md'
      ],

      // Permissions
      permission: {
        edit: 'allow',
        bash: {
          'git *': 'allow',
          'npm *': 'allow',
          'bd *': 'allow'
        }
      },

      // Korsakov metadata
      korsakov: {
        version: '1.0.0',
        agents: agents.map(a => a.id),
        generatedAt: this.getTimestamp()
      }
    };
  }

  /**
   * Generate AGENTS.md (OpenCode's project context file)
   */
  generateAgentsMd(config, agents) {
    let content = `# Project Agents

This file describes the AI agents available in this project via Korsakov.

## Korsakov Framework

Korsakov is a multi-agent orchestration framework that coordinates specialized AI agents
working in parallel. See \`ai-tools/README.md\` for full documentation.

## Available Agents

| Agent | Description |
|-------|-------------|
`;

    for (const agent of agents) {
      content += `| @${agent.id} | ${agent.description || agent.name} |\n`;
    }

    content += `
## Agent Delegation Protocol

**CRITICAL: You are the orchestrator, NOT the implementer.**

1. **NEVER implement directly** - Delegate to specialized agents
2. **Use @ mentions** - Reference agents like @backend-engineer
3. **Read definitions** - Check \`.opencode/agent/{name}.md\` for full instructions
4. **Parallel execution** - Dispatch independent work simultaneously

## Commands

| Command | Purpose |
|---------|---------|
| /start | Universal entry point - creates branch, routes to workflow |
| /plan-execution | Creates work items from PRD with dependencies |
| /execute-work | Executes work in parallel waves, creates PR |
| /process-prds | Auto-process all PRDs with status: ready |

## Project Memory

Context persists in \`docs/ai/\`:
- \`project-overview.md\` - Vision and goals
- \`tech-stack.md\` - Technology inventory
- \`current-work.md\` - Active work tracking
- \`work/*/prd.md\` - PRD files for features

## Wave-Based Execution

Korsakov organizes work into dependency waves for maximum parallelism:

\`\`\`
WAVE 1 (No Dependencies - All Parallel):
├── @tech-lead: Database schema
├── @frontend-engineer: UI mockups
└── @qa-release: Test plan

WAVE 2 (After Wave 1):
├── @backend-engineer: API endpoints
└── @frontend-engineer: UI components
\`\`\`
`;

    return content;
  }

  /**
   * Map Korsakov model names to OpenCode provider/model format
   */
  mapModelToOpenCode(model) {
    const modelMap = {
      'sonnet': 'anthropic/claude-sonnet-4-5',
      'opus': 'anthropic/claude-opus-4-5',
      'haiku': 'anthropic/claude-haiku-4-5',
      'gpt-4': 'openai/gpt-4o',
      'gpt-4o': 'openai/gpt-4o'
    };

    return modelMap[model] || 'anthropic/claude-sonnet-4-5';
  }

  /**
   * Clean up OpenCode configuration
   */
  cleanup(projectRoot) {
    const outputDir = this.getOutputPath(projectRoot);
    const configPath = path.join(projectRoot, 'opencode.json');

    let cleaned = false;

    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
      cleaned = true;
    }

    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
      cleaned = true;
    }

    return { success: true, message: cleaned ? 'Cleaned' : 'Nothing to clean' };
  }
}

module.exports = { OpenCodeAdapter };
