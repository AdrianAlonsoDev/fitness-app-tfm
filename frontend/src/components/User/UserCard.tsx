import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Stack,
  Avatar,
  Box,
} from "@mui/material";
import { Iconify } from "../../utils/iconify";
import { User } from "../../types/User";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "client":
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "client":
        return "Cliente";
      default:
        return role;
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/dashboard/users/${user.id}`)}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                mr: 2,
                bgcolor: "primary.main",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              {getInitials(user.name, user.surname)}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                component="h3"
                noWrap
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                {user.name} {user.surname}
              </Typography>
              <Chip
                label={getRoleLabel(user.role)}
                color={getRoleColor(user.role)}
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Iconify
                icon="eva:email-outline"
                sx={{ width: 16, height: 16, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>

            {user.birth_date && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Iconify
                  icon="eva:calendar-outline"
                  sx={{ width: 16, height: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {new Date(user.birth_date).toLocaleDateString("es-ES")}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Iconify
                icon="eva:clock-outline"
                sx={{ width: 16, height: 16, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                Registrado:{" "}
                {new Date(user.created_at).toLocaleDateString("es-ES")}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
        <IconButton
          size="small"
          onClick={() => navigate(`/dashboard/users/${user.id}`)}
          sx={{
            color: "info.main",
            "&:hover": { bgcolor: "info.lighter" },
          }}
        >
          <Iconify icon="eva:eye-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onEdit(user)}
          sx={{
            color: "primary.main",
            "&:hover": { bgcolor: "primary.lighter" },
          }}
        >
          <Iconify icon="eva:edit-2-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onDelete(user.id)}
          sx={{
            color: "error.main",
            "&:hover": { bgcolor: "error.lighter" },
          }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ width: 18, height: 18 }} />
        </IconButton>
      </CardActions>
    </Card>
  );
};
