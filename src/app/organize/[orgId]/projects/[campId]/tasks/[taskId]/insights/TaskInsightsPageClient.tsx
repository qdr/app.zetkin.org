'use client';

import { FunctionComponent, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography } from '@mui/material';

import { assignedTasksLoaded, taskLoaded } from 'features/tasks/store';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
} from 'features/tasks/components/types';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { useAppDispatch } from 'core/hooks';
import { ZetkinTask } from 'utils/types/zetkin';

interface PieChartProps {
  tasks: ZetkinAssignedTask[];
}

const PieChart: FunctionComponent<PieChartProps> = ({ tasks }) => {
  const assigned = tasks.filter(
    (task) => task.status === ASSIGNED_STATUS.ASSIGNED
  );
  const ignored = tasks.filter(
    (task) => task.status === ASSIGNED_STATUS.IGNORED
  );
  const completed = tasks.filter(
    (task) => task.status === ASSIGNED_STATUS.COMPLETED
  );

  const data = [
    {
      color: 'rgb(255, 128, 0)',
      id: 'assigned',
      label: 'No action',
      value: assigned.length,
    },
    {
      color: 'rgb(128, 0, 255)',
      id: 'ignored',
      label: 'Discarded',
      value: ignored.length,
    },
    {
      color: 'rgb(0, 255, 128)',
      id: 'completed',
      label: 'Completed',
      value: completed.length,
    },
  ];

  return (
    <ResponsivePie
      activeOuterRadiusOffset={8}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      arcLinkLabel="label"
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      borderWidth={1}
      cornerRadius={3}
      data={data}
      innerRadius={0.5}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
              },
            },
          ],
          itemDirection: 'left-to-right',
          itemHeight: 18,
          itemOpacity: 1,
          itemTextColor: '#999',
          itemWidth: 100,
          itemsSpacing: 0,
          justify: false,
          symbolShape: 'circle',
          symbolSize: 18,
          translateX: 0,
          translateY: 56,
        },
      ]}
      margin={{ bottom: 80, left: 80, right: 80, top: 40 }}
      padAngle={0.7}
    />
  );
};

interface TaskInsightsPageClientProps {
  assignedTasks: ZetkinAssignedTask[];
  orgId: number;
  task: ZetkinTask;
  taskId: number;
}

export default function TaskInsightsPageClient({
  assignedTasks,
  task,
  taskId,
}: TaskInsightsPageClientProps) {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);

  useEffect(() => {
    dispatch(taskLoaded(task));
    dispatch(assignedTasksLoaded([taskId, assignedTasks]));
  }, [task, taskId, assignedTasks, dispatch]);

  return (
    <Box height={400} maxWidth={500} mt={3} width="100%">
      <Typography>
        <Msg id={messageIds.assigneeActions} />
      </Typography>
      <PieChart tasks={assignedTasks} />
    </Box>
  );
}
