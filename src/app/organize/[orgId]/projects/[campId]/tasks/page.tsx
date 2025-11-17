'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { useNumericRouteParams } from 'core/hooks';

const TasksPage = () => {
  const { orgId, campId } = useNumericRouteParams();

  useEffect(() => {
    redirect(`/organize/${orgId}/projects/${campId}`);
  }, [orgId, campId]);

  return null;
};

export default TasksPage;
