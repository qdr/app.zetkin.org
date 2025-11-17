'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useContext, useState } from 'react';

import { groupTags } from 'features/tags/components/TagManager/utils';
import messageIds from 'features/tags/l10n/messageIds';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import TagDialog from 'features/tags/components/TagManager/components/TagDialog';
import TagsLayout from 'features/tags/layout/TagsLayout';
import useDeleteTag from 'features/tags/hooks/useDeleteTag';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import useTagMutations from 'features/tags/hooks/useTagMutations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { Msg, useMessages } from 'core/i18n';

}
        <TagDialog
          groups={tagGroups}
          onClose={() => setTagToEdit(undefined)}
          onDelete={(tagId) => {
            showConfirmDialog({
              onSubmit: () => {
                deleteTag(tagId);
              },
              warningText: messages.dialog.deleteWarning(),
            });
          }}
          onSubmit={(tag) => {
            if ('id' in tag) {
              updateTag(tag);
            }
          }}
          open={!!tagToEdit}
          tag={tagToEdit}
        />
      </Box>
    </>
  );
};


export default TagsPage;
