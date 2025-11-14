'use client';

import JoinFormList from 'features/joinForms/components/JoinFormList';
import JoinFormPane from 'features/joinForms/panes/JoinFormPane';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';
import { usePanes } from 'utils/panes';
import { useParams } from 'next/navigation';

export default function JoinFormsPage() {
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const { data: joinForms } = useJoinForms(orgId);
  const { openPane } = usePanes();

  if (!joinForms) {
    return null;
  }

  const ownJoinForms = joinForms.filter(
    (form) => form.organization.id == orgId
  );

  return (
    <PeopleLayout>
      <JoinFormList
        forms={ownJoinForms}
        onItemClick={(form) => {
          openPane({
            render: () => (
              <JoinFormPane formId={form.id} orgId={form.organization.id} />
            ),
            width: 500,
          });
        }}
      />
    </PeopleLayout>
  );
}
