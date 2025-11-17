'use client';

import JoinFormList from 'features/joinForms/components/JoinFormList';
import JoinFormPane from 'features/joinForms/panes/JoinFormPane';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';
import { useNumericRouteParams } from 'core/hooks';
import { usePanes } from 'utils/panes';

const JoinFormsPage = () => {
  const { orgId } = useNumericRouteParams();
  const { data: joinForms } = useJoinForms(orgId);
  const { openPane } = usePanes();

  if (!joinForms) {
    return null;
  }

  const ownJoinForms = joinForms.filter(
    (form) => form.organization.id == orgId
  );

  return (
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
  );
};

export default JoinFormsPage;
