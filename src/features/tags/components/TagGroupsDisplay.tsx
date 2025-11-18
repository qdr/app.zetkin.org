'use client';

import { Suspense, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { groupTags } from './TagManager/utils';
import messageIds from '../l10n/messageIds';
import TagChip from './TagManager/components/TagChip';
import TagGroupsSkeleton from './TagGroupsSkeleton';
import useTags from '../hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface TagGroupsDisplayProps {
  orgId: number;
  onTagClick: (tag: ZetkinTag) => void;
}

function TagGroupsContent({ orgId, onTagClick }: TagGroupsDisplayProps) {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const tags = useTags(orgId).data;

  const groupedTags = groupTags(
    tags || [],
    messages.tagsPage.ungroupedHeader()
  );

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {groupedTags.length === 0 && (
        <Typography>
          <Msg id={messageIds.tagsPage.noTags} />
        </Typography>
      )}
      {groupedTags.map((group) => {
        return (
          <Box
            key={group.id}
            padding={2}
            sx={{
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 2,
            }}
          >
            <Box alignItems="center" display="flex" paddingBottom={1}>
              <Typography
                sx={{
                  borderRight: `1px solid ${theme.palette.grey[300]}`,
                  paddingRight: 1,
                }}
                variant="h5"
              >
                {group.title}
              </Typography>
              <Typography
                sx={{ color: theme.palette.primary.main, paddingLeft: 1 }}
                variant="h5"
              >
                {group.tags.length}
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
              {group.tags.map((tag) => (
                <TagChip
                  key={tag.id}
                  onClick={() => onTagClick(tag)}
                  tag={tag}
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default function TagGroupsDisplay({
  orgId,
  onTagClick,
}: TagGroupsDisplayProps) {
  return (
    <Suspense fallback={<TagGroupsSkeleton />}>
      <TagGroupsContent orgId={orgId} onTagClick={onTagClick} />
    </Suspense>
  );
}
