import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function EventLoading() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Card>
        <CardContent>
          {/* Event header */}
          <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />

          {/* Date and time */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={24} />
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={250} height={24} />
          </Box>

          {/* Organization */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={180} height={24} />
          </Box>

          {/* Map skeleton */}
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 3 }} />

          {/* Description */}
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" sx={{ mb: 3 }} />

          {/* Action button */}
          <Skeleton variant="rectangular" width={150} height={44} />
        </CardContent>
      </Card>
    </Box>
  );
}
