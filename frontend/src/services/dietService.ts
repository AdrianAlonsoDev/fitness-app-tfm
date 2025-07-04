import { Diet } from '../types/Diet';
import { DietWithFoods } from '../types/DietWithFoods';
import { DietFood } from '../types/DietFood';
import axiosInstance from '../lib/axios';


// Obtener todas las dietas
export const getDiets = async (): Promise<Diet[]> => {
  try {
    const response = await axiosInstance.get('/diets');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener dietas:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener dietas');
  }
};

// Obtener todas las dietas con alimentos
export const getDietsWithFoods = async (): Promise<DietWithFoods[]> => {
  try {
    console.log('📡 DietService: Solicitando dietas con alimentos...');
    const response = await axiosInstance.get('/diets/with-foods');
    console.log('✅ DietService: Respuesta recibida:', response.data.length, 'dietas');
    return response.data;
  } catch (error: any) {
    console.error('❌ DietService: Error al obtener dietas con alimentos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener dietas con alimentos');
  }
};

// Obtener detalles de una dieta (con alimentos)
export const getDietWithFoods = async (id: number): Promise<DietWithFoods> => {
  try {
    const response = await axiosInstance.get(`/diets/${id}/details`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener detalles de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'No se pudieron cargar los detalles de la dieta');
  }
};

// Crear dieta
export const createDiet = async (diet: Omit<Diet, 'id'>): Promise<Diet> => {
  try {
    const response = await axiosInstance.post('/diets', diet);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear dieta');
  }
};

// Actualizar dieta
export const updateDiet = async (id: number, diet: Omit<Diet, 'id'>): Promise<Diet> => {
  try {
    const response = await axiosInstance.put(`/diets/${id}`, diet);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al actualizar dieta');
  }
};

// Eliminar dieta
export const deleteDiet = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/diets/${id}`);
  } catch (error: any) {
    console.error('Error al eliminar dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar dieta');
  }
};


// Añadir alimentos a una dieta (relación dieta-alimentos)
export const addFoodsToDiet = async (
  dietId: number,
  foods: DietFood[]
) => {
  try {
    const payload = foods.map((food) => ({
      ...food,
      diet_id: dietId
    }));

    const response = await axiosInstance.post('/diet_foods', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error al guardar alimentos de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al guardar alimentos de la dieta');
  }
};

// Eliminar todos los alimentos de una dieta
export const removeAllFoodsFromDiet = async (dietId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/diet_foods/diet/${dietId}`);
  } catch (error: any) {
    console.error('Error al eliminar alimentos de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar alimentos de la dieta');
  }
};

// Obtener usuarios asignados a una dieta
export const getDietUsers = async (dietId: number) => {
  try {
    const response = await axiosInstance.get(`/diets/${dietId}/users`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener usuarios de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios de la dieta');
  }
};

// Asignar usuario a dieta
export const assignUserToDiet = async (dietId: number, userId: number) => {
  try {
    const response = await axiosInstance.post(`/diets/${dietId}/users`, { userId });
    return response.data;
  } catch (error: any) {
    console.error('Error al asignar usuario a la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al asignar usuario a la dieta');
  }
};

// Quitar usuario de dieta
export const removeUserFromDiet = async (dietId: number, userId: number) => {
  try {
    const response = await axiosInstance.delete(`/diets/${dietId}/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error al quitar usuario de la dieta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al quitar usuario de la dieta');
  }
};

