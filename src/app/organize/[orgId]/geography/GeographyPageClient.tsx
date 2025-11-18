'use client';

import GeographyWithInitialData from 'features/geography/components/GeographyWithInitialData';
import { Zetkin2Area } from 'features/areas/types';

interface GeographyPageClientProps {
  areas: Zetkin2Area[];
  orgId: number;
}

export default function GeographyPageClient({
  areas,
  orgId,
}: GeographyPageClientProps) {
  return <GeographyWithInitialData areas={areas} orgId={orgId} />;
}
