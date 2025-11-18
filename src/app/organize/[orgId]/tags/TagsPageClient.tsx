'use client';

import { useContext, useState } from 'react';

import messageIds from 'features/tags/l10n/messageIds';
import TagDialog from 'features/tags/components/TagManager/components/TagDialog';
import TagGroupsDisplayWithInitialData from 'features/tags/components/TagGroupsDisplayWithInitialData';
import useDeleteTag from 'features/tags/hooks/useDeleteTag';
import useTagMutations from 'features/tags/hooks/useTagMutations';
import { ZetkinTag } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { useMessages } from 'core/i18n';

interface TagsPageClientProps {
  orgId: number;
  tagGroups: ZetkinTag[];
  tags: ZetkinTag[];
}

export default function TagsPageClient({
  orgId,
  tagGroups,
  tags,
}: TagsPageClientProps) {
  const messages = useMessages(messageIds);
  const deleteTag = useDeleteTag(orgId);
  const { updateTag } = useTagMutations(orgId);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [tagToEdit, setTagToEdit] = useState<ZetkinTag | undefined>(undefined);

  return (
    <>
      <TagGroupsDisplayWithInitialData
        orgId={orgId}
        onTagClick={setTagToEdit}
        tagGroups={tagGroups}
        tags={tags}
      />

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
    </>
  );
}
