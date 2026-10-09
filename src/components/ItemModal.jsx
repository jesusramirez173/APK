import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const COMMON_BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Huawei', 'Google', 'Infinix', 'Tecno', 'Honor', 'Realme'];
const COMMON_CATEGORIES = [
  'Case Silicona Líquida',
  'Case MagSafe Magnético',
  'Case Antichoque / Uso Rudo',
  'Funda Transparente TPU',
  'Case Cuero Premium',
  'Case con Anillo Soporte',
  'Vidrio Templado 9D',
  'Protector de Lente Cámara'
];

export function ItemModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    categoria: 'Case Silicona Líquida',
    precio: '',
    costo: '',
    stock: '',
    codigo: '',
    ubicacion: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        marca: itemToEdit.marca || '',
        modelo: itemToEdit.modelo || '',
        categoria: itemToEdit.categoria || 'Case Silicona Líquida',
        precio: itemToEdit.precio !== undefined ? itemToEdit.precio : '',
        costo: itemToEdit.costo !== undefined ? itemToEdit.costo : '',
        stock: itemToEdit.stock !== undefined ? itemToEdit.stock : '',
        codigo: itemToEdit.codigo || '',
        ubicacion: itemToEdit.ubicacion || ''
      });
    } else {
      setFormData({
        marca: '',
        modelo: '',
        categoria: 'Case Silicona Líquida',
        precio: '',
        costo: '',
        stock: '10',
        codigo: '',
        ubicacion: ''
      });
    }
    setError('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.marca.trim()) {
      setError('Por favor indica la marca del artículo');
      return;
    }
    if (!formData.modelo.trim()) {
      setError('Por favor indica el modelo del teléfono / accesorio');
      return;
    }
    if (!formData.precio || isNaN(formData.precio) || Number(formData.precio) < 0) {
      setError('Por favor ingresa un precio de venta válido');
      return;
    }

    onSave({
      ...formData,
      precio: Number(formData.precio),
      costo: formData.costo ? Number(formData.costo) : 0,
      stock: formData.stock ? Number(formData.stock) : 0
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {itemToEdit ? 'Modificar Artículo' : 'Añadir Nuevo Artículo'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Marca con Presets */}
          <div className="form-group">
            <label className="form-label">Marca *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Apple, Samsung, Xiaomi..."
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              required
            />
            <div className="brand-presets">
              {COMMON_BRANDS.map((b) => (
                <button
                  type="button"
                  key={b}
                  className="preset-chip"
                  onClick={() => setFormData({ ...formData, marca: b })}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Modelo */}
          <div className="form-group">
            <label className="form-label">Modelo del Dispositivo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: iPhone 16 Pro Max, Galaxy S25..."
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              required
            />
          </div>

          {/* Categoría / Tipo de Case */}
          <div className="form-group">
            <label className="form-label">Tipo de Case / Categoría</label>
            <select
              className="form-input"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            >
              {COMMON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Otro">Otro Accesorio</option>
            </select>
          </div>

          {/* Precios: Venta y Costo */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Precio de Venta ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Costo ($ opcional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
                value={formData.costo}
                onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
              />
            </div>
          </div>

          {/* Unidades Disponibles (Stock) y Ubicación */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Unidades Disponibles *</label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="10"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ubicación Tienda</label>
              <input
                type="text"
                className="form-input"
                placeholder="Vitrina 1, Gaveta B..."
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </div>
          </div>

          {/* Código SKU o Barra */}
          <div className="form-group">
            <label className="form-label">Código SKU / Barra (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: MC-IP16P-01"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {itemToEdit ? 'Guardar Cambios' : 'Añadir al Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
