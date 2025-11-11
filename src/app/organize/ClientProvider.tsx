'use client';

import { ReactNode } from 'react';
import Head from 'next/head';

import messageIds from 'features/organizations/l10n/messageIds';
import { useMessages } from 'core/i18n';

export default function ClientProvider({ children }: { children: ReactNode }) {
  const messages = useMessages(messageIds);

  return (
    <>
      <Head>
        <title>{messages.page.title()}</title>
      </Head>
      {children}
    </>
  );
}
