#!/usr/bin/env node

/**
 * Korsakov Windsurf Adapter
 * Generates .windsurf/rules.md with references to ai-tools/
 */

const fs = require('fs');
const path = require('path');
const { BaseAdapter } = require('./base-adapter');
const { ensureDir } = require('../core/utils');

class WindsurfAdapter extends BaseAdapter {
  get vendorName() {
    return 'Windsurf';
  }

  get vendorId() {
    return 'windsurf';
  }

  get vendorDescription() {
    return 'AI development environment with .windsurf/ rules';
  }

  getOutputPath(projectRoot) {
    return path.join(projectRoot, '.windsurf');
  }

  canUseSymlinks() {
    return false;
  }

  supportsSlashCommands() {
    return false;
  }

  /**
   * Generate Windsurf configuration
   */
  async generate(config, projectRoot) {
    const outputDir = this.getOutputPath(projectRoot);

    try {
      // Ensure .windsurf directory exists
      ensureDir(outputDir);

      // Generate rules.md
      const content = this.generateWindsurfRules(config);
      const rulesPath = path.join(outputDir, 'rules.md');
      fs.writeFileSync(rulesPath, content);

      return {
        success: true,
        files: ['.windsurf/rules.md']
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Generate rules.md content
   */
  generateWindsurfRules(config) {
    const baseContent = this.generateReferenceContent(config, 'Korsakov AI Framework - Windsurf Rules');

    // Add Windsurf-specific instructions
    const windsurfInstructions = `
## Windsurf-Specific Instructions

### Natural Language Commands

Since Windsurf doesn't support slash commands natively, use these phrases:

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

### Cascade Integration

Windsurf's Cascade feature works well with Korsakov:
- Use Cascade for multi-file edits orchestrated by agents
- Let agents define the scope, Cascade executes
- Wave execution maps naturally to Cascade flows

### Context Files

Always read these files when available:
- \`docs/ai/project-overview.md\` - Project context
- \`docs/ai/tech-stack.md\` - Technology decisions
- \`docs/ai/current-work.md\` - Active work
`;

    return baseContent + windsurfInstructions;
  }

  /**
   * Clean up Windsurf configuration
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

module.exports = { WindsurfAdapter };
