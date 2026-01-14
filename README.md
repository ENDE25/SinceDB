# 📱 SinceDB - Cuándo hablé por última vez

Una aplicación web minimalista y elegante para hacer seguimiento de cuánto tiempo ha pasado desde la última vez que hablaste con las personas importantes en tu vida.

---

## 📖 **GUÍA DE USUARIO**

### ¿Para qué sirve?

**SinceDB** te ayuda a mantener contacto regular con las personas que te importan. La aplicación visualiza de manera intuitiva cuánto tiempo ha pasado desde tu última conversación con cada persona, usando barras de colores que crecen conforme pasa más tiempo.

### 🎯 **Funcionalidades Principales**

#### 📊 **Visualización Intuitiva**
- **Barras horizontales** que representan el tiempo transcurrido
- **Colores graduales**: Verde (reciente) → Amarillo (moderado) → Rojo (mucho tiempo)
- **Contador de días** preciso a la derecha de cada barra
- **Ordenamiento automático**: Las personas con más tiempo sin contacto aparecen arriba

#### 👥 **Gestión de Contactos**
- ➕ **Añadir personas** con la fecha del último contacto
- ✏️ **Editar información** de personas existentes
- 🗑️ **Eliminar personas** individualmente
- ✅ **Marcar "acabo de hablar"** para actualizar a la fecha actual

#### 🔧 **Herramientas Adicionales**
- 🗑️ **Borrar todos los datos** con confirmación de seguridad
- ℹ️ **Información de almacenamiento** con estadísticas detalladas
- 📱 **Diseño responsive** para móviles y escritorio

### 🚀 **Cómo usar la aplicación**

#### **Primeros pasos:**
1. **Abre** `index.html` en tu navegador web
2. **Haz clic** en "Añadir Persona" para crear tu primera entrada
3. **Introduce** el nombre y la fecha del último contacto
4. **Guarda** y observa cómo aparece en la lista

#### **Uso diario:**
- **Revisa** regularmente la lista para ver con quién llevas más tiempo sin hablar
- **Usa el botón ✅** cuando hables con alguien para actualizar la fecha automáticamente
- **Edita fechas** si recuerdas conversaciones anteriores
- **Añade nuevas personas** conforme expandes tu círculo social

#### **Interpretación visual:**
- **Barras verdes cortas**: Has hablado recientemente (≤ 7 días)
- **Barras amarillas medianas**: Tiempo moderado sin contacto (8-30 días)
- **Barras rojas largas**: Mucho tiempo sin contacto (> 30 días)

### 💾 **Almacenamiento de Datos**

Tus datos se guardan **localmente** en tu navegador y **NO se envían** a ningún servidor externo:
- ✅ **Privacidad total**: Solo tú tienes acceso a la información
- ✅ **Persistencia**: Los datos se mantienen al cerrar y abrir el navegador
- ✅ **Sin internet**: Funciona completamente offline
- ⚠️ **Backup recomendado**: Los datos se pierden si borras los datos del navegador

---

## 🛠️ **DOCUMENTACIÓN TÉCNICA**

### 📋 **Arquitectura del Proyecto**

#### **Patrón Arquitectónico: Vista-Controlador**
La aplicación implementa una arquitectura MVC simplificada:
- **Vista**: `index.html` + `styles.css` (interfaz de usuario)
- **Controlador**: `app.js` (lógica de negocio y manejo de eventos)
- **Modelo**: Datos en localStorage (persistencia)

#### **Estructura de Archivos**
```
SinceDB/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS con diseño responsive
├── app.js             # Controlador principal de la aplicación
└── README.md          # Documentación del proyecto
```

### 💻 **Tecnologías Utilizadas**

#### **Frontend**
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Flexbox, CSS Grid, variables CSS, gradientes
- **JavaScript ES6+**: Clases, módulos, arrow functions, async/await
- **Font Awesome 6**: Iconografía
- **Google Fonts (Inter)**: Tipografía moderna

#### **Almacenamiento**
- **localStorage API**: Persistencia local de datos
- **JSON**: Formato de serialización de datos

#### **Características Técnicas**
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Funciona sin JavaScript (degradación elegante)
- **Cross-browser Compatibility**: Compatible con navegadores modernos
- **Accessibility**: ARIA labels y navegación por teclado

### 🔧 **Implementación Técnica**

#### **Clase Principal: SinceDBController**
```javascript
class SinceDBController {
    constructor() {
        this.people = [];           // Array de objetos persona
        this.currentEditingId = null;  // ID de persona siendo editada
        this.init();               // Inicialización
    }
}
```

#### **Modelo de Datos**
```javascript
// Estructura de cada persona
{
    id: "unique_id",           // ID único generado
    name: "Nombre Persona",    // Nombre de la persona
    lastContact: Date          // Fecha del último contacto
}
```

