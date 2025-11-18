import { FC } from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const MyActivitiesListSkeleton: FC = () => {
  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {/* Filter buttons skeleton */}
      <Box display="flex" gap={1}>
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={120} height={32} />
      </Box>

      {/* Activity items skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Title */}
              <Skeleton variant="text" width="60%" height={28} />

              {/* Info line */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>

              {/* Action button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyActivitiesListSkeleton;
