'use client';

import { FC } from 'react';
import { Grid, LinearProgress, Typography } from '@mui/material';

import { getCompletionPercentage } from 'features/journeys/components/JourneyMilestoneProgress';
import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyMilestoneCard from 'features/journeys/components/JourneyMilestoneCard';
import messageIds from 'features/journeys/l10n/messageIds';
import { Msg } from 'core/i18n';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import useJourneyInstanceMilestones from 'features/journeys/hooks/useJourneyInstanceMilestones';

interface MilestonesPageClientProps {
  orgId: number;
  instanceId: number;
}

const MilestonesPageClient: FC<MilestonesPageClientProps> = ({
  orgId,
  instanceId,
}) => {
  const journeyInstanceFuture = useJourneyInstance(orgId, instanceId);
  const milestonesFuture = useJourneyInstanceMilestones(orgId, instanceId);
  const journeyInstance = journeyInstanceFuture.data;
  const milestones = milestonesFuture.data || [];

  if (!journeyInstance) {
    return null;
  }

  const percentComplete = getCompletionPercentage(milestones);

  return (
    <JourneyInstanceLayout>
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
                <JourneyMilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                />
              ))}
            </>
          )}
        </Grid>
      </Grid>
    </JourneyInstanceLayout>
  );
};

export default MilestonesPageClient;
