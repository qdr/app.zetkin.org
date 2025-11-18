'use client';

import { FC } from 'react';

import FolderLayout from 'features/views/layout/FolderLayout';
import ViewBrowser from 'features/views/components/ViewBrowser';

interface FolderPageClientProps {
  orgId: string;
  folderId: number;
}

const FolderPageClient: FC<FolderPageClientProps> = ({ orgId, folderId }) => {
  return (
    <FolderLayout folderId={folderId}>
      <ViewBrowser
        basePath={`/organize/${orgId}/people`}
        folderId={folderId}
      />
    </FolderLayout>
  );
};

export default FolderPageClient;
