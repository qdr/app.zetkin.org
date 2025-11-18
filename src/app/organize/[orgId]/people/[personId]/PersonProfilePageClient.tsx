'use client';

import PersonProfileWithInitialData from 'features/profile/components/PersonProfileWithInitialData';
import {
  ZetkinAppliedTag,
  ZetkinCustomField,
  ZetkinJourney,
  ZetkinPerson,
} from 'utils/types/zetkin';

interface PersonProfilePageClientProps {
  customFields: ZetkinCustomField[];
  journeys: ZetkinJourney[];
  orgId: number;
  person: ZetkinPerson;
  personId: number;
  personTags: ZetkinAppliedTag[];
}

export default function PersonProfilePageClient({
  customFields,
  journeys,
  orgId,
  person,
  personId,
  personTags,
}: PersonProfilePageClientProps) {
  return (
    <PersonProfileWithInitialData
      customFields={customFields}
      journeys={journeys}
      orgId={orgId}
      person={person}
      personId={personId}
      personTags={personTags}
    />
  );
}
