'use client';

import { FC } from 'react';

import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';
import PublicSurveyPageWithInitialData from 'features/surveys/components/PublicSurveyPageWithInitialData';

interface Props {
  survey: ZetkinSurveyExtended;
  user: ZetkinUser | null;
}

const PublicSurveyPageClient: FC<Props> = ({ survey, user }) => {
  return <PublicSurveyPageWithInitialData survey={survey} user={user} />;
};

export default PublicSurveyPageClient;
