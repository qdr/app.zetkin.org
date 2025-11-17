'use client';

import Calendar from 'features/calendar/components';
import messageIds from 'features/campaigns/l10n/messageIds';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

const CampaignCalendarPage = () => {
  const messages = useMessages(messageIds);
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

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

export default CampaignCalendarPage;
