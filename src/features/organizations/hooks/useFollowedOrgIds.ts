import useMemberships from './useMemberships';

export default function useFollowedOrgIds(): number[] {
  const memberships = useMemberships();

  if (!memberships.data) {
    return [];
  }

  // Return org IDs where follow is not explicitly false
  // (undefined or true means followed)
  return memberships.data
    .filter((membership) => membership.follow !== false)
    .map((membership) => membership.organization.id);
}
