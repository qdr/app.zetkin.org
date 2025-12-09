import { Box, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ZUIIconLabel from 'zui/components/ZUIIconLabel';
import ZUIDataChip from 'zui/components/ZUIDataChip';
import ZUILink from 'zui/components/ZUILink';
import ZUIButton from 'zui/components/ZUIButton';
import useIsMobile from 'utils/hooks/useIsMobile';

type Props = {
  actions?: JSX.Element[];
  activityType: 'event' | 'call' | 'canvass';
  activityTypeLabel: string;
  href?: string;
  iconTitle?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  image?: string;
  info: {
    Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
    labels: ReactNode[];
  }[];
  showDate?: boolean;
  title: string;
};

const MyActivityListItem: FC<Props> = ({
  actions,
  activityType,
  activityTypeLabel,
  href,
  image,
  info,
  showDate = false,
  title,
}) => {
  const isMobile = useIsMobile();

  const chipColors = {
    canvass: 'mid3',
    call: 'final',
    event: 'main',
  } as const;

  const ImageWrapper: FC<{ children: ReactNode }> = href
    ? ({ children }) => <Link href={href}>{children}</Link>
    : ({ children }) => children as JSX.Element;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        border: `0.063rem solid ${theme.palette.dividers.main}`,
        borderRadius: '0.25rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
      })}
    >
      {image && (
        <ImageWrapper>
          <Box
            sx={{
              flexShrink: 0,
              height: isMobile ? '9.375rem' : '15rem',
              width: isMobile ? '100%' : '15rem',
            }}
          >
            <Image
              alt={title}
              height={960}
              src={image}
              style={{ height: '100%', objectFit: 'cover', width: '100%' }}
              width={960}
            />
          </Box>
        </ImageWrapper>
      )}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: '1.25rem',
          padding: '1.25rem',
          position: 'relative',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
          }}
        >
          <Box
            sx={(theme) => ({
              backgroundColor:
                chipColors[activityType] === 'main'
                  ? 'rgba(139, 92, 246, 0.15)'
                  : chipColors[activityType] === 'mid3'
                    ? 'rgba(124, 58, 237, 0.15)'
                    : 'rgba(196, 181, 253, 0.15)',
              borderRadius: '2rem',
              display: 'inline-flex',
              padding: '0.125rem 0.5rem',
            })}
          >
            <Box
              sx={{
                color: '#6B21A8',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {activityTypeLabel}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '5rem' }}>
          <Box sx={{ fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {href ? <ZUILink href={href} text={title} /> : title}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {info.map((item, index) => (
              <ZUIIconLabel
                key={index}
                color="secondary"
                icon={item.Icon}
                label={item.labels}
                noWrap
                size="small"
              />
            ))}
          </Box>
        </Box>
        {actions && (
          <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyActivityListItem;
