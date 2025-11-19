import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function ProjectLoading() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Filter buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto' }}>
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={110} height={32} />
      </Box>

      {/* Events grouped by date */}
      {[1, 2, 3].map((group) => (
        <Box key={group} sx={{ mb: 3 }}>
          {/* Date header */}
          <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />

          {/* Event cards */}
          {[1, 2].map((event) => (
            <Card key={event} sx={{ mb: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Time */}
                  <Box sx={{ minWidth: 60 }}>
                    <Skeleton variant="text" width={50} height={24} />
                  </Box>

                  {/* Event details */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>

                  {/* Status */}
                  <Skeleton variant="rectangular" width={80} height={36} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}
    </Box>
  );
}
