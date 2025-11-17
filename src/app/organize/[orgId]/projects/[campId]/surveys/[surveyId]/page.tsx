'use client';

import { Grid } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';

import { getSurveyCampId } from 'features/surveys/utils/getSurveyUrl';
import SubmissionWarningAlert from 'features/surveys/components/SubmissionWarningAlert';
import SurveyLayout from 'features/surveys/layouts/SurveyLayout';
import SurveySubmissionsList from 'features/surveys/components/SurveySubmissionsList';
import SurveySuborgsCard from 'features/surveys/components/SurveySuborgsCard';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveySubmissions from 'features/surveys/hooks/useSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';

=> {
  const parsedOrg = parseInt(orgId);
  const surveyFuture = useSurvey(parsedOrg, parseInt(surveyId));
  const submissionsFuture = useSurveySubmissions(parsedOrg, parseInt(surveyId));

  const campaignId =
    getSurveyCampId(surveyFuture?.data, parsedOrg) || 'standalone';

  const params = useParams();
  const searchParams = useSearchParams();
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
            orgId={parseInt(orgId)}
            showUnlinkedOnly={showUnlinkedOnly}
            surveyId={parseInt(surveyId)}
          />

          {!isShared && (
            <SurveySuborgsCard
              orgId={parseInt(orgId)}
              surveyId={parseInt(surveyId)}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};


export default SubmissionsPage;
