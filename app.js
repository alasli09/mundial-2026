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
        // Tabs
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

        // Flechas de fecha
        document.getElementById('prev-date').onclick = () => this.changeDate(-1);
        document.getElementById('next-date').onclick = () => this.changeDate(1);

        // Lógica del Modal (Perfeccionada)
        const modal = document.getElementById('modal-filtros');
        document.getElementById('btn-filtros-avanzados').onclick = () => modal.classList.add('active');
        modal.querySelector('.close-modal').onclick = () => modal.classList.remove('active');

        document.getElementById('aplicar-filtros').onclick = () => {
            this.filtrosAvanzados.fechaDesde = document.getElementById('filtro-fecha-desde').value || null;
            this.filtrosAvanzados.fechaHasta = document.getElementById('filtro-fecha-hasta').value || null;
            this.filtrosAvanzados.fases = Array.from(modal.querySelectorAll('input[data-grupo="fases"]:checked')).map(i => i.value);
            this.filtrosAvanzados.disponibilidad = Array.from(modal.querySelectorAll('input[data-grupo="disponibilidad"]:checked')).map(i => i.value);
            this.filtrosAvanzados.canales = Array.from(modal.querySelectorAll('input[data-grupo="canales"]:checked')).map(i => i.value);
            
            this.filtrosAvanzados.activo = !!(this.filtrosAvanzados.fechaDesde || this.filtrosAvanzados.fechaHasta || this.filtrosAvanzados.fases.length || this.filtrosAvanzados.disponibilidad.length || this.filtrosAvanzados.canales.length);
            
            modal.classList.remove('active');
            this.renderCalendar();
        };

        document.getElementById('limpiar-filtros').onclick = () => {
            modal.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
            document.getElementById('filtro-fecha-desde').value = '2026-06-11';
            document.getElementById('filtro-fecha-hasta').value = '2026-07-19';
            this.filtrosAvanzados.activo = false;
            this.renderCalendar();
        };
    }

    changeDate(delta) {
        const index = this.fechasMundial.indexOf(this.currentDate);
        const newIndex = Math.max(0, Math.min(this.fechasMundial.length - 1, index + delta));
        this.currentDate = this.fechasMundial[newIndex];
        this.renderCalendar();
    }

    estaDisponible(fecha, hora) {
        const h = parseInt(hora.split(':')[0]);
        if (h >= 8 && h < 17) return 'oficina';
        if (h >= 17 || (h >= 6 && h < 8)) return 'casa';
        return 'sueño';
    }

    renderCalendar() {
        const container = document.getElementById('matches-timeline');
        const display = document.getElementById('current-date-display');
        const dayLabel = document.getElementById('current-day-label');
        
        // El modo lista se activa si hay filtros, búsqueda o rango de fechas
        const modoLista = this.filtrosAvanzados.activo || this.currentFilter !== 'todos' || this.searchQuery;
        
        let partidos = modoLista ? [...MUNDIAL_DATA.partidos] : MUNDIAL_DATA.partidos.filter(p => p.fecha === this.currentDate);

        // 1. Filtro de búsqueda
        if (this.searchQuery) {
            partidos = partidos.filter(p => {
                const e1 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1)?.nombre.toLowerCase() || "";
                const e2 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2)?.nombre.toLowerCase() || "";
                return e1.includes(this.searchQuery) || e2.includes(this.searchQuery) || p.ciudad.toLowerCase().includes(this.searchQuery);
            });
        }

        // 2. Filtros Rápidos (Favoritos, Oficina, Casa)
        if (this.currentFilter === 'favoritos') {
            partidos = partidos.filter(p => this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2));
        } else if (this.currentFilter === 'oficina' || this.currentFilter === 'casa') {
            partidos = partidos.filter(p => this.estaDisponible(p.fecha, p.hora) === this.currentFilter);
        }

        // 3. Filtros Avanzados (Rango de Fechas, Fases, Canales)
        if (this.filtrosAvanzados.activo) {
            if (this.filtrosAvanzados.fechaDesde) partidos = partidos.filter(p => p.fecha >= this.filtrosAvanzados.fechaDesde);
            if (this.filtrosAvanzados.fechaHasta) partidos = partidos.filter(p => p.fecha <= this.filtrosAvanzados.fechaHasta);
            if (this.filtrosAvanzados.fases.length) partidos = partidos.filter(p => this.filtrosAvanzados.fases.includes(p.fase));
            if (this.filtrosAvanzados.canales.length) partidos = partidos.filter(p => p.canales.some(c => this.filtrosAvanzados.canales.includes(c)));
            if (this.filtrosAvanzados.disponibilidad.length) partidos = partidos.filter(p => this.filtrosAvanzados.disponibilidad.includes(this.estaDisponible(p.fecha, p.hora)));
        }

        // UI Header
        if (modoLista) {
            display.textContent = "Resultados Filtrados";
            dayLabel.textContent = `${partidos.length} partidos encontrados`;
            document.querySelector('.date-navigator').style.background = "#f0f7ff";
        } else {
            display.textContent = this.currentDate;
            dayLabel.textContent = "Navegación por día";
            document.querySelector('.date-navigator').style.background = "transparent";
        }

        if (partidos.length === 0) {
            container.innerHTML = '<div style="padding:40px; text-align:center; color:#999;">No hay partidos para estos criterios.</div>';
            return;
        }

        // Agrupar por fecha
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
        const e1 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo1) || {nombre: 'TBD', bandera: '🏳️', ranking: '?'};
        const e2 = MUNDIAL_DATA.equipos.find(e => e.id === p.equipo2) || {nombre: 'TBD', bandera: '🏳️', ranking: '?'};
        const esFav = this.favoritos.includes(p.equipo1) || this.favoritos.includes(p.equipo2);
        const disp = this.estaDisponible(p.fecha, p.hora);
        const icons = { oficina: '💼', casa: '🏠', sueño: '🌙' };

        return `
            <div class="match-card ${esFav ? 'favorito' : ''}">
                <div class="match-time">${p.hora} <br> <span style="font-size:1.2rem">${icons[disp]}</span></div>
                <div class="match-teams">
                    <div class="team">
                        <span class="flag">${e1.bandera}</span> 
                        <span class="name">${e1.nombre}</span>
                        <span class="rank">#${e1.ranking}</span>
                    </div>
                    <div class="team">
                        <span class="flag">${e2.bandera}</span> 
                        <span class="name">${e2.nombre}</span>
                        <span class="rank">#${e2.ranking}</span>
                    </div>
                </div>
                <div class="match-info">
                    <div class="match-location">${p.estadio}<br><strong>${p.ciudad}</strong></div>
                    <div class="match-channels">
                        ${p.canales.map(c => `<span class="tag tag-${c}">${c}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderTeams() {
        const container = document.getElementById('teams-selector');
        if (!container) return;
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
        if (!container) return;
        container.innerHTML = `<div style="padding:20px; text-align:center;">Analizando cobertura para tus ${this.favoritos.length} selecciones favoritas...</div>`;
    }

    renderAll() { this.renderCalendar(); this.renderTeams(); }
}
const app = new MundialApp();
