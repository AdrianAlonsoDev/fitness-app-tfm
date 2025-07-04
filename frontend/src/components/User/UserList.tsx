import { useState } from "react";
import {
  Card,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Box,
  Chip,
  IconButton,
  TablePagination,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Stack,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Iconify } from "../../utils/iconify";
import { User } from "../../types/User";
import { UserCard } from "./UserCard";
import { useNavigate } from "react-router-dom";

interface UserListProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onExport: (format: "pdf" | "excel" | "csv") => void;
  onCreateNew: () => void;
}

export const UserList = ({
  users,
  loading,
  onEdit,
  onDelete,
  onExport,
  onCreateNew,
}: UserListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const handleExportClick = (format: "pdf" | "excel" | "csv") => {
    onExport(format);
    setExportMenuAnchor(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          Gestión de Usuarios
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onCreateNew}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Nuevo Usuario
          </Button>
        </Stack>
      </Box>

      
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); 
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", md: 240 },
              width: { xs: "100%", md: "auto" },
            }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              ml: { xs: 0, md: "auto" },
              textAlign: { xs: "center", md: "right" },
            }}
          >
            {filteredUsers.length} de {users.length} usuarios
          </Typography>
        </Stack>
      </Card>

      
      {isMobile ? (
        
        <>
          <Grid container spacing={2}>
            {loading ? (
              <Grid size={12}>
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography>Cargando...</Typography>
                </Card>
              </Grid>
            ) : filteredUsers.length === 0 ? (
              <Grid size={12}>
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No hay usuarios registrados
                  </Typography>
                </Card>
              </Grid>
            ) : (
              paginatedUsers.map((user) => (
                <Grid key={user.id} size={{ xs: 12, sm: 6 }}>
                  <UserCard user={user} onEdit={onEdit} onDelete={onDelete} />
                </Grid>
              ))
            )}
          </Grid>

          
          {filteredUsers.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <TablePagination
                page={page}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            </Box>
          )}
        </>
      ) : (
        
        <Card>
          <TableContainer sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: { xs: 600, md: "auto" } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Fecha Nacimiento
                  </TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>Cargando...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">
                        No hay usuarios registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.name} {user.surname}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: { xs: "block", md: "none" } }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", sm: "table-cell" } }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {user.birth_date
                            ? new Date(user.birth_date).toLocaleDateString('es-ES')
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/dashboard/users/${user.id}`)}
                            title="Ver detalles"
                          >
                            <Iconify icon="solar:eye-bold" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(user)}
                          >
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(user.id)}
                            sx={{ display: { xs: "none", sm: "inline-flex" } }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            page={page}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            sx={{
              ".MuiTablePagination-toolbar": {
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
                alignItems: { xs: "center", sm: "center" },
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
            }}
          />
        </Card>
      )}

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExportClick("pdf")}>
          <Iconify icon="eva:file-text-fill" sx={{ mr: 2 }} />
          Exportar a PDF
        </MenuItem>
        <MenuItem onClick={() => handleExportClick("excel")}>
          <Iconify icon="eva:file-fill" sx={{ mr: 2 }} />
          Exportar a Excel
        </MenuItem>
        <MenuItem onClick={() => handleExportClick("csv")}>
          <Iconify icon="eva:file-text-outline" sx={{ mr: 2 }} />
          Exportar a CSV
        </MenuItem>
      </Menu>
    </Box>
  );
};
