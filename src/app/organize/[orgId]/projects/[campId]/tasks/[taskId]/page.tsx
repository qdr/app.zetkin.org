'use client';

import { Grid } from '@mui/material';

import TaskDetailsSection from 'features/tasks/components/TaskDetailsSection';
import TaskPreviewSection from 'features/tasks/components/TaskPreviewSection';
import { useNumericRouteParams } from 'core/hooks';
import useTask from 'features/tasks/hooks/useTask';

const TaskDetailPage = () => {
  const { orgId, taskId } = useNumericRouteParams();
  const task = useTask(orgId, taskId);

  if (!task) {
    return null;
  }

  return (
    <>
            <Grid container justifyContent="space-between" spacing={4}>
        <Grid size={{ lg: 6, md: 6, xs: 12 }}>
          <TaskDetailsSection task={task} />
        </Grid>
        <Grid size={{ lg: 4, md: 6, xs: 12 }}>
          <TaskPreviewSection task={task} />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskDetailPage;
