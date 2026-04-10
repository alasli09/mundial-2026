class MundialApp {
    constructor() {
        this.favoritos = JSON.parse(localStorage.getItem('mundial_favoritos')) || ['col', 'arg', 'bra'];
        this.currentDate = '2026-06-11';
        this.currentFilter = 'todos';
        this.searchQuery = '';

        this.filtrosAvanzados = {
            fases: [],
            disponibilidad: [],
            canales: [],
            fechaDesde: null,
            fechaHasta: null,
            activo: false
        };

        this.fechasMundial = [...new Set(MUNDIAL_DATA.partidos.map(p => p.fecha))].sort();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAll();
    }

    setupEventListeners() {
        // Navegación Tabs
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn, .main-content').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
                if (btn.dataset.tab === 'analisis') this.renderAnalisis();
            });
        });

        // Buscador
        const searchInput = document.getElementById('search-input');
        const btnClear = document.getElementById('btn-clear-search');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            btnClear.style.display = this.searchQuery ? 'block' : 'none';
            this.renderCalendar();
        });
        btnClear.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            btnClear.style.display = 'none';
            this.renderCalendar();
        });

        // Filtros Rápidos
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentFilter = chip.dataset.filter;
                this.renderCalendar();
            });
        });

        // Navegación de Fechas
        document.getElementById('prev-date').addEventListener('click', () => this.changeDate(-1));
        document.getElementById('next-date').addEventListener('click', () => this.changeDate(1));

        // Modal de Filtros
        this.setupModalLogic();
    }

    setupModalLogic() {
        const modal = document.getElementById('modal-filtros');
        const btnAbrir = document.getElementById('btn-filtros-avanzados');
        const btnCerrar = modal.querySelector('.close-modal');
        const btnLimpiar = document.getElementById('limpiar-filtros');
        const btnAplicar = document.getElementById('aplicar-filtros');

        btnAbrir.onclick = () => modal.classList.add('active');
        btnCerrar.onclick = () => modal.classList.remove('active');

        btnAplicar.onclick = () => {
            this.filtrosAvanzados.fases = Array.from(modal.querySelectorAll('input[data-grupo="fases"]:checked')).map(i => i.value);
            this.filtrosAvanzados.disponibilidad = Array.from(modal.querySelectorAll('input[data-grupo="disponibilidad"]:checked')).map(i => i.value);
            this.filtrosAvanzados.canales = Array.from(modal.querySelectorAll('input[data-grupo="canales"]:checked')).map(i => i.value);
            this.filtrosAvanzados.fechaDesde = document.getElementById('filtro-fecha-desde').value;
            this.filtrosAvanzados.fechaHasta = document.getElementById('filtro-fecha-hasta').value;
            
            this.filtrosAvanzados.activo = true;
            modal.classList.remove('active');
            this.renderCalendar();
        };

        btnLimpiar.onclick = () => {
            modal.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
            document.getElementById('filtro-fecha-desde').value = '2026-06-11';
            document.getElementById('filtro-fecha-hasta').value = '2026-07-19';
            this.filtrosAvanzados.activo = false;
            this.renderCalendar();
        };
    }

    changeDate(delta) {
        const index = this.fechasMundial.indexOf(this.currentDate);
        const newIndex = index + delta;
        if (newIndex >= 0 && newIndex < this.fechasMundial.length) {
            this.currentDate = this.fechasMundial[newIndex];
            this.renderCalendar();
        }
    }

    estaDisponible(fecha, hora) {
        const h = parseInt(hora.split(':')[0]);
        if (h >= 8 && h < 17) return 'oficina';
        if (h >= 17 || (h >= 6 && h < 8)) return 'casa';
        return 'sueño';
    }

    renderCalendar() {
        const container = document.getElementById('matches-timeline');
        const fechaDisplay = document.getElementById('current-date-display');
        const nav = document.querySelector('.date-navigator');

        // Determinar si mostramos un solo día o una lista filtrada (rango, favoritos, etc)
        const esModoFiltro = this.filtrosAvanzados.activo || this.currentFilter !== 'todos' || this.searchQuery;
        
        let partidos = esModoFiltro ? [...MUNDIAL_DATA.partidos] : MUNDIAL_DATA.partidos.filter(p => p.fecha === this.currentDate);

        // Aplicar Filtros
        if (this.searchQuery) {
            partidos = partidos.filter(p => 
                MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1)?.nombre.toLowerCase().includes(this.searchQuery) ||
                MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2)?.nombre.toLowerCase().includes(this.searchQuery) ||
                p.ciudad.toLowerCase().includes(this.searchQuery)
            );
        }

        if (this.currentFilter === 'favoritos') {
            partidos = partidos.filter(p => this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2));
        } else if (this.currentFilter === 'oficina' || this.currentFilter === 'casa') {
            partidos = partidos.filter(p => this.estaDisponible(p.fecha, p.hora) === this.currentFilter);
        }

        if (this.filtrosAvanzados.activo) {
            if (this.filtrosAvanzados.fechaDesde) partidos = partidos.filter(p => p.fecha >= this.filtrosAvanzados.fechaDesde);
            if (this.filtrosAvanzados.fechaHasta) partidos = partidos.filter(p => p.fecha <= this.filtrosAvanzados.fechaHasta);
            if (this.filtrosAvanzados.fases.length) partidos = partidos.filter(p => this.filtrosAvanzados.fases.includes(p.fase));
            if (this.filtrosAvanzados.canales.length) partidos = partidos.filter(p => p.canales.some(c => this.filtrosAvanzados.canales.includes(c)));
            if (this.filtrosAvanzados.disponibilidad.length) partidos = partidos.filter(p => this.filtrosAvanzados.disponibilidad.includes(this.estaDisponible(p.fecha, p.hora)));
        }

        // UI Feedback
        if (esModoFiltro) {
            fechaDisplay.textContent = "Partidos Filtrados";
            nav.style.opacity = "0.5";
        } else {
            fechaDisplay.textContent = this.currentDate;
            nav.style.opacity = "1";
        }

        // Renderizar
        if (partidos.length === 0) {
            container.innerHTML = '<div class="no-results">No se encontraron partidos con estos filtros</div>';
            return;
        }

        // Agrupar por fecha para mostrar ordenado
        const grupos = partidos.reduce((acc, p) => {
            acc[p.fecha] = acc[p.fecha] || [];
            acc[p.fecha].push(p);
            return acc;
        }, {});

        container.innerHTML = Object.keys(grupos).sort().map(fecha => `
            <div class="date-group">
                <div class="date-header">${fecha}</div>
                ${grupos[fecha].map(p => this.createMatchHTML(p)).join('')}
            </div>
        `).join('');
    }

    createMatchHTML(p) {
        const e1 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1);
        const e2 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2);
        const disp = this.estaDisponible(p.fecha, p.hora);
        const dispIcons = { oficina: '💼', casa: '🏠', sueño: '🌙' };

        return `
            <div class="match-card ${this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2) ? 'favorito' : ''}">
                <div class="match-time">${p.hora} <span class="disp-icon">${dispIcons[disp]}</span></div>
                <div class="match-teams">
                    <div class="team"><span>${e1.bandera}</span> ${e1.nombre}</div>
                    <div class="team"><span>${e2.bandera}</span> ${e2.nombre}</div>
                </div>
                <div class="match-info">
                    <div class="match-location">${p.ciudad}</div>
                    <div class="match-channels">${p.canales.map(c => `<span class="tag tag-${c}">${c}</span>`).join('')}</div>
                </div>
            </div>
        `;
    }

    renderAll() {
        this.renderCalendar();
        this.renderTeams();
    }

    renderTeams() {
        const container = document.getElementById('teams-selector');
        container.innerHTML = MUNDIAL_DATA.equipos.map(e => `
            <div class="team-chip ${this.favoritos.includes(e.id) ? 'active' : ''}" onclick="app.toggleFavorito('${e.id}')">
                ${e.bandera} ${e.nombre}
            </div>
        `).join('');
    }

    toggleFavorito(id) {
        if (this.favoritos.includes(id)) {
            this.favoritos = this.favoritos.filter(f => f !== id);
        } else {
            this.favoritos.push(id);
        }
        localStorage.setItem('mundial_favoritos', JSON.stringify(this.favoritos));
        this.renderAll();
    }

    renderAnalisis() {
        const container = document.getElementById('analisis-container');
        container.innerHTML = '<p style="padding: 20px;">Análisis actualizado basado en tus favoritos...</p>';
        // Aquí podrías añadir la lógica de la tabla de canales que tenías
    }
}

const app = new MundialApp();
