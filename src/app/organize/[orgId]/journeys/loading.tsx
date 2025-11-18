import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

export default function JourneysLoading() {
  return (
    <Box>
      <Skeleton variant="text" width={250} height={40} sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid key={i} size={{ lg: 4, md: 6, xs: 12 }}>
            <Card sx={{ height: '100%', minHeight: 180 }}>
              <CardContent>
                <Skeleton variant="text" width="70%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={100} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
