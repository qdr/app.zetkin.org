'use client';

import { FC, useEffect } from 'react';

import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';
import { useAppDispatch } from 'core/hooks';
import { surveysLoaded } from '../store';
import { userLoaded } from 'features/user/store';
import PublicSurveyPage from '../pages/PublicSurveyPage';

interface Props {
  survey: ZetkinSurveyExtended;
  user: ZetkinUser | null;
}

const PublicSurveyPageWithInitialData: FC<Props> = ({ survey, user }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(surveysLoaded([survey]));
    if (user) {
      dispatch(userLoaded(user));
    }
  }, [survey, user, dispatch]);

  return <PublicSurveyPage survey={survey} user={user} />;
};

export default PublicSurveyPageWithInitialData;
