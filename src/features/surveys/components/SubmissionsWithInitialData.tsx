'use client';

import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { getSurveyCampId } from '../utils/getSurveyUrl';
import SubmissionWarningAlert from './SubmissionWarningAlert';
import SurveySubmissionsList from './SurveySubmissionsList';
import SurveySuborgsCard from './SurveySuborgsCard';
import { surveyLoaded, surveySubmissionsLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';

interface SubmissionsWithInitialDataProps {
  campId: number;
  orgId: number;
  submissions: ZetkinSurveySubmission[];
  survey: ZetkinSurveyExtended;
  surveyId: number;
}

export default function SubmissionsWithInitialData({
  campId,
  orgId,
  submissions,
  survey,
  surveyId,
}: SubmissionsWithInitialDataProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const showUnlinkedOnly = searchParams.get('filter') === 'true';
  const router = useRouter();

  useEffect(() => {
    dispatch(surveyLoaded(survey));
    dispatch(surveySubmissionsLoaded([surveyId, submissions]));
  }, [survey, surveyId, submissions, dispatch]);

  const campaignId = getSurveyCampId(survey, orgId) || 'standalone';
  const isShared = campaignId === 'shared';

  let filteredSubmissions = submissions;
  if (showUnlinkedOnly) {
    filteredSubmissions = submissions.filter(
      (sub) => sub.respondent && !sub.respondent.id
    );
    if (filteredSubmissions.length === 0) {
      router.push(
        `/organize/${orgId}/projects/${campId}/surveys/${surveyId}/submissions`
      );
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: isShared ? 12 : 8, sm: 12, xs: 12 }}>
        {filteredSubmissions.length !== 0 || !showUnlinkedOnly ? (
          <SurveySubmissionsList submissions={filteredSubmissions} />
        ) : null}
      </Grid>
      <Grid size={{ md: 4, sm: 12, xs: 12 }}>
        <SubmissionWarningAlert
          campId={campaignId}
          orgId={orgId}
          showUnlinkedOnly={showUnlinkedOnly}
          surveyId={surveyId}
        />

        {!isShared && <SurveySuborgsCard orgId={orgId} surveyId={surveyId} />}
      </Grid>
    </Grid>
  );
}
