'use client';


import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import messageIds from 'features/campaigns/l10n/messageIds';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useMessages } from 'core/i18n';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';



export default CampaignCalendarPage;
