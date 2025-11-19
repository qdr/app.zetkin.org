#!/bin/bash
# analyze-page.sh - Analyzes a page for Level 2 conversion
# Usage: ./scripts/analyze-page.sh src/app/organize/[orgId]/people/page.tsx

PAGE_PATH=$1

if [ -z "$PAGE_PATH" ]; then
  echo "Usage: $0 <path-to-page.tsx>"
  echo "Example: $0 src/app/organize/[orgId]/people/page.tsx"
  exit 1
fi

if [ ! -f "$PAGE_PATH" ]; then
  echo "❌ File not found: $PAGE_PATH"
  exit 1
fi

echo "🔍 Level 2 Conversion Analysis: $PAGE_PATH"
echo "=============================================="
echo ""

# Check if it's already a Server Component
if grep -q "'use client'" "$PAGE_PATH"; then
  echo "📦 Current Type: Client Component"
else
  echo "📦 Current Type: Server Component (already converted?)"
fi

echo ""
echo "📥 Imports:"
echo "----------"
grep "^import" "$PAGE_PATH" | head -20

echo ""
echo "🪝 React Hooks Used:"
echo "-------------------"
HOOKS=$(grep -oE "use[A-Z][a-zA-Z]*\(" "$PAGE_PATH" | sed 's/($//' | sort -u)
if [ -z "$HOOKS" ]; then
  echo "  (none found)"
else
  echo "$HOOKS" | sed 's/^/  - /'
fi

echo ""
echo "📡 API Calls:"
echo "------------"
API_CALLS=$(grep -E "apiClient\.(get|post|put|patch|delete)" "$PAGE_PATH")
if [ -z "$API_CALLS" ]; then
  echo "  (none found directly - check hooks)"
else
  echo "$API_CALLS" | sed 's/^/  /'
fi

echo ""
echo "🎯 Redux Dispatches:"
echo "-------------------"
DISPATCHES=$(grep "dispatch(" "$PAGE_PATH" | head -10)
if [ -z "$DISPATCHES" ]; then
  echo "  (none found)"
else
  echo "$DISPATCHES" | sed 's/^/  /'
fi

echo ""
echo "⚙️  Route Parameters:"
echo "--------------------"
PARAMS=$(grep -E "useParams|useNumericRouteParams|useRouter" "$PAGE_PATH")
if [ -z "$PARAMS" ]; then
  echo "  (none found)"
else
  echo "$PARAMS" | sed 's/^/  /'
fi

echo ""
echo "📊 Data Fetching Hooks:"
echo "----------------------"
DATA_HOOKS=$(grep -oE "use[A-Z][a-zA-Z]*\(" "$PAGE_PATH" | sed 's/($//' | grep -E "(useCampaigns|usePeople|useJourneys|useTags|useSurveys|useActivities)" | sort -u)
if [ -z "$DATA_HOOKS" ]; then
  echo "  (none found - check code manually)"
else
  echo "$DATA_HOOKS" | sed 's/^/  - /'
fi

echo ""
echo "✅ Level 2 Conversion Checklist:"
echo "--------------------------------"
echo "  [ ] Identify API endpoints to pre-fetch"
echo "  [ ] Find Redux actions for data loading"
echo "  [ ] Check for data transformation logic (colors, sorting, etc.)"
echo "  [ ] Note any authentication/redirect logic"
echo "  [ ] Plan Client component structure"
echo ""
echo "📝 Next Steps:"
echo "  1. Create [PageName]Client.tsx file"
echo "  2. Convert page.tsx to Server Component"
echo "  3. Add server-side data fetching"
echo "  4. Create Redux hydration wrapper"
echo "  5. Test and validate"
echo ""
