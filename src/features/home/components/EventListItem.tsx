import { useIntl } from 'react-intl';
import { FC } from 'react';
import {
  GroupWorkOutlined,
  LocationOnOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';

import MyActivityListItem from './MyActivityListItem';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from '../types';
import { removeOffset } from 'utils/dateUtils';
import { timeSpanToString } from 'zui/utils/timeSpanString';
import ZUILink from 'zui/components/ZUILink';

type Props = {
  event: ZetkinEventWithStatus;
  href?: string;
  showDate?: boolean;
};

const EventListItem: FC<Props> = ({ event, href, showDate = false }) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);

  // Signup button removed from list view - only show on detail page
  const actions: JSX.Element[] = [];

  const orgProjectLabels = [
    <ZUILink
      key="org"
      href={`/o/${event.organization.id}`}
      text={event.organization.title}
    />,
    event.campaign && (
      <ZUILink
        key="campaign"
        href={`/o/${event.organization.id}/projects/${event.campaign.id}`}
        text={event.campaign.title}
      />
    ),
  ].filter((label) => !!label);

  const startDateTime = new Date(removeOffset(event.start_time));
  const endDateTime = new Date(removeOffset(event.end_time));

  const timeLabel = showDate
    ? `${intl.formatDate(startDateTime, { month: 'short', day: 'numeric' })} ${intl.formatTime(startDateTime)} - ${intl.formatTime(endDateTime)}`
    : `${intl.formatTime(startDateTime)} - ${intl.formatTime(endDateTime)}`;

  return (
    <MyActivityListItem
      actions={actions}
      activityType="event"
      activityTypeLabel={messages.activityList.types.event()}
      href={href}
      image={event.cover_file?.url}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: orgProjectLabels,
        },
        {
          Icon: WatchLaterOutlined,
          labels: [timeLabel],
        },
        {
          Icon: LocationOnOutlined,
          labels: [
            event.location?.title || messages.defaultTitles.noLocation(),
          ],
        },
      ]}
      showDate={showDate}
      title={
        event.title || event.activity?.title || messages.defaultTitles.event()
      }
    />
  );
};

export default EventListItem;
