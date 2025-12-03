import { FC } from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';

type Props = {
  params: {
    orgId: number;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const OrganizeHomePage: FC<Props> = async ({ params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" component="h1">
            {org.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to {org.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is the new organize interface prototype. Navigate using the sidebar to explore different sections.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { label: 'People', href: `/organize_new/${org.id}/people` },
              { label: 'Events', href: `/organize_new/${org.id}/events` },
              { label: 'Calls', href: `/organize_new/${org.id}/calls` },
              { label: 'Projects', href: `/organize_new/${org.id}/projects` },
            ].map((link) => (
              <Box
                key={link.href}
                component="a"
                href={link.href}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  textDecoration: 'none',
                  color: 'text.primary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {link.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default OrganizeHomePage;
