'use client';

import { FunctionComponent } from 'react';
import { useParams } from 'next/navigation';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: FunctionComponent<SettingsLayoutProps> = ({
  children,
}) => {
  const params = useParams();
  const orgId = params.orgId as string;
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/settings`}
      defaultTab="/"
      tabs={[{ href: `/`, label: messages.officials.settingsLayout.access() }]}
      title={messages.officials.settingsLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default SettingsLayout;
