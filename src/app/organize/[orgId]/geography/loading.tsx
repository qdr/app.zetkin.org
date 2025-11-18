import { Box, Skeleton } from '@mui/material';

export default function GeographyLoading() {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={600}
        sx={{ borderRadius: 1 }}
      />
    </Box>
  );
}
