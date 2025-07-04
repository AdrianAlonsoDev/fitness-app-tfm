import { styled } from '@mui/material/styles';

import { layoutClasses } from './classes';

// ----------------------------------------------------------------------

// Utility function to merge classes
function mergeClasses(classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type MainSectionProps = React.ComponentProps<typeof MainRoot>;

export function MainSection({ children, className, sx, ...other }: MainSectionProps) {
  return (
    <MainRoot className={mergeClasses([layoutClasses.main, className])} sx={sx} {...other}>
      {children}
    </MainRoot>
  );
}

// ----------------------------------------------------------------------

const MainRoot = styled('main')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
});
