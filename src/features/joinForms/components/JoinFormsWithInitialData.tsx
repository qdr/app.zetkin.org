'use client';

import { useEffect } from 'react';

import JoinFormList from './JoinFormList';
import JoinFormPane from '../panes/JoinFormPane';
import { joinFormsLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { usePanes } from 'utils/panes';
import { ZetkinJoinForm } from '../types';

interface JoinFormsWithInitialDataProps {
  joinForms: ZetkinJoinForm[];
  orgId: number;
}

export default function JoinFormsWithInitialData({
  joinForms,
  orgId,
}: JoinFormsWithInitialDataProps) {
  const dispatch = useAppDispatch();
  const { openPane } = usePanes();

  useEffect(() => {
    dispatch(joinFormsLoaded(joinForms));
  }, [joinForms, dispatch]);

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
}
