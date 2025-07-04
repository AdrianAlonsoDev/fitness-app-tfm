import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { Iconify } from '../utils/iconify';
import { Chart } from '../utils/chart';
import * as userService from '../services/userService';
import * as dietService from '../services/dietService';
import * as workoutService from '../services/workoutService';
import * as productService from '../services/productService';

interface DashboardStats {
  totalUsers: number;
  totalDiets: number;
  totalWorkouts: number;
  totalProducts: number;
  usersByRole: { role: string; count: number }[];
  recentActivity: number;
  monthlyData: {
    users: number[];
    workouts: number[];
    categories: string[];
  };
}

export const HomePage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDiets: 0,
    totalWorkouts: 0,
    totalProducts: 0,
    usersByRole: [],
    recentActivity: 0,
    monthlyData: {
      users: [],
      workouts: [],
      categories: [],
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const [users, diets, workouts, products] = await Promise.all([
        userService.getUsers(),
        dietService.getDiets(),
        workoutService.getWorkouts(),
        productService.getProducts(),
      ]);

      // Calcular estadísticas de usuarios por rol
      const roleStats = users.reduce((acc: { [key: string]: number }, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const usersByRole = Object.entries(roleStats).map(([role, count]) => ({
        role,
        count: count as number,
      }));

      // Calcular datos mensuales reales (últimos 7 meses)
      const monthlyData = calculateMonthlyData(users, workouts);

      setStats({
        totalUsers: users.length,
        totalDiets: diets.length,
        totalWorkouts: workouts.length,
        totalProducts: products.length,
        usersByRole,
        recentActivity: users.filter(user => {
          // Calcular usuarios recientes (últimos 30 días)
          const createdAt = new Date(user.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdAt >= thirtyDaysAgo;
        }).length,
        monthlyData,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyData = (users: any[], workouts: any[]) => {
    const months = [];
    const userCounts = [];
    const workoutCounts = [];
    
    // Últimos 7 meses
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      months.push(date.toLocaleDateString('es-ES', { month: 'short' }));
      
      // Contar usuarios creados en este mes
      const usersInMonth = users.filter(user => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        const userMonthYear = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
        return userMonthYear === monthYear;
      }).length;
      
      // Contar entrenamientos creados en este mes
      const workoutsInMonth = workouts.filter(workout => {
        if (!workout.created_at) return false;
        const workoutDate = new Date(workout.created_at);
        const workoutMonthYear = `${workoutDate.getFullYear()}-${String(workoutDate.getMonth() + 1).padStart(2, '0')}`;
        return workoutMonthYear === monthYear;
      }).length;
      
      userCounts.push(usersInMonth);
      workoutCounts.push(workoutsInMonth);
    }
    
    return {
      users: userCounts,
      workouts: workoutCounts,
      categories: months,
    };
  };

  const quickActions = [
    {
      title: 'Usuarios',
      description: 'Gestiona los perfiles de tus clientes',
      icon: 'solar:users-group-two-rounded-bold-duotone',
      color: '#4CAF50',
      path: '/dashboard/users',
    },
    {
      title: 'Dietas',
      description: 'Crea y administra planes nutricionales',
      icon: 'solar:chef-hat-bold-duotone',
      color: '#2196F3',
      path: '/dashboard/diets',
    },
    {
      title: 'Entrenamientos',
      description: 'Diseña rutinas de ejercicios personalizadas',
      icon: 'solar:dumbbell-bold-duotone',
      color: '#FF9800',
      path: '/dashboard/workouts',
    },
    {
      title: 'Productos',
      description: 'Administra tu catálogo de productos',
      icon: 'solar:bag-4-bold-duotone',
      color: '#9C27B0',
      path: '/dashboard/products',
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🏋️ Fitness Management System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
          Gestiona tu negocio de entrenamiento personal de manera eficiente
        </Typography>
      </Box>

      {/* Estadísticas del Dashboard */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Resumen del Sistema
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Iconify icon="solar:users-group-two-rounded-bold-duotone" sx={{ color: 'white', width: 32, height: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {loading ? '...' : stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Total Usuarios
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(240, 147, 251, 0.4)',
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Iconify icon="solar:chef-hat-bold-duotone" sx={{ color: 'white', width: 32, height: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {loading ? '...' : stats.totalDiets}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Dietas Activas
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(79, 172, 254, 0.4)',
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Iconify icon="solar:dumbbell-bold-duotone" sx={{ color: 'white', width: 32, height: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {loading ? '...' : stats.totalWorkouts}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Entrenamientos
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(250, 112, 154, 0.4)',
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Iconify icon="solar:bag-4-bold-duotone" sx={{ color: 'white', width: 32, height: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {loading ? '...' : stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Productos
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Acciones Rápidas */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Acciones Rápidas
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {quickActions.map((action) => (
          <Card
            key={action.title}
            sx={{
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: action.color + '14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Iconify icon={action.icon} width={32} sx={{ color: action.color }} />
              </Box>
              
              <Typography variant="h6" component="h2" gutterBottom>
                {action.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {action.description}
              </Typography>
              
              <Button
                component={Link}
                to={action.path}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: action.color,
                  '&:hover': {
                    bgcolor: action.color,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                Acceder
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Analytics Section - Solo datos reales */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Análisis y Estadísticas
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Users by Role Chart */}
          <Card sx={{ p: 3 }}>
            <CardHeader 
              title="Usuarios por Rol"
              subheader="Distribución actual"
              sx={{ pb: 2 }}
            />
            <Box sx={{ height: 300 }}>
              {stats.usersByRole.length > 0 ? (
                <Chart
                  type="donut"
                  series={stats.usersByRole.map(item => item.count)}
                  options={{
                    labels: stats.usersByRole.map(item => item.role || 'Sin rol'),
                    colors: ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0'],
                    legend: {
                      position: 'bottom'
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '70%'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography color="text.secondary">No hay datos de usuarios disponibles</Typography>
                </Box>
              )}
            </Box>
          </Card>

          {/* System Overview */}
          <Card sx={{ p: 3 }}>
            <CardHeader 
              title="Resumen del Sistema"
              subheader="Datos actuales"
              sx={{ pb: 2 }}
            />
            <Box sx={{ height: 300 }}>
              <Chart
                type="bar"
                series={[
                  {
                    name: 'Cantidad',
                    data: [stats.totalUsers, stats.totalDiets, stats.totalWorkouts, stats.totalProducts]
                  }
                ]}
                options={{
                  chart: {
                    toolbar: { show: false }
                  },
                  colors: ['#2196F3'],
                  xaxis: {
                    categories: ['Usuarios', 'Dietas', 'Entrenamientos', 'Productos']
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      columnWidth: '60%'
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Stats Section - Solo datos reales */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Resumen del Sistema
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mt: 2,
          }}
        >
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuarios Registrados
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" gutterBottom>
                {stats.totalDiets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dietas Creadas
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main" gutterBottom>
                {stats.totalWorkouts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Entrenamientos
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="secondary.main" gutterBottom>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Productos
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Análisis Avanzado */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Análisis del Negocio
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
            mt: 3,
          }}
        >
          {/* Gráfico de Usuarios por Rol */}
          <Card sx={{ p: 3 }}>
            <CardHeader 
              title="Distribución de Usuarios"
              subheader="Por tipo de rol en el sistema"
              sx={{ pb: 2 }}
            />
            <Box sx={{ height: 300 }}>
              <Chart
                type="donut"
                series={stats.usersByRole.map(item => item.count)}
                options={{
                  labels: stats.usersByRole.map(item => {
                    switch(item.role) {
                      case 'admin': return 'Administradores';
                      case 'client': return 'Clientes';
                      default: return item.role;
                    }
                  }),
                  colors: ['#FF5722', '#4CAF50'],
                  legend: {
                    position: 'bottom'
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: function(val: number) {
                      return Math.round(val) + '%';
                    }
                  }
                }}
              />
            </Box>
          </Card>

          {/* Actividad Reciente */}
          <Card sx={{ p: 3 }}>
            <CardHeader 
              title="Actividad del Sistema"
              subheader="Métricas de rendimiento mensual"
              sx={{ pb: 2 }}
            />
            <Box sx={{ height: 300 }}>
              <Chart
                type="line"
                series={[
                  {
                    name: 'Nuevos Usuarios',
                    data: stats.monthlyData.users
                  },
                  {
                    name: 'Entrenamientos Creados',
                    data: stats.monthlyData.workouts
                  }
                ]}
                options={{
                  xaxis: {
                    categories: stats.monthlyData.categories
                  },
                  colors: ['#2196F3', '#FF9800'],
                  stroke: {
                    curve: 'smooth',
                    width: 2
                  },
                  markers: {
                    size: 4
                  }
                }}
              />
            </Box>
          </Card>

          {/* Progreso de Objetivos */}
          <Card sx={{ p: 3 }}>
            <CardHeader 
              title="Objetivos Mensuales"
              subheader="Progreso hacia las metas establecidas"
              sx={{ pb: 2 }}
            />
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">Nuevos Clientes</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalUsers}/{Math.max(stats.totalUsers + 10, 50)}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((stats.totalUsers / Math.max(stats.totalUsers + 10, 50)) * 100, 100)} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">Planes de Dieta</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalDiets}/{Math.max(stats.totalDiets + 5, 30)}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((stats.totalDiets / Math.max(stats.totalDiets + 5, 30)) * 100, 100)} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">Entrenamientos</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalWorkouts}/{Math.max(stats.totalWorkouts + 15, 100)}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((stats.totalWorkouts / Math.max(stats.totalWorkouts + 15, 100)) * 100, 100)} 
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">Productos en Catálogo</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalProducts}/{Math.max(stats.totalProducts + 3, 20)}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((stats.totalProducts / Math.max(stats.totalProducts + 3, 20)) * 100, 100)} 
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
          </Card>

          {/* Resumen de Datos Reales */}
          <Card sx={{ p: 3 }}>
            <CardHeader 
              title="Resumen del Sistema"
              subheader="Información en tiempo real"
              sx={{ pb: 2 }}
            />
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  {stats.recentActivity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios nuevos este mes
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" color="success.main" gutterBottom>
                  {stats.totalUsers > 0 ? Math.round((stats.totalWorkouts / stats.totalUsers) * 100) / 100 : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Entrenamientos promedio por usuario
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  {stats.usersByRole.find(r => r.role === 'client')?.count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clientes registrados
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip 
                  label="Datos Reales" 
                  color="success" 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label="Backend Activo" 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};
