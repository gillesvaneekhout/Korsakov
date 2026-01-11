#!/usr/bin/env node

/**
 * Xavier Gemini CLI Adapter
 * Generates .gemini/ directory with GEMINI.md and settings.json
 */

const fs = require('fs');
const path = require('path');
const { BaseAdapter } = require('./base-adapter');
const { ensureDir } = require('../core/utils');

class GeminiAdapter extends BaseAdapter {
  get vendorName() {
    return 'Gemini CLI';
  }

  get vendorId() {
    return 'gemini';
  }

  get vendorDescription() {
    return 'Google Gemini CLI with .gemini/ configuration';
  }

  getOutputPath(projectRoot) {
    return path.join(projectRoot, '.gemini');
  }

  canUseSymlinks() {
    return false;
  }

  supportsSlashCommands() {
    return true; // Via TOML commands
  }

  /**
   * Generate Gemini CLI configuration
   */
  async generate(config, projectRoot) {
    const outputDir = this.getOutputPath(projectRoot);
    const generatedFiles = [];

    try {
      // Ensure .gemini directory exists
      ensureDir(outputDir);

      // Generate GEMINI.md
      const content = this.generateGeminiMd(config);
      const geminiMdPath = path.join(outputDir, 'GEMINI.md');
      fs.writeFileSync(geminiMdPath, content);
      generatedFiles.push('.gemini/GEMINI.md');

      // Generate settings.json
      const settings = this.generateSettings(config);
      const settingsPath = path.join(outputDir, 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      generatedFiles.push('.gemini/settings.json');

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
   * Generate GEMINI.md content
   */
  generateGeminiMd(config) {
    const baseContent = this.generateReferenceContent(config, 'Xavier AI Framework - Gemini CLI');

    // Add Gemini-specific instructions
    const geminiInstructions = `
## Gemini CLI-Specific Instructions

### Using Xavier with Gemini

Start Gemini CLI with context:
\`\`\`bash
gemini -p "Read .gemini/GEMINI.md for Xavier framework instructions"
\`\`\`

### Natural Language Commands

Use these phrases to invoke Xavier workflows:

| Workflow | Say... |
|----------|--------|
| Start Work | "Let's start working on [task]" |
| Plan Execution | "Create a plan for the PRD at docs/ai/work/[feature]/prd.md" |
| Execute Work | "Execute the work items in parallel waves" |
| Process PRDs | "Find and process all ready PRDs" |

### Reading Definitions

When I mention an agent (like @backend-engineer), read their definition:
\`\`\`
ai-tools/agents/backend-engineer.md
\`\`\`

When I invoke a skill, read its definition:
\`\`\`
ai-tools/skills/{skill-name}/SKILL.md
\`\`\`

When I invoke a command, read its definition:
\`\`\`
ai-tools/commands/{command-name}.md
\`\`\`

### Agent Invocation Pattern

When you see @agent-name in the conversation:
1. Read \`ai-tools/agents/{agent-name}.md\`
2. Understand their role and responsibilities
3. Act according to their definition
4. Follow their quality gates

### Context Files

Always read these files when available:
- \`docs/ai/project-overview.md\` - Project context
- \`docs/ai/tech-stack.md\` - Technology decisions
- \`docs/ai/current-work.md\` - Active work

### Gemini Code Execution

When executing code changes:
1. Read the relevant agent definition
2. Follow their coding standards
3. Apply their quality gates
4. Use structured output for multi-file changes
`;

    return baseContent + geminiInstructions;
  }

  /**
   * Generate settings.json
   */
  generateSettings(config) {
    const agents = this.getAgents(config);
    const skills = this.getSkills();

    return {
      context: {
        fileName: ['GEMINI.md']
      },
      xavier: {
        version: '1.0.0',
        agents: agents.map(a => a.id),
        skills: skills.map(s => s.id),
        generatedAt: this.getTimestamp()
      }
    };
  }

  /**
   * Clean up Gemini CLI configuration
   */
  cleanup(projectRoot) {
    const outputDir = this.getOutputPath(projectRoot);

    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
      return { success: true };
    }

    return { success: true, message: 'Nothing to clean' };
  }
}

module.exports = { GeminiAdapter };
