'use client';

import SubmissionsWithInitialData from 'features/surveys/components/SubmissionsWithInitialData';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';

interface SubmissionsPageClientProps {
  campId: number;
  orgId: number;
  submissions: ZetkinSurveySubmission[];
  survey: ZetkinSurveyExtended;
  surveyId: number;
}

export default function SubmissionsPageClient({
  campId,
  orgId,
  submissions,
  survey,
  surveyId,
}: SubmissionsPageClientProps) {
  return (
    <SubmissionsWithInitialData
      campId={campId}
      orgId={orgId}
      submissions={submissions}
      survey={survey}
      surveyId={surveyId}
    />
  );
}
