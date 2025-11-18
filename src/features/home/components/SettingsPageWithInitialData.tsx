'use client';

import { FC, useEffect } from 'react';

import { ZetkinUser } from 'utils/types/zetkin';
import { useAppDispatch } from 'core/hooks';
import { userLoaded } from 'features/user/store';
import AppPreferences from './AppPreferences';
import AccountSettings from './AccountSettings';

interface Props {
  user: ZetkinUser;
}

const SettingsPageWithInitialData: FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userLoaded(user));
  }, [user, dispatch]);

  return (
    <>
      <AppPreferences user={user} />
      <AccountSettings user={user} />
    </>
  );
};

export default SettingsPageWithInitialData;
