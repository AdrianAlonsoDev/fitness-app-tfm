import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { User } from '../../types/User';
import * as userService from '../../services/userService';
import { useToast } from '../../utils/notifications';
import { useExport } from '../../utils/hooks/useExport';
import { UserList } from './UserList';
import { UserForm } from './UserForm';

export const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { showToast, ToastContainer } = useToast();
  const { exportToPDF, exportToExcel, exportToCSV } = useExport();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      showToast('Error al cargar los usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      await userService.createUser(userData);
      showToast('Usuario creado correctamente', 'success');
      loadUsers();
    } catch (error) {
      console.error('Error creando usuario:', error);
      showToast('Error al crear el usuario', 'error');
      throw error;
    }
  };

  const handleUpdateUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    if (!editingUser) return;
    
    try {
      await userService.updateUser(editingUser.id, userData);
      showToast('Usuario actualizado correctamente', 'success');
      loadUsers();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      showToast('Error al actualizar el usuario', 'error');
      throw error;
    }
  };

  const handleSubmitUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    if (editingUser) {
      await handleUpdateUser(userData);
    } else {
      await handleCreateUser(userData);
    }
    handleCloseForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await userService.deleteUser(id);
        showToast('Usuario eliminado correctamente', 'success');
        loadUsers();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        showToast('Error al eliminar el usuario', 'error');
      }
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Fecha Nacimiento', 'Rol'];
    const data = users.map(user => [
      user.id.toString(),
      user.name,
      user.surname,
      user.email,
      user.birth_date ? new Date(user.birth_date).toLocaleDateString('es-ES') : 'N/A',
      user.role === 'admin' ? 'Administrador' : 'Cliente'
    ]);

    const exportData = {
      headers,
      data,
      filename: `usuarios_${new Date().toISOString().split('T')[0]}`,
      title: 'Reporte de Usuarios'
    };

    switch (format) {
      case 'pdf':
        exportToPDF(exportData);
        showToast('Reporte PDF generado correctamente', 'success');
        break;
      case 'excel':
        exportToExcel(exportData);
        showToast('Archivo Excel descargado correctamente', 'success');
        break;
      case 'csv':
        exportToCSV(exportData);
        showToast('Archivo CSV descargado correctamente', 'success');
        break;
    }
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <ToastContainer />
      
      <UserList
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onCreateNew={handleCreateNew}
      />

      <UserForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitUser}
        userToEdit={editingUser}
      />
    </Box>
  );
};
