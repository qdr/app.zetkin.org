'use client';

import { Grid } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

import { getSurveyCampId } from 'features/surveys/utils/getSurveyUrl';
import SubmissionWarningAlert from 'features/surveys/components/SubmissionWarningAlert';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySuborgsCard from 'features/surveys/components/SurveySuborgsCard';
import { useNumericRouteParams } from 'core/hooks';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveySubmissions from 'features/surveys/hooks/useSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';

const SubmissionsPage = () => {
  const { orgId, campId, surveyId } = useNumericRouteParams();
  const searchParams = useSearchParams();
  const showUnlinkedOnly = searchParams.get('filter') === 'true';
  const surveyFuture = useSurvey(orgId, surveyId);
  const submissionsFuture = useSurveySubmissions(orgId, surveyId);

  const campaignId = getSurveyCampId(surveyFuture?.data, orgId) || 'standalone';

  const router = useRouter();
  const isShared = campaignId === 'shared';

  return (
    <>
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
            <SurveySuborgsCard orgId={orgId} surveyId={surveyId} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default SubmissionsPage;
