import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default function CallBlockedRedirect({ params }: PageProps) {
  const { orgId } = params;
  // Redirect to main people page since this special system view is no longer supported
  redirect(`/organize/${orgId}/people`);
}
