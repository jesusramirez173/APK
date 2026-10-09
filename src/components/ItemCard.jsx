import React from 'react';
import { Edit2, Trash2, Plus, Minus, MapPin, Tag } from 'lucide-react';

export function ItemCard({ item, onEdit, onDelete, onAdjustStock }) {
  const stock = item.stock || 0;
  
  // Determinación visual del estado del inventario
  let stockClass = 'good';
  let stockText = `${stock} un.`;
  if (stock === 0) {
    stockClass = 'empty';
    stockText = 'Agotado';
  } else if (stock < 5) {
    stockClass = 'low';
    stockText = `${stock} un. (Crítico)`;
  } else if (stock < 10) {
    stockClass = 'low';
    stockText = `${stock} un. (Bajo)`;
  }

  return (
    <article className="item-card">
      <div className="item-top">
        <div>
          <span className="item-brand-badge">{item.marca}</span>
          <h2 className="item-title">{item.modelo}</h2>
          <div className="item-cat">{item.categoria || 'Funda / Accesorio'}</div>
        </div>

        <div className="item-price-tag">
          <div className="item-price-main">${(item.precio || 0).toFixed(2)}</div>
          {item.costo ? (
            <div className="item-price-cost">Costo: ${(item.costo || 0).toFixed(2)}</div>
          ) : null}
        </div>
      </div>

      <div className="item-middle">
        <div className="stock-indicator">
          <span className={`stock-pill ${stockClass}`}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: stockClass === 'good' ? '#10b981' : stockClass === 'low' ? '#f59e0b' : '#ef4444'
            }}></span>
            {stockText}
          </span>
        </div>

        <div className="item-meta-info">
          {item.codigo && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Tag size={12} /> {item.codigo}
            </span>
          )}
          {item.ubicacion && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={12} /> {item.ubicacion}
            </span>
          )}
        </div>
      </div>

      <div className="item-bottom">
        {/* Contador Rápido de Stock (+ y -) */}
        <div className="stock-stepper" title="Ajuste rápido de unidades disponibles">
          <button
            className="stepper-btn"
            onClick={() => onAdjustStock(item.id, -1)}
            disabled={stock <= 0}
            title="Reducir 1 unidad (Venta)"
            aria-label="Restar 1 unidad"
          >
            <Minus size={15} />
          </button>
          <span className="stepper-val">{stock}</span>
          <button
            className="stepper-btn"
            onClick={() => onAdjustStock(item.id, 1)}
            title="Añadir 1 unidad (Reabastecimiento)"
            aria-label="Sumar 1 unidad"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Acciones de Edición y Eliminación */}
        <div className="item-action-btns">
          <button
            className="btn-item-action edit"
            onClick={() => onEdit(item)}
            title="Modificar artículo"
            aria-label="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn-item-action del"
            onClick={() => onDelete(item)}
            title="Eliminar artículo"
            aria-label="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
