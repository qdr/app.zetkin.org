/* eslint-disable react/no-danger */
'use client';

import { Box, BoxProps } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
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
        // isomorphic-dompurify default export is the DOMPurify instance
        const purify = module.default;
        if (purify && typeof purify.sanitize === 'function') {
          setDOMPurify(purify);
        } else {
          console.error('DOMPurify.sanitize is not a function:', purify);
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
    // Return empty while loading DOMPurify
    return <Box {...BoxProps} />;
  }

  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
