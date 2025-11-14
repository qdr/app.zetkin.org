
export const metadata = {
  title: 'getServerSideProps - Zetkin',
};

export default async function getServerSideProps({
  params,
}: {
  params: { orgId: string };
}) {
  return <getServerSidePropsClient {...params} />;
}