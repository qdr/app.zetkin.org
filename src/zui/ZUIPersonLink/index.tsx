'use client';

import { Link } from '@mui/material';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonHoverCard from '../ZUIPersonHoverCard';

interface ZUIPersonLinkProps {
  person: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
}
const ZUIPersonLink: React.FC<ZUIPersonLinkProps> = ({ person }) => {
  const params = useParams();
  const { orgId } = params;

  return (
    <ZUIPersonHoverCard
      BoxProps={{ style: { display: 'inline-flex' } }}
      personId={Number(person.id)}
    >
      <NextLink
        href={`/organize/${orgId}/people/${person.id}`}
        legacyBehavior
        passHref
      >
        <Link
          color="textPrimary"
          style={{ fontWeight: 'bold' }}
          underline="hover"
        >
          {person.first_name + ' ' + person.last_name}
        </Link>
      </NextLink>
    </ZUIPersonHoverCard>
  );
};

export default ZUIPersonLink;
