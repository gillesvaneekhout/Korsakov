#!/usr/bin/env node

/**
 * Korsakov Claude Code Adapter
 * Generates .claude/ directory with symlinks to ai-tools/
 */

const fs = require('fs');
const path = require('path');
const { BaseAdapter } = require('./base-adapter');
const { createSymlinkOrCopy, ensureDir, success, warn, log, colors } = require('../core/utils');

class ClaudeAdapter extends BaseAdapter {
  get vendorName() {
    return 'Claude Code';
  }

  get vendorId() {
    return 'claude';
  }

  get vendorDescription() {
    return 'Anthropic Claude Code CLI with native slash commands and skills';
  }

  getOutputPath(projectRoot) {
    return path.join(projectRoot, '.claude');
  }

  canUseSymlinks() {
    return true;
  }

  supportsSlashCommands() {
    return true;
  }

  supportsSkillTool() {
    return true;
  }

  /**
   * Generate Claude Code configuration
   */
  async generate(config, projectRoot) {
    const outputDir = this.getOutputPath(projectRoot);
    const aiToolsDir = this.getAiToolsDir(projectRoot);
    const generatedFiles = [];

    try {
      // Ensure .claude directory exists
      ensureDir(outputDir);

      // Create symlinks from .claude/ to ai-tools/
      const symlinks = [
        { source: 'agents', target: 'agents' },
        { source: 'commands', target: 'commands' },
        { source: 'skills', target: 'skills' }
      ];

      for (const { source, target } of symlinks) {
        const sourcePath = path.join(aiToolsDir, source);
        const targetPath = path.join(outputDir, target);

        if (fs.existsSync(sourcePath)) {
          const result = createSymlinkOrCopy(sourcePath, targetPath);
          if (result.success) {
            generatedFiles.push(`${target}/ (${result.method})`);
          }
        }
      }

      // Generate CLAUDE.md
      const claudeMd = this.generateClaudeMd(config);
      const claudeMdPath = path.join(outputDir, 'CLAUDE.md');
      fs.writeFileSync(claudeMdPath, claudeMd);
      generatedFiles.push('CLAUDE.md');

      // Generate settings.local.json
      const settings = this.generateSettings();
      const settingsPath = path.join(outputDir, 'settings.local.json');
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      generatedFiles.push('settings.local.json');

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
   * Generate CLAUDE.md content
   */
  generateClaudeMd(config) {
    const agents = this.getAgents(config);
    const commands = this.getCommands();
    const skills = this.getSkills();

    let content = `# Korsakov AI Framework - Claude Code Configuration

## Available Commands

`;

    for (const cmd of commands) {
      content += `- \`${cmd.slashCommand}\` - ${cmd.description || cmd.name}\n`;
    }

    content += `
See \`.claude/commands/\` for full command documentation.

---

## Available Agents

### Strategy Layer
`;

    const strategyAgents = agents.filter(a =>
      ['product-partner', 'tech-lead', 'work-orchestrator'].includes(a.id)
    );
    content += strategyAgents.map(a => `@${a.id}`).join(', ') || 'None configured';

    content += `

### Engineering Layer
`;
    const engineeringAgents = agents.filter(a =>
      ['frontend-engineer', 'backend-engineer', 'data-analytics-engineer'].includes(a.id)
    );
    content += engineeringAgents.map(a => `@${a.id}`).join(', ') || 'None configured';

    content += `

### Data Engineering Layer
`;
    const dataAgents = agents.filter(a =>
      ['data-pipeline-engineer', 'analytics-engineer', 'data-platform-engineer'].includes(a.id)
    );
    content += dataAgents.map(a => `@${a.id}`).join(', ') || 'None configured';

    content += `

### Quality Layer
`;
    const qaAgents = agents.filter(a => ['qa-release'].includes(a.id));
    content += qaAgents.map(a => `@${a.id}`).join(', ') || 'None configured';

    content += `

See \`.claude/agents/\` for full agent definitions.

---

## Available Skills

`;

    for (const skill of skills) {
      content += `- \`${skill.id}\` - ${skill.description || skill.name}\n`;
    }

    content += `
See \`.claude/skills/\` for skill details.

---

## Agent Delegation Protocol [MANDATORY]

**CRITICAL: You are the orchestrator, NOT the implementer.**

### 1. NEVER Implement Directly
- Do NOT write code yourself
- Do NOT perform technical implementations
- Do NOT do research tasks that agents should do

### 2. ALWAYS Delegate to Specialized Agents
Engage agents using @ mentions for their specialized work.

### 3. Your Role as Orchestrator
Your job is to:
- Understand user requests
- Engage appropriate agents using @ mentions
- Coordinate between agents
- Monitor progress using \`bd list\` or \`docs/ai/work-items.json\`
- Ensure quality gates are met

---

## Unlimited Parallelism Principle [MANDATORY]

**CRITICAL: AI agents are NOT human resources. They are unlimited AI processes.**

### Key Principles:
- Agents are infinite - spawn as many as needed simultaneously
- NEVER queue work due to "agent availability"
- Organize work in dependency waves for maximum parallelism
- Think of agents as API calls, not employees

Sequential execution: 5 agents × 2 min = 10 minutes
Parallel execution: 5 agents at once = 2 minutes

**Make parallel execution your default.**

---

## Git Workflow [MANDATORY]

**Every feature/fix uses this flow:**

\`\`\`
main ──┬── feature/kpi-trends ──┬── PR ──► main
       │                        │
       └── fix/login-button ────┴── PR ──► main
\`\`\`

### Branch Naming
- \`feature/\` → New functionality
- \`fix/\` → Bug fixes
- \`refactor/\` → Code restructuring
- \`docs/\` → Documentation

### Automatic Flow
1. \`/start\` creates the branch
2. All work happens on that branch
3. \`/execute-work\` ends with PR creation
4. After merge, branch is deleted

---

## Wave-Based Execution

Korsakov uses **wave-based parallel execution** for maximum efficiency:

\`\`\`
WAVE 1 (No Dependencies - All Parallel):
├── @tech-lead: Database schema
├── @frontend-engineer: UI mockups
└── @qa-release: Test plan

WAVE 2 (After Wave 1 - All Parallel):
├── @backend-engineer: API endpoints
└── @frontend-engineer: UI components

WAVE 3 (After Wave 2):
└── @qa-release: Integration testing
\`\`\`

---

## Work Tracking

Korsakov supports two work tracking backends:

### Option 1: Beads (Recommended)
\`\`\`bash
# Install Beads CLI
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$PATH:$HOME/.local/bin"  # Add to ~/.zshrc

# Use in project
bd init
bd create "Feature name" --type epic
bd ready  # Show unblocked work
\`\`\`

### Option 2: Local JSON (No Dependencies)
Use \`docs/ai/work-items.json\` for simple tracking without external tools.

---

## Project Memory

All agents rely on the Memory Bank for project context:
- \`docs/ai/project-overview.md\` - Vision and goals
- \`docs/ai/tech-stack.md\` - Technology inventory
- \`docs/ai/working-agreements.md\` - Team conventions
- \`docs/ai/current-work.md\` - Active work tracking
- \`docs/ai/work-items.json\` - Work items (if not using Beads)
- \`docs/ai/work/*/prd.md\` - PRD files for features
- \`docs/ai/decisions/\` - Architecture decision records

Always read relevant Memory Bank files before starting work.

---

## Context Management [CRITICAL]

Parallel agents consume context quickly. To prevent "Conversation too long" errors:

### Rules
1. **Max 3 agents per wave** - More risks context overflow
2. **Run \`/compact\` proactively** - Don't wait for the warning
3. **State persists in Beads/JSON** - Work survives compaction
4. **If compaction fails** - Start fresh session, check \`bd ready\`

---

## Key Principles

1. **Agents are specialists**: Each agent has deep expertise in their domain
2. **Skills are reusable**: Common patterns encoded once, used everywhere
3. **Memory persists**: All context tracked in \`docs/ai/\`
4. **Unlimited parallelism**: Dispatch all independent work simultaneously
5. **Wave execution**: Think in waves, not queues
6. **Progress over perfection**: Small, incremental changes with continuous improvement
`;

    return content;
  }

  /**
   * Generate settings.local.json
   */
  generateSettings() {
    return {
      permissions: {
        allow: [
          "Bash(git:*)",
          "Bash(npm:*)",
          "Bash(bd:*)",
          "Read",
          "Write",
          "Edit"
        ],
        deny: []
      }
    };
  }

  /**
   * Clean up Claude Code configuration
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

module.exports = { ClaudeAdapter };
