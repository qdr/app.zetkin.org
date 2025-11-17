import { ReactNode } from 'react';
import TagsLayout from 'features/tags/layout/TagsLayout';

export default function TagsSection({
  children,
}: {
  children: ReactNode;
}) {
  return <TagsLayout>{children}</TagsLayout>;
}
