'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';

import DuplicateCard from 'features/duplicates/components/DuplicateCard';
import messageIds from 'features/duplicates/l10n/messageIds';
import oldTheme from 'theme';
import useDuplicates from 'features/duplicates/hooks/useDuplicates';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

const DuplicatesPage = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const list = useDuplicates(orgId);
  const messages = useMessages(messageIds);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [page, setPage] = useState(
    searchParams.get('page') !== null ? Number(searchParams.get('page')) : 1
  );
  const pageSize = 100;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `${window.location.protocol}//${window.location.host}${pathname}?page=${page}`;
    window.history.replaceState({}, '', url);
  }, [page, pathname]);

  if (onServer) {
    return null;
  }

  const filteredData =
    list.data?.filter((cluster) => cluster.status === 'pending') ?? [];
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <>
      {list.isLoading && (
        <Box display="flex" justifyContent="center" m={2}>
          <CircularProgress />
        </Box>
      )}
      {!list.isLoading && list.data?.length === 0 && (
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
      )}
      {totalItems > 0 && (
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
      )}
    </>
  );
};

export default DuplicatesPage;
