#!/bin/bash
# Usage: ./scripts/migrate-page.sh src/pages/organize/[orgId]/projects/index.tsx
#
# This script helps migrate a Pages Router page to App Router by:
# 1. Creating the target directory structure in src/app
# 2. Copying the file and renaming index.tsx to page.tsx
# 3. Showing next steps for manual conversion

set -e

if [ -z "$1" ]; then
  echo "❌ Error: No file path provided"
  echo ""
  echo "Usage: ./scripts/migrate-page.sh <path-to-page-file>"
  echo "Example: ./scripts/migrate-page.sh src/pages/organize/[orgId]/projects/index.tsx"
  exit 1
fi

OLD_PATH="$1"

# Validate that the file exists
if [ ! -f "$OLD_PATH" ]; then
  echo "❌ Error: File not found: $OLD_PATH"
  exit 1
fi

# Convert pages path to app path
NEW_PATH="${OLD_PATH/pages/app}"

# Rename index.tsx to page.tsx for App Router
if [[ "$NEW_PATH" == *"/index.tsx" ]]; then
  NEW_PATH="${NEW_PATH/index.tsx/page.tsx}"
fi

echo "🚀 Migrating Pages Router page to App Router"
echo ""
echo "From: $OLD_PATH"
echo "  To: $NEW_PATH"
echo ""

# Create directory structure
NEW_DIR="$(dirname "$NEW_PATH")"
mkdir -p "$NEW_DIR"
echo "✓ Created directory: $NEW_DIR"

# Copy file
cp "$OLD_PATH" "$NEW_PATH"
echo "✓ Copied file to: $NEW_PATH"

echo ""
echo "📝 Next Steps (Manual):"
echo ""
echo "1. Open the file: $NEW_PATH"
echo ""
echo "2. Replace getServerSideProps with async page function:"
echo "   BEFORE:"
echo "   export const getServerSideProps = scaffold(async (ctx) => {"
echo "     const { orgId } = ctx.params;"
echo "     ..."
echo "   }, { authLevelRequired: 2 });"
echo ""
echo "   AFTER:"
echo "   export default async function Page({ params }: PageProps) {"
echo "     const { orgId } = await params;"
echo "     const { user, apiClient } = await requireAuth(2);"
echo "     await requireOrgAccess(apiClient, user, orgId);"
echo "     ..."
echo "   }"
echo ""
echo "3. Add proper imports at the top:"
echo "   import { requireAuth, requireOrgAccess } from 'app/organize/auth';"
echo ""
echo "4. If there's data fetching, create a Client Component wrapper:"
echo "   - Move the component to <PageName>Client.tsx"
echo "   - Add 'use client' directive"
echo "   - Pass server-fetched data as props"
echo ""
echo "5. Add type for params:"
echo "   type PageProps = {"
echo "     params: Promise<{ orgId: string; /* add other params */ }>;"
echo "     searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;"
echo "   };"
echo ""
echo "6. Test the route in your browser"
echo ""
echo "✅ File ready for conversion!"
