'use client';

import Calendar from 'features/calendar/components';
import messageIds from 'features/campaigns/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';

const AllCampaignsCalendarPage = () => {
  const messages = useMessages(messageIds);

  const isOnServer = useServerSide();
  if (isOnServer) {
    return null;
  }

  return (
    <>
            <Calendar />
    </>
  );
};

export default AllCampaignsCalendarPage;
