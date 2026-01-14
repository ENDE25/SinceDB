// Controlador principal de la aplicación SinceDB
class SinceDBController {
    constructor() {
        this.people = [];
        this.currentEditingId = null;
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.loadData();
        this.setupEventListeners();
        this.render();
        this.setTodayAsDefault();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botón para añadir persona
        document.getElementById('addPersonBtn').addEventListener('click', () => {
            this.openSidebar('add');
        });

        // Botón para borrar todos los datos
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Formulario
        document.getElementById('personForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Esc para cerrar sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('sidebar').classList.contains('open')) {
                this.closeSidebar();
            }
        });

        // Tooltip para información de almacenamiento
        this.setupStorageInfoTooltip();
    }

    // Establecer fecha de hoy como predeterminada
    setTodayAsDefault() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('lastContact').value = today;
    }

    // Cargar datos del localStorage
    loadData() {
        try {
            const stored = localStorage.getItem('sincedb-people');
            this.people = stored ? JSON.parse(stored) : [];
            
            // Convertir strings de fecha a objetos Date
            this.people.forEach(person => {
                person.lastContact = new Date(person.lastContact);
            });
        } catch (error) {
            console.error('Error cargando datos:', error);
            this.people = [];
        }
    }

    // Guardar datos en localStorage
    saveData() {
        try {
            // Convertir fechas a strings para JSON
            const dataToSave = this.people.map(person => ({
                ...person,
                lastContact: person.lastContact.toISOString().split('T')[0]
            }));
            
            localStorage.setItem('sincedb-people', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error guardando datos:', error);
        }
    }

    // Calcular días desde último contacto
    getDaysSince(date) {
        const now = new Date();
        const lastContact = new Date(date);
        const diffTime = now - lastContact;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // Obtener el rango de días para calcular porcentajes de barras
    getDaysRange() {
        if (this.people.length === 0) return { min: 0, max: 100 };
        
        const days = this.people.map(person => this.getDaysSince(person.lastContact));
        return {
            min: Math.min(...days),
            max: Math.max(...days)
        };
    }

    // Calcular porcentaje de barra basado en días transcurridos
    getBarPercentage(days) {
        const range = this.getDaysRange();
        if (range.max === range.min) return 50; // Si todos tienen los mismos días
        
        return ((days - range.min) / (range.max - range.min)) * 100;
    }

    // Obtener clase de color basada en días
    getBarColorClass(days) {
        if (days <= 7) return 'low';
        if (days <= 30) return 'medium';
        return 'high';
    }

    // Formatear fecha para mostrar
    formatDate(date) {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Añadir nueva persona
    addPerson(name, lastContact) {
        const person = {
            id: this.generateId(),
            name: name.trim(),
            lastContact: new Date(lastContact)
        };
        
        this.people.push(person);
        this.saveData();
        this.render();
        this.closeSidebar();
        
        // Mostrar feedback
        this.showNotification(`${name} añadido correctamente`, 'success');
    }

    // Editar persona existente
    editPerson(id, name, lastContact) {
        const personIndex = this.people.findIndex(p => p.id === id);
        if (personIndex !== -1) {
            this.people[personIndex] = {
                ...this.people[personIndex],
                name: name.trim(),
                lastContact: new Date(lastContact)
            };
            
            this.saveData();
            this.render();
            this.closeSidebar();
            
            // Mostrar feedback
            this.showNotification(`${name} actualizado correctamente`, 'success');
        }
    }

    // Eliminar persona
    deletePerson(id) {
        const person = this.people.find(p => p.id === id);
        if (person && confirm(`¿Estás seguro de eliminar a ${person.name}?`)) {
            this.people = this.people.filter(p => p.id !== id);
            this.saveData();
            this.render();
            
            // Mostrar feedback
            this.showNotification(`${person.name} eliminado correctamente`, 'info');
        }
    }

    // Marcar como "acabo de hablar"
    markAsSpokenToday(id) {
        const personIndex = this.people.findIndex(p => p.id === id);
        if (personIndex !== -1) {
            const person = this.people[personIndex];
            this.people[personIndex].lastContact = new Date();
            
            this.saveData();
            this.render();
            
            // Mostrar feedback
            this.showNotification(`Marcado como hablado hoy con ${person.name}`, 'success');
        }
    }

    // Borrar todos los datos
    clearAllData() {
        const confirmed = confirm(
            '¿Estás seguro de que quieres borrar TODOS los datos?\n\n' +
            'Esta acción eliminará todas las personas y no se puede deshacer.\n\n' +
            '⚠️ Se perderá toda la información permanentemente.'
        );
        
        if (confirmed) {
            // Segundo nivel de confirmación para mayor seguridad
            const doubleConfirmed = confirm(
                '⚠️ ÚLTIMA CONFIRMACIÓN ⚠️\n\n' +
                'Esto borrará definitivamente todos tus datos.\n' +
                'No habrá forma de recuperarlos.\n\n' +
                '¿Continuar con el borrado?'
            );
            
            if (doubleConfirmed) {
                // Limpiar datos
                this.people = [];
                localStorage.removeItem('sincedb-people');
                
                // Re-renderizar
                this.render();
                
                // Mostrar confirmación
                this.showNotification('Todos los datos han sido borrados', 'info');
            }
        }
    }

    // Configurar tooltip de información de almacenamiento
    setupStorageInfoTooltip() {
        const storageInfo = document.getElementById('storageInfo');
        
        if (storageInfo) {
            // Mejorar el tooltip nativo con información adicional
            storageInfo.addEventListener('click', () => {
                this.showStorageInfo();
            });
        }
    }

    // Mostrar información detallada sobre el almacenamiento
    showStorageInfo() {
        const storageSize = this.getStorageSize();
        const dataCount = this.people.length;
        
        alert(
            '📊 INFORMACIÓN DE ALMACENAMIENTO\n\n' +
            '📍 Ubicación: localStorage del navegador\n' +
            '💾 Persistencia: Los datos NO se borran al cerrar el navegador\n' +
            '🔒 Privacidad: Los datos permanecen solo en tu dispositivo\n' +
            '🌐 Acceso: Solo desde este dominio/URL\n\n' +
            '📈 ESTADÍSTICAS ACTUALES:\n' +
            `👥 Personas registradas: ${dataCount}\n` +
            `📦 Tamaño de datos: ~${storageSize} bytes\n` +
            `💽 Límite aproximado: ~5-10 MB\n\n` +
            '⚠️ Los datos se pueden perder si:\n' +
            '• Borras los datos del navegador manualmente\n' +
            '• Usas modo incógnito/privado\n' +
            '• Desinstalas el navegador completamente'
        );
    }

    // Obtener tamaño aproximado del almacenamiento
    getStorageSize() {
        try {
            const data = localStorage.getItem('sincedb-people');
            return data ? data.length : 0;
        } catch (error) {
            return 0;
        }
    }

    // Abrir sidebar para añadir o editar
    openSidebar(mode, personId = null) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const title = document.getElementById('sidebarTitle');
        const submitBtn = document.getElementById('submitBtn');
        const form = document.getElementById('personForm');
        
        // Limpiar formulario
        form.reset();
        this.setTodayAsDefault();
        
        if (mode === 'add') {
            this.currentEditingId = null;
            title.textContent = 'Añadir Persona';
            submitBtn.textContent = 'Añadir';
        } else if (mode === 'edit' && personId) {
            const person = this.people.find(p => p.id === personId);
            if (person) {
                this.currentEditingId = personId;
                title.textContent = 'Editar Persona';
                submitBtn.textContent = 'Guardar';
                
                // Llenar formulario con datos existentes
                document.getElementById('personName').value = person.name;
                document.getElementById('lastContact').value = person.lastContact.toISOString().split('T')[0];
            }
        }
        
        // Mostrar sidebar
        sidebar.classList.add('open');
        overlay.classList.add('show');
        
        // Focus en el campo de nombre
        setTimeout(() => {
            document.getElementById('personName').focus();
        }, 300);
    }

    // Cerrar sidebar
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        this.currentEditingId = null;
    }

    // Manejar envío del formulario
    handleFormSubmit() {
        const name = document.getElementById('personName').value.trim();
        const lastContact = document.getElementById('lastContact').value;
        
        if (!name || !lastContact) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        if (this.currentEditingId) {
            this.editPerson(this.currentEditingId, name, lastContact);
        } else {
            // Verificar si ya existe una persona con ese nombre
            if (this.people.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                this.showNotification('Ya existe una persona con ese nombre', 'error');
                return;
            }
            this.addPerson(name, lastContact);
        }
    }

    // Mostrar notificación (feedback simple)
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'var(--success-color)' : 
                       type === 'error' ? 'var(--danger-color)' : 
                       'var(--primary-color)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '2000',
            transform: 'translateX(100%)',
            transition: 'var(--transition)',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Renderizar la lista de personas
    render() {
        const personList = document.getElementById('personList');
        const emptyState = document.getElementById('emptyState');
        
        if (this.people.length === 0) {
            personList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }
        
        emptyState.classList.remove('show');
        
        // Ordenar por días transcurridos (descendente)
        const sortedPeople = [...this.people].sort((a, b) => {
            return this.getDaysSince(b.lastContact) - this.getDaysSince(a.lastContact);
        });
        
        const range = this.getDaysRange();
        
        personList.innerHTML = sortedPeople.map(person => {
            const days = this.getDaysSince(person.lastContact);
            const percentage = this.getBarPercentage(days);
            const colorClass = this.getBarColorClass(days);
            
            return `
                <div class="person-item">
                    <div class="person-header">
                        <h3 class="person-name">${this.escapeHtml(person.name)}</h3>
                        <div class="person-actions">
                            <button class="action-btn spoke-now" 
                                    onclick="app.markAsSpokenToday('${person.id}')"
                                    title="Marcar como 'acabo de hablar'">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="action-btn edit" 
                                    onclick="app.openSidebar('edit', '${person.id}')"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" 
                                    onclick="app.deletePerson('${person.id}')"
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar-container">
                            <div class="progress-bar ${colorClass}" 
                                 style="width: ${percentage}%"></div>
                        </div>
                        <div class="days-counter">
                            ${days} ${days === 1 ? 'día' : 'días'}
                        </div>
                    </div>
                    
                    <div class="last-contact-info">
                        Última vez: ${this.formatDate(person.lastContact)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Funciones globales para los event handlers en el HTML
window.toggleSidebar = () => app.openSidebar('add');
window.closeSidebar = () => app.closeSidebar();

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SinceDBController();
    
    // Registrar Service Worker para funcionalidad offline (opcional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Service worker no disponible, continuar sin él
        });
    }
});

// Exportar para uso en módulos (si se necesita)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SinceDBController;
}
