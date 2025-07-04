import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Iconify } from '../utils/iconify';
import { User } from '../types/User';
import * as userService from '../services/userService';
import * as dietService from '../services/dietService';
import * as workoutService from '../services/workoutService';
import { useToast } from '../utils/notifications';
import { Chart } from '../utils/chart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserStats {
  totalUsers: number;
  totalDiets: number;
  totalWorkouts: number;
  usersByRole: { admin: number; user: number };
}

export const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalDiets: 0,
    totalWorkouts: 0,
    usersByRole: { admin: 0, user: 0 },
  });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    surname: '',
    email: '',
    birth_date: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadUserProfile();
    loadStats();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el usuario actual autenticado
      const user = await userService.getCurrentUser();
      
      setCurrentUser(user);
      setProfileForm({
        name: user.name,
        surname: user.surname,
        email: user.email,
        birth_date: user.birth_date,
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      const errorMessage = error.message || 'Error al cargar el perfil';
      setError(errorMessage);
      
      // Si es un error de autenticación, redirigir al login
      if (errorMessage.includes('autenticado') || errorMessage.includes('inicia sesión')) {
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [users, diets, workouts] = await Promise.all([
        userService.getUsers(),
        dietService.getDiets(),
        workoutService.getWorkouts(),
      ]);

      const usersByRole = users.reduce((acc, user) => {
        acc[user.role as keyof typeof acc] = (acc[user.role as keyof typeof acc] || 0) + 1;
        return acc;
      }, { admin: 0, user: 0 });

      setStats({
        totalUsers: users.length,
        totalDiets: diets.length,
        totalWorkouts: workouts.length,
        usersByRole,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileSubmit = async () => {
    if (!currentUser) return;

    try {
      setSaving(true);
      await userService.updateUser(currentUser.id, {
        ...profileForm,
        password: currentUser.password, // Mantener password actual
        role: currentUser.role,
      });
      
      showToast('Perfil actualizado correctamente', 'success');
      loadUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error al actualizar el perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!currentUser) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      setSaving(true);
      await userService.updateUser(currentUser.id, {
        ...profileForm,
        password: passwordForm.newPassword,
        role: currentUser.role,
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangePasswordOpen(false);
      showToast('Contraseña actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Error al actualizar la contraseña', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Datos para gráficos basados en datos reales
  const chartData = {
    categories: ['Usuarios', 'Dietas', 'Entrenamientos'],
    series: [
      {
        name: 'Total',
        data: [stats.totalUsers, stats.totalDiets, stats.totalWorkouts],
      },
    ],
  };

  const roleChartData = {
    series: [stats.usersByRole.admin, stats.usersByRole.user],
    labels: ['Administradores', 'Usuarios'],
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Cargando perfil...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No se pudo cargar la información del usuario</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <ToastContainer />
      
      {/* Header del perfil */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            <Avatar
              sx={{ 
                width: { xs: 100, sm: 80 }, 
                height: { xs: 100, sm: 80 }, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            >
              {getInitials(currentUser.name, currentUser.surname)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                {currentUser.name} {currentUser.surname}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {currentUser.email}
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
              >
                <Chip 
                  label={currentUser.role === 'admin' ? 'Administrador' : 'Usuario'} 
                  color={currentUser.role === 'admin' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip 
                  label={`${calculateAge(currentUser.birth_date)} años`} 
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader
          title="Mi Perfil"
          sx={{
            '& .MuiCardHeader-action': {
              alignSelf: 'stretch',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 2, sm: 0 },
            }
          }}
          action={
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 12px', sm: '12px 16px' },
                },
              }}
            >
              <Tab 
                label="Personal" 
                icon={<Iconify icon="solar:user-bold-duotone" width={20} />}
                iconPosition="start"
                sx={{ display: { xs: 'flex', sm: 'flex' } }}
              />
              <Tab 
                label="Estadísticas" 
                icon={<Iconify icon="solar:chart-bold-duotone" width={20} />}
                iconPosition="start"
                sx={{ display: { xs: 'flex', sm: 'flex' } }}
              />
            </Tabs>
          }
        />
        
        <Divider />

        {/* Panel de Información Personal */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined">
                <CardHeader title="Datos Personales" />
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={profileForm.surname}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, surname: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Fecha de Nacimiento"
                      type="date"
                      value={profileForm.birth_date}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, birth_date: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                    
                    <Button
                      variant="contained"
                      onClick={handleProfileSubmit}
                      disabled={saving}
                      startIcon={saving ? <Iconify icon="solar:refresh-bold-duotone" /> : <Iconify icon="solar:diskette-bold-duotone" />}
                      fullWidth={true}
                      sx={{ mt: 2 }}
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined">
                <CardHeader 
                  title="Gestión de Contraseña"
                  action={
                    <IconButton size="small" onClick={() => setChangePasswordOpen(true)}>
                      <Iconify icon="solar:lock-keyhole-bold-duotone" width={20} />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="solar:lock-keyhole-bold-duotone" />}
                      onClick={() => setChangePasswordOpen(true)}
                    >
                      Cambiar Contraseña
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Iconify icon="solar:logout-3-bold-duotone" />}
                      onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        window.location.href = '/sign-in';
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        {/* Panel de Estadísticas */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined">
                <CardHeader title="Estadísticas Generales del Sistema" />
                <CardContent>
                  <Chart
                    type="bar"
                    series={chartData.series}
                    options={{
                      chart: { height: 300 },
                      xaxis: { categories: chartData.categories },
                      colors: ['#1976d2'],
                      plotOptions: {
                        bar: {
                          horizontal: false,
                          columnWidth: '55%',
                        },
                      },
                    }}
                    height={300}
                  />
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined">
                <CardHeader title="Distribución de Usuarios por Rol" />
                <CardContent>
                  <Chart
                    type="donut"
                    series={roleChartData.series}
                    options={{
                      labels: roleChartData.labels,
                      colors: ['#1976d2', '#2e7d32'],
                      legend: { position: 'bottom' },
                    }}
                    height={300}
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
          
          {/* Resumen de datos */}
          <Box sx={{ mt: 3 }}>
            <Card variant="outlined">
              <CardHeader title="Resumen del Sistema" />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" color="primary">
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Usuarios
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" color="success.main">
                      {stats.totalDiets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Dietas
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" color="warning.main">
                      {stats.totalWorkouts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Entrenamientos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Card>

      {/* Dialog para cambiar contraseña */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:lock-keyhole-bold-duotone" width={24} />
            <Typography variant="h6">Cambiar Contraseña</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              type="password"
              label="Contraseña Actual"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              type="password"
              label="Nueva Contraseña"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              helperText="Mínimo 6 caracteres"
            />
            <TextField
              fullWidth
              type="password"
              label="Confirmar Nueva Contraseña"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePasswordSubmit}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
