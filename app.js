// Mundial 2026 App - Versión Calendario

class MundialApp {
    constructor() {
        this.favoritos = JSON.parse(localStorage.getItem('mundial_favoritos')) || ['col', 'arg', 'bra'];
        this.destacados = JSON.parse(localStorage.getItem('mundial_destacados')) || [];
        this.horario = JSON.parse(localStorage.getItem('mundial_horario')) || {
            manana: { inicio: '08:00', fin: '12:00' },
            tarde: { inicio: '14:00', fin: '17:00' }
        };
        this.currentDate = '2026-06-11'; // Fecha inicial del mundial - string directo
        this.currentFilter = 'todos';
        this.equiposSort = 'fifa'; // 'fifa' o 'alpha'
        this.searchQuery = '';

        // Filtros avanzados combinables
        this.filtrosAvanzados = {
            fases: [], // ['grupos', 'octavos', 'cuartos', 'semis', 'finales']
            disponibilidad: [], // ['casa', 'oficina', 'sueño']
            canales: [], // ['caracol', 'winsports', 'directv']
            fechaDesde: null, // '2026-06-11'
            fechaHasta: null, // '2026-07-19'
            activo: false // Si está usando filtros avanzados o no
        };

        // Fechas únicas del mundial
        this.fechasMundial = [...new Set(MUNDIAL_DATA.partidos.map(p => p.fecha))].sort();

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCalendar();
        this.setupEquiposSelector();
        this.setupHorario();
        this.setupModal();
        this.setupFiltrosRapidos();
        this.renderCalendar();
        this.actualizarAnalisis();
    }

    guardar() {
        localStorage.setItem('mundial_favoritos', JSON.stringify(this.favoritos));
        localStorage.setItem('mundial_destacados', JSON.stringify(this.destacados));
        localStorage.setItem('mundial_horario', JSON.stringify(this.horario));
    }

