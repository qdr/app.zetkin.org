'use client';

import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Card, Link, Typography } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'core/l10n/messageIds';

export default function LegacyPage() {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const searchParams = useSearchParams();

  const path = searchParams.get('path') || '';
  const orgQuerystring = searchParams.get('orgId')
    ? `?org=${searchParams.get('orgId')}`
    : '';
  const destination = `https://organize.${process.env.NEXT_PUBLIC_ZETKIN_API_DOMAIN || 'dev.zetkin.org'}/${path}${orgQuerystring}`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body, body > div { height: 100%; padding: 0; margin: 0; }
        `,
        }}
      />
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Card
          style={{
            margin: 10,
            maxWidth: 600,
            padding: 20,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3">
            <Msg id={messageIds.legacy.header} />
          </Typography>
          <Typography
            style={{ marginBottom: 20, marginTop: 20 }}
            variant="body1"
          >
            <Msg id={messageIds.legacy.info} />
          </Typography>
          <NextLink href={destination} legacyBehavior passHref>
            <Button color="primary" component="a" variant="contained">
              <Msg id={messageIds.legacy.continueButton} />
            </Button>
          </NextLink>
          <Typography
            color="textSecondary"
            style={{ marginTop: 4 }}
            variant="body2"
          >
            <NextLink href="/" legacyBehavior passHref>
              <Link
                onClick={(ev) => {
                  ev.preventDefault();
                  router.back();
                }}
                underline="hover"
              >
                No, take me back!
              </Link>
            </NextLink>
          </Typography>
        </Card>
      </Box>
    </>
  );
}
