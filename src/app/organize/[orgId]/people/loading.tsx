import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function PeopleLoading() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={400} />
      </CardContent>
    </Card>
  );
}
