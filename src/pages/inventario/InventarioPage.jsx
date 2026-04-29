import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { useInventario } from '../../hooks/useInventario';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { StockIndicator } from '../../components/common/StockIndicator';
import { AjusteStockModal } from './AjusteStockModal';
import { ConfigStockModal } from './ConfigStockModal';
import { ArrowRightLeft, Settings, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';

/**
 * Vista de Gestión de Inventario.
 * Muestra el catálogo de productos con su stock actual en la sucursal correspondiente.
 * Provee filtros básicos y acción para realizar ajustes manuales de stock.
 */
export const InventarioPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rolNombre === 'ADMIN';
  
  // Estado local para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook de obtención de datos
  // Si no es admin, el backend debería filtrar automáticamente por su sucursal,
  // pero podemos enviar el param explícitamente si la API lo requiere.
  const { inventarioQuery, ajustarStock, isAjustando, actualizarConfig, isActualizandoConfig } = useInventario({ 
    search: searchTerm,
    sucursalId: isAdmin ? null : user?.sucursalId 
  });

  const [modalAjuste, setModalAjuste] = useState({ isOpen: false, item: null });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, item: null });

  const handleAjuste = (item) => {
    setModalAjuste({ isOpen: true, item });
  };

  const submitAjuste = (data) => {
    ajustarStock(data, {
      onSuccess: () => setModalAjuste({ isOpen: false, item: null })
    });
  };

  const handleConfigurar = (item) => {
    setModalConfig({ isOpen: true, item });
  };

  const submitConfigurar = (data) => {
    actualizarConfig(data, {
      onSuccess: () => setModalConfig({ isOpen: false, item: null })
    });
  };

  const columns = [
    { header: 'SKU', accessorKey: 'producto.codigo', cell: (row) => row.producto?.codigo || row.productoCodigo },
    { header: 'Producto', accessorKey: 'producto.nombre', cell: (row) => row.producto?.nombre || row.productoNombre },
    // Mostrar columna de sucursal solo a ADMIN
    ...(isAdmin ? [{ header: 'Sucursal', accessorKey: 'sucursal.nombre', cell: (row) => row.sucursal?.nombre || row.sucursalNombre }] : []),
    { header: 'Categoría', accessorKey: 'producto.categoria', cell: (row) => row.producto?.categoria || '-' },
    { 
      header: 'Stock Actual', 
      accessorKey: 'stockActual',
      cell: (row) => (
        <StockIndicator 
          current={row.stockActual} 
          min={row.stockMinimo} 
          max={row.stockMaximo} 
        />
      )
    },
    { header: 'Nivel Mín.', accessorKey: 'stockMinimo', className: 'text-gray-500 font-mono text-sm' },
    { header: 'Nivel Máx.', accessorKey: 'stockMaximo', className: 'text-gray-500 font-mono text-sm' },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAjuste(row)}>
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Ajustar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleConfigurar(row)}>
            <Settings className="h-3 w-3 mr-1" />
            Configurar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Inventario" 
        breadcrumb="Operaciones › Inventario"
      />

      <div className="mb-6 flex gap-4 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar por código o producto..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Aquí irían filtros de Categoría o Sucursal (si es ADMIN) */}
      </div>

      <DataTable 
        columns={columns} 
        data={inventarioQuery.data?.content || inventarioQuery.data || []} 
        isLoading={inventarioQuery.isLoading}
        pageParams={inventarioQuery.data?.pageable ? inventarioQuery.data : null}
      />

      <AjusteStockModal 
        isOpen={modalAjuste.isOpen}
        onClose={() => setModalAjuste({ isOpen: false, item: null })}
        inventario={modalAjuste.item}
        onAjustar={submitAjuste}
        isAjustando={isAjustando}
      />
      <ConfigStockModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, item: null })}
        inventario={modalConfig.item}
        onActualizar={submitConfigurar}
        isActualizando={isActualizandoConfig}
      />    </div>
  );
};
