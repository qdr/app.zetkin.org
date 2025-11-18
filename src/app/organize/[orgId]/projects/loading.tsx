import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

export default function ProjectsLoading() {
  return (
    <Box>
      {/* Activities Overview Skeleton */}
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

      {/* Campaigns Grid Skeleton */}
      <Box mt={4}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ lg: 3, md: 4, xs: 12 }}>
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
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
