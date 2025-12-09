import { FC } from 'react';
import { Box, Fade } from '@mui/material';
import { Search } from '@mui/icons-material';

import useAllActivities from '../hooks/useAllActivities';
import EventListItem from './EventListItem';
import CallListItem from './CallListItem';
import AreaAssignmentListItem from './AreaAssignmentListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIDate from 'zui/ZUIDate';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import ZUIText from 'zui/components/ZUIText';

const AllActivitiesList: FC = () => {
  const messages = useMessages(messageIds);
  const allActivities = useAllActivities();
  const nextDelay = useIncrementalDelay();

  // Subtract 120 days for testing purposes
  const testDate = new Date();
  testDate.setDate(testDate.getDate() - 120);
  const today = testDate.toISOString().slice(0, 10);

  console.log('[AllActivitiesList] Today:', today);
  console.log('[AllActivitiesList] All activities:', allActivities);

  // Filter and separate activities with time info, only show today or future
  const activitiesWithTime = allActivities.filter((activity) => {
    // Check if activity has time info
    let hasTime = false;
    let activityDate = '';

    if (activity.kind === 'event') {
      hasTime = !!activity.data.start_time;
      activityDate = activity.data.start_time?.slice(0, 10) || '';
    } else if (activity.kind === 'call') {
      hasTime = !!activity.data.start_date;
      activityDate = activity.data.start_date?.slice(0, 10) || '';
    } else if (activity.kind === 'canvass') {
      hasTime = !!activity.data.start_date;
      activityDate = activity.data.start_date?.slice(0, 10) || '';
    }

    const include = hasTime && activityDate >= today;
    console.log('[AllActivitiesList] Activity filter:', {
      kind: activity.kind,
      hasTime,
      activityDate,
      today,
      include,
    });

    // Only include activities with time info that are today or in the future
    return include;
  });

  console.log('[AllActivitiesList] Activities with time:', activitiesWithTime);

  // Group activities by date
  const activitiesByDate = activitiesWithTime.reduce<
    Record<string, typeof allActivities>
  >((dates, activity) => {
    let dateString: string;
    if (activity.kind === 'event') {
      dateString = activity.data.start_time.slice(0, 10);
    } else if (activity.kind === 'call') {
      dateString = activity.data.start_date?.slice(0, 10) || '';
    } else {
      dateString = activity.data.start_date?.slice(0, 10) || '';
    }

    const existingActivities = dates[dateString] || [];
    return {
      ...dates,
      [dateString]: [...existingActivities, activity],
    };
  }, {});

  const dates = Object.keys(activitiesByDate).sort();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      overflow="hidden"
      position="relative"
    >
      {activitiesWithTime.length == 0 && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
          marginTop={3}
          padding={2}
        >
          <ZUIText color="secondary">
            <Msg id={messageIds.allEventsList.emptyList.message} />
          </ZUIText>
          <Search color="secondary" fontSize="large" />
        </Box>
      )}
      {dates.map((date) => (
        <Box key={date} paddingX={1}>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <div>
              <ZUIText my={1} variant="headingMd">
                <ZUIDate datetime={date} />
              </ZUIText>
            </div>
          </Fade>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {activitiesByDate[date].map((activity) => {
                if (activity.kind === 'event') {
                  return (
                    <EventListItem
                      key={`event-${activity.data.id}`}
                      event={activity.data}
                      href={`/o/${activity.data.organization.id}/events/${activity.data.id}`}
                    />
                  );
                } else if (activity.kind === 'call') {
                  return (
                    <CallListItem
                      key={`call-${activity.data.id}`}
                      callAssignment={activity.data}
                      href={`/o/${activity.data.organization.id}/calls/${activity.data.id}`}
                    />
                  );
                } else {
                  return (
                    <AreaAssignmentListItem
                      key={`canvass-${activity.data.id}`}
                      assignment={activity.data}
                      href={`/o/${activity.data.organization_id}/canvass/${activity.data.id}`}
                    />
                  );
                }
              })}
            </Box>
          </Fade>
        </Box>
      ))}
    </Box>
  );
};

export default AllActivitiesList;