#### **Algoritmo de Visualización**
1. **Cálculo de días transcurridos**: `(fechaActual - fechaUltimoContacto) / (1000 * 60 * 60 * 24)`
2. **Normalización de barras**: Escalado relativo basado en rango min-max
3. **Asignación de colores**: Clasificación por umbrales (≤7, ≤30, >30 días)

#### **Gestión del Estado**
- **Carga inicial**: `loadData()` deserializa desde localStorage
- **Persistencia automática**: `saveData()` en cada modificación
- **Renderizado reactivo**: `render()` actualiza la vista completa

### 🎨 **Sistema de Diseño**

#### **Variables CSS Personalizadas**
```css
:root {
    --primary-color: #6366f1;     /* Índigo principal */
    --success-color: #10b981;     /* Verde para acciones exitosas */
    --danger-color: #ef4444;      /* Rojo para acciones destructivas */
    --gray-scale: #f9fafb...#111827; /* Escala de grises */
}
```

#### **Componentes Reutilizables**
- **Botones**: `.add-person-btn`, `.clear-all-btn`, `.action-btn`
- **Formularios**: `.person-form`, `.form-group`
- **Tarjetas**: `.person-item`
- **Notificaciones**: Sistema dinámico con animaciones

#### **Responsive Breakpoints**
- **Desktop**: > 768px (diseño horizontal)
- **Mobile**: ≤ 768px (diseño vertical, sidebar full-screen)

### 🔐 **Seguridad y Calidad del Código**

#### **Prevención de Vulnerabilidades**
- **XSS Protection**: `escapeHtml()` para sanitización de entrada
- **Input Validation**: Validación tanto frontend como en el controlador
- **Confirmaciones múltiples**: Doble confirmación para acciones destructivas

#### **Manejo de Errores**
```javascript
try {
    // Operación con localStorage
} catch (error) {
    console.error('Error específico:', error);
    this.people = [];  // Fallback seguro
}
```

#### **Optimizaciones de Rendimiento**
- **Event Delegation**: Manejo eficiente de eventos dinámicos
- **Debouncing**: Control de frecuencia en operaciones pesadas
- **Lazy Loading**: Renderizado bajo demanda
- **Minimal DOM Manipulation**: Batch updates para mejor rendimiento

### 📱 **Funcionalidades Avanzadas**

#### **Notificaciones del Sistema**
- **Toasts animados**: Feedback visual inmediato
- **Auto-dismiss**: Eliminación automática después de 3 segundos
- **Tipos diferenciados**: Success, error, info con colores específicos

#### **Navegación por Teclado**
- **ESC**: Cierra sidebar y modales
- **Enter**: Envía formularios
- **Tab**: Navegación accesible entre elementos

#### **Gestión del Estado del Sidebar**
- **Overlay transparente**: Cierre por clic fuera
- **Animaciones CSS**: Transiciones suaves
- **Focus management**: Auto-focus en campos importantes

### 🚀 **Instalación y Despliegue**

#### **Requisitos**
- Navegador web moderno (Chrome 80+, Firefox 75+, Safari 13+)
- No requiere servidor web (puede ejecutarse localmente)

#### **Instalación Local**
```bash
# Clonar o descargar los archivos
git clone <repository-url>
cd SinceDB

# Abrir en navegador
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

#### **Despliegue Web**
- **GitHub Pages**: Subir a repositorio y activar Pages
- **Netlify**: Drag & drop de la carpeta
- **Vercel**: Deploy automático desde Git
- **Servidor estático**: Cualquier servidor HTTP

### 🧪 **Testing y Debugging**

#### **Herramientas de Debug**
- **Console logs**: Información detallada en consola del navegador
- **localStorage inspector**: DevTools → Application → Storage
- **Network tab**: Verificación de recursos externos
- **Responsive design mode**: Testing multi-dispositivo

#### **Casos de Prueba Recomendados**
1. **Añadir persona** con diferentes tipos de nombres
2. **Editar fechas** con valores límite (pasado/futuro)
3. **Eliminar elementos** y verificar persistencia
4. **Borrado masivo** y recuperación de estado
5. **Navegación móvil** y desktop
6. **Offline functionality** (desconectar internet)

### 📈 **Posibles Mejoras Futuras**

#### **Funcionalidades**
- **Export/Import**: Backup en JSON/CSV
- **Categorías**: Agrupar por tipo de relación
- **Recordatorios**: Notificaciones push
- **Estadísticas**: Gráficos de tendencias
- **Sincronización**: Cloud storage opcional

#### **Técnicas**
- **Service Worker**: Funcionalidad offline completa
- **IndexedDB**: Base de datos más robusta
- **PWA**: Instalación como aplicación nativa
- **TypeScript**: Tipado estático
- **Testing framework**: Jest o Vitest para pruebas automatizadas

---

## 📄 **Licencia**

Este proyecto está bajo licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🤝 **Contribuciones**

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.
