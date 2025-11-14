import SinglePersonLayout from 'features/singleperson/layout/SinglePersonLayout';

export const metadata = {
  title: 'getServerSideProps - Zetkin',
};

export default async function getServerSideProps({
  params,
}: {
  params: { orgId: string };
}) {
  return (
    <SinglePersonLayout>
      <getServerSidePropsClient {...params} />
    </SinglePersonLayout>
  );
}