'use client';

import QuestionsWithInitialData from 'features/surveys/components/QuestionsWithInitialData';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { SurveyStats } from 'features/surveys/rpc/getSurveyStats';

interface QuestionsPageClientProps {
  campId: number | string;
  orgId: number;
  stats: SurveyStats;
  survey: ZetkinSurveyExtended;
  surveyId: number;
}

export default function QuestionsPageClient({
  campId,
  orgId,
  stats,
  survey,
  surveyId,
}: QuestionsPageClientProps) {
  return (
    <QuestionsWithInitialData
      campId={campId}
      orgId={orgId}
      stats={stats}
      survey={survey}
      surveyId={surveyId}
    />
  );
}
