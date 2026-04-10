class MundialApp {
    constructor() {
        this.favoritos = JSON.parse(localStorage.getItem('mundial_favoritos')) || ['col', 'arg', 'bra'];
        this.currentDate = '2026-06-11';
        this.currentFilter = 'todos';
        this.searchQuery = '';
        this.filtrosAvanzados = {
            fases: [],
            disponibilidad: [],
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
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            document.getElementById('btn-clear-search').style.display = this.searchQuery ? 'block' : 'none';
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

        // Navegación Fechas
        document.getElementById('prev-date').onclick = () => this.changeDate(-1);
        document.getElementById('next-date').onclick = () => this.changeDate(1);

        // Modal
        const modal = document.getElementById('modal-filtros');
        document.getElementById('btn-filtros-avanzados').onclick = () => modal.classList.add('active');
        modal.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
        
        document.getElementById('aplicar-filtros').onclick = () => {
            this.filtrosAvanzados.fechaDesde = document.getElementById('filtro-fecha-desde').value;
            this.filtrosAvanzados.fechaHasta = document.getElementById('filtro-fecha-hasta').value;
            this.filtrosAvanzados.fases = Array.from(modal.querySelectorAll('input[data-grupo="fases"]:checked')).map(i => i.value);
            this.filtrosAvanzados.disponibilidad = Array.from(modal.querySelectorAll('input[data-grupo="disponibilidad"]:checked')).map(i => i.value);
            this.filtrosAvanzados.activo = true;
            modal.classList.remove('active');
            this.renderCalendar();
        };

        document.getElementById('limpiar-filtros').onclick = () => {
            this.filtrosAvanzados.activo = false;
            modal.querySelectorAll('input').forEach(i => i.checked = false);
            this.renderCalendar();
        };
    }

    changeDate(delta) {
        const index = this.fechasMundial.indexOf(this.currentDate);
        const newIndex = Math.max(0, Math.min(this.fechasMundial.length - 1, index + delta));
        this.currentDate = this.fechasMundial[newIndex];
        this.renderCalendar();
    }

    estaDisponible(hora) {
        const h = parseInt(hora.split(':')[0]);
        return (h >= 8 && h < 17) ? 'oficina' : 'casa';
    }

    renderCalendar() {
        const container = document.getElementById('matches-timeline');
        const display = document.getElementById('current-date-display');
        
        // Detectar si debe ignorar el "día a día" para mostrar lista
        const modoLista = this.filtrosAvanzados.activo || this.currentFilter !== 'todos' || this.searchQuery;
        
        let partidos = modoLista ? [...MUNDIAL_DATA.partidos] : MUNDIAL_DATA.partidos.filter(p => p.fecha === this.currentDate);

        // Filtros de búsqueda
        if (this.searchQuery) {
            partidos = partidos.filter(p => {
                const e1 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1)?.nombre.toLowerCase() || "";
                const e2 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2)?.nombre.toLowerCase() || "";
                return e1.includes(this.searchQuery) || e2.includes(this.searchQuery) || p.ciudad.toLowerCase().includes(this.searchQuery);
            });
        }

        // Filtros rápidos
        if (this.currentFilter === 'favoritos') partidos = partidos.filter(p => this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2));
        if (this.currentFilter === 'oficina') partidos = partidos.filter(p => this.estaDisponible(p.hora) === 'oficina');
        if (this.currentFilter === 'casa') partidos = partidos.filter(p => this.estaDisponible(p.hora) === 'casa');
        
        // Filtros avanzados (Rango de fecha)
        if (this.filtrosAvanzados.activo) {
            if (this.filtrosAvanzados.fechaDesde) partidos = partidos.filter(p => p.fecha >= this.filtrosAvanzados.fechaDesde);
            if (this.filtrosAvanzados.fechaHasta) partidos = partidos.filter(p => p.fecha <= this.filtrosAvanzados.fechaHasta);
            if (this.filtrosAvanzados.fases.length) partidos = partidos.filter(p => this.filtrosAvanzados.fases.includes(p.fase));
            if (this.filtrosAvanzados.disponibilidad.length) partidos = partidos.filter(p => this.filtrosAvanzados.disponibilidad.includes(this.estaDisponible(p.hora)));
        }

        display.textContent = modoLista ? "Resultados Filtrados" : this.currentDate;

        const grupos = partidos.reduce((acc, p) => {
            acc[p.fecha] = acc[p.fecha] || [];
            acc[p.fecha].push(p);
            return acc;
        }, {});

        container.innerHTML = Object.keys(grupos).sort().map(fecha => `
            <div class="date-group">
                <div class="date-header">${fecha}</div>
                ${grupos[fecha].map(p => this.createMatchCard(p)).join('')}
            </div>
        `).join('') || '<div class="no-results">No se encontraron partidos.</div>';
    }

    createMatchCard(p) {
        const e1 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1) || {nombre: 'TBD', bandera: '🏳️'};
        const e2 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2) || {nombre: 'TBD', bandera: '🏳️'};
        const esFav = this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2);
        const disp = this.estaDisponible(p.hora);

        return `
            <div class="match-card ${esFav ? 'favorito' : ''}">
                <div class="match-time">${p.hora} <br> <small>${disp === 'oficina' ? '💼' : '🏠'}</small></div>
                <div class="match-teams">
                    <div class="team"><span>${e1.bandera}</span> ${e1.nombre}</div>
                    <div class="team"><span>${e2.bandera}</span> ${e2.nombre}</div>
                </div>
                <div class="match-info">
                    <div class="match-location">${p.estadio}<br>${p.ciudad}</div>
                    <div class="match-channels">${p.canales.map(c => `<span class="tag tag-${c}">${c}</span>`).join('')}</div>
                </div>
            </div>
        `;
    }

    renderTeams() {
        const container = document.getElementById('teams-selector');
        container.innerHTML = MUNDIAL_DATA.equipos.map(e => `
            <div class="team-chip ${this.favoritos.includes(e.id) ? 'active' : ''}" onclick="app.toggleFav('${e.id}')">
                ${e.bandera} ${e.nombre}
            </div>
        `).join('');
    }

    toggleFav(id) {
        this.favoritos = this.favoritos.includes(id) ? this.favoritos.filter(f => f !== id) : [...this.favoritos, id];
        localStorage.setItem('mundial_favoritos', JSON.stringify(this.favoritos));
        this.renderAll();
    }

    renderAnalisis() {
        const container = document.getElementById('analisis-container');
        container.innerHTML = `<div style="padding:20px; text-align:center">Aquí verás el resumen de canales para tus ${this.favoritos.length} favoritos.</div>`;
    }

    renderAll() { this.renderCalendar(); this.renderTeams(); }
}
const app = new MundialApp();
