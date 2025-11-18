import { getServerApiClient } from 'core/api/server';
import { ZetkinTag } from 'utils/types/zetkin';
import TagsPageClient from './TagsPageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

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
                    onClick={() => setTagToEdit(tag)}
                    tag={tag}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
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
    <>
      <TagGroupsDisplay orgId={orgId} onTagClick={setTagToEdit} />
// Server Component - pre-fetches tag groups and tags data for faster initial render
export default async function TagsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  // Pre-fetch tag groups and tags data on server (in parallel)
  const apiClient = await getServerApiClient();
  const [tagGroups, tags] = await Promise.all([
    apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/tag_groups`),
    apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/tags`),
  ]);

  return <TagsPageClient orgId={orgId} tagGroups={tagGroups} tags={tags} />;
}
