import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthLayout } from './components/layout/AuthLayout';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import useAuthStore from './store/authStore';
import { getDefaultRouteForRole } from './utils/roleGuards';

// Sucursales
import { SucursalesPage } from './pages/sucursales/SucursalesPage';
import { SucursalFormPage } from './pages/sucursales/SucursalFormPage';

// Usuarios
import { UsuariosPage } from './pages/usuarios/UsuariosPage';
import { UsuarioFormPage } from './pages/usuarios/UsuarioFormPage';

// Proveedores
import { ProveedoresPage } from './pages/proveedores/ProveedoresPage';
import { ProveedorFormPage } from './pages/proveedores/ProveedorFormPage';
import { ProveedorHistorialPage } from './pages/proveedores/ProveedorHistorialPage';

// Productos
import { ProductosPage } from './pages/productos/ProductosPage';
import { ProductoFormPage } from './pages/productos/ProductoFormPage';
import { ProductoDetallePage } from './pages/productos/ProductoDetallePage';

// Inventario
import { InventarioPage } from './pages/inventario/InventarioPage';

// Ventas
import { VentasPage } from './pages/ventas/VentasPage';
import { VentaFormPage } from './pages/ventas/VentaFormPage';
import { VentaDetallePage } from './pages/ventas/VentaDetallePage';

// Compras
import { ComprasPage } from './pages/compras/ComprasPage';
import { CompraFormPage } from './pages/compras/CompraFormPage';
import { CompraDetallePage } from './pages/compras/CompraDetallePage';

// Transferencias
import { TransferenciasPage } from './pages/transferencias/TransferenciasPage';
import { TransferenciaFormPage } from './pages/transferencias/TransferenciaFormPage';
import { TransferenciaDetallePage } from './pages/transferencias/TransferenciaDetallePage';

// Logística
import { LogisticaPage } from './pages/logistica/LogisticaPage';

// Alertas
import { AlertasPage } from './pages/alertas/AlertasPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Vistas placeholder (se reemplazarán luego)
const ForbiddenPage = () => <div className="p-8 text-danger-500">No tienes permiso para ver esta página.</div>;

const HomeRedirect = () => {
  const user = useAuthStore(state => state.user);
  return <Navigate to={getDefaultRouteForRole(user)} replace />;
};

export default function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rutas Privadas */}
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <HomeRedirect />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* SUCURSALES (Solo ADMIN) */}
          <Route path="/sucursales" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SucursalesPage />
            </ProtectedRoute>
          } />
          <Route path="/sucursales/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SucursalFormPage />
            </ProtectedRoute>
          } />
          <Route path="/sucursales/:id/editar" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SucursalFormPage />
            </ProtectedRoute>
          } />

          {/* USUARIOS (Solo ADMIN) */}
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsuariosPage />
            </ProtectedRoute>
          } />
          <Route path="/usuarios/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsuarioFormPage />
            </ProtectedRoute>
          } />
          <Route path="/usuarios/:id/editar" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsuarioFormPage />
            </ProtectedRoute>
          } />

          {/* PROVEEDORES (ADMIN, GERENTE) */}
          <Route path="/proveedores" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProveedoresPage />
            </ProtectedRoute>
          } />
          <Route path="/proveedores/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProveedorFormPage />
            </ProtectedRoute>
          } />
          <Route path="/proveedores/:id/editar" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProveedorFormPage />
            </ProtectedRoute>
          } />
          <Route path="/proveedores/:id/historial" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProveedorHistorialPage />
            </ProtectedRoute>
          } />

          {/* PRODUCTOS (ADMIN, GERENTE) */}
          <Route path="/productos" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProductosPage />
            </ProtectedRoute>
          } />
          <Route path="/productos/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProductoFormPage />
            </ProtectedRoute>
          } />
          <Route path="/productos/:id/editar" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProductoFormPage />
            </ProtectedRoute>
          } />
          <Route path="/productos/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ProductoDetallePage />
            </ProtectedRoute>
          } />

          {/* INVENTARIO (ADMIN, GERENTE, OPERADOR) */}
          <Route path="/inventario" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <InventarioPage />
            </ProtectedRoute>
          } />

          {/* VENTAS (ADMIN, GERENTE, OPERADOR) */}
          <Route path="/ventas" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <VentasPage />
            </ProtectedRoute>
          } />
          <Route path="/ventas/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <VentaFormPage />
            </ProtectedRoute>
          } />
          <Route path="/ventas/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <VentaDetallePage />
            </ProtectedRoute>
          } />

          {/* COMPRAS (ADMIN, GERENTE) */}
          <Route path="/compras" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <ComprasPage />
            </ProtectedRoute>
          } />
          <Route path="/compras/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <CompraFormPage />
            </ProtectedRoute>
          } />
          <Route path="/compras/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <CompraDetallePage />
            </ProtectedRoute>
          } />

          {/* TRANSFERENCIAS (ADMIN, GERENTE, OPERADOR) */}
          <Route path="/transferencias" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <TransferenciasPage />
            </ProtectedRoute>
          } />
          <Route path="/transferencias/nuevo" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <TransferenciaFormPage />
            </ProtectedRoute>
          } />
          <Route path="/transferencias/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <TransferenciaDetallePage />
            </ProtectedRoute>
          } />

          {/* LOGISTICA (ADMIN, GERENTE) */}
          <Route path="/logistica" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE']}>
              <LogisticaPage />
            </ProtectedRoute>
          } />

          {/* ALERTAS (ADMIN, GERENTE, OPERADOR) */}
          <Route path="/alertas" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GERENTE', 'OPERADOR']}>
              <AlertasPage />
            </ProtectedRoute>
          } />

          {/* Más rutas se agregarán aquí en futuras fases */}
        </Route>

        {/* Rutas de Error */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<div className="p-8 text-danger-500">Página no encontrada</div>} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}
