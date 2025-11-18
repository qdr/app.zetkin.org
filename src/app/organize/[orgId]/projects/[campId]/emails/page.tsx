import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
  };
};

export default function EmailsRedirect({ params }: PageProps) {
  const { orgId, campId } = params;
  redirect(`/organize/${orgId}/projects/${campId}`);
}
