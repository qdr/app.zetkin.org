'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';

import { assignedTasksLoaded, taskLoaded } from 'features/tasks/store';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import messageIds from 'features/campaigns/l10n/messageIds';
import { QUERY_STATUS } from 'features/smartSearch/components/types';
import QueryStatusAlert from 'features/tasks/components/QueryStatusAlert';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import TaskAssigneesList from 'features/tasks/components/TaskAssigneesList';
import { useAppDispatch } from 'core/hooks';
import { useMessages } from 'core/i18n';
import useTaskMutations from 'features/tasks/hooks/useTaskMutations';
import { ZetkinAssignedTask, ZetkinTask } from 'utils/types/zetkin';

interface TaskAssigneesPageClientProps {
  assignedTasks: ZetkinAssignedTask[];
  orgId: number;
  task: ZetkinTask;
  taskId: number;
}

const getQueryStatus = (
  task: ZetkinTask | null,
  assignedTasks: ZetkinAssignedTask[] | null
) => {
  const taskStatus = task ? getTaskStatus(task) : undefined;
  let queryStatus = QUERY_STATUS.ASSIGNED;
  if (
    taskStatus === TASK_STATUS.DRAFT ||
    taskStatus === TASK_STATUS.SCHEDULED
  ) {
    queryStatus = QUERY_STATUS.EDITABLE;
    if (!task?.target.filter_spec.length) {
      queryStatus = QUERY_STATUS.NEW;
    }
  } else if (assignedTasks && !assignedTasks.length) {
    queryStatus = QUERY_STATUS.PUBLISHED;
  }
  return queryStatus;
};

export default function TaskAssigneesPageClient({
  assignedTasks,
  orgId,
  task,
  taskId,
}: TaskAssigneesPageClientProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const { updateTargetQuery } = useTaskMutations(orgId, taskId);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(taskLoaded(task));
    dispatch(assignedTasksLoaded([taskId, assignedTasks]));
  }, [task, taskId, assignedTasks, dispatch]);

  const queryStatus = useMemo(
    () => getQueryStatus(task, assignedTasks),
    [task, assignedTasks]
  );

  const readOnly =
    queryStatus === QUERY_STATUS.PUBLISHED ||
    queryStatus === QUERY_STATUS.ASSIGNED;

  const query = task?.target;

  return (
    <>
      <QueryStatusAlert
        openDialog={() => setDialogOpen(true)}
        status={queryStatus}
      />
      <Box mt={3}>
        <TaskAssigneesList assignedTasks={assignedTasks} />
      </Box>
      {dialogOpen && (
        <SmartSearchDialog
          onDialogClose={() => setDialogOpen(false)}
          onSave={(query) => {
            updateTargetQuery(query);
            setDialogOpen(false);
          }}
          query={query}
          readOnly={readOnly}
        />
      )}
    </>
  );
}
