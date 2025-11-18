'use client';

import { useContext, useState } from 'react';

import messageIds from 'features/tags/l10n/messageIds';
import TagDialog from 'features/tags/components/TagManager/components/TagDialog';
import TagGroupsDisplay from 'features/tags/components/TagGroupsDisplay';
import useDeleteTag from 'features/tags/hooks/useDeleteTag';
import { useNumericRouteParams } from 'core/hooks';
import useTagGroups from 'features/tags/hooks/useTagGroups';
import useTagMutations from 'features/tags/hooks/useTagMutations';
import { ZetkinTag } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { useMessages } from 'core/i18n';

const TagsPage = () => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const tagGroups = useTagGroups(orgId).data || [];
  const deleteTag = useDeleteTag(orgId);
  const { updateTag } = useTagMutations(orgId);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [tagToEdit, setTagToEdit] = useState<ZetkinTag | undefined>(undefined);

  return (
    <>
      <TagGroupsDisplay orgId={orgId} onTagClick={setTagToEdit} />

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
};

export default TagsPage;
