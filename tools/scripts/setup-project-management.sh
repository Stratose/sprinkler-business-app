#!/bin/bash

# Setup GitHub Project Management for Non-Technical Users
# Usage: ./scripts/setup-project-management.sh

set -e

echo "🎯 Setting up GitHub Project Management..."
echo

# Check if GitHub CLI is authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ GitHub CLI is not authenticated. Please run 'gh auth login' first."
    exit 1
fi

echo "📋 Setting up project management features..."
echo

# Create milestone for current routing issues
echo "🎯 Creating milestone for routing fixes..."
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="Week 1 - Authentication & Routing Fixes" \
  --field description="Resolve authentication and routing issues from initial deployment" \
  --field due_on="$(date -v +1w +%Y-%m-%d)T23:59:59Z" \
  --field state="open" > /dev/null 2>&1

echo "✅ Created milestone: Week 1 - Authentication & Routing Fixes"

# Assign issues to milestone
echo "🔗 Assigning issues to milestone..."
for i in {1..5}; do
    gh issue edit $i --milestone "Week 1 - Authentication & Routing Fixes" > /dev/null 2>&1
    echo "  ✅ Issue #$i assigned to milestone"
done

echo
echo "🎉 Project management setup complete!"
echo
echo "📋 Next steps for your project manager:"
echo "1. Visit: https://github.com/Stratose/sprinkler-business-app"
echo "2. Click 'Projects' tab"
echo "3. Click 'New Project'"
echo "4. Choose 'Board' layout"
echo "5. Name it: 'Sprinkler App Development'"
echo "6. Add issues to the project board"
echo
echo "📱 Mobile access:"
echo "- Download GitHub Mobile app"
echo "- Bookmark the project URL"
echo "- Enable notifications in GitHub settings"
echo
echo "📊 Current status:"
echo "- Issues created: 5"
echo "- Milestone created: Week 1 - Authentication & Routing Fixes"
echo "- Due date: $(date -v +1w +%Y-%m-%d)"
echo "- All issues assigned to milestone"
echo
echo "🔔 Recommended next steps:"
echo "1. Enable GitHub Discussions for team communication"
echo "2. Set up email notifications for issue updates"
echo "3. Create weekly review meetings"
echo "4. Train project manager on GitHub interface (30 min)"
echo
echo "📚 Documentation created:"
echo "- docs/project-manager-setup.md - Complete setup guide"
echo "- This covers everything needed for non-technical project management" 