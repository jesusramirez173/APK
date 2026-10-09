import React from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';

export function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  sortBy,
  setSortBy,
  onOpenAddModal,
  brandOptions
}) {
  return (
    <div className="controls-card">
      {/* Search Input */}
      <div className="search-box">
        <Search size={18} color="var(--gold-primary)" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por marca, modelo, tipo o código..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Brand & Filter Chips */}
      <div className="filter-chips">
        <button
          className={`chip-btn ${selectedBrand === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedBrand('ALL')}
        >
          Todos
        </button>
        <button
          className={`chip-btn ${selectedBrand === 'LOW_STOCK' ? 'active' : ''}`}
          onClick={() => setSelectedBrand('LOW_STOCK')}
          style={selectedBrand === 'LOW_STOCK' ? {} : { color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}
        >
          ⚠️ Stock Bajo
        </button>
        {brandOptions.map((brand) => (
          <button
            key={brand}
            className={`chip-btn ${selectedBrand === brand ? 'active' : ''}`}
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Action Row: Sort and Add Button */}
      <div className="action-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={14} color="var(--text-dim)" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Recientes</option>
            <option value="price-desc">Mayor Precio ($$)</option>
            <option value="price-asc">Menor Precio ($)</option>
            <option value="stock-desc">Mayor Stock</option>
            <option value="stock-asc">Menor Stock</option>
            <option value="alpha">Nombre A-Z</option>
          </select>
        </div>

        <button className="btn-primary-add" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Nuevo Artículo</span>
        </button>
      </div>
    </div>
  );
}
