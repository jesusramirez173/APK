import React from 'react';
import { Smartphone, Layers, DollarSign, AlertTriangle } from 'lucide-react';

export function Metrics({ items }) {
  const totalModelos = items.length;
  const totalUnidades = items.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  const valorTotal = items.reduce((acc, curr) => acc + ((curr.stock || 0) * (curr.precio || 0)), 0);
  const articulosBajos = items.filter(item => (item.stock || 0) < 5).length;

  return (
    <section className="metrics-grid">
      <div className="metric-card">
        <div className="metric-header">
          <span>Modelos</span>
          <div className="metric-icon-wrap" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}>
            <Smartphone size={16} />
          </div>
        </div>
        <div className="metric-value">{totalModelos}</div>
        <div className="metric-subtitle">Artículos registrados</div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>En Stock</span>
          <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Layers size={16} />
          </div>
        </div>
        <div className="metric-value">{totalUnidades}</div>
        <div className="metric-subtitle">Unidades físicas</div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>Valor Inventario</span>
          <div className="metric-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <DollarSign size={16} />
          </div>
        </div>
        <div className="metric-value">${valorTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div className="metric-subtitle">Precio de venta total</div>
      </div>

      <div className={`metric-card ${articulosBajos > 0 ? 'alert' : ''}`}>
        <div className="metric-header">
          <span>Stock Bajo</span>
          <div className="metric-icon-wrap" style={{ 
            background: articulosBajos > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
            color: articulosBajos > 0 ? '#ef4444' : 'var(--text-muted)' 
          }}>
            <AlertTriangle size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: articulosBajos > 0 ? '#f87171' : 'inherit' }}>
          {articulosBajos}
        </div>
        <div className="metric-subtitle">
          {articulosBajos > 0 ? 'Menos de 5 unidades' : 'Niveles óptimos'}
        </div>
      </div>
    </section>
  );
}
