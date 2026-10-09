import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, RefreshCw, Trash, Check, AlertCircle } from 'lucide-react';
import { dbService } from '../services/db';

export function DataManagementModal({ isOpen, onClose, onDataReload, notify }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = async () => {
    try {
      await dbService.exportJSON();
      notify('Base de datos exportada en formato JSON exitosamente', 'success');
    } catch (e) {
      notify('Error al exportar JSON: ' + e.message, 'error');
    }
  };

  const handleExportCSV = async () => {
    try {
      await dbService.exportCSV();
      notify('Inventario exportado en formato CSV (Excel) exitosamente', 'success');
    } catch (e) {
      notify('Error al exportar CSV: ' + e.message, 'error');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      if (file.name.endsWith('.json')) {
        await dbService.importJSON(text);
        notify('Datos importados desde JSON correctamente', 'success');
        onDataReload();
      } else {
        notify('Formato no soportado directamente. Por favor sube un archivo .json', 'warning');
      }
    } catch (err) {
      notify('Error al importar archivo: ' + err.message, 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetSample = async () => {
    if (window.confirm('¿Deseas recargar los artículos de muestra de Mundo Cases?')) {
      setLoading(true);
      try {
        await dbService.resetToSample();
        notify('Catálogo inicial restaurado con éxito', 'success');
        onDataReload();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de que deseas eliminar TODOS los artículos del inventario? Esta acción no se puede deshacer.')) {
      setLoading(true);
      try {
        await dbService.clear();
        notify('Se ha vaciado el inventario', 'info');
        onDataReload();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Gestión de la Base de Datos</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.4 }}>
          Base de datos local ultrarrápida <strong>IndexedDB (Dexie)</strong>. Tus datos se guardan permanentemente en tu teléfono incluso sin internet. Puedes respaldar y manipular tus datos libremente:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Exportar JSON */}
          <button
            onClick={handleExportJSON}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Download size={18} color="var(--gold-primary)" />
              <div style={{ textAlign: 'left' }}>
                <div>Exportar Copia de Seguridad (.JSON)</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 400 }}>Respaldo completo de la base de datos</div>
              </div>
            </div>
            <span style={{ color: 'var(--gold-light)', fontSize: '0.8rem' }}>Descargar</span>
          </button>

          {/* Exportar CSV */}
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileSpreadsheet size={18} color="#10b981" />
              <div style={{ textAlign: 'left' }}>
                <div>Exportar para Excel (.CSV)</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 400 }}>Abre y edita en Microsoft Excel o Sheets</div>
              </div>
            </div>
            <span style={{ color: '#34d399', fontSize: '0.8rem' }}>Excel</span>
          </button>

          {/* Importar Archivo */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Upload size={18} color="#38bdf8" />
              <div style={{ textAlign: 'left' }}>
                <div>Restaurar o Importar Archivo (.JSON)</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 400 }}>Carga masiva de artículos al inventario</div>
              </div>
            </div>
            <span style={{ color: '#38bdf8', fontSize: '0.8rem' }}>Subir</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '6px 0' }} />

          {/* Recargar Artículos Muestra */}
          <button
            onClick={handleResetSample}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.86rem'
            }}
          >
            <RefreshCw size={16} />
            <span>Recargar Catálogo Inicial de Muestra</span>
          </button>

          {/* Vaciar Inventario */}
          <button
            onClick={handleClearAll}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.86rem'
            }}
          >
            <Trash size={16} />
            <span>Vaciar Base de Datos Completa</span>
          </button>
        </div>

        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <button className="btn-cancel" style={{ width: '100%' }} onClick={onClose}>
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}
