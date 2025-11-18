'use client';

import { FC } from 'react';

import JoinFormList from 'features/joinForms/components/JoinFormList';
import JoinFormPane from 'features/joinForms/panes/JoinFormPane';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';
import { usePanes } from 'utils/panes';

interface JoinFormsPageClientProps {
  orgId: number;
}

const JoinFormsPageClient: FC<JoinFormsPageClientProps> = ({ orgId }) => {
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
};

export default JoinFormsPageClient;
