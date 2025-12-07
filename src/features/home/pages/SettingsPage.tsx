'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AppPreferences from '../components/AppPreferences';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AccountSettings from '../components/AccountSettings';
import MyMemberships from '../components/MyMemberships';

const AllEventsPage: FC = () => {
  const user = useCurrentUser();

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      {user && (
        <>
          <MyMemberships />
          <AppPreferences user={user} />
          <AccountSettings user={user} />
        </>
      )}
    </Suspense>
  );
};

export default AllEventsPage;
