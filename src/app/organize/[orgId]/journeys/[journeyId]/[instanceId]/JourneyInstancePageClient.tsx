'use client';

import { FC, useState } from 'react';
import { Box, Divider, Grid } from '@mui/material';

import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyInstanceOutcome from 'features/journeys/components/JourneyInstanceOutcome';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'features/journeys/components/JourneyInstanceSummary';
import messageIds from 'features/journeys/l10n/messageIds';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import useJourneyInstanceMutations from 'features/journeys/hooks/useJourneyInstanceMutations';
import { useMessages } from 'core/i18n';
import useTimelineNote from 'features/journeys/hooks/useTimelineNotes';
import useTimelineUpdates from 'features/journeys/hooks/useTimelineUpdates';
import { ZetkinUpdate } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISection from 'zui/ZUISection';
import ZUITimeline from 'zui/ZUITimeline';

interface JourneyInstancePageClientProps {
  orgId: number;
  instanceId: number;
}

const JourneyInstancePageClient: FC<JourneyInstancePageClientProps> = ({
  orgId,
  instanceId,
}: JourneyInstancePageClientProps) => {
  const messages = useMessages(messageIds);
  const [isLoading, setIsLoading] = useState(false);

  const journeyInstanceFuture = useJourneyInstance(orgId, instanceId);
  const timelineUpdatesFuture = useTimelineUpdates(orgId, instanceId);
  const { addNote, editNote } = useTimelineNote(orgId, instanceId);
  const {
    addAssignee,
    addSubject,
    assignTag,
    removeAssignee,
    removeSubject,
    unassignTag,
  } = useJourneyInstanceMutations(orgId, instanceId);

  const journeyInstance = journeyInstanceFuture.data;
  if (!journeyInstance) {
    return null;
  }

  return (
    <JourneyInstanceLayout>
      <Grid container justifyContent="space-between" spacing={3}>
        <Grid size={{ lg: 6, md: 7, xl: 5, xs: 12 }}>
          <JourneyInstanceSummary journeyInstance={journeyInstance} />
          {journeyInstance.closed && (
            <JourneyInstanceOutcome journeyInstance={journeyInstance} />
          )}
          <Box mb={3} mt={4}>
            <Divider />
          </Box>
          <ZUISection title={messages.instance.sections.timeline()}>
            <ZUIFuture future={timelineUpdatesFuture}>
              {(updates: ZetkinUpdate[]) => (
                <ZUITimeline
                  disabled={isLoading}
                  onAddNote={async (note: string) => {
                    setIsLoading(true);
                    await addNote(note);
                    setIsLoading(false);
                  }}
                  onEditNote={editNote}
                  updates={updates}
                />
              )}
            </ZUIFuture>
          </ZUISection>
        </Grid>
        <Grid size={{ lg: 4, md: 4, xs: 12 }}>
          <JourneyInstanceSidebar
            journeyInstance={journeyInstance}
            onAddAssignee={addAssignee}
            onAddSubject={addSubject}
            onAssignTag={(tag) => {
              assignTag({
                id: tag.id,
                value: tag.value,
              });
            }}
            onRemoveAssignee={removeAssignee}
            onRemoveSubject={removeSubject}
            onTagEdited={() => {
              //TODO: Mark tag as stale
            }}
            onUnassignTag={(tag) => {
              unassignTag(tag.id);
            }}
          />
        </Grid>
      </Grid>
    </JourneyInstanceLayout>
  );
};

export default JourneyInstancePageClient;
