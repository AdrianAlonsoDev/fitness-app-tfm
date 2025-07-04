import { useState, useEffect } from 'react';
import {
  Box,
  Alert,
} from '@mui/material';
import { Product } from '../../types/Product';
import * as productService from '../../services/productService';
import { useToast } from '../../utils/notifications';
import { useExport } from '../../utils/hooks/useExport';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { showToast, ToastContainer } = useToast();
  const { exportToCSV, exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setError(null);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setError(null);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        showToast('Producto eliminado exitosamente', 'success');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error al eliminar producto', 'error');
      }
    }
  };

  const handleSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      setError(null);
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        showToast('Producto actualizado exitosamente', 'success');
      } else {
        await productService.createProduct(productData);
        showToast('Producto creado exitosamente', 'success');
      }
      setOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Error al guardar el producto. Por favor, intenta de nuevo.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const headers = ['ID', 'Nombre', 'Descripción', 'Precio'];
    const data = products.map(product => [
      product.id.toString(),
      product.name,
      product.description,
      product.price ? `$${product.price}` : 'N/A'
    ]);

    const exportData = {
      headers,
      data,
      filename: 'productos',
      title: 'Productos'
    };

    switch (format) {
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'pdf':
        exportToPDF(exportData);
        break;
      case 'excel':
        exportToExcel(exportData);
        break;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <ToastContainer />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onCreateNew={handleAdd}
        loading={loading}
      />

      <ProductForm
        open={open}
        productToEdit={editingProduct}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};
