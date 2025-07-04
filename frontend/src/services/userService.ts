import { User } from '../types/User';
import axiosInstance from '../lib/axios';
import { supabase } from '../lib/supabase';


export const getUsers = async (): Promise<User[]> => {
  console.log('Frontend: Solicitando lista de usuarios');
  try {
    const response = await axiosInstance.get('/users');
    console.log(`Frontend: Recibidos ${response.data.length} usuarios`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
};


export const getUser = async (id: number): Promise<User> => {
  console.log(`Frontend: Solicitando usuario con ID ${id}`);
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    console.log('Frontend: Usuario recibido', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener usuario');
  }
};


export const createUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<User> => {
  console.log('Frontend: Creando nuevo usuario', user);
  try {
    const response = await axiosInstance.post('/users', user);
    console.log('Frontend: Usuario creado exitosamente', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear usuario');
  }
};


export const updateUser = async (id: number, user: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User> => {
  console.log(`Frontend: Actualizando usuario con ID ${id}`);
  try {
    const response = await axiosInstance.put(`/users/${id}`, user);
    console.log('Frontend: Usuario actualizado', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
  }
};


export const deleteUser = async (id: number): Promise<void> => {
  console.log(`Frontend: Eliminando usuario con ID ${id}`);
  try {
    await axiosInstance.delete(`/users/${id}`);
    console.log('Frontend: Usuario eliminado exitosamente');
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  console.log('Frontend: Obteniendo usuario actual autenticado');
  try {
    // Obtener el usuario de la sesión de Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    console.log('Supabase Auth User:', authUser);
    console.log('Supabase Auth Error:', authError);
    
    if (authError || !authUser) {
      console.error('No hay usuario autenticado:', authError);
      throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
    }

    // Obtener el usuario correspondiente de nuestra tabla
    console.log('Realizando petición a /users/profile...');
    const response = await axiosInstance.get('/users/profile');
    console.log('Frontend: Usuario actual recibido', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener usuario actual:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }
    throw new Error(error.response?.data?.message || error.message || 'Error al obtener usuario actual');
  }
};
