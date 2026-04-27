import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { StockIndicator } from '../../components/common/StockIndicator';
import { useDashboard } from '../../hooks/useDashboard';
import { useAlertas } from '../../hooks/useAlertas';
import { TrendingUp, Package, ShoppingCart, Truck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';
  const navigate = useNavigate();

  const params = { sucursalId: isAdmin ? null : user?.sucursalId };
  
  const { metricasQuery } = useDashboard(params);
  const { alertasQuery, marcarLeida } = useAlertas(params);

  // Valores por defecto
  const metricas = metricasQuery.data || {
    ventasMes: 0,
    comprasMes: 0,
    productosBajoStockCount: 0,
    transferenciasPendientes: 0,
    ventasMensuales: [
      { name: 'Ene', ventas: 12000000 },
      { name: 'Feb', ventas: 19000000 },
      { name: 'Mar', ventas: 15000000 },
      { name: 'Abr', ventas: 22000000 },
    ],
    productosBajoStock: [
      // Mock data in case backend is empty
    ]
  };

  const alertas = alertasQuery.data?.content || alertasQuery.data || [];
  const alertasPendientes = alertas.filter(a => !a.leida);

  const formatTooltipCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Bienvenido, ${user?.nombre}`} 
        breadcrumb="Inicio › Dashboard"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-success-100 text-success-600 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ventas (Este Mes)</p>
              <h3 className="text-2xl font-bold text-gray-900">
                <CurrencyDisplay amount={metricas.ventasMes} />
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-info-100 text-info-600 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Compras (Este Mes)</p>
              <h3 className="text-2xl font-bold text-gray-900">
                <CurrencyDisplay amount={metricas.comprasMes} />
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/inventario')}>
            <div className="p-3 bg-warning-100 text-warning-600 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prod. Bajo Stock</p>
              <h3 className="text-2xl font-bold text-gray-900">{metricas.productosBajoStockCount || metricas.productosBajoStock?.length || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/transferencias')}>
            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Transf. Pendientes</p>
              <h3 className="text-2xl font-bold text-gray-900">{metricas.transferenciasPendientes}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de Ventas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {metricas.ventasMensuales && metricas.ventasMensuales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricas.ventasMensuales} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000000}M`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatTooltipCurrency(value), 'Ventas']}
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="ventas" fill="#E8630A" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No hay datos de ventas disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas y Stock */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-base">
                <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
                Alertas Rápidas
              </CardTitle>
              {alertasPendientes.length > 0 && (
                <span className="bg-danger-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {alertasPendientes.length}
                </span>
              )}
            </CardHeader>
            <CardContent>
              {alertasPendientes.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success-500 opacity-50" />
                  <p className="text-sm">Todo en orden</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alertasPendientes.slice(0, 4).map(alerta => (
                    <div key={alerta.id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-gray-900 line-clamp-1">{alerta.titulo}</span>
                        <Button variant="ghost" className="h-6 px-2 text-xs text-primary-600" onClick={() => marcarLeida(alerta.id)}>
                          OK
                        </Button>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(alerta.fechaCreacion)}</span>
                    </div>
                  ))}
                  {alertasPendientes.length > 4 && (
                    <Button variant="link" className="w-full text-xs text-primary-600" onClick={() => navigate('/alertas')}>
                      Ver todas las alertas <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Productos Bajo Stock</span>
                <Button variant="ghost" size="sm" className="h-8 text-primary-600" onClick={() => navigate('/inventario')}>
                  Ver
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metricas.productosBajoStock && metricas.productosBajoStock.length > 0 ? (
                <div className="space-y-4">
                  {metricas.productosBajoStock.slice(0, 5).map((prod, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{prod.nombre}</p>
                        <p className="text-xs text-gray-500">{prod.sucursal}</p>
                      </div>
                      <div className="w-24">
                        <StockIndicator actual={prod.stockActual} minimo={prod.stockMinimo} maximo={prod.stockMaximo || prod.stockMinimo * 3} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Sin productos bajo stock.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
