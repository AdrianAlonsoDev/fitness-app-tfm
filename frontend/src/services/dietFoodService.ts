import { DietFood } from '../types/DietFood';
import axiosInstance from '../lib/axios';

// Obtener alimentos de una dieta
export const getDietFoods = async (dietId: number): Promise<DietFood[]> => {
  try {
    const response = await axiosInstance.get(`/diet_foods?diet_id=${dietId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener alimentos de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener alimentos de la dieta');
  }
};

// Añadir alimento a dieta
export const addFoodToDiet = async (diet_id: number, food_id: number, quantity: number): Promise<DietFood> => {
  try {
    const response = await axiosInstance.post('/diet_foods', { diet_id, food_id, quantity });
    return response.data;
  } catch (error: any) {
    console.error('Error al añadir alimento a la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al añadir alimento a la dieta');
  }
};

// Eliminar alimento de dieta
export const removeFoodFromDiet = async (dietFoodId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/diet_foods/${dietFoodId}`);
  } catch (error: any) {
    console.error('Error al eliminar alimento de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar alimento de la dieta');
  }
};