import { Card, CardContent, Skeleton, Box } from '@mui/material';

export default function JourneyCardSkeleton() {
  return (
    <Card sx={{ height: '100%', minHeight: 220 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="70%" height={28} />
        </Box>
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </CardContent>
    </Card>
  );
}
