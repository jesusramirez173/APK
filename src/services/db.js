import Dexie from 'dexie';

// Inicialización de la base de datos Dexie (IndexedDB)
export const db = new Dexie('MundoCasesDB');

db.version(1).stores({
  items: '++id, marca, modelo, categoria, precio, costo, stock, codigo, ubicacion, updatedAt'
});

// Artículos de demostración precargados con la especialidad de la tienda
export const SAMPLE_ITEMS = [
  {
    marca: 'Apple',
    modelo: 'iPhone 15 Pro Max',
    categoria: 'Case MagSafe Silicona',
    precio: 18.50,
    costo: 8.00,
    stock: 24,
    codigo: 'AP-IP15PM-MAG',
    ubicacion: 'Vitrina 1 - Estante A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    marca: 'Apple',
    modelo: 'iPhone 14 / 14 Pro',
    categoria: 'Case Antichoque Reforzado',
    precio: 14.00,
    costo: 6.50,
    stock: 12,
    codigo: 'AP-IP14-ARM',
    ubicacion: 'Vitrina 1 - Estante B',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    marca: 'Samsung',
    modelo: 'Galaxy S24 Ultra',
    categoria: 'Case Fibra de Carbono Mate',
    precio: 20.00,
    costo: 9.00,
    stock: 15,
    codigo: 'SM-S24U-CF',
    ubicacion: 'Vitrina 2 - Estante A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    marca: 'Samsung',
    modelo: 'Galaxy A54 / A55 5G',
    categoria: 'Funda Transparente Antiamarilleo',
    precio: 9.50,
    costo: 3.50,
    stock: 4, // Stock bajo para probar alertas
    codigo: 'SM-A54-CLR',
    ubicacion: 'Vitrina 2 - Estante C',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    marca: 'Xiaomi',
    modelo: 'Redmi Note 13 Pro+',
    categoria: 'Case Armor con Anillo Soporte',
    precio: 12.00,
    costo: 5.00,
    stock: 2, // Alerta crítica de stock
    codigo: 'XI-RN13P-RNG',
    ubicacion: 'Vitrina 3 - Estante B',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    marca: 'Xiaomi',
    modelo: 'POCO X6 Pro 5G',
    categoria: 'Case Cuero Sintético Premium',
    precio: 15.00,
    costo: 6.80,
    stock: 8,
    codigo: 'XI-PCX6-LTH',
    ubicacion: 'Vitrina 3 - Estante A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    marca: 'Motorola',
    modelo: 'Moto G84 5G',
    categoria: 'Case Silicona Líquida Soft',
    precio: 10.00,
    costo: 4.00,
    stock: 18,
    codigo: 'MO-G84-SLK',
    ubicacion: 'Vitrina 4 - Estante A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Métodos CRUD de la base de datos
export const dbService = {
  // Obtener todos los artículos ordenados por actualización reciente
  async getAll() {
    try {
      const items = await db.items.toArray();
      if (items.length === 0) {
        // Si la base de datos está vacía por primera vez, sembramos datos iniciales
        await db.items.bulkAdd(SAMPLE_ITEMS);
        return await db.items.toArray();
      }
      return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (err) {
      console.warn('Error accediendo a Dexie, usando localStorage fallback:', err);
      return this._fallbackGet();
    }
  },

  // Agregar nuevo artículo
  async add(item) {
    const newItem = {
      ...item,
      precio: parseFloat(item.precio) || 0,
      costo: parseFloat(item.costo) || 0,
      stock: parseInt(item.stock, 10) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      const id = await db.items.add(newItem);
      return { ...newItem, id };
    } catch (err) {
      return this._fallbackAdd(newItem);
    }
  },

  // Modificar artículo existente
  async update(id, updates) {
    const cleanUpdates = {
      ...updates,
      precio: updates.precio !== undefined ? parseFloat(updates.precio) || 0 : undefined,
      costo: updates.costo !== undefined ? parseFloat(updates.costo) || 0 : undefined,
      stock: updates.stock !== undefined ? parseInt(updates.stock, 10) || 0 : undefined,
      updatedAt: new Date().toISOString()
    };
    // Remover undefined
    Object.keys(cleanUpdates).forEach(k => cleanUpdates[k] === undefined && delete cleanUpdates[k]);

    try {
      await db.items.update(Number(id), cleanUpdates);
      return await db.items.get(Number(id));
    } catch (err) {
      return this._fallbackUpdate(id, cleanUpdates);
    }
  },

  // Ajuste rápido de stock (+1 o -1)
  async adjustStock(id, delta) {
    try {
      const item = await db.items.get(Number(id));
      if (!item) return null;
      const newStock = Math.max(0, (item.stock || 0) + delta);
      await db.items.update(Number(id), { stock: newStock, updatedAt: new Date().toISOString() });
      return await db.items.get(Number(id));
    } catch (err) {
      return this._fallbackAdjustStock(id, delta);
    }
  },

  // Eliminar artículo
  async delete(id) {
    try {
      await db.items.delete(Number(id));
      return true;
    } catch (err) {
      return this._fallbackDelete(id);
    }
  },

  // Vaciar base de datos
  async clear() {
    try {
      await db.items.clear();
      localStorage.removeItem('mundo_cases_items');
      return true;
    } catch (err) {
      localStorage.removeItem('mundo_cases_items');
      return true;
    }
  },

  // Recargar datos de muestra
  async resetToSample() {
    await this.clear();
    await db.items.bulkAdd(SAMPLE_ITEMS);
    return await db.items.toArray();
  },

  // Exportar base de datos como archivo JSON (fácil manipulación y respaldo)
  async exportJSON() {
    const items = await this.getAll();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `inventario_mundo_cases_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Exportar base de datos como CSV para Excel
  async exportCSV() {
    const items = await this.getAll();
    const headers = ['ID', 'Marca', 'Modelo', 'Categoria', 'Precio Venta', 'Costo', 'Stock', 'Codigo SKU', 'Ubicacion', 'Fecha'];
    const rows = items.map(i => [
      i.id || '',
      `"${(i.marca || '').replace(/"/g, '""')}"`,
      `"${(i.modelo || '').replace(/"/g, '""')}"`,
      `"${(i.categoria || '').replace(/"/g, '""')}"`,
      i.precio || 0,
      i.costo || 0,
      i.stock || 0,
      `"${(i.codigo || '').replace(/"/g, '""')}"`,
      `"${(i.ubicacion || '').replace(/"/g, '""')}"`,
      i.updatedAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventario_mundo_cases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Importar desde JSON
  async importJSON(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) throw new Error('El archivo JSON debe contener una lista de artículos');
    const itemsToInsert = parsed.map(item => ({
      marca: item.marca || 'Genérica',
      modelo: item.modelo || 'Sin modelo',
      categoria: item.categoria || 'Case',
      precio: parseFloat(item.precio) || 0,
      costo: parseFloat(item.costo) || 0,
      stock: parseInt(item.stock, 10) || 0,
      codigo: item.codigo || '',
      ubicacion: item.ubicacion || '',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    await db.items.bulkAdd(itemsToInsert);
    return await this.getAll();
  },

  // Fallbacks de LocalStorage en caso de entornos restringidos
  _fallbackGet() {
    const stored = localStorage.getItem('mundo_cases_items');
    if (!stored) {
      localStorage.setItem('mundo_cases_items', JSON.stringify(SAMPLE_ITEMS));
      return SAMPLE_ITEMS;
    }
    return JSON.parse(stored);
  },
  _fallbackAdd(item) {
    const list = this._fallbackGet();
    const withId = { ...item, id: Date.now() };
    list.unshift(withId);
    localStorage.setItem('mundo_cases_items', JSON.stringify(list));
    return withId;
  },
  _fallbackUpdate(id, updates) {
    let list = this._fallbackGet();
    list = list.map(item => item.id == id ? { ...item, ...updates } : item);
    localStorage.setItem('mundo_cases_items', JSON.stringify(list));
    return list.find(item => item.id == id);
  },
  _fallbackAdjustStock(id, delta) {
    let list = this._fallbackGet();
    list = list.map(item => {
      if (item.id == id) {
        const stock = Math.max(0, (item.stock || 0) + delta);
        return { ...item, stock, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    localStorage.setItem('mundo_cases_items', JSON.stringify(list));
    return list.find(item => item.id == id);
  },
  _fallbackDelete(id) {
    let list = this._fallbackGet();
    list = list.filter(item => item.id != id);
    localStorage.setItem('mundo_cases_items', JSON.stringify(list));
    return true;
  }
};
