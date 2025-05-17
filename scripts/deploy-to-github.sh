#!/bin/bash

# Script to commit and push changes to GitHub
# Usage: bash scripts/deploy-to-github.sh "Your commit message"

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "❌ Error: Please provide a commit message"
  echo "Usage: bash scripts/deploy-to-github.sh \"Your commit message\""
  exit 1
fi

# Store the commit message
COMMIT_MESSAGE="$1"

# Check if Git is initialized
if [ ! -d .git ]; then
  echo "❌ Error: Git repository not initialized"
  exit 1
fi

# Run the staging script
echo "🔄 Running staging script..."
bash scripts/stage-for-commit.sh

# Check if there are changes to commit
if git diff --cached --quiet; then
  echo "ℹ️ No changes to commit"
  exit 0
fi

# Commit changes
echo "🔄 Committing changes with message: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Push to GitHub
echo "🔄 Pushing changes to GitHub..."
git push origin main

# Check if push was successful
if [ $? -eq 0 ]; then
  echo "✅ Successfully pushed changes to GitHub"
else
  echo "❌ Error: Failed to push changes to GitHub"
  exit 1
fi

echo "✨ Done! Your changes are now live on GitHub."
echo "📊 View repository: https://github.com/abhijittiwari/GopalMetals"

exit 0 