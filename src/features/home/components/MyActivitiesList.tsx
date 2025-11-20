'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { GroupWorkOutlined, Hotel } from '@mui/icons-material';

import useMyActivities from '../hooks/useMyActivities';
import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import EventListItem from './EventListItem';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import AreaAssignmentListItem from './AreaAssignmentListItem';

const INITIAL_PAGE_SIZE = 20;
const PAGE_INCREMENT = 20;

const MyActivitiesList: FC = () => {
  const activities = useMyActivities();
  const messages = useMessages(messageIds);
  const [filteredKinds, setFilteredKinds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(INITIAL_PAGE_SIZE);
  const nextDelay = useIncrementalDelay();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(INITIAL_PAGE_SIZE);
  }, [filteredKinds]);

  if (!isMounted) {
    return <div style={{ display: 'none' }} />;
  }

  const kinds = Array.from(
    new Set(activities.map((activity) => activity.kind))
  );

  const filteredActivities = activities.filter((activity) => {
    const notFiltering = filteredKinds.length == 0;
    return notFiltering || filteredKinds.includes(activity.kind);
  });

  const visibleActivities = filteredActivities.slice(0, itemsToShow);
  const hasMore = filteredActivities.length > itemsToShow;

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {kinds.length > 1 && (
        <Box display="flex" gap={1}>
          {kinds.map((kind) => {
            const active = filteredKinds.includes(kind);
            return (
              <ZUIFilterButton
                key={kind}
                active={active}
                label={messages.activityList.filters[kind]()}
                onClick={() => {
                  const newValue = filteredKinds.filter(
                    (prevKind) => prevKind != kind
                  );

                  if (!active) {
                    newValue.push(kind);
                  }

                  setFilteredKinds(newValue);
                }}
              />
            );
          })}
        </Box>
      )}
      {filteredActivities.length == 0 && (
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
            <Msg id={messageIds.activityList.emptyListMessage} />
          </ZUIText>
          <Hotel color="secondary" fontSize="large" />
        </Box>
      )}
      {visibleActivities.map((activity) => {
        let elem, href;

        if (activity.kind == 'call') {
          href = `/call/${activity.data.id}`;
          elem = (
            <MyActivityListItem
              actions={[
                <ZUIButton
                  key="mainAction"
                  href={href}
                  label={messages.activityList.actions.call()}
                  size="large"
                  variant="secondary"
                />,
              ]}
              info={[
                {
                  Icon: GroupWorkOutlined,
                  labels: activity.data.campaign
                    ? [
                        activity.data.campaign.title,
                        activity.data.organization.title,
                      ]
                    : [activity.data.organization.title],
                },
              ]}
              title={
                activity.data.title || messages.defaultTitles.callAssignment()
              }
            />
          );
        } else if (activity.kind == 'canvass') {
          href = `/canvass/${activity.data.id}`;
          elem = (
            <AreaAssignmentListItem assignment={activity.data} href={href} />
          );
        } else if (activity.kind == 'event') {
          href = `/o/${activity.data.organization.id}/events/${activity.data.id}`;
          elem = <EventListItem event={activity.data} href={href} />;
        }

        return (
          <Fade key={href} appear in style={{ transitionDelay: nextDelay() }}>
            <Box>{elem}</Box>
          </Fade>
        );
      })}
      {hasMore && (
        <Box display="flex" justifyContent="center" mt={2}>
          <ZUIButton
            label={messages.activityList.loadMore?.() || 'Load More'}
            onClick={() => setItemsToShow((prev) => prev + PAGE_INCREMENT)}
            variant="secondary"
          />
        </Box>
      )}
    </Box>
  );
};

export default MyActivitiesList;
