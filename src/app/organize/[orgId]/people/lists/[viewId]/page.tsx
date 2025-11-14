import SharedViewLayout from 'features/sharedview/layout/SharedViewLayout';

export const metadata = {
  title: 'getServerSideProps - Zetkin',
};

export default async function getServerSideProps({
  params,
}: {
  params: { orgId: string };
}) {
  return (
    <SharedViewLayout>
      <getServerSidePropsClient {...params} />
    </SharedViewLayout>
  );
}