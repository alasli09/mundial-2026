class MundialApp {
    constructor() {
        this.favoritos = JSON.parse(localStorage.getItem('mundial_favoritos')) || ['col', 'arg', 'bra'];
        this.currentDate = '2026-06-11';
        this.currentFilter = 'todos';
        this.searchQuery = '';
        this.filtrosAvanzados = {
            fases: [],
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
        // Tabs
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn, .main-content').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });

        // Buscador
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
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
        
        const filtrosActivos = this.filtrosAvanzados.activo || this.currentFilter !== 'todos' || this.searchQuery;
        
        let partidos = filtrosActivos ? [...MUNDIAL_DATA.partidos] : MUNDIAL_DATA.partidos.filter(p => p.fecha === this.currentDate);

        // Aplicar Lógica de Filtros
        if (this.currentFilter === 'favoritos') partidos = partidos.filter(p => this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2));
        if (this.currentFilter === 'oficina') partidos = partidos.filter(p => this.estaDisponible(p.hora) === 'oficina');
        if (this.currentFilter === 'casa') partidos = partidos.filter(p => this.estaDisponible(p.hora) === 'casa');
        
        if (this.filtrosAvanzados.activo) {
            if (this.filtrosAvanzados.fechaDesde) partidos = partidos.filter(p => p.fecha >= this.filtrosAvanzados.fechaDesde);
            if (this.filtrosAvanzados.fechaHasta) partidos = partidos.filter(p => p.fecha <= this.filtrosAvanzados.fechaHasta);
            if (this.filtrosAvanzados.fases.length) partidos = partidos.filter(p => this.filtrosAvanzados.fases.includes(p.fase));
        }

        display.textContent = filtrosActivos ? "Partidos Filtrados" : this.currentDate;

        const grupos = partidos.reduce((acc, p) => {
            acc[p.fecha] = acc[p.fecha] || [];
            acc[p.fecha].push(p);
            return acc;
        }, {});

        container.innerHTML = Object.keys(grupos).sort().map(fecha => `
            <div class="date-group">
                <div class="date-header">${fecha}</div>
                ${grupos[fecha].map(p => this.matchHTML(p)).join('')}
            </div>
        `).join('') || '<p style="padding:20px">No hay partidos.</p>';
    }

    matchHTML(p) {
        const e1 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1) || {nombre: 'TBD', bandera: '🏳️'};
        const e2 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2) || {nombre: 'TBD', bandera: '🏳️'};
        const esFav = this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2);
        return `
            <div class="match-card ${esFav ? 'favorito' : ''}">
                <div class="match-time">${p.hora}</div>
                <div class="match-teams">
                    <div>${e1.bandera} ${e1.nombre}</div>
                    <div>${e2.bandera} ${e2.nombre}</div>
                </div>
                <div class="match-info">${p.canales.map(c => `<span class="tag tag-${c}">${c}</span>`).join('')}</div>
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

    renderAll() { this.renderCalendar(); this.renderTeams(); }
}
const app = new MundialApp();
