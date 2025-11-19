'use client';

import { Box, Grid } from '@mui/material';
import { useEffect } from 'react';

import EmptyOverview from './EmptyOverview';
import SubmissionChartCard from './SubmissionChartCard';
import SurveyUnlinkedCard from './SurveyUnlinkedCard';
import SurveyURLCard from './SurveyURLCard';
import { elementsLoaded, surveyLoaded } from '../store';
import { SurveyState } from '../hooks/useSurveyState';
import { useAppDispatch } from 'core/hooks';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

interface SurveyOverviewWithInitialDataProps {
  campId: string;
  orgId: number;
  survey: ZetkinSurveyExtended;
  surveyId: number;
}

export default function SurveyOverviewWithInitialData({
  campId,
  orgId,
  survey,
  surveyId,
}: SurveyOverviewWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(surveyLoaded(survey));
    dispatch(elementsLoaded([surveyId, survey.elements]));
  }, [survey, surveyId, dispatch]);

  const surveyIsEmpty = !survey.elements || survey.elements.length === 0;

  // Calculate survey state
  let state = SurveyState.DRAFT;
  if (survey.published) {
    const publishDate = new Date(survey.published);
    const now = new Date();

    if (publishDate > now) {
      state = SurveyState.SCHEDULED;
    } else {
      if (survey.expires) {
        const expiryDate = new Date(survey.expires);
        if (expiryDate < now) {
          state = SurveyState.UNPUBLISHED;
        } else {
          state = SurveyState.PUBLISHED;
        }
      } else {
        state = SurveyState.PUBLISHED;
      }
    }
  }

  const isOpen = state === SurveyState.PUBLISHED;

  return (
    <Box>
      {surveyIsEmpty ? (
        <EmptyOverview campId={campId} orgId={orgId} surveyId={surveyId} />
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ md: 8 }}>
            <SubmissionChartCard orgId={orgId} surveyId={surveyId} />
          </Grid>
          <Grid size={{ md: 4 }}>
            <SurveyURLCard
              isOpen={isOpen}
              orgId={survey.organization.id.toString()}
              surveyId={surveyId.toString()}
            />
            <SurveyUnlinkedCard
              campId={
                campId !== 'shared' && campId !== 'standalone'
                  ? parseInt(campId)
                  : campId
              }
              orgId={orgId}
              surveyId={surveyId}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
