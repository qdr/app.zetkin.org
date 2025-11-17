'use client';

import { ReactNode } from 'react';
import DefaultLayout from 'utils/layout/DefaultLayout';
import Header from 'zui/ZUIHeader';
import { useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';

export default function GeographyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const messages = useMessages(messageIds);

  return (
    <DefaultLayout>
      <Header title={messages.page.title()} />
      {children}
    </DefaultLayout>
  );
}
