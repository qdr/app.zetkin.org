'use client';

import SurveyOverviewWithInitialData from 'features/surveys/components/SurveyOverviewWithInitialData';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

interface SurveyOverviewPageClientProps {
  campId: string;
  orgId: number;
  survey: ZetkinSurveyExtended;
  surveyId: number;
}

export default function SurveyOverviewPageClient({
  campId,
  orgId,
  survey,
  surveyId,
}: SurveyOverviewPageClientProps) {
  return (
    <SurveyOverviewWithInitialData
      campId={campId}
      orgId={orgId}
      survey={survey}
      surveyId={surveyId}
    />
  );
}
