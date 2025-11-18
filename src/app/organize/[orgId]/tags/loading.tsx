import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function TagsLoading() {
  return (
    <Box>
      {[1, 2, 3].map((i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                <Skeleton
                  key={j}
                  variant="rounded"
                  width={80}
                  height={32}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
