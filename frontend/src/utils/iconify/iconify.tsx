import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { Icon, type IconifyIcon } from '@iconify/react';

export type IconifyProps = BoxProps & {
  icon: IconifyIcon | string;
  width?: number | string;
  sx?: BoxProps['sx'];
};

export const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
);

Iconify.displayName = 'Iconify';
