import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import './styles/components.css'
import App from './App'
import { supabase } from './lib/supabase'
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  Navigate
} from 'react-router-dom'
import { DashboardLayout } from './layouts/dashboard'
import { AuthLayout } from './layouts/auth'
import { HomePage } from './pages/HomePage'
import { UsersPage } from './pages/UsersPage'
import { DietsPage } from './pages/DietsPage'
import { WorkoutsPage } from './pages/WorkoutsPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { LandingPage } from './pages/LandingPage'
import { UserDetailPage } from './pages/UserDetailPage'


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setIsAuthenticated(!!session)
        setLoading(false)
      })
      .catch(() => {
        // Si hay error con Supabase, redirigir al login
        setLoading(false)
        setIsAuthenticated(false)
      })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        Cargando...
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to='/sign-in' replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App><LandingPage /></App>,
  },
  {
    path: '/sign-in',
    element: (
      <App>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </App>
    )
  },
  {
    path: '/register',
    element: (
      <App>
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      </App>
    )
  },
  
  // RUTAS PROTEGIDAS (requieren autenticación)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <App>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </App>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard/home" replace />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'users',
        element: <UsersPage />
      },
      {
        path: 'users/:id',
        element: <UserDetailPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'diets',
        element: <DietsPage />
      },
      {
        path: 'workouts',
        element: <WorkoutsPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
