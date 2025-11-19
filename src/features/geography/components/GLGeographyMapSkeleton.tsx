import { Box, Skeleton } from '@mui/material';

export default function GLGeographyMapSkeleton() {
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{ borderRadius: 1 }}
      />
    </Box>
  );
}