    // ==================== NAVEGACIÓN ====================
    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.main-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tab).classList.add('active');

                if (tab === 'analisis') {
                    this.actualizarAnalisis();
                }
            });
        });
    }

    // ==================== CALENDARIO ====================
    setupCalendar() {
        // Navegación de fechas
        document.getElementById('prev-day').addEventListener('click', () => {
            const currentIndex = this.fechasMundial.findIndex(f => f === this.currentDate);
            if (currentIndex > 0) {
                this.currentDate = this.fechasMundial[currentIndex - 1];
                this.renderCalendar();
            }
        });

        document.getElementById('next-day').addEventListener('click', () => {
            const currentIndex = this.fechasMundial.findIndex(f => f === this.currentDate);
            if (currentIndex < this.fechasMundial.length - 1) {
                this.currentDate = this.fechasMundial[currentIndex + 1];
                this.renderCalendar();
            }
        });
    }

    // Parse date string YYYY-MM-DD sin problemas de zona horaria
    parseDateLocal(fechaStr) {
        const [year, month, day] = fechaStr.split('-').map(Number);
        return new Date(year, month - 1, day); // Mes es 0-indexed
    }

    // Función para aplicar todos los filtros combinados
    aplicarFiltrosCombinados(partidos) {
        // Filtro de búsqueda por texto
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            partidos = partidos.filter(p => {
                const eq1 = this.getEquipo(p.equipo1);
                const eq2 = this.getEquipo(p.equipo2);
                return eq1.nombre.toLowerCase().includes(query) ||
                       eq2.nombre.toLowerCase().includes(query) ||
                       (p.grupo && p.grupo.toLowerCase().includes(query)) ||
                       (p.ciudad && p.ciudad.toLowerCase().includes(query));
            });
        }

        // Filtro rápido actual (si no es 'todos' ni 'hoy')
        if (this.currentFilter === 'favoritos') {
            partidos = partidos.filter(p => this.esFavorito(p) || this.destacados.includes(p.id));
        } else if (this.currentFilter === 'casa') {
            partidos = partidos.filter(p => this.estaDisponible(p.fecha, p.hora) === 'casa');
        } else if (this.currentFilter === 'oficina') {
            partidos = partidos.filter(p => this.estaDisponible(p.fecha, p.hora) === 'oficina');
        } else if (this.currentFilter === 'sueño') {
            partidos = partidos.filter(p => p.hora === '00:00' && !this.esFavorito(p) && !this.destacados.includes(p.id));
        } else if (['caracol', 'winsports', 'directv'].includes(this.currentFilter)) {
            partidos = partidos.filter(p => p.canales.includes(this.currentFilter));
        }

        // Filtros avanzados combinables
        if (this.filtrosAvanzados.activo) {
            // Filtro por fases
            if (this.filtrosAvanzados.fases.length > 0) {
                partidos = partidos.filter(p => this.filtrosAvanzados.fases.includes(p.fase));
            }

            // Filtro por disponibilidad
            if (this.filtrosAvanzados.disponibilidad.length > 0) {
                partidos = partidos.filter(p => {
                    const disp = this.estaDisponible(p.fecha, p.hora);
                    // 'sueño' es un caso especial
                    if (this.filtrosAvanzados.disponibilidad.includes('sueño') && p.hora === '00:00') {
                        return true;
                    }
                    return this.filtrosAvanzados.disponibilidad.includes(disp);
                });
            }

            // Filtro por canales
            if (this.filtrosAvanzados.canales.length > 0) {
                partidos = partidos.filter(p => {
                    // El partido debe estar en AL MENOS UNO de los canales seleccionados (OR)
                    return this.filtrosAvanzados.canales.some(canal => p.canales.includes(canal));
                });
            }

            // Filtro por rango de fechas
            if (this.filtrosAvanzados.fechaDesde || this.filtrosAvanzados.fechaHasta) {
                partidos = partidos.filter(p => {
                    let incluir = true;
                    if (this.filtrosAvanzados.fechaDesde) {
                        incluir = incluir && p.fecha >= this.filtrosAvanzados.fechaDesde;
                    }
                    if (this.filtrosAvanzados.fechaHasta) {
                        incluir = incluir && p.fecha <= this.filtrosAvanzados.fechaHasta;
                    }
                    return incluir;
                });
            }
        }

        return partidos;
    }

    renderCalendar() {
        const fechaStr = this.currentDate;
        const fechaDisplay = document.getElementById('current-date-display');
        const matchCount = document.getElementById('match-count');
        const timeline = document.getElementById('matches-timeline');

        // Formatear fecha usando parse local para evitar problemas de zona horaria
        const fechaObj = this.parseDateLocal(fechaStr);
        const mes = MESES[fechaObj.getMonth()];
        const dia = fechaObj.getDate();
        const diaSemana = DIAS_SEMANA_COMPLETO[fechaObj.getDay()];
        fechaDisplay.textContent = `${diaSemana} ${dia} de ${mes} 2026`;

        // Obtener partidos base
        let partidos;

        // Si el filtro es "todos" o "hoy" Y no hay filtros avanzados activos, mostrar solo el día actual
        if ((this.currentFilter === 'todos' || this.currentFilter === 'hoy') &&
            !this.filtrosAvanzados.activo &&
            !this.searchQuery) {
            partidos = MUNDIAL_DATA.partidos.filter(p => p.fecha === fechaStr);
        } else {
            // Para otros filtros o cuando hay búsqueda/filtros avanzados, buscar en TODOS los partidos
            partidos = [...MUNDIAL_DATA.partidos];
        }

        // Aplicar filtros combinados
        partidos = this.aplicarFiltrosCombinados(partidos);

        matchCount.textContent = `${partidos.length} partido${partidos.length !== 1 ? 's' : ''}`;

        // Renderizar partidos
        timeline.innerHTML = '';

        if (partidos.length === 0) {
            timeline.innerHTML = `
                <div class="no-matches">
                    <p style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        No hay partidos ${this.getFiltroTexto()}
                    </p>
                </div>
            `;
            return;
        }

        // Si estamos filtrando (no es vista por día), agrupar por fecha
        if (this.currentFilter !== 'todos' && this.currentFilter !== 'hoy') {
            // Agrupar partidos por fecha
            const partidosPorFecha = {};
            partidos.forEach(p => {
                if (!partidosPorFecha[p.fecha]) partidosPorFecha[p.fecha] = [];
                partidosPorFecha[p.fecha].push(p);
            });

            // Ordenar fechas
            Object.keys(partidosPorFecha).sort().forEach(fecha => {
                // Agregar header de fecha
                const fechaHeader = document.createElement('div');
                fechaHeader.className = 'fecha-header';
                const fechaObj = this.parseDateLocal(fecha);
                const mes = MESES[fechaObj.getMonth()];
                const dia = fechaObj.getDate();
                const diaSemana = DIAS_SEMANA_COMPLETO[fechaObj.getDay()];
                fechaHeader.innerHTML = `<h3>${diaSemana} ${dia} de ${mes}</h3>`;
                timeline.appendChild(fechaHeader);

                // Agregar partidos de esa fecha
                partidosPorFecha[fecha].forEach(partido => {
                    const row = this.crearMatchRow(partido);
                    timeline.appendChild(row);
                });
            });
        } else {
            // Vista normal del día
            partidos.forEach(partido => {
                const row = this.crearMatchRow(partido);
                timeline.appendChild(row);
            });
        }
    }

    getFiltroTexto() {
        const textos = {
            'todos': 'este día',
            'hoy': 'este día',
            'favoritos': 'de tus favoritos',
            'casa': 'que puedas ver en casa',
            'oficina': 'en horario de oficina',
            'sueño': 'a horas de dormir (00:00)',
            'caracol': 'en Caracol',
            'winsports': 'en Win+',
            'directv': 'en DirecTV'
        };
        return textos[this.currentFilter] || '';
    }

    crearMatchRow(partido) {
        const disponible = this.estaDisponible(partido.fecha, partido.hora);
        const esFav = this.esFavorito(partido);
        const esDestacado = this.destacados.includes(partido.id);
        const equipo1 = this.getEquipo(partido.equipo1);
        const equipo2 = this.getEquipo(partido.equipo2);

        const div = document.createElement('div');
        div.className = `match-row ${esFav || esDestacado ? 'favorito' : ''}`;

        div.innerHTML = `
            <div class="match-time">
                <div class="hora">${partido.hora}</div>
                <div class="estado">${partido.fase === 'grupos' ? `Grupo ${partido.grupo}` : partido.fase}</div>
            </div>
            <div class="match-teams">
                <div class="team-row">
                    <span class="team-flag">${equipo1.bandera}</span>
                    <span class="team-name ${this.favoritos.includes(partido.equipo1) ? 'favorito' : ''}">${equipo1.nombre}</span>
                </div>
                <div class="team-row">
                    <span class="team-flag">${equipo2.bandera}</span>
                    <span class="team-name ${this.favoritos.includes(partido.equipo2) ? 'favorito' : ''}">${equipo2.nombre}</span>
                </div>
            </div>
            <div class="match-meta">
                <div class="disponibilidad-badge ${disponible}">
                    ${disponible === 'casa' ? '🏠 Casa' : '💼 Oficina'}
                </div>
                <div class="canales-row">
                    ${partido.canales.map(c => `<span class="canal-mini ${c}">${c === 'caracol' ? 'CAR' : c === 'winsports' ? 'WIN' : 'DTV'}</span>`).join('')}
                </div>
            </div>
        `;

        return div;
    }

    setupFiltrosRapidos() {
        // Filtros chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;

                // Toggle
                if (this.currentFilter === filter) {
                    this.currentFilter = 'todos';
                    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                    document.querySelector('.filter-chip[data-filter="todos"]').classList.add('active');
                } else {
                    this.currentFilter = filter;
                    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                }

                this.renderCalendar();
                this.actualizarFiltrosActivosUI();
            });
        });

        // Buscador
        const searchInput = document.getElementById('search-input');
        const btnClearSearch = document.getElementById('btn-clear-search');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                btnClearSearch.style.display = this.searchQuery ? 'flex' : 'none';
                this.renderCalendar();
                this.actualizarFiltrosActivosUI();
            });
        }

        if (btnClearSearch) {
            btnClearSearch.addEventListener('click', () => {
                this.searchQuery = '';
                searchInput.value = '';
                btnClearSearch.style.display = 'none';
                this.renderCalendar();
                this.actualizarFiltrosActivosUI();
            });
        }

        // Limpiar todos los filtros
        const btnClearAll = document.getElementById('btn-clear-all');
        if (btnClearAll) {
            btnClearAll.addEventListener('click', () => {
                this.resetearFiltros();
            });
        }

        // Botón filtros avanzados
        document.getElementById('btn-filtros-avanzados').addEventListener('click', () => {
            this.abrirModalFiltros();
        });
    }

    // ==================== MODAL Y FILTROS AVANZADOS ====================
    setupModal() {
        const modal = document.getElementById('filtros-modal');

        document.getElementById('modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        document.getElementById('limpiar-filtros').addEventListener('click', () => {
            this.limpiarFiltrosModal();
        });

        document.getElementById('aplicar-filtros').addEventListener('click', () => {
            this.aplicarFiltrosAvanzados();
            modal.classList.remove('active');
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Actualizar contador en tiempo real al seleccionar
        document.querySelectorAll('#filtros-modal input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => {
                this.actualizarContadorModal();
            });
        });
    }

    abrirModalFiltros() {
        const modal = document.getElementById('filtros-modal');

        // Cargar estado actual de filtros
        this.cargarEstadoFiltrosModal();

        // Actualizar contador
        this.actualizarContadorModal();

        modal.classList.add('active');
    }

    cargarEstadoFiltrosModal() {
        // Cargar fases
        document.querySelectorAll('input[data-grupo="fases"]').forEach(cb => {
            cb.checked = this.filtrosAvanzados.fases.includes(cb.value);
        });

        // Cargar disponibilidad
        document.querySelectorAll('input[data-grupo="disp"]').forEach(cb => {
            cb.checked = this.filtrosAvanzados.disponibilidad.includes(cb.value);
        });

        // Cargar canales
        document.querySelectorAll('input[data-grupo="canales"]').forEach(cb => {
            cb.checked = this.filtrosAvanzados.canales.includes(cb.value);
        });
    }

    limpiarFiltrosModal() {
        document.querySelectorAll('#filtros-modal input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        this.actualizarContadorModal();
    }

    actualizarContadorModal() {
        // Calcular cuántos partidos coincidirían con los filtros seleccionados
        let fases = [];
        let disponibilidad = [];
        let canales = [];

        document.querySelectorAll('input[data-grupo="fases"]:checked').forEach(cb => fases.push(cb.value));
        document.querySelectorAll('input[data-grupo="disp"]:checked').forEach(cb => disponibilidad.push(cb.value));
        document.querySelectorAll('input[data-grupo="canales"]:checked').forEach(cb => canales.push(cb.value));

        // Simular filtros
        const tempFiltros = { ...this.filtrosAvanzados, fases, disponibilidad, canales, activo: true };
        const partidosFiltrados = this.simularFiltrosAvanzados(tempFiltros);

        const contadorBtn = document.getElementById('contador-filtros');
        if (contadorBtn) {
            contadorBtn.textContent = `Ver ${partidosFiltrados.length}`;
        }
    }

    simularFiltrosAvanzados(filtros) {
        let partidos = [...MUNDIAL_DATA.partidos];

        if (filtros.fases.length > 0) {
            partidos = partidos.filter(p => filtros.fases.includes(p.fase));
        }

        if (filtros.disponibilidad.length > 0) {
            partidos = partidos.filter(p => {
                if (filtros.disponibilidad.includes('sueño') && p.hora === '00:00') return true;
                const disp = this.estaDisponible(p.fecha, p.hora);
                return filtros.disponibilidad.includes(disp);
            });
        }

        if (filtros.canales.length > 0) {
            partidos = partidos.filter(p => filtros.canales.some(c => p.canales.includes(c)));
        }

        return partidos;
    }

    aplicarFiltrosAvanzados() {
        // Leer valores de los checkboxes
        this.filtrosAvanzados.fases = [];
        this.filtrosAvanzados.disponibilidad = [];
        this.filtrosAvanzados.canales = [];

        document.querySelectorAll('input[data-grupo="fases"]:checked').forEach(cb => {
            this.filtrosAvanzados.fases.push(cb.value);
        });

        document.querySelectorAll('input[data-grupo="disp"]:checked').forEach(cb => {
            this.filtrosAvanzados.disponibilidad.push(cb.value);
        });

        document.querySelectorAll('input[data-grupo="canales"]:checked').forEach(cb => {
            this.filtrosAvanzados.canales.push(cb.value);
        });

        // Activar filtros avanzados si hay alguno seleccionado
        this.filtrosAvanzados.activo =
            this.filtrosAvanzados.fases.length > 0 ||
            this.filtrosAvanzados.disponibilidad.length > 0 ||
            this.filtrosAvanzados.canales.length > 0;

        this.renderCalendar();
        this.actualizarFiltrosActivosUI();
    }

    resetearFiltros() {
        this.currentFilter = 'todos';
        this.searchQuery = '';
        this.filtrosAvanzados = {
            fases: [],
            disponibilidad: [],
            canales: [],
            activo: false
        };

        // Resetear UI
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        document.querySelector('.filter-chip[data-filter="todos"]').classList.add('active');

        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        const btnClearSearch = document.getElementById('btn-clear-search');
        if (btnClearSearch) btnClearSearch.style.display = 'none';

        this.renderCalendar();
        this.actualizarFiltrosActivosUI();
    }

    actualizarFiltrosActivosUI() {
        const container = document.getElementById('active-filters');
        const list = document.getElementById('active-filters-list');

        if (!container || !list) return;

        const filtros = [];

        // Filtro rápido
        if (this.currentFilter !== 'todos') {
            const nombres = {
                'hoy': '📅 Hoy',
                'favoritos': '⭐ Mis Favoritos',
                'casa': '🏠 En Casa',
                'oficina': '💼 En Oficina',
                'sueño': '🌙 Horas de Sueño',
                'caracol': '📺 Caracol',
                'winsports': '📺 Win+',
                'directv': '📺 DirecTV'
            };
            filtros.push({ tipo: 'rapido', valor: this.currentFilter, label: nombres[this.currentFilter] || this.currentFilter });
        }

        // Búsqueda
        if (this.searchQuery) {
            filtros.push({ tipo: 'search', valor: this.searchQuery, label: `🔍 "${this.searchQuery}"` });
        }

        // Filtros avanzados
        if (this.filtrosAvanzados.activo) {
            this.filtrosAvanzados.fases.forEach(f => {
                const nombres = { 'grupos': '🏆 Fase de Grupos', 'octavos': '🏆 Octavos', 'cuartos': '🏆 Cuartos', 'semis': '🏆 Semifinales', 'finales': '🏆 Finales' };
                filtros.push({ tipo: 'avanzado', categoria: 'fase', valor: f, label: nombres[f] || f });
            });

            this.filtrosAvanzados.disponibilidad.forEach(d => {
                const nombres = { 'casa': '🏠 En Casa', 'oficina': '💼 En Oficina', 'sueño': '🌙 Horas de Sueño' };
                filtros.push({ tipo: 'avanzado', categoria: 'disp', valor: d, label: nombres[d] || d });
            });

            this.filtrosAvanzados.canales.forEach(c => {
                const nombres = { 'caracol': '📺 Caracol', 'winsports': '📺 Win+', 'directv': '📺 DirecTV' };
                filtros.push({ tipo: 'avanzado', categoria: 'canal', valor: c, label: nombres[c] || c });
            });
        }

        // Mostrar u ocultar
        if (filtros.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';

        // Renderizar filtros
        list.innerHTML = filtros.map(f => `
            <span class="active-filter-chip" data-tipo="${f.tipo}" data-valor="${f.valor}" data-cat="${f.categoria || ''}">
                ${f.label}
                <button class="remove-filter">✕</button>
            </span>
        `).join('');

        // Agregar eventos de eliminar
        list.querySelectorAll('.active-filter-chip').forEach(chip => {
            chip.querySelector('.remove-filter').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removerFiltroActivo(chip.dataset.tipo, chip.dataset.valor, chip.dataset.cat);
            });
        });
    }

    removerFiltroActivo(tipo, valor, categoria) {
        if (tipo === 'rapido') {
            this.currentFilter = 'todos';
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            document.querySelector('.filter-chip[data-filter="todos"]').classList.add('active');
        } else if (tipo === 'search') {
            this.searchQuery = '';
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            const btnClearSearch = document.getElementById('btn-clear-search');
            if (btnClearSearch) btnClearSearch.style.display = 'none';
        } else if (tipo === 'avanzado') {
            if (categoria === 'fase') {
                this.filtrosAvanzados.fases = this.filtrosAvanzados.fases.filter(f => f !== valor);
            } else if (categoria === 'disp') {
                this.filtrosAvanzados.disponibilidad = this.filtrosAvanzados.disponibilidad.filter(d => d !== valor);
            } else if (categoria === 'canal') {
                this.filtrosAvanzados.canales = this.filtrosAvanzados.canales.filter(c => c !== valor);
            }

            // Verificar si quedan filtros avanzados
            this.filtrosAvanzados.activo =
                this.filtrosAvanzados.fases.length > 0 ||
                this.filtrosAvanzados.disponibilidad.length > 0 ||
                this.filtrosAvanzados.canales.length > 0;
        }

        this.renderCalendar();
        this.actualizarFiltrosActivosUI();
    }

    // ==================== EQUIPOS SELECTOR ====================
    setupEquiposSelector() {
        // Search
        document.getElementById('equipo-search').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderEquiposLista();
        });

        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.equiposSort = btn.dataset.sort;
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderEquiposLista();
            });
        });

        // Horario inputs
        const inicioM = document.getElementById('hora-inicio-m');
        const finM = document.getElementById('hora-fin-m');
        const inicioT = document.getElementById('hora-inicio-t');
        const finT = document.getElementById('hora-fin-t');

        inicioM.value = this.horario.manana.inicio;
        finM.value = this.horario.manana.fin;
        inicioT.value = this.horario.tarde.inicio;
        finT.value = this.horario.tarde.fin;

        const actualizarHorario = () => {
            this.horario.manana.inicio = inicioM.value;
            this.horario.manana.fin = finM.value;
            this.horario.tarde.inicio = inicioT.value;
            this.horario.tarde.fin = finT.value;
            this.guardar();
        };

        [inicioM, finM, inicioT, finT].forEach(input => {
            input.addEventListener('change', actualizarHorario);
        });

        this.renderEquiposLista();
        this.renderFavoritosTags();
    }

    getEquiposOrdenados() {
        let equipos = [...MUNDIAL_DATA.equipos];

        // Filtrar por búsqueda
        if (this.searchQuery) {
            equipos = equipos.filter(e =>
                e.nombre.toLowerCase().includes(this.searchQuery) ||
                e.bandera.includes(this.searchQuery)
            );
        }

        // Ordenar
        if (this.equiposSort === 'fifa') {
            equipos.sort((a, b) => a.ranking - b.ranking);
        } else {
            equipos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }

        return equipos;
    }

    renderEquiposLista() {
        const container = document.getElementById('equipos-lista');
        container.innerHTML = '';

        const equipos = this.getEquiposOrdenados();

        equipos.forEach(equipo => {
            const item = document.createElement('div');
            item.className = `equipo-item ${this.favoritos.includes(equipo.id) ? 'selected' : ''}`;
            item.innerHTML = `
                <input type="checkbox" ${this.favoritos.includes(equipo.id) ? 'checked' : ''}>
                <span class="equipo-flag">${equipo.bandera}</span>
                <div class="equipo-info">
                    <div class="equipo-nombre">${equipo.nombre}</div>
                    <div class="equipo-ranking">Ranking FIFA: #${equipo.ranking}</div>
                </div>
            `;

            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = item.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                }

                const isSelected = item.querySelector('input').checked;
                item.classList.toggle('selected', isSelected);

                if (isSelected) {
                    if (!this.favoritos.includes(equipo.id)) {
                        this.favoritos.push(equipo.id);
                    }
                } else {
                    this.favoritos = this.favoritos.filter(id => id !== equipo.id);
                }

                this.guardar();
                this.renderFavoritosTags();
                this.renderCalendar();
            });

            container.appendChild(item);
        });
    }

    renderFavoritosTags() {
        const container = document.getElementById('favoritos-tags');
        container.innerHTML = '';

        if (this.favoritos.length === 0) {
            container.innerHTML = '<span style="color: var(--text-secondary); font-size: 0.9rem;">No has seleccionado equipos favoritos</span>';
            return;
        }

        this.favoritos.forEach(id => {
            const equipo = this.getEquipo(id);
            const tag = document.createElement('div');
            tag.className = 'favorito-tag';
            tag.innerHTML = `
                <span>${equipo.bandera} ${equipo.nombre}</span>
                <span class="remove" data-id="${id}">×</span>
            `;
            container.appendChild(tag);
        });

        // Eventos de remove
        container.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.favoritos = this.favoritos.filter(fid => fid !== id);
                this.guardar();
                this.renderEquiposLista();
                this.renderFavoritosTags();
                this.renderCalendar();
            });
        });
    }

    setupHorario() {
        // Ya está en setupEquiposSelector
    }

    // ==================== UTILIDADES ====================
    estaDisponible(fecha, hora) {
        const fechaObj = new Date(fecha + 'T' + hora);
        const diaSemana = fechaObj.getDay();
        const horaStr = hora;

        // Fin de semana: siempre disponible
        if (diaSemana === 0 || diaSemana === 6) {
            return 'casa';
        }

        // Lunes a viernes: verificar si está en horario laboral
        const enManana = horaStr >= this.horario.manana.inicio && horaStr < this.horario.manana.fin;
        const enTarde = horaStr >= this.horario.tarde.inicio && horaStr < this.horario.tarde.fin;

        if (enManana || enTarde) {
            return 'oficina';
        }
        return 'casa';
    }

    esFavorito(partido) {
        return this.favoritos.includes(partido.equipo1) || this.favoritos.includes(partido.equipo2);
    }

    getEquipo(id) {
        return MUNDIAL_DATA.equipos.find(e => e.id === id) || { nombre: id, bandera: '🏳️', ranking: 999 };
    }

    // ==================== ANÁLISIS ====================
    actualizarAnalisis() {
        // Obtener partidos únicos de favoritos (sin duplicados)
        const partidosFavoritosSet = new Set();
        const partidosFavoritos = [];

        MUNDIAL_DATA.partidos.forEach(p => {
            if (this.esFavorito(p) && !partidosFavoritosSet.has(p.id)) {
                partidosFavoritosSet.add(p.id);
                partidosFavoritos.push(p);
            }
        });

        // Agregar destacados
        this.destacados.forEach(id => {
            if (!partidosFavoritosSet.has(id)) {
                const partido = MUNDIAL_DATA.partidos.find(p => p.id === id);
                if (partido) {
                    partidosFavoritos.push(partido);
                }
            }
        });

        const totalPrioritarios = partidosFavoritos.length;
        document.getElementById('total-prioritarios').textContent = totalPrioritarios;

        // Calcular stats
        const stats = {
            caracol: { total: 0, casa: 0 },
            winsports: { total: 0, casa: 0 },
            directv: { total: 0, casa: 0 }
        };

        partidosFavoritos.forEach(partido => {
            const disponible = this.estaDisponible(partido.fecha, partido.hora);

            partido.canales.forEach(canal => {
                if (stats[canal]) {
                    stats[canal].total++;
                    if (disponible === 'casa') {
                        stats[canal].casa++;
                    }
                }
            });
        });

        // Actualizar UI
        ['caracol', 'winsports', 'directv'].forEach(canal => {
            document.getElementById(`${canal}-total`).textContent = stats[canal].total;
            document.getElementById(`${canal}-casa`).textContent = stats[canal].casa;

            const porcentaje = totalPrioritarios > 0 ? Math.round((stats[canal].casa / totalPrioritarios) * 100) : 0;
            document.getElementById(`${canal}-porcentaje`).textContent = `${porcentaje}%`;
        });

        // Generar recomendación
        this.generarRecomendacion(stats, totalPrioritarios);

        // Generar tabla desglose
        this.generarTablaDesglose(partidosFavoritos);
    }

    generarRecomendacion(stats, totalPrioritarios) {
        const container = document.getElementById('recomendacion-texto');

        if (totalPrioritarios === 0) {
            container.innerHTML = '<p>Selecciona tus equipos favoritos para ver la recomendación personalizada.</p>';
            return;
        }

        const caracolCasa = stats.caracol.casa;
        const winsportsCasa = stats.winsports.casa;
        const directvCasa = stats.directv.casa;
        const maxCasa = Math.max(caracolCasa, winsportsCasa, directvCasa);

        let html = '';

        if (maxCasa === 0) {
            html = '<p>⚠️ Ningún partido prioritario coincide con tu horario en casa. Revisa tu selección.</p>';
        } else {
            html += `<p>De tus <strong>${totalPrioritarios}</strong> partidos prioritarios:</p>`;
            html += `<ul style="margin: 12px 0 12px 20px; line-height: 1.8;">`;
            html += `<li><strong style="color: var(--caracol)">Caracol:</strong> ${caracolCasa} en casa</li>`;
            html += `<li><strong style="color: var(--winsports)">Win+:</strong> ${winsportsCasa} en casa (~$40k)</li>`;
            html += `<li><strong style="color: var(--directv)">DirecTV:</strong> ${directvCasa} en casa (~$55k)</li>`;
            html += `</ul>`;

            if (caracolCasa === totalPrioritarios) {
                html += `<p style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 12px;">🎉 ¡Excelente! Todos tus partidos están en Caracol (GRATIS). No necesitas contratar nada.</p>`;
            } else if (caracolCasa >= totalPrioritarios * 0.7) {
                html += `<p style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 12px;">✅ Caracol cubre el ${Math.round(caracolCasa/totalPrioritarios*100)}% de tus partidos. Los que faltan son en horario de oficina, podrías seguirlos desde allí.</p>`;
            } else if (winsportsCasa === maxCasa) {
                const extra = winsportsCasa - Math.max(directvCasa, caracolCasa);
                html += `<p style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 12px;">💡 Win+ te da ${extra} partido${extra > 1 ? 's' : ''} más en casa. Valora si vale ~$40k/mes para ti.</p>`;
            } else if (directvCasa === maxCasa) {
                const extra = directvCasa - Math.max(winsportsCasa, caracolCasa);
                html += `<p style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 12px;">💡 DirecTV te da ${extra} partido${extra > 1 ? 's' : ''} más en casa. Considera el prepago (~$55k).</p>`;
            }
        }

        container.innerHTML = html;
    }

    generarTablaDesglose(partidosPrioritarios) {
        const tbody = document.getElementById('tabla-desglose');
        let html = '';

        // Partidos totales
        const countsTotal = { caracol: 0, winsports: 0, directv: 0 };
        partidosPrioritarios.forEach(p => {
            p.canales.forEach(c => { if (countsTotal[c] !== undefined) countsTotal[c]++; });
        });
        html += `<tr><td style="text-align: left;"><strong>Partidos prioritarios</strong></td><td>${countsTotal.caracol}</td><td>${countsTotal.winsports}</td><td>${countsTotal.directv}</td></tr>`;

        // En casa
        const enCasa = partidosPrioritarios.filter(p => this.estaDisponible(p.fecha, p.hora) === 'casa');
        const countsCasa = { caracol: 0, winsports: 0, directv: 0 };
        enCasa.forEach(p => {
            p.canales.forEach(c => { if (countsCasa[c] !== undefined) countsCasa[c]++; });
        });
        html += `<tr><td style="text-align: left;"><strong>🏠 En Casa</strong></td><td class="col-caracol" style="font-weight: 700; color: var(--caracol)">${countsCasa.caracol}</td><td style="font-weight: 700; color: var(--winsports)">${countsCasa.winsports}</td><td style="font-weight: 700; color: var(--directv)">${countsCasa.directv}</td></tr>`;

        // En oficina
        const enOficina = partidosPrioritarios.filter(p => this.estaDisponible(p.fecha, p.hora) === 'oficina');
        const countsOficina = { caracol: 0, winsports: 0, directv: 0 };
        enOficina.forEach(p => {
            p.canales.forEach(c => { if (countsOficina[c] !== undefined) countsOficina[c]++; });
        });
        html += `<tr><td style="text-align: left;"><strong>💼 En Oficina</strong></td><td>${countsOficina.caracol}</td><td>${countsOficina.winsports}</td><td>${countsOficina.directv}</td></tr>`;

        tbody.innerHTML = html;
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MundialApp();
});
