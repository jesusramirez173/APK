import React from 'react';
import { Database, ShieldCheck, Sparkles } from 'lucide-react';

export function Header({ onOpenDataModal, itemCount }) {
  return (
    <header className="header-card">
      <div className="brand-wrapper">
        <div className="brand-logo-container" title="Mundo Cases - Logo Oficial">
          <img src="/logo.jpg" alt="Mundo Cases" className="brand-logo-img" />
        </div>
        <div className="brand-info">
          <h1>Mundo Cases</h1>
          <p>
            <span className="status-indicator"></span>
            <span>Inventario Móvil</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: 'var(--gold-light)' }}>{itemCount} modelos</span>
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className="btn-icon" 
          onClick={onOpenDataModal} 
          title="Gestión de Datos (Exportar / Importar / Backup)"
          aria-label="Gestión de Datos"
        >
          <Database size={19} color="#d4af37" />
        </button>
      </div>
    </header>
  );
}
