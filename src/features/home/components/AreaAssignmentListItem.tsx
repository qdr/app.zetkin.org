import React, { FC } from 'react';
import { GroupWorkOutlined, WatchLaterOutlined } from '@mui/icons-material';
import { useIntl } from 'react-intl';

import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import MyActivityListItem from './MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import { timeSpanToString } from 'zui/utils/timeSpanString';

type Props = {
  assignment: ZetkinAreaAssignment;
  href?: string;
  showDate?: boolean;
};

const AreaAssignmentListItem: FC<Props> = ({ assignment, href, showDate = false }) => {
  const intl = useIntl();
  const campaign = useCampaign(
    assignment.organization_id,
    assignment.project_id
  );
  const organization = useOrganization(assignment.organization_id);
  const messages = useMessages(messageIds);

  // Show only time (date is in the list header) unless showDate is true
  let timeInfo = 'All day';
  if (assignment.start_date && assignment.end_date) {
    const startDate = removeOffset(assignment.start_date);
    const endDate = removeOffset(assignment.end_date);

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
      labels: [
        campaign.campaignFuture.data?.title,
        organization.data?.title,
      ].filter((label) => !!label) as string[],
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
          label={messages.activityList.actions.areaAssignment()}
          size="large"
          variant="secondary"
        />,
      ]}
      activityType="canvass"
      activityTypeLabel={messages.activityList.types.canvass()}
      href={href}
      info={infoItems}
      showDate={showDate}
      title={assignment.title || messages.defaultTitles.areaAssignment()}
    />
  );
};

export default AreaAssignmentListItem;
