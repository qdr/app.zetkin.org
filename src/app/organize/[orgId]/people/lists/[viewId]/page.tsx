import SharedViewLayout from 'features/sharedview/layout/SharedViewLayout';
import ViewDataTableClient from './ViewDataTableClient';

export const metadata = {
  title: 'View - Zetkin',
};

export default async function ViewPage({
  params,
}: {
  params: { orgId: string; viewId: string };
}) {
  return (
    <SharedViewLayout>
      <ViewDataTableClient orgId={params.orgId} viewId={params.viewId} />
    </SharedViewLayout>
  );
}
