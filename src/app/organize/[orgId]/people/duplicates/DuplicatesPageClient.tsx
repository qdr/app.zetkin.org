'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Box, Pagination, Typography } from '@mui/material';

import DuplicateCard from 'features/duplicates/components/DuplicateCard';
import messageIds from 'features/duplicates/l10n/messageIds';
import oldTheme from 'theme';
import {
  potentialDuplicatesLoaded,
  PotentialDuplicate,
} from 'features/duplicates/store';
import { useAppDispatch } from 'core/hooks';
import { useMessages } from 'core/i18n';

interface DuplicatesPageClientProps {
  duplicates: PotentialDuplicate[];
  orgId: number;
}

export default function DuplicatesPageClient({
  duplicates,
}: DuplicatesPageClientProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [page, setPage] = useState(
    searchParams.get('page') !== null ? Number(searchParams.get('page')) : 1
  );
  const pageSize = 100;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(potentialDuplicatesLoaded(duplicates));
  }, [duplicates, dispatch]);

  useEffect(() => {
    const url = `${window.location.protocol}//${window.location.host}${pathname}?page=${page}`;
    window.history.replaceState({}, '', url);
  }, [page, pathname]);

  const totalItems = duplicates.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = duplicates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (duplicates.length === 0) {
    return (
      <Box m={2}>
        <Typography variant="overline">
          {messages.page.noDuplicates()}
        </Typography>
        <Typography variant="body1">
          {messages.page.noDuplicatesDescription()}
          <br />
          <br />
          {messages.page.noDuplicatesContactUs()}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        p: 1.5,
      }}
    >
      <Typography
        color={oldTheme.palette.grey[500]}
        sx={{ mb: 2, textTransform: 'uppercase' }}
        variant="subtitle2"
      >
        {messages.page.possibleDuplicates()}
      </Typography>

      {paginatedData.map((cluster) => (
        <DuplicateCard key={cluster.id} cluster={cluster} />
      ))}

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          onChange={(_, value) => {
            setPage(value);
            containerRef?.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          page={page}
        />
      </Box>
    </Box>
  );
}
