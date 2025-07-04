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
import { DietWithFoods } from '../../types/DietWithFoods';
import { calculateDietCalories, formatCalories } from '../../utils/dietUtils';

interface DietCardProps {
  diet: DietWithFoods;
  userName?: string;
  onEdit: (diet: DietWithFoods) => void;
  onDelete: (id: number) => void;
  onViewDetails: (diet: DietWithFoods) => void;
  onManageFoods?: (diet: DietWithFoods) => void;
  onManageUsers?: (diet: DietWithFoods) => void;
}

export const DietCard = ({
  diet,
  userName,
  onEdit,
  onDelete,
  onViewDetails,
  onManageFoods,
  onManageUsers,
}: DietCardProps) => {
  const foodsCount = diet.diet_foods?.length ?? diet.foods?.length ?? 0;

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
            {diet.name}
          </Typography>
          {userName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Asignado a: {userName}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={formatCalories(calculateDietCalories(diet))}
              color="primary"
              size="small"
            />
            <Chip
              icon={<Iconify icon="solar:apple-bold" sx={{ width: 14, height: 14 }} />}
              label={`${foodsCount} alimentos`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {diet.description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <IconButton
          size="small"
          onClick={() => onViewDetails(diet)}
          sx={{
            color: 'info.main',
            '&:hover': { bgcolor: 'info.lighter' },
          }}
        >
          <Iconify icon="eva:eye-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>
        <Box>
          {onManageFoods && (
            <IconButton
              size="small"
              onClick={() => onManageFoods(diet)}
              sx={{
                color: 'secondary.main',
                '&:hover': { bgcolor: 'secondary.lighter' },
                mr: 0.5,
              }}
            >
              <Iconify icon="solar:apple-bold" sx={{ width: 18, height: 18 }} />
            </IconButton>
          )}
          {onManageUsers && (
            <IconButton
              size="small"
              onClick={() => onManageUsers(diet)}
              sx={{
                color: 'info.main',
                '&:hover': { bgcolor: 'info.lighter' },
                mr: 0.5,
              }}
              title="Gestionar usuarios"
            >
              <Iconify icon="solar:users-group-rounded-bold" sx={{ width: 18, height: 18 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => onEdit(diet)}
            sx={{
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.lighter' },
              mr: 0.5,
            }}
          >
            <Iconify icon="eva:edit-2-outline" sx={{ width: 18, height: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(diet.id)}
            sx={{
              color: 'error.main',
              '&:hover': { bgcolor: 'error.lighter' },
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ width: 18, height: 18 }} />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};
