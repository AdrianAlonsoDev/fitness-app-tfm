import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { Iconify } from "../../utils/iconify";
import { DietWithFoods } from "../../types/DietWithFoods";
import { User } from "../../types/User";
import * as dietService from "../../services/dietService";
import * as userService from "../../services/userService";
import { useToast } from "../../utils/notifications";
import { useExport } from "../../utils/hooks/useExport";
import { DietList } from "./DietList";
import { DietForm } from "./DietForm";
import { DietDetail } from "./DietDetail";
import { DietFoodsManager } from "./DietFoodsManager";
import { DietUsersDialog } from "./DietUsersDialog";
import { calculateDietCalories, formatCalories } from "../../utils/dietUtils";

export const DietManager = () => {
  const [diets, setDiets] = useState<DietWithFoods[]>([]);
  const [filteredDiets, setFilteredDiets] = useState<DietWithFoods[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingDiet, setEditingDiet] = useState<DietWithFoods | null>(null);
  const [viewingDiet, setViewingDiet] = useState<DietWithFoods | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [openFoodsManager, setOpenFoodsManager] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<DietWithFoods | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [selectedDietForUsers, setSelectedDietForUsers] = useState<DietWithFoods | null>(null);

  const { showToast, ToastContainer } = useToast();
  const { exportToCSV, exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    loadDiets();
    loadUsers();
  }, []);

  useEffect(() => {
    filterDiets();
  }, [diets, searchQuery]);

  const loadDiets = async () => {
    try {
      setLoading(true);
      console.log('🔍 DietManager: Cargando dietas...');
      const data = await dietService.getDietsWithFoods();
      console.log('✅ DietManager: Dietas cargadas:', data.length);
      setDiets(data);
    } catch (error: any) {
      console.error('❌ DietManager: Error al cargar dietas:', error);
      showToast(`Error al cargar dietas: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const filterDiets = () => {
    if (!searchQuery.trim()) {
      setFilteredDiets(diets);
    } else {
      const filtered = diets.filter(
        (diet) =>
          diet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          diet.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDiets(filtered);
    }
  };

  const handleAdd = () => {
    setEditingDiet(null);
    setError(null);
    setFormOpen(true);
  };

  const handleEdit = (diet: DietWithFoods) => {
    setEditingDiet(diet);
    setError(null);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta dieta?")) {
      try {
        await dietService.deleteDiet(id);
        showToast("Dieta eliminada exitosamente", "success");
        loadDiets();
      } catch (error) {
        console.error("Error deleting diet:", error);
        showToast("Error al eliminar dieta", "error");
      }
    }
  };

  const handleViewDetails = (diet: DietWithFoods) => {
    setViewingDiet(diet);
    setDetailOpen(true);
  };

  const handleManageFoods = (diet: DietWithFoods) => {
    setSelectedDiet(diet);
    setOpenFoodsManager(true);
  };
  const handleCloseFoodsManager = () => {
    setOpenFoodsManager(false);
    setSelectedDiet(null);
  };

  const handleManageUsers = (diet: DietWithFoods) => {
    setSelectedDietForUsers(diet);
    setUsersDialogOpen(true);
  };

  const handleCloseUsersDialog = () => {
    setUsersDialogOpen(false);
    setSelectedDietForUsers(null);
  };

  const handleSubmit = async (dietData: any) => {
    try {
      setError(null);
      if (editingDiet) {
        await dietService.updateDiet(editingDiet.id, dietData);
        showToast("Dieta actualizada exitosamente", "success");
      } else {
        await dietService.createDiet(dietData);
        showToast("Dieta creada exitosamente", "success");
      }
      setFormOpen(false);
      loadDiets();
    } catch (error) {
      setError("Error al guardar la dieta. Por favor, intenta de nuevo.");
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setError(null);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setViewingDiet(null);
  };

  const handleExport = (format: "csv" | "pdf" | "excel") => {
    const headers = ["ID", "Nombre", "Descripción", "Calorías Calculadas", "Alimentos"];
    const data = filteredDiets.map((diet) => [
      diet.id.toString(),
      diet.name,
      diet.description || "Sin descripción",
      formatCalories(calculateDietCalories(diet)),
      diet.diet_foods?.length?.toString() ||
        diet.foods?.length?.toString() ||
        "0",
    ]);

    const exportData = {
      headers,
      data,
      filename: "dietas",
      title: "Dietas",
    };

    switch (format) {
      case "csv":
        exportToCSV(exportData);
        break;
      case "pdf":
        exportToPDF(exportData);
        break;
      case "excel":
        exportToExcel(exportData);
        break;
    }
    setExportMenuAnchor(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <ToastContainer />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
          Gestión de Dietas
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
            onClick={handleAdd}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Nueva Dieta
          </Button>
        </Stack>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar dietas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Diet List */}
      <DietList
        diets={filteredDiets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onManageFoods={handleManageFoods}
        onManageUsers={handleManageUsers}
        loading={loading}
      />

      {/* Diet Form Dialog */}
      <DietForm
        open={formOpen}
        dietToEdit={editingDiet}
        users={users}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
      />

      {/* Diet Detail Dialog */}
      {viewingDiet && (
        <DietDetail
          open={detailOpen}
          diet={viewingDiet}
          onClose={handleDetailClose}
        />
      )}

      {/* Foods Manager Dialog */}
      {selectedDiet && (
        <DietFoodsManager
          open={openFoodsManager}
          diet={selectedDiet}
          onClose={handleCloseFoodsManager}
          onSave={async () => {
            // Puedes recargar las dietas aquí si lo necesitas
            setOpenFoodsManager(false);
            loadDiets();
          }}
        />
      )}

      {/* Users Dialog */}
      {selectedDietForUsers && (
        <DietUsersDialog
          open={usersDialogOpen}
          diet={selectedDietForUsers}
          onClose={handleCloseUsersDialog}
          onUpdate={loadDiets}
        />
      )}

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExport("pdf")}>
          <Iconify icon="eva:file-text-fill" sx={{ mr: 2 }} />
          Exportar a PDF
        </MenuItem>
        <MenuItem onClick={() => handleExport("excel")}>
          <Iconify icon="eva:file-fill" sx={{ mr: 2 }} />
          Exportar a Excel
        </MenuItem>
        <MenuItem onClick={() => handleExport("csv")}>
          <Iconify icon="eva:file-text-outline" sx={{ mr: 2 }} />
          Exportar a CSV
        </MenuItem>
      </Menu>
    </Box>
  );
};
