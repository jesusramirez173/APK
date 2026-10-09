# 📱 Mundo Cases - Control de Inventario Móvil (APK)

Aplicación móvil moderna de control y gestión de inventario para la tienda especializada **Mundo Cases**, desarrollada con **React 18**, **Vite**, **Capacitor** y **Dexie (IndexedDB)**.

![Logo Mundo Cases](public/logo.jpg)

---

## 🚀 Características Principales

- **Gestión Completa de Artículos (CRUD):**
  - ➕ **Agregar** nuevos modelos de fundas y accesorios con validación inmediata.
  - ✏️ **Modificar** artículos existentes (precios, stock, descripción, ubicación en tienda).
  - 🗑️ **Eliminar** artículos con ventana de confirmación segura.
  - ⚡ **Ajuste Rápido de Stock:** Botones directos `+` y `-` en cada tarjeta para registrar ventas o recepciones en 1 segundo.
- **Campos del Inventario:**
  - **Marca:** Presets rápidos (Apple, Samsung, Xiaomi, Motorola, etc.) y texto libre.
  - **Modelo:** Especificación del dispositivo (ej: iPhone 16 Pro Max, Galaxy S25...).
  - **Categoría:** Tipos de case (Silicona líquida, MagSafe magnético, Uso rudo, etc.).
  - **Precio de Venta ($):** Formato monetario con decimales.
  - **Costo ($ opcional):** Para cálculo de margen de ganancia.
  - **Unidades Disponibles (Stock):** Control visual con alertas por colores (verde, amarillo para bajo stock `< 5`, rojo para agotado).
  - **Ubicación en Tienda:** Vitrinas, estantes o gavetas.
  - **Código SKU / Barra:** Para identificación rápida.
- **Base de Datos Inteligente y Fácil de Manipular:**
  - **Offline-First:** Funciona sin internet mediante **IndexedDB / Dexie** con respaldo en `localStorage`.
  - 📤 **Exportación a JSON:** Respaldo completo de la base de datos con un clic.
  - 📥 **Importación desde JSON:** Carga o restaura tu base de datos fácilmente en cualquier teléfono.
  - 📊 **Exportación a CSV (Excel):** Genera hojas de cálculo para control contable y edición en Excel.
  - 🔄 **Restablecer catálogo muestra:** Carga datos iniciales reales de Mundo Cases para demostraciones.
- **Diseño Luxury & Móvil:**
  - Paleta en tonos oscuros y dorados acorde al logo oficial de Mundo Cases.
  - Optimizado para pantallas táctiles y uso vertical con una sola mano.

---

## 🛠️ Arquitectura Tecnológica

| Capa | Tecnología |
|---|---|
| **Frontend UI** | React 18, Lucide Icons, Vanilla CSS Luxury Design System |
| **Bundler & Tooling** | Vite 5 |
| **Persistencia Local** | Dexie.js (IndexedDB) + LocalStorage Fallback |
| **Plataforma Móvil Native** | Capacitor 6 (Android SDK) |
| **CI/CD & Compilación APK** | GitHub Actions (`.github/workflows/build-apk.yml`) |

---

## 📦 Descarga e Instalación del APK

### Opción 1: Desde GitHub Releases (Recomendada)
1. Ve a la pestaña **Releases** de este repositorio en GitHub.
2. Descarga el archivo **`MundoCases-Inventario-v1.0.apk`**.
3. En tu teléfono Android, abre el archivo descargado y presiona **Instalar**. *(Si tu teléfono lo solicita, activa "Permitir instalar aplicaciones de orígenes desconocidos" en Ajustes).*
4. ¡Listo! La app aparecerá en tu menú de aplicaciones con el logo dorado oficial de Mundo Cases.

### Opción 2: Desde GitHub Actions
1. Ve a la pestaña **Actions** en el repositorio.
2. Selecciona la ejecución del flujo **"Construir APK Mundo Cases"**.
3. En la sección **Artifacts**, descarga el archivo ZIP que contiene la APK ya compilada.

---

## 💻 Desarrollo Local

Para correr el proyecto en tu computadora:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Compilar para producción web
npm run build

# Sincronizar cambios con el proyecto Android nativo
npx cap sync android
```
