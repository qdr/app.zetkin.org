/* eslint-disable react/no-danger */
'use client';

import { useEffect, useMemo, useState } from 'react';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: React.HTMLAttributes<HTMLSpanElement>;
}

type DOMPurifyType = {
  sanitize: (dirty: string) => string;
};

const ZUICleanHtml = ({
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const [DOMPurify, setDOMPurify] = useState<DOMPurifyType | null>(null);

  useEffect(() => {
    // Dynamically import DOMPurify only on client side
    import('isomorphic-dompurify')
      .then((module) => {
        // Try different ways to access the DOMPurify instance
        let purify = null;

        // Try module.default first (ES module)
        if (module.default && typeof module.default.sanitize === 'function') {
          purify = module.default;
        }
        // Try module directly (CommonJS)
        else if (typeof module.sanitize === 'function') {
          purify = module as any;
        }
        // Try module.default() if it's a function that returns DOMPurify
        else if (typeof module.default === 'function') {
          const result = module.default();
          if (result && typeof result.sanitize === 'function') {
            purify = result;
          }
        }

        if (purify) {
          setDOMPurify(purify);
        } else {
          console.error('Could not find DOMPurify.sanitize in module:', module);
        }
      })
      .catch((err) => {
        console.error('Failed to load isomorphic-dompurify:', err);
      });
  }, []);

  const cleanHtml = useMemo(() => {
    if (!DOMPurify || typeof DOMPurify.sanitize !== 'function') return '';
    return DOMPurify.sanitize(dirtyHtml);
  }, [dirtyHtml, DOMPurify]);

  if (!DOMPurify) {
    // Return empty span while loading DOMPurify to avoid nesting issues
    return <span {...BoxProps} />;
  }

  // Use span instead of div to avoid invalid nesting in paragraphs
  return <span dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
