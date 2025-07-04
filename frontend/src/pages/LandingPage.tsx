// Página principal de presentación de la plataforma para entrenadoras personales
// Inspirada en https://lifeboost1.com/ pero con estilo minimalista y profesional
//
// Características principales:
// - Hero section con logos y CTA destacado
// - Sección de características con animaciones de hover
// - CTA final para registro
// - Footer con información de contacto y branding
// - Animaciones de entrada sutiles

import { AppBar, Toolbar, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { Iconify } from '../utils/iconify';

// COMPONENTE PRINCIPAL: LandingPage
// Estructura general:
// 1. Animaciones globales (keyframes)
// 2. Header con navegación y branding
// 3. Hero Section: título, subtítulo, logos y CTA
// 4. Features Section: cards con características
// 5. CTA Section: llamada a la acción final
// 6. Footer: contacto y derechos

export const LandingPage = () => {
  const navigate = useNavigate();

  // FEATURES SECTION
  // - Grid de las cards con las principales funcionalidades de la plataforma
  // - Cada card tiene un icono, título y descripción
  // - Animación de hover en las cards e iconos
  
  const features = [
    {
      icon: 'mdi:calendar-clock',
      title: 'Flexibilidad Total',
      description: 'Gestiona tu negocio en cualquier momento y lugar, adaptándose a tu horario y estilo de vida'
    },
    {
      icon: 'mdi:account-group',
      title: 'Gestión de Clientes',
      description: 'Administra todos tus clientes con un sistema completo de seguimiento personalizado'
    },
    {
      icon: 'mdi:nutrition',
      title: 'Planes Nutricionales',
      description: 'Crea y gestiona dietas personalizadas con cálculo automático de calorías'
    },
    {
      icon: 'mdi:dumbbell',
      title: 'Rutinas de Entrenamiento',
      description: 'Diseña entrenamientos específicos para cada cliente y objetivo'
    },
    {
      icon: 'mdi:chart-line',
      title: 'Seguimiento y Analytics',
      description: 'Monitorea el progreso de tus clientes con estadísticas detalladas'
    },
    {
      icon: 'mdi:store',
      title: 'Tienda Integrada',
      description: 'Vende productos y suplementos directamente desde tu plataforma'
    }
  ];

  return (
    <>
      {/* GLOBAL ANIMATIONS */}
      <Box
        sx={{
          '@keyframes fadeInUp': {
            from: {
              opacity: 0,
              transform: 'translateY(30px)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      />
      
      {/* NAVIGATION (HEADER) */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(0, 0, 0, 0.95)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)' 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/src/assets/logo_LB.png"
              alt="Logo LB"
              style={{ height: 50, width: 50, objectFit: 'contain', cursor: 'pointer', marginRight: '16px' }}
              onClick={() => window.open('https://lifeboost1.com/', '_blank')}
            />
            <img
              src="/src/assets/logo.png"
              alt="Logo principal"
              style={{ height: 40, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              color="inherit"
              onClick={() => navigate('/sign-in')}
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* HERO SECTION */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000 0%, #222 100%)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: 8
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, #444 0%, transparent 50%), radial-gradient(circle at 75% 75%, #666 0%, transparent 50%)',
            opacity: 0.1,
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center',
            gap: 6
          }}>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 900,
                  color: 'white',
                  mb: 3,
                  lineHeight: 1.1,
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  animation: 'fadeInUp 0.8s ease-out'
                }}
              >
                TRANSFORMA TU
                <Box component="span" sx={{ 
                  color: '#888',
                  display: 'block'
                }}>
                  NEGOCIO FITNESS
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  color: '#ccc',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  maxWidth: '500px',
                  mx: { xs: 'auto', md: 0 },
                  animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}
              >
                La plataforma completa para entrenadoras personales. Gestiona clientes, 
                crea planes personalizados y haz crecer tu negocio con herramientas profesionales.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: '#fff',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 2,
                    borderRadius: '30px',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 30px rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: '#f0f0f0',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  COMENZAR AHORA
                </Button>
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="mdi:star" sx={{ color: '#888', fontSize: 20 }} />
                  <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                    +500 entrenadoras confían en nosotros
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 0
                }}
              >
                {/* Logo LB más grande */}
                <img
                  src="/src/assets/logo_LB.png"
                  alt="Logo LB"
                  style={{ 
                    height: 140, 
                    width: 140, 
                    objectFit: 'contain',
                    animation: 'fadeInUp 1s ease-out',
                    marginBottom: 0
                  }}
                />
                
                {/* Logo principal debajo */}
                <img
                  src="/src/assets/logo_white.png"
                  alt="Logo principal"
                  style={{ 
                    height: 60, 
                    objectFit: 'contain',
                    animation: 'fadeInUp 1s ease-out 0.3s both',
                    marginTop: 0
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: 10, background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 900,
                color: '#000',
                mb: 3
              }}
            >
              TODO LO QUE NECESITAS PARA
              <Box component="span" sx={{ 
                color: '#666',
                display: 'block'
              }}>
                HACER CRECER TU NEGOCIO
              </Box>
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 4 
          }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'white',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-15px) scale(1.02)',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: '#f5f5f5',
                      border: '2px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                      <Iconify icon={feature.icon} sx={{ fontSize: 40, color: '#666' }} />
                    </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#000' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #000 0%, #222 100%)',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 900,
              color: 'white',
              mb: 3
            }}
          >
            ¿LISTA PARA TRANSFORMAR TU NEGOCIO?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#ccc',
              mb: 5,
              fontWeight: 400
            }}
          >
            Únete a cientos de entrenadoras que ya están revolucionando 
            su forma de trabajar con nuestra plataforma
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              background: '#fff',
              color: '#000',
              fontWeight: 900,
              fontSize: '1.2rem',
              px: 6,
              py: 2.5,
              borderRadius: '30px',
              textTransform: 'uppercase',
              boxShadow: '0 8px 30px rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: '#f0f0f0',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            EMPEZAR GRATIS AHORA
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 6, background: '#000', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4 
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <img
                  src="/src/assets/logo_LB.png"
                  alt="Logo LB"
                  style={{ height: 40, width: 40, objectFit: 'contain', marginRight: '16px' }}
                />
                <img
                  src="/src/assets/logo.png"
                  alt="Logo principal"
                  style={{ height: 40 }}
                />
              </Box>
              <Typography sx={{ color: '#ccc', mb: 2 }}>
                Plataforma integral para entrenadoras personales que buscan 
                profesionalizar y hacer crecer su negocio fitness.
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                Una extensión de LifeBoost1 - Transformando vidas a través del fitness
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>
                CONTACTO
              </Typography>
              <Stack spacing={1}>
                <Typography sx={{ color: '#ccc' }}>
                  📧 info@lifeboost-platform.com
                </Typography>
                <Typography sx={{ color: '#ccc' }}>
                  📱 +34 727 733 332
                </Typography>
                <Typography sx={{ color: '#ccc' }}>
                  📍 Granada, España
                </Typography>
              </Stack>
            </Box>
          </Box>
          
          <Box sx={{ 
            borderTop: '1px solid #333', 
            mt: 4, 
            pt: 4, 
            textAlign: 'center',
            color: '#666'
          }}>
            <Typography sx={{ fontSize: '0.9rem' }}>
              © 2025 LifeBoost Platform. Todos los derechos reservados. | 
              <Button 
                color="inherit" 
                sx={{ color: '#ccc', textDecoration: 'underline', p: 0, ml: 1 }}
                onClick={() => window.open('https://lifeboost1.com/', '_blank')}
              >
                Visitar LifeBoost1
              </Button>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};