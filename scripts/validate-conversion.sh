#!/bin/bash
# validate-conversion.sh - Validates Level 2 conversion
# Usage: ./scripts/validate-conversion.sh src/app/organize/[orgId]/people

PAGE_DIR=$1

if [ -z "$PAGE_DIR" ]; then
  echo "Usage: $0 <path-to-page-directory>"
  echo "Example: $0 src/app/organize/[orgId]/people"
  exit 1
fi

if [ ! -d "$PAGE_DIR" ]; then
  echo "❌ Directory not found: $PAGE_DIR"
  exit 1
fi

echo "✅ Level 2 Conversion Validation: $PAGE_DIR"
echo "=============================================="
echo ""

PASS=0
FAIL=0
WARN=0

# Check for Server Component (page.tsx)
echo "🔍 Checking page.tsx..."
if [ -f "$PAGE_DIR/page.tsx" ]; then
  echo "  ✅ page.tsx exists"
  ((PASS++))

  if grep -q "'use client'" "$PAGE_DIR/page.tsx"; then
    echo "  ❌ page.tsx still has 'use client' directive"
    ((FAIL++))
  else
    echo "  ✅ page.tsx is Server Component (no 'use client')"
    ((PASS++))
  fi

  if grep -q "async function\|async (" "$PAGE_DIR/page.tsx"; then
    echo "  ✅ page.tsx has async function"
    ((PASS++))
  else
    echo "  ⚠️  page.tsx should be async to fetch data"
    ((WARN++))
  fi

  if grep -q "getServerApiClient" "$PAGE_DIR/page.tsx"; then
    echo "  ✅ page.tsx uses getServerApiClient"
    ((PASS++))
  else
    echo "  ⚠️  page.tsx should use getServerApiClient for data fetching"
    ((WARN++))
  fi

  if grep -q "params:" "$PAGE_DIR/page.tsx"; then
    echo "  ✅ page.tsx uses params prop"
    ((PASS++))
  else
    echo "  ⚠️  page.tsx should use params prop instead of useParams()"
    ((WARN++))
  fi
else
  echo "  ❌ page.tsx not found"
  ((FAIL++))
fi

echo ""
echo "🔍 Checking Client Component..."
CLIENT_FILES=$(find "$PAGE_DIR" -maxdepth 1 -name "*Client.tsx" 2>/dev/null)
if [ -n "$CLIENT_FILES" ]; then
  for CLIENT_FILE in $CLIENT_FILES; do
    CLIENT_NAME=$(basename "$CLIENT_FILE")
    echo "  ✅ Client component found: $CLIENT_NAME"
    ((PASS++))

    if grep -q "'use client'" "$CLIENT_FILE"; then
      echo "  ✅ $CLIENT_NAME has 'use client' directive"
      ((PASS++))
    else
      echo "  ❌ $CLIENT_NAME missing 'use client' directive"
      ((FAIL++))
    fi

    if grep -q "interface.*Props" "$CLIENT_FILE"; then
      echo "  ✅ $CLIENT_NAME has TypeScript props interface"
      ((PASS++))
    else
      echo "  ⚠️  $CLIENT_NAME should have TypeScript props interface"
      ((WARN++))
    fi
  done
else
  echo "  ❌ No Client component (*Client.tsx) found"
  ((FAIL++))
fi

echo ""
echo "🔍 Checking Hydration Component..."
HYDRATION_FILES=$(find "src/features" -name "*WithInitialData.tsx" 2>/dev/null | tail -5)
if [ -n "$HYDRATION_FILES" ]; then
  echo "  ✅ Hydration components found:"
  echo "$HYDRATION_FILES" | sed 's/^/    - /'
  ((PASS++))
else
  echo "  ⚠️  No hydration components found (check if reusing existing)"
  ((WARN++))
fi

echo ""
echo "🔍 Checking imports..."
if [ -f "$PAGE_DIR/page.tsx" ]; then
  if grep -q "from 'core/api/server'" "$PAGE_DIR/page.tsx"; then
    echo "  ✅ Correct import path (core/api/server, not @/core/api/server)"
    ((PASS++))
  elif grep -q "from '@/core/api/server'" "$PAGE_DIR/page.tsx"; then
    echo "  ❌ Wrong import path: should be 'core/api/server' not '@/core/api/server'"
    ((FAIL++))
  fi
fi

echo ""
echo "📊 Summary:"
echo "----------"
echo "  ✅ Passed:  $PASS checks"
echo "  ⚠️  Warnings: $WARN checks"
echo "  ❌ Failed:  $FAIL checks"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 Level 2 conversion looks good!"
  echo ""
  echo "📋 Manual Testing Checklist:"
  echo "  [ ] Page loads without errors"
  echo "  [ ] Data displays correctly"
  echo "  [ ] No duplicate API requests in Network tab"
  echo "  [ ] Redux DevTools shows data populated on mount"
  echo "  [ ] View page source - data should be in HTML"
  echo "  [ ] Client-side navigation still works"
  echo "  [ ] All filters/interactions work as before"
  echo ""
  exit 0
else
  echo "⚠️  Please fix the $FAIL failed check(s) above"
  echo ""
  exit 1
fi
