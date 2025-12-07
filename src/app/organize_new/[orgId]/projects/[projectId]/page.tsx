import { redirect } from 'next/navigation';

interface Props {
  params: {
    orgId: string;
    projectId: string;
  };
}

export default function ProjectPage({ params }: Props) {
  redirect(`/organize_new/${params.orgId}/projects/${params.projectId}/overview`);
}
