#!/usr/bin/env node

/**
 * Korsakov Cursor Adapter
 * Generates .cursorrules file with references to ai-tools/
 */

const fs = require('fs');
const path = require('path');
const { BaseAdapter } = require('./base-adapter');
const { ensureDir } = require('../core/utils');

class CursorAdapter extends BaseAdapter {
  get vendorName() {
    return 'Cursor';
  }

  get vendorId() {
    return 'cursor';
  }

  get vendorDescription() {
    return 'AI-powered code editor with .cursorrules';
  }

  getOutputPath(projectRoot) {
    return path.join(projectRoot, '.cursorrules');
  }

  canUseSymlinks() {
    return false;
  }

  supportsSlashCommands() {
    return false;
  }

  usesSingleFile() {
    return true;
  }

  usesDirectoryStructure() {
    return false;
  }

  /**
   * Generate Cursor configuration
   */
  async generate(config, projectRoot) {
    const outputPath = this.getOutputPath(projectRoot);

    try {
      // Generate reference content
      const content = this.generateCursorRules(config);
      fs.writeFileSync(outputPath, content);

      return {
        success: true,
        files: ['.cursorrules']
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Generate .cursorrules content
   */
  generateCursorRules(config) {
    const baseContent = this.generateReferenceContent(config, 'Korsakov AI Framework - Cursor Rules');

    // Add Cursor-specific instructions
    const cursorInstructions = `
## Cursor-Specific Instructions

### Natural Language Commands

Since Cursor doesn't support slash commands natively, use these phrases:

| Instead of... | Say... |
|---------------|--------|
| \`/start\` | "Let's start working on [task]" |
| \`/plan-execution\` | "Create a plan for the PRD" |
| \`/execute-work\` | "Execute the work items in waves" |
| \`/process-prds\` | "Process all ready PRDs" |

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
`;

    return baseContent + cursorInstructions;
  }

  /**
   * Clean up Cursor configuration
   */
  cleanup(projectRoot) {
    const outputPath = this.getOutputPath(projectRoot);

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      return { success: true };
    }

    return { success: true, message: 'Nothing to clean' };
  }
}

module.exports = { CursorAdapter };
