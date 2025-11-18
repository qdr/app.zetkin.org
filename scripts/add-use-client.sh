#!/bin/bash
# Add 'use client' directive to files that need it
# Usage: ./scripts/add-use-client.sh path/to/file.tsx

for file in "$@"; do
  if [ -f "$file" ]; then
    # Check if file doesn't already have 'use client'
    if ! grep -q "'use client'" "$file"; then
      # Add 'use client' at the top
      echo "'use client';
" | cat - "$file" > temp && mv temp "$file"
      echo "Added 'use client' to: $file"
    else
      echo "Already has 'use client': $file"
    fi
  fi
done
