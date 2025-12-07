import { FC } from 'react';
import { Box, Container } from '@mui/material';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';

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

  const quickLinks = [
    { label: 'People', href: `/organize_new/${org.id}/people` },
    { label: 'Events', href: `/organize_new/${org.id}/events` },
    { label: 'Calls', href: `/organize_new/${org.id}/calls` },
    { label: 'Projects', href: `/organize_new/${org.id}/projects` },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2,
        }}
      >
        <ZUIText variant="headingMd" component="h1">
          {org.title}
        </ZUIText>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ZUIText variant="headingLg" gutterBottom>
          Welcome to {org.title}
        </ZUIText>

        <ZUIText variant="bodyMdRegular" color="secondary" sx={{ mb: 4 }}>
          This is the new organize interface prototype. Navigate using the sidebar to explore different sections.
        </ZUIText>

        {/* Quick Links Section */}
        <Box sx={{ mt: 4 }}>
          <ZUIText variant="headingSm" gutterBottom>
            Quick Links
          </ZUIText>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 2,
              mt: 2,
            }}
          >
            {quickLinks.map((link) => (
              <Box
                key={link.href}
                component="a"
                href={link.href}
                sx={(theme) => ({
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                  },
                })}
              >
                <ZUIText variant="bodyMdSemiBold" color="primary">
                  {link.label}
                </ZUIText>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recent Activity Placeholder */}
        <Box sx={{ mt: 6 }}>
          <ZUIText variant="headingSm" gutterBottom>
            Recent Activity
          </ZUIText>

          <Box
            sx={(theme) => ({
              mt: 2,
              p: 4,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: theme.palette.divider,
              textAlign: 'center',
            })}
          >
            <ZUIText variant="bodyMdRegular" color="secondary">
              Recent activity will appear here
            </ZUIText>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default OrganizeHomePage;
