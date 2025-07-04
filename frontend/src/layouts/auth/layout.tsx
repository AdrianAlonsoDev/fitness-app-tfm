import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Iconify } from '../../utils/iconify';

// ----------------------------------------------------------------------

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <StyledRoot>
      <StyledContent>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 4,
              width: 1,
              maxWidth: 420,
              mx: 'auto',
              boxShadow: (theme) => theme.shadows[10],
            }}
          >
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Iconify 
                  icon="solar:dumbbell-bold-duotone" 
                  width={48} 
                  sx={{ color: 'primary.main', mr: 1 }} 
                />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  Fitness App
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 0 }}>
              {children}
            </CardContent>
          </Card>
        </Container>
      </StyledContent>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}14 0%, ${theme.palette.secondary.main}14 100%)`,
  position: 'relative',
  
  // Background pattern
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.slice(1)}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
}));

const StyledContent = styled('div')({
  width: '100%',
  position: 'relative',
  zIndex: 1,
});
