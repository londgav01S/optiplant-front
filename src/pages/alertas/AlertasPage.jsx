import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { useAlertas } from '../../hooks/useAlertas';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import useAuthStore from '../../store/authStore';

const ICONS = {
  CRITICO: <AlertTriangle className="h-5 w-5 text-danger-500" />,
  ADVERTENCIA: <AlertTriangle className="h-5 w-5 text-warning-500" />,
  INFO: <Info className="h-5 w-5 text-info-500" />
};

const BORDERS = {
  CRITICO: 'border-l-4 border-l-danger-500',
  ADVERTENCIA: 'border-l-4 border-l-warning-500',
  INFO: 'border-l-4 border-l-info-500'
};

/**
 * Vista de Alertas de Sistema.
 * Muestra el listado de notificaciones importantes (ej. stock bajo).
 * Permite marcar las alertas como leídas e incluye filtrado de vista por roles.
 */
export const AlertasPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';

  // Solo mostrar alertas de la sucursal del usuario, a menos que sea ADMIN
  const { alertasQuery, marcarLeida } = useAlertas({
    sucursalId: isAdmin ? null : user?.sucursalId
  });

  const alertas = alertasQuery.data?.content || alertasQuery.data || [];

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Alertas de Sistema" 
        breadcrumb="Análisis › Alertas"
      />

      {alertasQuery.isLoading ? (
        <div className="p-8 text-center text-gray-500">Cargando alertas...</div>
      ) : alertas.length === 0 ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-12 text-center text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success-500 opacity-50" />
            <p className="text-lg font-medium">Todo está bajo control</p>
            <p className="text-sm">No tienes alertas pendientes por revisar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alertas.map(alerta => (
            <Card key={alerta.id} className={`${BORDERS[alerta.nivel] || 'border-l-4 border-l-gray-300'} ${alerta.leida ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1">
                  {ICONS[alerta.nivel] || <Info className="h-5 w-5 text-gray-400" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-semibold ${alerta.leida ? 'text-gray-600' : 'text-gray-900'}`}>
                      {alerta.titulo}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(alerta.fechaCreacion)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{alerta.mensaje}</p>
                  
                  {isAdmin && alerta.sucursalNombre && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {alerta.sucursalNombre}
                    </Badge>
                  )}
                </div>

                {!alerta.leida && (
                  <Button variant="ghost" size="sm" onClick={() => marcarLeida(alerta.id)} className="shrink-0 text-gray-500 hover:text-success-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Marcar leída
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
