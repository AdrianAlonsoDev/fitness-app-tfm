import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'

import { Iconify } from '../utils/iconify'

export const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = useCallback(async () => {
    try {
      setError("");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        navigate("/dashboard/home");

      }
    } catch (err) {
      setError("Error al iniciar sesión");
    }
  }, [email, password, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard/home`,
        },
      });

      if (error) {
        setError("Error al iniciar sesión con Google");
      }
    } catch (err) {
      setError("Error al conectar con Google");
    }
  };

  const renderForm = (
    <Box component="form" sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        name="email"
        label="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
        <Link
          variant="body2"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => alert("Funcionalidad de recuperación de contraseña")}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Box>

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={
                      showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="button"
        color="primary"
        variant="contained"
        onClick={handleSignIn}
        sx={{ mb: 2 }}
      >
        Iniciar Sesión
      </Button>

      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        onClick={() => navigate("/register")}
      >
        Crear Cuenta Nueva
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Typography variant="h4" component="h1">
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Accede a tu cuenta de Fitness Management System
        </Typography>
      </Box>

      {renderForm}

      <Divider
        sx={{ my: 3, "&::before, &::after": { borderTopStyle: "dashed" } }}
      >
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", fontWeight: "fontWeightMedium" }}
        >
          O
        </Typography>
      </Divider>

      <Box
        sx={{
          gap: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleGoogleSignIn}
          startIcon={<Iconify width={22} icon="logos:google-icon" />}
          sx={{ mb: 3 }}
        >
          logeate con Google
        </Button>
      </Box>
    </>
  );
}
