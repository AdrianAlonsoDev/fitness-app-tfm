import { Food } from '../types/Food';
import axiosInstance from '../lib/axios';

export const getFoods = async (): Promise<Food[]> => {
  try {
    const response = await axiosInstance.get('/foods');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener alimentos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener alimentos');
  }
};

export const createFood = async (food: Omit<Food, 'id'>): Promise<Food> => {
  try {
    const response = await axiosInstance.post('/foods', food);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear alimento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear alimento');
  }
};

export const updateFood = async (id: number, food: Omit<Food, 'id'>): Promise<Food> => {
  try {
    const response = await axiosInstance.put(`/foods/${id}`, food);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar alimento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al actualizar alimento');
  }
};

export const deleteFood = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/foods/${id}`);
  } catch (error: any) {
    console.error('Error al eliminar alimento:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar alimento');
  }
};