#!/bin/bash

# WraithWeave GitHub Push Script
# This script will push your code to GitHub safely

echo "🎃 WraithWeave GitHub Push Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the wraithweave-core directory"
    exit 1
fi

echo "✅ In correct directory (wraithweave-core)"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi
echo ""

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/AB2511/wraithweave-hr-radio.git
    echo "✅ Remote added"
else
    echo "✅ Remote already exists"
    echo "Current remote:"
    git remote -v
fi
echo ""

# Check what will be committed
echo "📋 Files to be committed:"
echo "------------------------"
git status --short
echo ""

# Check if node_modules would be committed (it shouldn't be)
if git status --short | grep -q "node_modules"; then
    echo "⚠️  WARNING: node_modules detected in staging!"
    echo "This should be ignored by .gitignore"
    echo ""
    read -p "Continue anyway? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

# Add all files
echo "➕ Adding files..."
git add .
echo "✅ Files added"
echo ""

# Show what's staged
echo "📦 Staged files:"
git diff --cached --name-only | head -20
echo ""

# Commit
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="feat: Complete WraithWeave implementation with speech recognition and horror effects"
fi

echo "💾 Committing with message: $commit_msg"
git commit -m "$commit_msg"
echo "✅ Committed"
echo ""

# Determine branch
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
    echo "🌿 Creating main branch..."
    git checkout -b main
    current_branch="main"
fi

echo "📤 Pushing to origin/$current_branch..."
git push -u origin $current_branch

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your repository is now live at:"
    echo "   https://github.com/AB2511/wraithweave-hr-radio"
    echo ""
    echo "Next steps:"
    echo "1. Visit the repository and verify all files are there"
    echo "2. Add a description and topics on GitHub"
    echo "3. Upload a demo video/GIF"
    echo "4. Create a release for the contest submission"
else
    echo ""
    echo "❌ Push failed!"
    echo "Please check the error message above and try again."
    echo ""
    echo "Common fixes:"
    echo "- If authentication failed, check your GitHub credentials"
    echo "- If rejected, try: git pull origin $current_branch --rebase"
    echo "- If force push needed: git push -f origin $current_branch"
fi