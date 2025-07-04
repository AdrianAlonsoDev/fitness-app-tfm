import { Iconify } from '../utils/iconify';

// ----------------------------------------------------------------------

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Iconify icon="solar:home-2-bold-duotone" width={24} />,
  },
  {
    title: 'Usuarios',
    path: '/dashboard/users',
    icon: <Iconify icon="solar:users-group-two-rounded-bold-duotone" width={24} />,
  },
  {
    title: 'Dietas',
    path: '/dashboard/diets',
    icon: <Iconify icon="solar:chef-hat-bold-duotone" width={24} />,
  },
  {
    title: 'Entrenamientos',
    path: '/dashboard/workouts',
    icon: <Iconify icon="solar:dumbbell-bold-duotone" width={24} />,
  },
  {
    title: 'Productos',
    path: '/dashboard/products',
    icon: <Iconify icon="solar:bag-4-bold-duotone" width={24} />,
  },
  {
    title: 'Perfil',
    path: '/dashboard/profile',
    icon: <Iconify icon="solar:user-circle-bold-duotone" width={24} />,
  },
];
