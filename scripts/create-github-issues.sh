#!/bin/bash

# Bulk create GitHub issues for routing fixes
# Usage: ./scripts/create-github-issues.sh

set -e

echo "🚀 Creating GitHub issues for routing fixes..."
echo

# Check if GitHub CLI is authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ GitHub CLI is not authenticated. Please run 'gh auth login' first."
    exit 1
fi

# Function to create an issue
create_issue() {
    local issue_file="$1"
    local title="$2"
    local labels="$3"
    
    if [ -f "$issue_file" ]; then
        echo "📝 Creating issue: $title"
        
        # Extract the body content (skip the title line)
        body=$(tail -n +3 "$issue_file")
        
        # Create the issue
        gh issue create \
            --title "$title" \
            --body "$body" \
            --label "$labels" \
            --assignee @me
        
        echo "✅ Created issue: $title"
        echo
    else
        echo "❌ Issue file not found: $issue_file"
    fi
}

# Create all issues
create_issue "github-issues/routing-issue-1.md" \
    "Fix post-login routing and navigation flow" \
    "bug,priority:high,component:auth,component:routing,status:ready"

create_issue "github-issues/routing-issue-2.md" \
    "Improve authentication state timing and route protection" \
    "enhancement,priority:medium,component:auth,component:routing,status:ready"

create_issue "github-issues/routing-issue-3.md" \
    "Optimize OAuth callback flow and redirect handling" \
    "enhancement,priority:medium,component:auth,component:oauth,status:ready"

create_issue "github-issues/routing-issue-4.md" \
    "Improve loading states and user feedback during authentication" \
    "enhancement,priority:low,component:ui,component:auth,status:ready"

create_issue "github-issues/routing-issue-5.md" \
    "Review and optimize production deployment configuration" \
    "devops,priority:medium,component:deployment,component:auth,status:ready"

echo "🎉 All GitHub issues created successfully!"
echo
echo "📋 Next steps:"
echo "1. Visit your GitHub repository to view the issues"
echo "2. Start with the HIGH priority issue: 'Fix post-login routing and navigation flow'"
echo "3. Use the GitHub project board to track progress"
echo
echo "🔗 View issues: gh issue list" 