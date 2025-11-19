import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCampaign, ZetkinEvent, ZetkinSurvey } from 'utils/types/zetkin';

const getUrlsXml = <T>(ts: T[], urlGen: (t: T) => string) => {
  return ts
    .map(
      (e) =>
        `<url><loc>${urlGen(
          e
        )}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
    )
    .join('');
};

export async function GET(
  _: Request,
  { params }: { params: { orgId: number } }
) {
  const { orgId } = await params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host = process.env.ZETKIN_APP_HOST || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const [events, projects, surveys] = await Promise.all([
    apiClient
      .get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`)
      .catch(() => [] as ZetkinEvent[]),
    apiClient
      .get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns`)
      .catch(() => [] as ZetkinCampaign[]),
    apiClient
      .get<ZetkinSurvey[]>(`/api/orgs/${orgId}/surveys`)
      .catch(() => [] as ZetkinSurvey[]),
  ]);

  const urls =
    getUrlsXml(
      [`${baseUrl}/o/${orgId}`, `${baseUrl}/o/${orgId}/suborgs`],
      (str) => str
    ) +
    getUrlsXml(events, (e) => `${baseUrl}/o/${orgId}/events/${e.id}`) +
    getUrlsXml(
      projects,
      (p) => `${baseUrl}/o/${orgId}/projects/${p.id}`
    ) +
    getUrlsXml(surveys, (s) => `${baseUrl}/o/${orgId}/surveys/${s.id}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
