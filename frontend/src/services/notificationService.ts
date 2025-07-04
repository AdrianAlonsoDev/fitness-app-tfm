import axiosInstance from '../lib/axios';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  icon?: string;
}

export const generateSystemNotifications = async (): Promise<SystemNotification[]> => {
  try {
    const [usersResponse, dietsResponse, workoutsResponse, productsResponse] = await Promise.all([
      axiosInstance.get('/users').catch(() => ({ data: [] })),
      axiosInstance.get('/diets').catch(() => ({ data: [] })),
      axiosInstance.get('/workouts').catch(() => ({ data: [] })),
      axiosInstance.get('/products').catch(() => ({ data: [] })),
    ]);

    const users = usersResponse.data;
    const diets = dietsResponse.data;
    const workouts = workoutsResponse.data;
    const products = productsResponse.data;

    console.log('📊 Datos para notificaciones:', { 
      usuarios: users.length, 
      dietas: diets.length, 
      entrenamientos: workouts.length, 
      productos: products.length 
    });

    // Debug: ver la estructura de los usuarios
    if (users.length > 0) {
      console.log('👤 Ejemplo de usuario:', users[0]);
      console.log('📅 Fechas de usuarios:', users.map((u: any) => ({
        id: u.id,
        name: u.name,
        created_at: u.created_at,
        fechaParsed: u.created_at ? new Date(u.created_at) : 'Sin fecha'
      })));
    }

    const notifications: SystemNotification[] = [];
    const now = new Date();

    // Solo usuarios de los últimos 3 días
    const recentUsers = users.filter((user: any) => {
      if (!user.created_at) {
        console.log('❌ Usuario sin created_at:', user);
        return false;
      }
      const created = new Date(user.created_at);
      if (isNaN(created.getTime())) {
        console.log('❌ Fecha inválida para usuario:', user.created_at);
        return false;
      }
      const diffMs = now.getTime() - created.getTime();
      
      return diffMs < 3 * 24 * 60 * 60 * 1000; // 3 días
    }).slice(0, 100); // Mostrar hasta 10 usuarios recientes

    console.log('👥 Usuarios recientes encontrados:', recentUsers.length);

    // Crear una sola notificación con el contador de usuarios recientes
    if (recentUsers.length > 0) {
      const userNames = recentUsers.slice(0, 3).map((u: any) => u.name || 'Usuario').join(', ');
      const moreCount = recentUsers.length > 3 ? ` y ${recentUsers.length - 3} más` : '';
      
      notifications.push({
        id: 'recent-users',
        title: 'Nuevos usuarios registrados',
        message: `${recentUsers.length} usuario${recentUsers.length > 1 ? 's' : ''} registrado${recentUsers.length > 1 ? 's' : ''} en los últimos 3 días: ${userNames}${moreCount}`,
        type: 'success',
        timestamp: new Date(recentUsers[0].created_at), // Usar la fecha del más reciente
        read: false,
        icon: 'solar:users-group-two-rounded-bold-duotone',
      });
    }

    // Notificaciones de bienvenida y estado del sistema
    if (notifications.length === 0) {
      // Mostrar estadísticas generales si no hay actividad reciente
      notifications.push({
        id: 'system-stats',
        title: 'Sistema Fitness App',
        message: `Sistema activo: ${users.length} usuarios, ${diets.length} dietas, ${workouts.length} entrenamientos`,
        type: 'info',
        timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutos atrás
        read: false,
        icon: 'solar:chart-bold-duotone',
      });
      
      notifications.push({
        id: 'welcome',
        title: 'Bienvenido al Dashboard',
        message: 'Todo funcionando correctamente. Gestiona usuarios, dietas y entrenamientos desde aquí.',
        type: 'success',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutos atrás
        read: false,
        icon: 'solar:shield-check-bold-duotone',
      });
    }

    console.log('🔔 Notificaciones generadas:', notifications.length);
    
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  } catch (error) {
    return [{
      id: 'error',
      title: 'Error de conexión',
      message: 'No se pudo conectar al servidor',
      type: 'error',
      timestamp: new Date(),
      read: false,
      icon: 'solar:wifi-router-minimalistic-bold-duotone',
    }];
  }
};
