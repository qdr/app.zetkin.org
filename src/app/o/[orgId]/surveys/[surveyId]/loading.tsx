import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function SurveyLoading() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
      <Card>
        <CardContent>
          {/* Survey title */}
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />

          {/* Survey description */}
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" sx={{ mb: 4 }} />

          {/* Form fields */}
          {[1, 2, 3, 4].map((field) => (
            <Box key={field} sx={{ mb: 3 }}>
              <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} />
            </Box>
          ))}

          {/* Submit button */}
          <Skeleton variant="rectangular" width={120} height={44} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    </Box>
  );
}
