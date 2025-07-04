import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Iconify } from '../../utils/iconify';
import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
            {product.name}
          </Typography>
          <Chip
            label={formatPrice(product.price)}
            color="primary"
            variant="filled"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {product.description}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          onClick={() => onEdit(product)}
          sx={{
            color: 'primary.main',
            '&:hover': { bgcolor: 'primary.lighter' },
          }}
        >
          <Iconify icon="eva:edit-2-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={() => onDelete(product.id)}
          sx={{
            color: 'error.main',
            '&:hover': { bgcolor: 'error.lighter' },
          }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>
      </CardActions>
    </Card>
  );
};