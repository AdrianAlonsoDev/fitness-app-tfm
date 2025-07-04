import type { Breakpoint } from '@mui/material/styles';

import { useLocation, Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import { Iconify } from '../../utils/iconify';
import { Scrollbar } from '../../utils/scrollbar';

import type { NavItem } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  onItemClick?: () => void; // Para cerrar el menú móvil
};

export function NavDesktop({
  data,
  slots,
  layoutQuery = 'lg',
}: NavContentProps & { layoutQuery?: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: '100vh',
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: theme.zIndex.drawer + 1,
        width: 280,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  // El menú se cerrará cuando el usuario haga click fuera (onClose del Drawer)
  // o cuando navegue manualmente usando onItemClick

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 280,
          zIndex: 1300, // Asegurar que esté por encima de otros elementos
        },
      }}
    >
      <NavContent data={data} slots={slots} onItemClick={onClose} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, onItemClick }: NavContentProps) {
  const location = useLocation();
  const theme = useTheme();

  return (
    <>
      {/* Logo */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <img 
          src="/src/assets/logo.png" 
          alt="Fitness App Logo" 
          className="logo-image sidebar-logo"
          style={{
            maxHeight: '40px',
            maxWidth: '180px',
            minHeight: '30px',
            minWidth: '120px',
            height: 'auto',
            width: 'auto',
            objectFit: 'contain',
            filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
          }}
          onError={(e) => {
            // Fallback to text + icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
              fallback.classList.add('fallback');
            }
          }}
        />
        <Box 
          sx={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: 1,
            '&.fallback': { display: 'flex !important' }
          }}
        >
          <Iconify icon="solar:dumbbell-bold-duotone" width={28} color="primary.main" />
          <Typography variant="h5" color="primary" fontWeight="bold">
            Fitness App
          </Typography>
        </Box>
      </Box>

      {slots?.topArea}

      {/* Navigation Items */}
      <Scrollbar>
        <Box
          component="nav"
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {data.map((item) => {
              const isActive = item.path === location.pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={onItemClick} // Cerrar menú móvil al hacer click
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: theme.palette.text.secondary,
                      minHeight: 44,
                      ...(isActive && {
                        fontWeight: 'fontWeightSemiBold',
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main + '14', // 8% opacity
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '29', // 16% opacity
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    <Box component="span" sx={{ flexGrow: 1 }}>
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
