import { FC } from 'react';
import { Box } from '@mui/material';
import { Search } from '@mui/icons-material';

import useAllActivities from '../hooks/useAllActivities';
import CallListItem from './CallListItem';
import AreaAssignmentListItem from './AreaAssignmentListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';

const CurrentActivities: FC = () => {
  const messages = useMessages(messageIds);
  const allActivities = useAllActivities();

  // Only show activities without time info
  const activitiesWithoutTime = allActivities.filter((activity) => {
    if (activity.kind === 'event') {
      return !activity.data.start_time;
    } else if (activity.kind === 'call') {
      return !activity.data.start_date;
    } else if (activity.kind === 'canvass') {
      return !activity.data.start_date;
    }
    return false;
  });

  if (activitiesWithoutTime.length === 0) {
    return null;
  }

  return (
    <Box
      bgcolor="white"
      borderRadius={2}
      display="flex"
      flexDirection="column"
      gap={2}
      padding={2}
    >
      <ZUIText variant="headingMd">
        <Msg id={messageIds.currentActivities.title} />
      </ZUIText>
      <Box display="flex" flexDirection="column" gap={1}>
        {activitiesWithoutTime.map((activity) => {
          if (activity.kind === 'call') {
            return (
              <CallListItem
                key={`call-${activity.data.id}`}
                callAssignment={activity.data}
                href={`/o/${activity.data.organization.id}/calls/${activity.data.id}`}
              />
            );
          } else if (activity.kind === 'canvass') {
            return (
              <AreaAssignmentListItem
                key={`canvass-${activity.data.id}`}
                assignment={activity.data}
                href={`/o/${activity.data.organization_id}/canvass/${activity.data.id}`}
              />
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
};

export default CurrentActivities;
