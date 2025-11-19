import { Box, Skeleton, useTheme } from '@mui/material';

export default function TagGroupsSkeleton() {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          padding={2}
          sx={{
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: 2,
          }}
        >
          <Box alignItems="center" display="flex" paddingBottom={1}>
            <Skeleton variant="text" width={150} height={32} sx={{ mr: 1 }} />
            <Skeleton variant="text" width={30} height={32} />
          </Box>
          <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton
                key={j}
                variant="rectangular"
                width={80}
                height={24}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
