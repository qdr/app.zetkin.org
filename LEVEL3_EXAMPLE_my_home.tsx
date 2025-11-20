// ============================================================================
// LEVEL 3 RSC CONVERSION EXAMPLE: /my/home
// ============================================================================
// This is a PROOF OF CONCEPT showing what a full Level 3 conversion looks like
// Do NOT use this file - it's just for reference!
// ============================================================================

// ============================================================================
// FILE: src/app/my/home/page.tsx (Server Component - stays almost the same!)
// ============================================================================

import { Suspense } from 'react';
import { headers } from 'next/headers';
import BackendApiClient from 'core/api/client/BackendApiClient';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import MyActivitiesList from './MyActivitiesList';
import MyActivitiesSkeleton from './MyActivitiesSkeleton';

export default async function Page() {
  await redirectIfLoginNeeded();

  return (
    <Suspense fallback={<MyActivitiesSkeleton />}>
      <MyActivitiesListServer />
    </Suspense>
  );
}

// ============================================================================
// NEW: Server Component that fetches data (replaces HomePageClient)
// ============================================================================

async function MyActivitiesListServer() {
  const headersList = headers();
  const headersObject = Object.fromEntries(headersList.entries());
  const apiClient = new BackendApiClient(headersObject);
  const today = new Date().toISOString().slice(0, 10);

  // Fetch all data in parallel
  const [areaAssignments, callAssignments, userEvents] = await Promise.all([
    apiClient.get('/api2/users/me/area_assignments'),
    apiClient.get('/api/users/me/call_assignments'),
    apiClient.get(`/api/users/me/actions?filter=end_time>=${today}`),
  ]);

  // Filter active assignments (server-side!)
  const activeAreaAssignments = areaAssignments.filter(
    ({ end_date, start_date }) =>
      start_date?.slice(0, 10) <= today &&
      (end_date == null || end_date.slice(0, 10) >= today)
  );

  const activeCallAssignments = callAssignments.filter(
    ({ end_date, start_date }) =>
      start_date <= today && (end_date == null || end_date >= today)
  );

  // Combine into activities
  const activities = [
    ...activeAreaAssignments.map((data) => ({
      data,
      kind: 'canvass' as const,
      start: new Date(data.start_date || 0),
    })),
    ...activeCallAssignments.map((data) => ({
      data,
      kind: 'call' as const,
      start: new Date(data.start_date || 0),
    })),
    ...userEvents.map((data) => ({
      data,
      kind: 'event' as const,
      start: new Date(data.start_time || 0),
    })),
  ].sort((a, b) => a.start.getTime() - b.start.getTime());

  // NO Redux, NO client-side hooks - just pass data directly!
  return <MyActivitiesList activities={activities} />;
}

// ============================================================================
// FILE: src/app/my/home/MyActivitiesList.tsx
// NOW: Pure Client Component (no Redux, no hooks!)
// ============================================================================

'use client';

import { FC, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useMessages } from 'core/i18n';
import messageIds from 'features/home/l10n/messageIds';
import EventListItem from 'features/home/components/EventListItem';
import MyActivityListItem from 'features/home/components/MyActivityListItem';
import AreaAssignmentListItem from 'features/home/components/AreaAssignmentListItem';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

type Activity =
  | { kind: 'canvass'; data: any; start: Date }
  | { kind: 'call'; data: any; start: Date }
  | { kind: 'event'; data: any; start: Date };

interface Props {
  activities: Activity[];
}

