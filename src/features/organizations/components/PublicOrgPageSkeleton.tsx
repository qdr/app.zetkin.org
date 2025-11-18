import { FC } from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const PublicOrgPageSkeleton: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 1,
        height: '100%',
        my: 2,
      }}
    >
      {/* Filter buttons skeleton */}
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        maxWidth="100%"
        padding={1}
        sx={{ overflowX: 'auto' }}
      >
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={110} height={32} />
        <Skeleton variant="rounded" width={90} height={32} />
      </Box>

      {/* Events by date skeleton */}
      {[1, 2, 3].map((dateGroup) => (
        <Box key={dateGroup} paddingX={1}>
          {/* Date header */}
          <Box sx={{ mb: 2, mt: 3 }}>
            <Skeleton variant="text" width={150} height={32} />
          </Box>

          {/* Event items for this date */}
          <Box display="flex" flexDirection="column" gap={1}>
            {[1, 2].map((eventIndex) => (
              <Card key={eventIndex} sx={{ width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                    {/* Time */}
                    <Box sx={{ minWidth: 60 }}>
                      <Skeleton variant="text" width={50} height={24} />
                      <Skeleton variant="text" width={50} height={20} />
                    </Box>

                    {/* Event details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width="50%" height={20} />
                      </Box>
                      {/* Location */}
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}
                      >
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width="40%" height={20} />
                      </Box>
                    </Box>

                    {/* Signup status */}
                    <Box sx={{ minWidth: 100 }}>
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PublicOrgPageSkeleton;
