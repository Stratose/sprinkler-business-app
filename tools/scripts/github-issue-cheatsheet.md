# GitHub CLI Issue Creation Cheatsheet

## Quick Reference Commands

### Create Issue - Interactive Mode

```bash
gh issue create
```

_Opens interactive prompts for title, body, labels, assignees_

### Create Issue - Command Line

```bash
gh issue create \
  --title "Fix login bug" \
  --body "Description of the bug..." \
  --label "bug,priority:high" \
  --assignee @me
```

### Create Issue - From File

```bash
gh issue create \
  --title "Feature Request" \
  --body-file ./issue-template.md \
  --label "enhancement"
```

## Working with Labels

### List Available Labels

```bash
gh label list
```

### Create New Label

```bash
gh label create "new-label" \
  --description "Description of the label" \
  --color "ff0000"
```

### Create Multiple Labels

```bash
gh label create "priority:critical" --description "Critical priority" --color "d73a4a"
gh label create "type:feature" --description "New feature" --color "0052cc"
gh label create "component:ui" --description "UI component" --color "5319e7"
```

## Issue Management

### List Issues

```bash
gh issue list                    # All open issues
gh issue list --state closed     # Closed issues
gh issue list --label "bug"      # Issues with specific label
gh issue list --assignee @me     # Issues assigned to you
```

### View Issue Details

```bash
gh issue view 1                  # View issue #1
gh issue view 1 --web           # Open issue #1 in browser
```

### Edit Issues

```bash
gh issue edit 1 --title "New title"
gh issue edit 1 --body "New description"
gh issue edit 1 --add-label "priority:high"
gh issue edit 1 --remove-label "priority:low"
```

### Close/Reopen Issues

```bash
gh issue close 1                 # Close issue #1
gh issue reopen 1               # Reopen issue #1
```

## Issue Templates

### Create Issue Template File

```bash
# Create template file
cat > issue-template.md << 'EOF'
## Issue Type
- [ ] Bug
- [ ] Feature Request
- [ ] Enhancement

## Description
Brief description of the issue...

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen...

## Actual Behavior
What actually happens...

## Technical Details
- Environment:
- Browser:
- Version:

## Additional Context
Any additional context or screenshots...
EOF
```

### Use Template

```bash
gh issue create \
  --title "Issue Title" \
  --body-file issue-template.md \
  --label "bug,status:ready"
```

## Common Label Schemes

### Priority Labels

```bash
gh label create "priority:critical" --color "d73a4a"
gh label create "priority:high" --color "d73a4a"
gh label create "priority:medium" --color "fbca04"
gh label create "priority:low" --color "0e8a16"
```

### Component Labels

```bash
gh label create "component:auth" --color "5319e7"
gh label create "component:ui" --color "5319e7"
gh label create "component:api" --color "5319e7"
gh label create "component:database" --color "5319e7"
```

### Status Labels

```bash
gh label create "status:ready" --color "0052cc"
gh label create "status:in-progress" --color "fbca04"
gh label create "status:blocked" --color "d73a4a"
gh label create "status:review" --color "a2eeef"
```

### Type Labels

```bash
gh label create "type:bug" --color "d73a4a"
gh label create "type:feature" --color "0052cc"
gh label create "type:enhancement" --color "a2eeef"
gh label create "type:documentation" --color "0075ca"
```

## Advanced Usage

### Bulk Create Issues from Directory

```bash
# Create script to process multiple issue files
for file in issues/*.md; do
  title=$(head -n 1 "$file" | sed 's/^# //')
  body=$(tail -n +3 "$file")

  gh issue create \
    --title "$title" \
    --body "$body" \
    --label "status:ready"
done
```

### Create Issue with GitHub Actions Integration

```bash
gh issue create \
  --title "Deploy to staging" \
  --body "Ready for staging deployment" \
  --label "deployment,automation" \
  --assignee @me
```

## Useful Aliases

Add these to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
# GitHub CLI aliases for issues
alias ghic='gh issue create'
alias ghil='gh issue list'
alias ghiv='gh issue view'
alias ghie='gh issue edit'
alias ghic-bug='gh issue create --label "bug,priority:high" --assignee @me'
alias ghic-feature='gh issue create --label "enhancement,priority:medium" --assignee @me'
```

## Best Practices

### 1. Use Consistent Labeling

- Always include priority and component labels
- Use descriptive titles (50-60 characters max)
- Include acceptance criteria in the body

### 2. Good Issue Title Format

```
[Component] Brief description of the issue
```

Examples:

- `[Auth] Fix login redirect after OAuth`
- `[UI] Add loading state to submit buttons`
- `[API] Optimize database query performance`

### 3. Include Context

- Environment details
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or logs when relevant

### 4. Use Issue References

```bash
# Reference other issues
gh issue create \
  --title "Follow-up to login fix" \
  --body "This addresses the remaining issues from #123"
```

### 5. Assign and Label Appropriately

```bash
gh issue create \
  --title "Critical bug fix" \
  --label "bug,priority:critical,component:auth" \
  --assignee @me \
  --milestone "v1.0"
```

## Quick Start Workflow

1. **Check existing labels**: `gh label list`
2. **Create missing labels**: `gh label create "label-name" --color "color"`
3. **Create issue**: `gh issue create` (interactive) or use command line
4. **Review**: `gh issue list` to see all issues
5. **Edit if needed**: `gh issue edit <number>`

## Integration with Development

### Create Issue from Git Branch

```bash
# Create branch and issue together
git checkout -b feature/new-dashboard
gh issue create \
  --title "Build new dashboard interface" \
  --body "Implement new dashboard with improved UX" \
  --label "enhancement,component:ui" \
  --assignee @me
```

### Link Issues to Pull Requests

```bash
# When creating PR, reference issue
gh pr create \
  --title "Fix login redirect (closes #1)" \
  --body "This PR fixes the login redirect issue described in #1"
```

This cheatsheet covers all the essential GitHub CLI issue operations you'll need!
