/* eslint-disable react/no-danger */
'use client';

import { Box, BoxProps } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

interface ZUICleanHtmlProps {
  dirtyHtml: string;
  BoxProps?: BoxProps;
}

const ZUICleanHtml = ({
  BoxProps,
  dirtyHtml,
}: ZUICleanHtmlProps): JSX.Element => {
  const [DOMPurify, setDOMPurify] = useState<any>(null);

  useEffect(() => {
    // Dynamically import DOMPurify only on client side
    import('isomorphic-dompurify').then((module) => {
      setDOMPurify(module.default);
    });
  }, []);

  const cleanHtml = useMemo(() => {
    if (!DOMPurify) return '';
    return DOMPurify.sanitize(dirtyHtml);
  }, [dirtyHtml, DOMPurify]);

  if (!DOMPurify) {
    // Return empty while loading DOMPurify
    return <Box {...BoxProps} />;
  }

  return <Box dangerouslySetInnerHTML={{ __html: cleanHtml }} {...BoxProps} />;
};

export default ZUICleanHtml;
