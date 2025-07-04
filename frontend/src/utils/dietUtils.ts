import { DietWithFoods } from '../types/DietWithFoods';

/**
 * Calcula las calorías totales de una dieta basándose en los alimentos agregados
 * @param diet - La dieta con sus alimentos
 * @returns El total de calorías calculadas
 */
export const calculateDietCalories = (diet: DietWithFoods): number => {
  if (!diet.diet_foods || diet.diet_foods.length === 0) {
    return 0;
  }
  
  return diet.diet_foods.reduce((total, dietFood) => {
    if (dietFood.foods && dietFood.quantity) {
      // Calcular calorías: (calorías por 100g * cantidad en gramos) / 100
      const foodCalories = (dietFood.foods.calories * dietFood.quantity) / 100;
      return total + Math.round(foodCalories);
    }
    return total;
  }, 0);
};

/**
 * Formatea las calorías para mostrarlas en la UI
 * @param calories - Número de calorías
 * @returns String formateado con "cal"
 */
export const formatCalories = (calories: number): string => {
  return `${calories} cal`;
};

/**
 * Calcula las calorías de un alimento específico según su cantidad
 * @param caloriesPer100g - Calorías por 100g del alimento
 * @param quantity - Cantidad en gramos
 * @returns Calorías calculadas
 */
export const calculateFoodCalories = (caloriesPer100g: number, quantity: number): number => {
  return Math.round((caloriesPer100g * quantity) / 100);
};
