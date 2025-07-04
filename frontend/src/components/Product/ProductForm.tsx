
import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Product } from '../../types/Product';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  productToEdit?: Product | null;
}

export const ProductForm = ({ open, onClose, onSubmit, productToEdit }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        description: productToEdit.description,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
      });
    }
    setErrors([]);
  }, [productToEdit, open]);

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) newErrors.push('El nombre es obligatorio');
    if (formData.price <= 0) newErrors.push('El precio debe ser mayor a 0');
    if (!formData.description.trim()) newErrors.push('La descripción es obligatoria');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      name: formData.name.trim(),
      price: formData.price,
      description: formData.description.trim(),
    });

    onClose();
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'price' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="h2">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {errors.length > 0 && (
              <Alert severity="error">
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <TextField
              fullWidth
              label="Nombre del Producto"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.some(e => e.includes('nombre'))}
              required
            />

            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={formData.price}
              onChange={handleChange('price')}
              error={errors.some(e => e.includes('precio'))}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />

            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
              error={errors.some(e => e.includes('descripción'))}
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            {productToEdit ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};