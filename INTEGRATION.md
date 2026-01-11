# Using Xavier Framework in Other Projects

## Recommended Setup: Multi-Root Workspace

The xavier framework is designed to be shared across all Indie Campers projects. Here's how to use it:

### For Claude Code (Recommended)

Simply open Claude Code with both directories:
```bash
# Open from parent directory
cd /Users/rui.costa/ai-indie
claude .

# Or specify multiple directories
claude xavier indiecampers.io-myindiepulse
```

Claude will automatically recognize the framework in xavier and apply it to your work in other repos.

### For Cursor/VSCode

Create a workspace file:

1. Open your project (e.g., myindiepulse)
2. File → Add Folder to Workspace → Select xavier
3. File → Save Workspace As → `indie-campers.code-workspace`

Your workspace file will look like:
```json
{
  "folders": [
    {
      "path": "xavier",
      "name": "Xavier Framework"
    },
    {
      "path": "indiecampers.io-myindiepulse",
      "name": "MyIndiePulse"
    }
  ]
}
```

## Project-Specific Configuration

If your project needs custom agents or skills, create a local `.claude/` directory that extends xavier:

### Example: MyIndiePulse with Xavier

```
indiecampers.io-myindiepulse/
├── .claude/
│   ├── config.md           # Points to xavier
│   └── agents/
│       └── pulse-analyst.md # Project-specific agent
├── [your project files]
```

**`.claude/config.md`:**
```markdown
# MyIndiePulse Configuration

This project uses the Xavier framework for base agents and skills.
Xavier should be in your workspace at: ../xavier

## Base Framework
- Agents: See xavier/.claude/agents/
- Skills: See xavier/.claude/skills/
- Memory: See xavier/docs/ai/

## Project-Specific Additions
- @pulse-analyst: Analyzes employee engagement data

## Project Context
Working on: Employee engagement platform
Tech: Next.js 15, Supabase, AWS Athena
Current work: Track in local `current-work.md` or xavier's
```

## Working with Multiple Projects

### Shared Memory Bank (xavier/docs/ai/)
- `project-overview.md` - Company-wide context
- `tech-stack.md` - Common technology
- `working-agreements.md` - Team standards

### Project-Specific Memory
Each project can maintain its own:
- `current-work.md` - Active work for that project
- `decisions/` - Project-specific ADRs
- `context.md` - Project-specific context

### Best Practices

1. **Keep xavier clean**: Don't add project-specific code to xavier
2. **Use shared agents**: Leverage xavier's agents for common tasks
3. **Extend locally**: Add project-specific agents/skills in the project
4. **Update shared docs**: Improve xavier's docs when you learn something universal
5. **Track work locally**: Use project's own `current-work.md` for project work

## Example Commands

When working in a multi-root workspace:

```
"@backend-engineer from xavier, implement the API for pulse surveys"
→ Uses xavier's backend-engineer agent in your project

"Use the testing-protocol skill to validate the implementation"
→ Applies xavier's testing protocol to your code

"Follow code-change-protocol for this refactoring"
→ Ensures consistency across projects
```

## Workspace Structure Example

```
/Users/rui.costa/ai-indie/
├── xavier/                    # Framework (shared)
│   ├── .claude/              # Agents & skills
│   ├── docs/ai/              # Company memory
│   └── CLAUDE.md             # Framework config
├── indiecampers.io-myindiepulse/
│   ├── .claude/config.md     # Points to xavier
│   ├── current-work.md       # Project work
│   └── [project files]
├── indiecampers.io-fleet/
│   ├── .claude/config.md     # Points to xavier
│   ├── current-work.md       # Project work
│   └── [project files]
└── indie-campers.code-workspace  # Workspace file
```

## Benefits of This Approach

1. **Single source of truth**: One set of agents/skills for all projects
2. **Consistent patterns**: Same conventions across all repos
3. **Easy updates**: Update xavier, all projects benefit
4. **Project flexibility**: Each project can extend as needed
5. **Clean separation**: Framework separate from implementation

## Migration Path

If you already have `.claude/` or `.cursorrules` in your project:

1. **Backup existing files**: `mv .claude .claude.backup`
2. **Add xavier to workspace**: As described above
3. **Create integration file**: `.claude/config.md` pointing to xavier
4. **Merge custom content**: Add project-specific agents/skills back
5. **Test the setup**: Ensure agents respond correctly

## Troubleshooting

### Agents not responding?
- Ensure xavier is in your workspace
- Check that Claude/Cursor can see both directories
- Try explicit references: "Use xavier's @backend-engineer"

### Conflicts with existing config?
- Rename existing files with `.backup`
- Create explicit `.claude/config.md` pointing to xavier
- Use namespacing: "xavier's testing-protocol"

### Want project isolation?
- Copy (don't symlink) only what you need from xavier
- Maintain your own subset
- Periodically sync with xavier for updates