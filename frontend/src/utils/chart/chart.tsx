import { lazy, Suspense, useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import type { Props as ReactApexChartsProps } from 'react-apexcharts';

const LazyChart = lazy(() => import('react-apexcharts'));

export type ChartProps = ReactApexChartsProps & {
  sx?: any;
  className?: string;
};

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function Chart({ type, series, options, className, sx, ...other }: ChartProps) {
  const isClient = useIsClient();

  const renderFallback = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
      }}
    >
      <CircularProgress />
    </Box>
  );

  return (
    <ChartRoot
      dir="ltr"
      className={className}
      sx={sx}
      {...other}
    >
      {isClient ? (
        <Suspense fallback={renderFallback()}>
          <LazyChart 
            type={type} 
            series={series} 
            options={options} 
            width="100%" 
            height="100%" 
          />
        </Suspense>
      ) : (
        renderFallback()
      )}
    </ChartRoot>
  );
}

const ChartRoot = styled('div')(({ theme }) => ({
  width: '100%',
  flexShrink: 0,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
}));
