import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Metrics } from './components/Metrics';
import { SearchBar } from './components/SearchBar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { DataManagementModal } from './components/DataManagementModal';
import { dbService } from './services/db';
import { Plus, PackageOpen, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');

  // Modales
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Notificaciones Toast
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Cargar artículos desde la base de datos
  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await dbService.getAll();
      setItems(data);
    } catch (err) {
      console.error('Error cargando inventario:', err);
      notify('Error al cargar la base de datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Opciones únicas de marcas
  const brandOptions = useMemo(() => {
    const brands = items.map(item => item.marca?.trim()).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [items]);

  // Artículos filtrados y ordenados
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Filtro de búsqueda
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchMarca = item.marca?.toLowerCase().includes(q);
          const matchModelo = item.modelo?.toLowerCase().includes(q);
          const matchCat = item.categoria?.toLowerCase().includes(q);
          const matchCode = item.codigo?.toLowerCase().includes(q);
          const matchUbi = item.ubicacion?.toLowerCase().includes(q);
          if (!matchMarca && !matchModelo && !matchCat && !matchCode && !matchUbi) {
            return false;
          }
        }

        // Filtro por marca o condición especial
        if (selectedBrand === 'LOW_STOCK') {
          return (item.stock || 0) < 5;
        }
        if (selectedBrand !== 'ALL') {
          return item.marca?.toLowerCase() === selectedBrand.toLowerCase();
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return (b.precio || 0) - (a.precio || 0);
        if (sortBy === 'price-asc') return (a.precio || 0) - (b.precio || 0);
        if (sortBy === 'stock-desc') return (b.stock || 0) - (a.stock || 0);
        if (sortBy === 'stock-asc') return (a.stock || 0) - (b.stock || 0);
        if (sortBy === 'alpha') return (a.modelo || '').localeCompare(b.modelo || '');
        // default: 'recent'
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      });
  }, [items, searchQuery, selectedBrand, sortBy]);

  // Manejadores CRUD
  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setItemToEdit(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (formData) => {
    try {
      if (itemToEdit) {
        await dbService.update(itemToEdit.id, formData);
        notify(`"${formData.modelo}" actualizado correctamente`, 'success');
      } else {
        await dbService.add(formData);
        notify(`"${formData.modelo}" añadido al inventario`, 'success');
      }
      await loadItems();
    } catch (err) {
      console.error('Error guardando artículo:', err);
      notify('Error al guardar el artículo: ' + err.message, 'error');
    }
  };

  const handleDeleteItem = async (item) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar "${item.marca} - ${item.modelo}" del inventario?`
    );
    if (!confirmDelete) return;

    try {
      await dbService.delete(item.id);
      notify(`"${item.modelo}" eliminado`, 'info');
      await loadItems();
    } catch (err) {
      console.error('Error eliminando artículo:', err);
      notify('Error al eliminar artículo: ' + err.message, 'error');
    }
  };

  const handleAdjustStock = async (id, delta) => {
    try {
      const updated = await dbService.adjustStock(id, delta);
      if (updated) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, stock: updated.stock, updatedAt: updated.updatedAt } : it))
        );
      }
    } catch (err) {
      console.error('Error ajustando stock:', err);
      notify('Error al actualizar stock', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notificación */}
      {toast && (
        <aside className={`toast-notification ${toast.type}`}>
          {toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : toast.type === 'info' ? (
            <Info size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
        </aside>
      )}

      {/* Header con Logo oficial de Mundo Cases */}
      <Header
        onOpenDataModal={() => setIsDataModalOpen(true)}
        itemCount={items.length}
      />

      {/* Tarjetas de Métricas de Inventario */}
      <Metrics items={items} />

      {/* Barra de Búsqueda, Filtros y Acciones */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenAddModal={handleOpenAdd}
        brandOptions={brandOptions}
      />

      {/* Lista de Artículos */}
      <main className="items-list-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando inventario de Mundo Cases...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="items-grid">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteItem}
                onAdjustStock={handleAdjustStock}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <PackageOpen size={42} color="var(--gold-primary)" />
            </div>
            <h3>No se encontraron artículos</h3>
            <p>
              {searchQuery || selectedBrand !== 'ALL'
                ? 'Intenta cambiar el criterio de búsqueda o filtro.'
                : 'Tu inventario está vacío. Añade el primer artículo con el botón inferior.'}
            </p>
            <button className="btn-primary-add" onClick={handleOpenAdd} style={{ marginTop: '12px' }}>
              <Plus size={18} />
              <span>Añadir Artículo</span>
            </button>
          </div>
        )}
      </main>

      {/* Botón flotante para móvil (FAB) */}
      <button
        className="fab-btn"
        onClick={handleOpenAdd}
        title="Añadir nuevo producto"
        aria-label="Añadir nuevo producto"
      >
        <Plus size={24} color="#07090e" strokeWidth={2.5} />
      </button>

      {/* Modal para Crear / Editar Artículo */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      {/* Modal para Gestión de Base de Datos (Exportar/Importar JSON & CSV) */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onDataReload={loadItems}
        notify={notify}
      />
    </div>
  );
}

export default App;
