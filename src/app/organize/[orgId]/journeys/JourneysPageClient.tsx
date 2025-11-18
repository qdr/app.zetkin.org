'use client';

import JourneysGridWithInitialData from 'features/journeys/components/JourneysGridWithInitialData';
import messageIds from 'features/journeys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinJourney } from 'utils/types/zetkin';
import ZUISection from 'zui/ZUISection';

interface JourneysPageClientProps {
  journeys: ZetkinJourney[];
  orgId: number;
}

export default function JourneysPageClient({
  journeys,
  orgId,
}: JourneysPageClientProps) {
  const messages = useMessages(messageIds);

  return (
    <ZUISection title={messages.journeys.overview.overviewTitle()}>
      <JourneysGridWithInitialData journeys={journeys} orgId={orgId} />
    </ZUISection>
  );
}
