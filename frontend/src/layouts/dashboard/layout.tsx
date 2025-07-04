import type { Breakpoint } from '@mui/material/styles'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Badge from '@mui/material/Badge'

import { Iconify } from '../../utils/iconify'
import { NotificationsPopover } from '../../utils/notifications/notifications-popover'
import { useNotifications } from '../../utils/hooks/useNotifications'

import { LayoutSection } from '../core/layout-section'
import { HeaderSection } from '../core/header-section'
import { MainSection } from '../core/main-section'

import { NavDesktop, NavMobile } from './nav'
import { navData } from '../nav-config-dashboard'
import { dashboardLayoutVars } from './css-vars'

import type { LayoutSectionProps } from '../core/layout-section'
import type { HeaderSectionProps } from '../core/header-section'
import type { MainSectionProps } from '../core/main-section'

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint
  slotProps?: {
    header?: HeaderSectionProps
    main?: MainSectionProps
  }
}

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg'
}: DashboardLayoutProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const [navOpen, setNavOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/sign-in')
    handleUserMenuClose()
  }

  const layoutSectionSlots = {
    headerSection: (
      <HeaderSection
        layoutQuery={layoutQuery}
        slots={{
          leftArea: (
            <>
              <IconButton
                onClick={() => setNavOpen(true)}
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Iconify
                  icon='solar:hamburger-menu-bold-duotone'
                  width={isMobile ? 24 : 28}
                />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                  ml: { xs: 1, sm: 0 }
                }}
              >
                <img
                  src='/src/assets/logo.png'
                  alt='Fitness App Logo'
                  className='logo-image topbar-logo'
                  style={{
                    maxHeight: '45px',
                    maxWidth: '200px',
                    minHeight: '35px',
                    minWidth: '140px',
                    height: 'auto',
                    width: 'auto',
                    objectFit: 'contain',
                    filter:
                      theme.palette.mode === 'dark'
                        ? 'brightness(0) invert(1)'
                        : 'brightness(0)'
                  }}
                  onError={(e) => {
                    // Fallback to text + icon if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) {
                      fallback.style.display = 'flex'
                      fallback.classList.add('fallback')
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
                  <Iconify
                    icon='solar:dumbbell-bold-duotone'
                    width={32}
                    color='primary.main'
                  />
                  <Typography variant='h5' color='primary' fontWeight='bold'>
                    Fitness App
                  </Typography>
                </Box>
              </Box>
            </>
          ),
          rightArea: (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 }
              }}
            >
              <Badge badgeContent={unreadCount} color='error'>
                <IconButton
                  onClick={handleNotificationsOpen}
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Iconify
                    icon='solar:bell-bold-duotone'
                    width={isMobile ? 24 : 28}
                  />
                </IconButton>
              </Badge>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Iconify
                  icon='solar:user-circle-bold-duotone'
                  width={isMobile ? 24 : 28}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: { width: 200 }
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/dashboard/profile')
                    handleUserMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Iconify icon='solar:user-bold-duotone' width={24} />
                  </ListItemIcon>
                  <ListItemText>Perfil</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Iconify icon='solar:logout-bold-duotone' width={24} />
                  </ListItemIcon>
                  <ListItemText>Cerrar Sesión</ListItemText>
                </MenuItem>
              </Menu>

              <NotificationsPopover
                anchorEl={notificationsAnchorEl}
                onClose={handleNotificationsClose}
              />
            </Box>
          )
        }}
        {...slotProps?.header}
      />
    ),
    sidebarSection: (
      <>
        <NavDesktop data={navData} layoutQuery={layoutQuery} />
        <NavMobile
          data={navData}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />
      </>
    )
  }

  const layoutSectionCssVars = {
    ...dashboardLayoutVars(theme),
    ...cssVars
  }

  return (
    <LayoutSection
      sx={[
        {
          minHeight: '100vh',
          ...(navOpen && {
            overflow: 'hidden'
          })
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      cssVars={layoutSectionCssVars}
      {...layoutSectionSlots}
    >
      <MainSection
        sx={{
          pl: {
            [layoutQuery]: 'calc(var(--layout-nav-vertical-width) + 16px)'
          },
          pt: 'calc(var(--layout-header-desktop-height) + 16px)',
          pb: 2,
          pr: 2
        }}
        {...slotProps?.main}
      >
        {children}
      </MainSection>
    </LayoutSection>
  )
}
