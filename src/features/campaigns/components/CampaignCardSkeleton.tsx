import { Card, CardContent, Skeleton, Box } from '@mui/material';

export default function CampaignCardSkeleton() {
  return (
    <Card sx={{ height: '100%', minHeight: 200 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="60%" height={32} />
        </Box>
        <Skeleton variant="rectangular" height={80} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
}
