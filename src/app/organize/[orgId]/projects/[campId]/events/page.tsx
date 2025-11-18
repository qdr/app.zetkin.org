import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
  };
};

export default function EventsRedirect({ params }: PageProps) {
  const { orgId, campId } = params;

  if (campId === 'standalone') {
    redirect(`/organize/${orgId}/projects/calendar`);
  } else {
    redirect(`/organize/${orgId}/projects/${campId}/calendar`);
  }
}
