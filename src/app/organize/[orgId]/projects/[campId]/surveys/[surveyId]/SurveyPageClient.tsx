'use client';

import { FC } from 'react';
import { Box, Grid } from '@mui/material';
import { useParams } from 'next/navigation';

import EmptyOverview from 'features/surveys/components/EmptyOverview';
import SubmissionChartCard from 'features/surveys/components/SubmissionChartCard';
import SurveyLayout from 'features/surveys/layouts/SurveyLayout';
import SurveyUnlinkedCard from 'features/surveys/components/SurveyUnlinkedCard';
import SurveyURLCard from 'features/surveys/components/SurveyURLCard';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import useSurveyState, {
  SurveyState,
} from 'features/surveys/hooks/useSurveyState';

interface SurveyPageClientProps {
  orgId: number;
  surveyId: number;
}

const SurveyPageClient: FC<SurveyPageClientProps> = ({ orgId, surveyId }) => {
  const params = useParams();
  const campId = params.campId as string;

  const { data: survey } = useSurvey(orgId, surveyId);
  const state = useSurveyState(orgId, surveyId);
  const { surveyIsEmpty } = useSurveyElements(orgId, surveyId);

  const isOpen = state === SurveyState.PUBLISHED;

  if (!survey) {
    return null;
  }

  return (
    <SurveyLayout
      campId={campId}
      orgId={orgId.toString()}
      surveyId={surveyId.toString()}
    >
      <Box>
        {surveyIsEmpty ? (
          <EmptyOverview campId={campId} orgId={orgId.toString()} surveyId={surveyId.toString()} />
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ md: 8 }}>
              <SubmissionChartCard
                orgId={orgId}
                surveyId={surveyId}
              />
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
    </SurveyLayout>
  );
};

export default SurveyPageClient;