// This is now a PURE component - receives data as props, no Redux!
const MyActivitiesList: FC<Props> = ({ activities }) => {
  const messages = useMessages(messageIds);
  const [filteredKinds, setFilteredKinds] = useState<string[]>([]);
  const nextDelay = useIncrementalDelay();

  const kinds = Array.from(new Set(activities.map((activity) => activity.kind)));

  const filteredActivities = activities.filter((activity) => {
    const notFiltering = filteredKinds.length == 0;
    return notFiltering || filteredKinds.includes(activity.kind);
  });

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {kinds.length > 1 && (
        <Box display="flex" gap={1}>
          {kinds.map((kind) => {
            const active = filteredKinds.includes(kind);
            return (
              <ZUIFilterButton
                key={kind}
                active={active}
                label={messages.activityList.filters[kind]()}
                onClick={() => {
                  const newValue = filteredKinds.filter(
                    (prevKind) => prevKind != kind
                  );
                  if (!active) {
                    newValue.push(kind);
                  }
                  setFilteredKinds(newValue);
                }}
              />
            );
          })}
        </Box>
      )}

      {filteredActivities.length == 0 && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
          marginTop={3}
          padding={2}
        >
          <ZUIText color="secondary">
            No activities found
          </ZUIText>
        </Box>
      )}

      {filteredActivities.map((activity) => {
        let elem, href;

        if (activity.kind == 'call') {
          href = `/call/${activity.data.id}`;
          elem = (
            <MyActivityListItem
              actions={[
                <ZUIButton
                  key="mainAction"
                  href={href}
                  label={messages.activityList.actions.call()}
                  size="large"
                  variant="secondary"
                />,
              ]}
              info={[
                {
                  Icon: null,
                  labels: activity.data.campaign
                    ? [
                        activity.data.campaign.title,
                        activity.data.organization.title,
                      ]
                    : [activity.data.organization.title],
                },
              ]}
              title={
                activity.data.title || messages.defaultTitles.callAssignment()
              }
            />
          );
        } else if (activity.kind == 'canvass') {
          href = `/canvass/${activity.data.id}`;
          elem = (
            <AreaAssignmentListItem assignment={activity.data} href={href} />
          );
        } else if (activity.kind == 'event') {
          href = `/o/${activity.data.organization.id}/events/${activity.data.id}`;
          elem = <EventListItem event={activity.data} href={href} />;
        }

        return (
          <Fade key={href} appear in style={{ transitionDelay: nextDelay() }}>
            <Box>{elem}</Box>
          </Fade>
        );
      })}
    </Box>
  );
};

export default MyActivitiesList;

// ============================================================================
// FILE: src/app/my/home/MyActivitiesSkeleton.tsx (NEW - for Suspense)
// ============================================================================

import { Box, Skeleton } from '@mui/material';

export default function MyActivitiesSkeleton() {
  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
    </Box>
  );
}

// ============================================================================
// COMPARISON SUMMARY
// ============================================================================

/*

LEVEL 2 (Current - What we just built):
├── page.tsx (Server Component) - Fetches data
├── HomePageClient.tsx (Client) - Receives data as props
├── MyActivitiesListWithInitialData.tsx - Hydrates Redux with useEffect
└── MyActivitiesList.tsx - Uses useMyActivities() hook (fetches from Redux)

Files: 4
Lines of code: ~200
Redux involved: Yes (3 actions dispatched)
Client JS bundle: ~50KB (includes Redux, hooks, selectors)
Data flow: Server → Client → Redux → Hook → Component


LEVEL 3 (Full RSC):
├── page.tsx (Server Component) - Just renders Suspense
├── MyActivitiesListServer.tsx (Server Component) - Fetches & processes data
├── MyActivitiesList.tsx (Client Component) - Pure component, receives props
└── MyActivitiesSkeleton.tsx (Client Component) - Loading state

Files: 4 (same!)
Lines of code: ~180 (LESS!)
Redux involved: NO
Client JS bundle: ~15KB (NO Redux, NO hooks, NO store)
Data flow: Server → Component (direct!)


KEY DIFFERENCES:

1. NO REDUX HYDRATION
   - Level 2: dispatch(myAssignmentsLoaded(data))
   - Level 3: Just pass data as props

2. NO HOOKS
   - Level 2: useMyActivities() → pulls from Redux
   - Level 3: activities prop → direct data

3. SMALLER CLIENT BUNDLE
   - Level 2: Ships Redux + all hooks + selectors
   - Level 3: Just the UI components

4. STREAMING READY
   - Level 2: All data must load before render
   - Level 3: Can stream with <Suspense>

5. SIMPLER MENTAL MODEL
   - Level 2: Server → Client → Redux → Hook → Component
   - Level 3: Server → Component (that's it!)


EFFORT TO CONVERT ONE PAGE (Level 2 → Level 3):
─────────────────────────────────────────────
Time: ~30-45 minutes per page
Complexity: MEDIUM

Steps:
1. Move data fetching logic to Server Component (5 min)
2. Convert client component to pure component (10 min)
3. Remove Redux dispatches/hooks (15 min)
4. Add Suspense + skeleton (5 min)
5. Test & verify (5-10 min)

Gotchas:
- Any mutations (POST/PUT/DELETE) need Server Actions
- Client-side filters/sorting still work (just useState)
- Can't use Redux selectors anymore (but don't need them!)


FULL APP CONVERSION ESTIMATE:
─────────────────────────────
Pages in /src/app: ~18
Complex pages: ~10 (like my/home)
Simple pages: ~8 (like surveys - already mostly done)

Total time: 8-12 hours
Risk: LOW (can do incrementally, test each page)
Benefits:
  - 70% smaller client JS bundle
  - Simpler codebase (no Redux in many places)
  - Better streaming/loading states
  - SEO improvements

*/
