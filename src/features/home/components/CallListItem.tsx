import { FC } from 'react';
import { GroupWorkOutlined, WatchLaterOutlined } from '@mui/icons-material';
import { useIntl } from 'react-intl';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import MyActivityListItem from './MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import { timeSpanToString } from 'zui/utils/timeSpanString';

type Props = {
  callAssignment: ZetkinCallAssignment;
  href?: string;
  showDate?: boolean;
};

const CallListItem: FC<Props> = ({ callAssignment, href, showDate = false }) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);

  // Show only time (date is in the list header) unless showDate is true
  let timeInfo = 'All day';
  if (callAssignment.start_date && callAssignment.end_date) {
    const startDate = removeOffset(callAssignment.start_date);
    const endDate = removeOffset(callAssignment.end_date);

    if (startDate && endDate) {
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      // Check if there are specific times (not just dates)
      const hasSpecificTime =
        startDateTime.getUTCHours() !== 0 ||
        startDateTime.getUTCMinutes() !== 0 ||
        endDateTime.getUTCHours() !== 0 ||
        endDateTime.getUTCMinutes() !== 0;

      if (hasSpecificTime) {
        const timeRange = `${intl.formatTime(startDateTime)} - ${intl.formatTime(endDateTime)}`;
        timeInfo = showDate
          ? `${intl.formatDate(startDateTime, { month: 'short', day: 'numeric' })} ${timeRange}`
          : timeRange;
      } else if (showDate) {
        timeInfo = intl.formatDate(startDateTime, { month: 'short', day: 'numeric' });
      }
    }
  }

  const infoItems = [
    {
      Icon: GroupWorkOutlined,
      labels: callAssignment.campaign
        ? [
            callAssignment.campaign.title,
            callAssignment.organization.title,
          ]
        : [callAssignment.organization.title],
    },
  ];

  infoItems.push({
    Icon: WatchLaterOutlined,
    labels: [timeInfo],
  });

  return (
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
      activityType="call"
      activityTypeLabel={messages.activityList.types.call()}
      href={href}
      info={infoItems}
      showDate={showDate}
      title={callAssignment.title || messages.defaultTitles.callAssignment()}
    />
  );
};

export default CallListItem;
