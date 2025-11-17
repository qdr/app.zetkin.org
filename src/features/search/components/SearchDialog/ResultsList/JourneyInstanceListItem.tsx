'use client';
import { Explore } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';

const JourneyInstanceListItem: React.FunctionComponent<{
  journeyInstance: ZetkinJourneyInstance;
}> = ({ journeyInstance }) => {
  const params = useParams();
  const orgId = params.orgId as string;

  return (
    <Link
      href={`/organize/${orgId}/journeys/${journeyInstance.journey.id}/${journeyInstance.id}`}
    >
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <Explore />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText
            primary={journeyInstance.title}
            secondary={journeyInstance.journey.title}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default JourneyInstanceListItem;
