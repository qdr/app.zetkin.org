'use client';

import { FC, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { AccountTree } from '@mui/icons-material';

import ZUIText from 'zui/components/ZUIText';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';

type Props = {
  params: {
    orgId: number;
  };
};

const ProjectsPage: FC<Props> = ({ params }) => {
  const router = useRouter();
  const campaignsFuture = useCampaigns(params.orgId);
  const campaigns = campaignsFuture.data || [];
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show all campaigns (no filter for now - all campaigns are visible)
  const publicCampaigns = campaigns;

  // Don't render until mounted on client to avoid hydration errors
  if (!mounted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <ZUIText variant="headingLg" gutterBottom>
            Projects
          </ZUIText>
        </Box>
      </Container>
    );
  }

  // Show loading state
  if (campaignsFuture.isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <ZUIText variant="headingLg" gutterBottom>
            Projects
          </ZUIText>
          <ZUIText variant="bodyMdRegular" color="secondary">
            Loading projects...
          </ZUIText>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <ZUIText variant="headingLg" gutterBottom>
          Projects
        </ZUIText>
        <ZUIText variant="bodyMdRegular" color="secondary">
          Explore all active projects in this organization
        </ZUIText>
      </Box>

      {publicCampaigns.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <AccountTree sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <ZUIText variant="headingSm" color="secondary" gutterBottom>
            No projects yet
          </ZUIText>
          <ZUIText variant="bodySmRegular" color="secondary">
            This organization hasn&apos;t created any public projects
          </ZUIText>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {publicCampaigns.map((campaign) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={campaign.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() =>
                    router.push(`/organize_new/${params.orgId}/projects/${campaign.id}`)
                  }
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ height: '100%', p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          backgroundColor: campaign.color || 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AccountTree sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <ZUIText variant="bodyMdSemiBold" gutterBottom>
                          {campaign.title}
                        </ZUIText>
                        {campaign.manager && (
                          <ZUIText variant="bodySmRegular" color="secondary">
                            Managed by {campaign.manager.name}
                          </ZUIText>
                        )}
                      </Box>
                    </Box>
                    {campaign.info_text && (
                      <Box
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        <ZUIText variant="bodySmRegular" color="secondary">
                          {campaign.info_text}
                        </ZUIText>
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectsPage;
