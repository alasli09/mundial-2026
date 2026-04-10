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

        // Obtener partidos según el filtro
        let partidos;

        // Si el filtro es "todos" o "hoy", mostrar solo el día actual
        if (this.currentFilter === 'todos' || this.currentFilter === 'hoy') {
            partidos = MUNDIAL_DATA.partidos.filter(p => p.fecha === fechaStr);
        } else {
            // Para otros filtros, buscar en TODOS los partidos del mundial
            partidos = [...MUNDIAL_DATA.partidos];

            if (this.currentFilter === 'favoritos') {
                partidos = partidos.filter(p => this.esFavorito(p) || this.destacados.includes(p.id));
            } else if (this.currentFilter === 'casa') {
                partidos = partidos.filter(p => this.estaDisponible(p.fecha, p.hora) === 'casa');
            } else if (this.currentFilter === 'oficina') {
                partidos = partidos.filter(p => this.estaDisponible(p.fecha, p.hora) === 'oficina');
            } else if (this.currentFilter === 'sueño') {
                // Partidos a medianoche (00:00) que probablemente estés dormido
                partidos = partidos.filter(p => p.hora === '00:00' && !this.esFavorito(p) && !this.destacados.includes(p.id));
            } else if (['caracol', 'winsports', 'directv'].includes(this.currentFilter)) {
                partidos = partidos.filter(p => p.canales.includes(this.currentFilter));
            }
        }

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
            });
        });

        // Botón filtros avanzados
        document.getElementById('btn-filtros-avanzados').addEventListener('click', () => {
            document.getElementById('filtros-modal').classList.add('active');
        });
    }

    // ==================== MODAL ====================
    setupModal() {
        const modal = document.getElementById('filtros-modal');

        document.getElementById('modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        document.getElementById('limpiar-filtros').addEventListener('click', () => {
            document.querySelectorAll('.filtro-options input').forEach(cb => cb.checked = false);
            document.querySelector('.filtro-options input[value="todos"]').checked = true;
        });

        document.getElementById('aplicar-filtros').addEventListener('click', () => {
            // Aquí se aplicarían filtros avanzados
            modal.classList.remove('active');
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.classList.remove('active');
        });
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
