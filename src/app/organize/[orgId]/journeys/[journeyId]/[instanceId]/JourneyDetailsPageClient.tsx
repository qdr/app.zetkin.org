'use client';

import { useEffect, useState } from 'react';
import { Box, Divider, Grid } from '@mui/material';

import JourneyInstanceOutcome from 'features/journeys/components/JourneyInstanceOutcome';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'features/journeys/components/JourneyInstanceSummary';
import messageIds from 'features/journeys/l10n/messageIds';
import {
  journeyInstanceLoaded,
  timelineUpdatesLoaded,
} from 'features/journeys/store';
import useJourneyInstanceMutations from 'features/journeys/hooks/useJourneyInstanceMutations';
import { useAppDispatch } from 'core/hooks';
import { useMessages } from 'core/i18n';
import useTimelineNote from 'features/journeys/hooks/useTimelineNotes';
import {
  ZetkinJourneyInstance,
  ZetkinUpdate,
} from 'utils/types/zetkin';
import ZUISection from 'zui/ZUISection';
import ZUITimeline from 'zui/ZUITimeline';

interface JourneyDetailsPageClientProps {
  instance: ZetkinJourneyInstance;
  instanceId: number;
  orgId: number;
  timelineUpdates: ZetkinUpdate[];
}

export default function JourneyDetailsPageClient({
  instance,
  instanceId,
  orgId,
  timelineUpdates,
}: JourneyDetailsPageClientProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const [isLoading, setIsLoading] = useState(false);

  const { addNote, editNote } = useTimelineNote(orgId, instanceId);
  const {
    addAssignee,
    addSubject,
    assignTag,
    removeAssignee,
    removeSubject,
    unassignTag,
  } = useJourneyInstanceMutations(orgId, instanceId);

  useEffect(() => {
    dispatch(journeyInstanceLoaded(instance));
    dispatch(timelineUpdatesLoaded([timelineUpdates, instanceId]));
  }, [instance, timelineUpdates, instanceId, dispatch]);

  return (
    <Grid container justifyContent="space-between" spacing={3}>
      <Grid size={{ lg: 6, md: 7, xl: 5, xs: 12 }}>
        <JourneyInstanceSummary journeyInstance={instance} />
        {instance.closed && (
          <JourneyInstanceOutcome journeyInstance={instance} />
        )}
        <Box mb={3} mt={4}>
          <Divider />
        </Box>
        <ZUISection title={messages.instance.sections.timeline()}>
          <ZUITimeline
            disabled={isLoading}
            onAddNote={async (note) => {
              setIsLoading(true);
              await addNote(note);
              setIsLoading(false);
            }}
            onEditNote={editNote}
            updates={timelineUpdates}
          />
        </ZUISection>
      </Grid>
      <Grid size={{ lg: 4, md: 4, xs: 12 }}>
        <JourneyInstanceSidebar
          journeyInstance={instance}
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
  );
}
