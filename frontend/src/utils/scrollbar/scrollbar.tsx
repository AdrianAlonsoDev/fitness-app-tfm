import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const ScrollbarRoot = styled('div')({
  flexGrow: 1,
  height: '100%',
  overflow: 'auto',
});

export type ScrollbarProps = React.ComponentProps<typeof ScrollbarRoot>;

export function Scrollbar({ children, ...other }: ScrollbarProps) {
  return <ScrollbarRoot {...other}>{children}</ScrollbarRoot>;
}
