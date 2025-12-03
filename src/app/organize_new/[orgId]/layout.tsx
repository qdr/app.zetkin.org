import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import { headers } from 'next/headers';

import OrganizeSidebar from './components/OrganizeSidebar';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization, ZetkinUser } from 'utils/types/zetkin';

type Props = {
  children: ReactNode;
  params: {
    orgId: number;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const OrganizeLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  // Fetch organization data
  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  // Fetch user data
  let user: ZetkinUser | null = null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    // User not logged in
  }

  // Fetch all organizations for the dropdown
  let organizations: ZetkinOrganization[] = [];
  try {
    organizations = await apiClient.get<ZetkinOrganization[]>('/api/orgs');
  } catch (e) {
    organizations = [org]; // Fallback to current org
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <OrganizeSidebar
        org={org}
        user={user}
        organizations={organizations}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#FFFFFF',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default OrganizeLayout;
