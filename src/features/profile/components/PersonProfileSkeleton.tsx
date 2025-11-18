import { Card, CardContent, Grid, Skeleton } from '@mui/material';

export default function PersonProfileSkeleton() {
  return (
    <Grid container direction="row" spacing={6}>
      {/* Map skeleton */}
      <Grid size={12}>
        <Skeleton variant="rectangular" width="100%" height="30vh" />
      </Grid>

      {/* Person details card */}
      <Grid size={{ lg: 4, xs: 12 }}>
        <Card>
          <CardContent>
            <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
          </CardContent>
        </Card>
      </Grid>

      {/* Tags card */}
      <Grid size={{ lg: 4, xs: 12 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid key={i}>
                  <Skeleton variant="rounded" width={80} height={32} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Journeys/Organizations cards */}
      <Grid size={{ lg: 4, xs: 12 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={140} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
