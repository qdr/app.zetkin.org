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
};

const CallListItem: FC<Props> = ({ callAssignment, href }) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);

  // Format date range for display
  const timeInfo = callAssignment.start_date
    ? timeSpanToString(
        new Date(removeOffset(callAssignment.start_date)),
        callAssignment.end_date
          ? new Date(removeOffset(callAssignment.end_date))
          : undefined,
        intl
      )
    : null;

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

  if (timeInfo) {
    infoItems.push({
      Icon: WatchLaterOutlined,
      labels: [timeInfo],
    });
  }

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
      href={href}
      info={infoItems}
      title={callAssignment.title || messages.defaultTitles.callAssignment()}
    />
  );
};

export default CallListItem;
