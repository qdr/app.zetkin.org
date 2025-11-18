'use client';

import { useEffect } from 'react';
import { Grid } from '@mui/material';

import TaskDetailsSection from 'features/tasks/components/TaskDetailsSection';
import TaskPreviewSection from 'features/tasks/components/TaskPreviewSection';
import { taskLoaded } from 'features/tasks/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinTask } from 'utils/types/zetkin';

interface TaskDetailPageClientProps {
  orgId: number;
  task: ZetkinTask;
  taskId: number;
}

export default function TaskDetailPageClient({
  task,
}: TaskDetailPageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(taskLoaded(task));
  }, [task, dispatch]);

  return (
    <Grid container justifyContent="space-between" spacing={4}>
      <Grid size={{ lg: 6, md: 6, xs: 12 }}>
        <TaskDetailsSection task={task} />
      </Grid>
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <TaskPreviewSection task={task} />
      </Grid>
    </Grid>
  );
}
