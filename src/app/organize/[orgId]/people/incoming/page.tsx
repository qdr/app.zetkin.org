import PeopleLayout from 'features/views/layout/PeopleLayout';
import IncomingClient from './IncomingClient';

export const metadata = {
  title: 'Incoming - Zetkin',
};

export default async function IncomingPage({
  params,
}: {
  params: { orgId: string };
}) {
  return (
    <PeopleLayout>
      <IncomingClient orgId={params.orgId} />
    </PeopleLayout>
  );
}
