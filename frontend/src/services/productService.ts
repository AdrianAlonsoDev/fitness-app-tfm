import { Product } from '../types/Product';
import axiosInstance from '../lib/axios';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get('/products');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener productos');
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await axiosInstance.post('/products', product);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear producto:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear producto');
  }
};

export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, product);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar producto:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al actualizar producto');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/${id}`);
  } catch (error: any) {
    console.error('Error al eliminar producto:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar producto');
  }
};
