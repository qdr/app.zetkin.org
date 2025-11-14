'use client';

import { Grid, LinearProgress, Typography } from '@mui/material';

import { getCompletionPercentage } from 'features/journeys/components/JourneyMilestoneProgress';
import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyMilestoneCard from 'features/journeys/components/JourneyMilestoneCard';
import messageIds from 'features/journeys/l10n/messageIds';
import { Msg } from 'core/i18n';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import useJourneyInstanceMilestones from 'features/journeys/hooks/useJourneyInstanceMilestones';
import { useParams } from 'next/navigation';



export default JourneyMilestonesPage;
