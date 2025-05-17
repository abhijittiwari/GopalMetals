#!/bin/bash

# Script to stage all relevant files for commit, excluding database files
# and other files that should not be committed
# Usage: bash scripts/stage-for-commit.sh

echo "🔄 Staging files for commit..."

# Stage specific file types
git add "*.ts" "*.tsx" "*.js" "*.mjs" "*.json" "*.css" "*.scss" "*.md" "*.sh" "*.html" 2>/dev/null || true

# Stage specific directories
git add app/
git add components/
git add lib/
git add public/
git add prisma/*.prisma
git add prisma/seed.ts
git add middleware.ts
git add next.config.js
git add postcss.config.mjs
git add tailwind.config.js
git add tsconfig.json
git add vercel.json
git add ecosystem.config.js
git add .gitignore
git add README.md
git add package.json

# Add specific script files
git add scripts/add-featured-products.mjs

# Stage scripts directory but exclude certain scripts
git add scripts/*.js scripts/*.ts scripts/*.sh 2>/dev/null || true
git rm --cached scripts/check-password.js scripts/find-user.js scripts/update-user.js 2>/dev/null || true

# Remove any database files from staging
git rm --cached prisma/*.db prisma/prisma/*.db 2>/dev/null || true
git rm --cached "*.db" 2>/dev/null || true

# Remove env files from staging
git rm --cached .env .env.local 2>/dev/null || true

# Remove logs from staging
git rm --cached logs/* 2>/dev/null || true

echo "✅ Files staged successfully. Ready for commit."
echo "👉 Run 'npm run deploy:github \"Your commit message\"' to commit and push to GitHub." 