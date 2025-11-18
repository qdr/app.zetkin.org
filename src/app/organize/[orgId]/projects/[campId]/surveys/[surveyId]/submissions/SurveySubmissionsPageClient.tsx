'use client';

import { FC } from 'react';
import { Grid } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { getSurveyCampId } from 'features/surveys/utils/getSurveyUrl';
import SubmissionWarningAlert from 'features/surveys/components/SubmissionWarningAlert';
import SurveyLayout from 'features/surveys/layouts/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySuborgsCard from 'features/surveys/components/SurveySuborgsCard';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveySubmissions from 'features/surveys/hooks/useSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';

interface SurveySubmissionsPageClientProps {
  orgId: number;
  surveyId: number;
}

const SurveySubmissionsPageClient: FC<SurveySubmissionsPageClientProps> = ({ orgId, surveyId }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const campId = params.campId as string;
  const showUnlinkedOnly = searchParams.get('filter') ? true : false;

  const surveyFuture = useSurvey(orgId, surveyId);
  const submissionsFuture = useSurveySubmissions(orgId, surveyId);

  const campaignId =
    getSurveyCampId(surveyFuture?.data, orgId) || 'standalone';

  const isShared = campaignId === 'shared';

  return (
    <SurveyLayout
      campId={campId}
      orgId={orgId.toString()}
      surveyId={surveyId.toString()}
    >
      <Grid container spacing={2}>
        <Grid size={{ md: isShared ? 12 : 8, sm: 12, xs: 12 }}>
          <ZUIFuture future={submissionsFuture} ignoreDataWhileLoading>
            {(data) => {
              let submissions = data;
              if (showUnlinkedOnly) {
                submissions = data.filter(
                  (sub) => sub.respondent && !sub.respondent.id
                );
                if (submissions.length === 0) {
                  router.push(
                    `/organize/${orgId}/projects/${campId}/surveys/${surveyId}/submissions`
                  );
                }
              }
              return submissions.length !== 0 || !showUnlinkedOnly ? (
                <SurveySubmissionsList submissions={submissions} />
              ) : null;
            }}
          </ZUIFuture>
        </Grid>
        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <SubmissionWarningAlert
            campId={campaignId}
            orgId={orgId}
            showUnlinkedOnly={showUnlinkedOnly}
            surveyId={surveyId}
          />

          {!isShared && (
            <SurveySuborgsCard
              orgId={orgId}
              surveyId={surveyId}
            />
          )}
        </Grid>
      </Grid>
    </SurveyLayout>
  );
};

export default SurveySubmissionsPageClient;
