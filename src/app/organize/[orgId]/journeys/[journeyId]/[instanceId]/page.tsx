'use client';

import { useState } from 'react';
import { Box, Divider, Grid } from '@mui/material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyInstanceOutcome from 'features/journeys/components/JourneyInstanceOutcome';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'features/journeys/components/JourneyInstanceSummary';
import messageIds from 'features/journeys/l10n/messageIds';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import useJourneyInstanceMutations from 'features/journeys/hooks/useJourneyInstanceMutations';
import { useMessages } from 'core/i18n';
import { useParams } from 'next/navigation';
import useTimelineNote from 'features/journeys/hooks/useTimelineNotes';
import useTimelineUpdates from 'features/journeys/hooks/useTimelineUpdates';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISection from 'zui/ZUISection';
import ZUITimeline from 'zui/ZUITimeline';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';


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
    </>
  );
};


export default JourneyDetailsPage;
