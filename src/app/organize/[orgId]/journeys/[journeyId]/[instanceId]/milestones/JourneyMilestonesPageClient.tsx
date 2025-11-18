'use client';

import { useEffect } from 'react';
import { Grid, LinearProgress, Typography } from '@mui/material';

import { getCompletionPercentage } from 'features/journeys/components/JourneyMilestoneProgress';
import JourneyMilestoneCard from 'features/journeys/components/JourneyMilestoneCard';
import messageIds from 'features/journeys/l10n/messageIds';
import {
  journeyInstanceLoaded,
  milestonesLoaded,
} from 'features/journeys/store';
import { Msg } from 'core/i18n';
import { useAppDispatch } from 'core/hooks';
import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
} from 'utils/types/zetkin';

interface JourneyMilestonesPageClientProps {
  instance: ZetkinJourneyInstance;
  instanceId: number;
  milestones: ZetkinJourneyMilestoneStatus[];
  orgId: number;
}

export default function JourneyMilestonesPageClient({
  instance,
  instanceId,
  milestones,
}: JourneyMilestonesPageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(journeyInstanceLoaded(instance));
    dispatch(milestonesLoaded([instanceId, milestones]));
  }, [instance, instanceId, milestones, dispatch]);

  const percentComplete = getCompletionPercentage(milestones);

  return (
    <Grid container justifyContent="space-between" spacing={2}>
      <Grid size={{ lg: 8, md: 10, xl: 6, xs: 12 }}>
        {milestones.length === 0 ? (
          <Typography data-testid="JourneyMilestoneCard-noMilestones">
            <Msg id={messageIds.instance.noMilestones} />
          </Typography>
        ) : (
          <>
            <Typography
              style={{
                padding: '1rem 0 1rem 0',
              }}
              variant="h4"
            >
              <Msg
                id={messageIds.instance.percentComplete}
                values={{ percentComplete }}
              />
            </Typography>
            <LinearProgress value={percentComplete} variant="determinate" />
            {milestones.map((milestone) => (
              <JourneyMilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </>
        )}
      </Grid>
    </Grid>
  );
}
