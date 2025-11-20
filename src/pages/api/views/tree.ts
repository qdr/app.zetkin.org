import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinView, ZetkinViewFolder } from 'features/views/components/types';

export type ViewTreeData = {
  folders: ZetkinViewFolder[];
  views: ZetkinView[];
  hasMore?: boolean;
  total?: number;
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { orgId, offset, limit } = req.query;

  const client = new BackendApiClient(req.headers);

  const offsetNum = offset ? parseInt(offset as string, 10) : 0;
  const limitNum = limit ? parseInt(limit as string, 10) : 80;

  try {
    const views = await client.get<ZetkinView[]>(
      `/api/orgs/${orgId}/people/views`
    );
    const folders = await client.get<ZetkinViewFolder[]>(
      `/api/orgs/${orgId}/people/view_folders`
    );

    // Sort views by creation date (most recent first)
    const sortedViews = views.sort((a, b) => {
      // Sort by created date descending (most recent first)
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    // Apply pagination
    const paginatedViews = sortedViews.slice(
      offsetNum,
      offsetNum + limitNum
    );

    const output: ViewTreeData = {
      folders,
      views: paginatedViews,
      hasMore: offsetNum + limitNum < sortedViews.length,
      total: sortedViews.length,
    };

    res.status(200).json({ data: output });
  } catch (err) {
    res.status(500).end();
  }
}
