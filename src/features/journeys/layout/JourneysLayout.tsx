'use client';

import { useParams } from 'next/navigation';

import { useMessages } from 'core/i18n';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import messageIds from '../l10n/messageIds';

interface JourneysLayoutProps {
  children: React.ReactNode;
}

const JourneysLayout: React.FunctionComponent<JourneysLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useParams();

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys`}
      defaultTab="/"
      ellipsisMenuItems={[
        {
          label: messages.journeys.menu.downloadCsv(),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}`;
          },
        },
        {
          label: messages.journeys.menu.downloadXlsx(),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&format=xlsx`;
          },
        },
      ]}
      tabs={[
        {
          href: `/`,
          label: messages.journeys.tabs.overview(),
        },
      ]}
      title={messages.journeys.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneysLayout;
