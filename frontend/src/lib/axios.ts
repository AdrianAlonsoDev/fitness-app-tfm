/**
 * Configuración de Axios con interceptor para autenticación automática
 * @description Agrega automáticamente el token JWT de Supabase a todas las requests
 */

import axios from 'axios';
import { supabase } from './supabase';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - Agregar token automáticamente
axiosInstance.interceptors.request.use(
  async (config) => {
    try {

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Error al obtener sesión:', error.message);
        return config;
      }

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('✅ Token agregado a la request:', config.url);
      } else {
        console.warn('⚠️ No hay sesión activa para:', config.url);
      }
      
      return config;
    } catch (error) {
      console.error('Error en interceptor de request:', error);
      return config;
    }
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - Manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (no autorizado) y no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !session) {
          console.error('No se pudo refrescar la sesión, redirigiendo al login');
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }

        // Si se pudo refrescar, reintentar la request original
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error('Error al refrescar sesión:', refreshError);
        window.location.href = '/sign-in';
        return Promise.reject(error);
      }
    }

    // Para otros errores, mostrar mensaje y rechazar
    if (error.response?.status === 403) {
      console.error('❌ Acceso denegado:', error.response.data?.message);
    } else if (error.response?.status >= 500) {
      console.error('❌ Error del servidor:', error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
