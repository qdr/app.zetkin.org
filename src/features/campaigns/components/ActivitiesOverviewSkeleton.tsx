import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function ActivitiesOverviewSkeleton() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width={200} height={32} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ flex: '1 1 150px', minWidth: 120 }}>
              <Skeleton variant="rectangular" height={100} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
