// Datos OFICIALES del Mundial 2026 - Calendario FIFA
// Horarios en hora Colombia (UTC-5) - igual a hora del Este de EE.UU.
// Torneo: 11 de junio al 19 de julio de 2026
// Formato: 12 grupos de 4 equipos (48 selecciones)

const MUNDIAL_DATA = {
    equipos: [
        // GRUPO A
        { id: 'mex', nombre: 'México', bandera: '🇲🇽', grupo: 'A', ranking: 15 },
        { id: 'rsa', nombre: 'Sudáfrica', bandera: '🇿🇦', grupo: 'A', ranking: 70 },
        { id: 'kor', nombre: 'Corea del Sur', bandera: '🇰🇷', grupo: 'A', ranking: 26 },
        { id: 'cze', nombre: 'República Checa', bandera: '🇨🇿', grupo: 'A', ranking: 46 },

        // GRUPO B
        { id: 'can', nombre: 'Canadá', bandera: '🇨🇦', grupo: 'B', ranking: 34 },
        { id: 'bih', nombre: 'Bosnia y Herzegovina', bandera: '🇧🇦', grupo: 'B', ranking: 65 },
        { id: 'qat', nombre: 'Catar', bandera: '🇶🇦', grupo: 'B', ranking: 78 },
        { id: 'sui', nombre: 'Suiza', bandera: '🇨🇭', grupo: 'B', ranking: 19 },

        // GRUPO C
        { id: 'bra', nombre: 'Brasil', bandera: '🇧🇷', grupo: 'C', ranking: 5 },
        { id: 'mar', nombre: 'Marruecos', bandera: '🇲🇦', grupo: 'C', ranking: 18 },
        { id: 'hai', nombre: 'Haití', bandera: '🇭🇹', grupo: 'C', ranking: 85 },
        { id: 'sco', nombre: 'Escocia', bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', grupo: 'C', ranking: 43 },

        // GRUPO D
        { id: 'usa', nombre: 'Estados Unidos', bandera: '🇺🇸', grupo: 'D', ranking: 17 },
        { id: 'par', nombre: 'Paraguay', bandera: '🇵🇾', grupo: 'D', ranking: 49 },
        { id: 'aus', nombre: 'Australia', bandera: '🇦🇺', grupo: 'D', ranking: 24 },
        { id: 'tur', nombre: 'Turquía', bandera: '🇹🇷', grupo: 'D', ranking: 45 },

        // GRUPO E
        { id: 'ger', nombre: 'Alemania', bandera: '🇩🇪', grupo: 'E', ranking: 10 },
        { id: 'cuw', nombre: 'Curazao', bandera: '🇨🇼', grupo: 'E', ranking: 95 },
        { id: 'civ', nombre: 'Costa de Marfil', bandera: '🇨🇮', grupo: 'E', ranking: 63 },
        { id: 'ecu', nombre: 'Ecuador', bandera: '🇪🇨', grupo: 'E', ranking: 32 },

        // GRUPO F
        { id: 'ned', nombre: 'Países Bajos', bandera: '🇳🇱', grupo: 'F', ranking: 7 },
        { id: 'jpn', nombre: 'Japón', bandera: '🇯🇵', grupo: 'F', ranking: 16 },
        { id: 'swe', nombre: 'Suecia', bandera: '🇸🇪', grupo: 'F', ranking: 31 },
        { id: 'tun', nombre: 'Túnez', bandera: '🇹🇳', grupo: 'F', ranking: 36 },

        // GRUPO G
        { id: 'bel', nombre: 'Bélgica', bandera: '🇧🇪', grupo: 'G', ranking: 8 },
        { id: 'egy', nombre: 'Egipto', bandera: '🇪🇬', grupo: 'G', ranking: 39 },
        { id: 'irn', nombre: 'Irán', bandera: '🇮🇷', grupo: 'G', ranking: 25 },
        { id: 'nzl', nombre: 'Nueva Zelanda', bandera: '🇳🇿', grupo: 'G', ranking: 88 },

        // GRUPO H
        { id: 'esp', nombre: 'España', bandera: '🇪🇸', grupo: 'H', ranking: 3 },
        { id: 'cpv', nombre: 'Cabo Verde', bandera: '🇨🇻', grupo: 'H', ranking: 72 },
        { id: 'ksa', nombre: 'Arabia Saudita', bandera: '🇸🇦', grupo: 'H', ranking: 72 },
        { id: 'uru', nombre: 'Uruguay', bandera: '🇺🇾', grupo: 'H', ranking: 12 },

        // GRUPO I
        { id: 'fra', nombre: 'Francia', bandera: '🇫🇷', grupo: 'I', ranking: 2 },
        { id: 'sen', nombre: 'Senegal', bandera: '🇸🇳', grupo: 'I', ranking: 21 },
        { id: 'irq', nombre: 'Irak', bandera: '🇮🇶', grupo: 'I', ranking: 68 },
        { id: 'nor', nombre: 'Noruega', bandera: '🇳🇴', grupo: 'I', ranking: 47 },

        // GRUPO J
        { id: 'arg', nombre: 'Argentina', bandera: '🇦🇷', grupo: 'J', ranking: 1 },
        { id: 'alg', nombre: 'Argelia', bandera: '🇩🇿', grupo: 'J', ranking: 38 },
        { id: 'aut', nombre: 'Austria', bandera: '🇦🇹', grupo: 'J', ranking: 28 },
        { id: 'jor', nombre: 'Jordania', bandera: '🇯🇴', grupo: 'J', ranking: 98 },

        // GRUPO K
        { id: 'por', nombre: 'Portugal', bandera: '🇵🇹', grupo: 'K', ranking: 6 },
        { id: 'cod', nombre: 'RD Congo', bandera: '🇨🇩', grupo: 'K', ranking: 58 },
        { id: 'uzb', nombre: 'Uzbekistán', bandera: '🇺🇿', grupo: 'K', ranking: 68 },
        { id: 'col', nombre: 'Colombia', bandera: '🇨🇴', grupo: 'K', ranking: 14 },

        // GRUPO L
        { id: 'eng', nombre: 'Inglaterra', bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', grupo: 'L', ranking: 4 },
        { id: 'cro', nombre: 'Croacia', bandera: '🇭🇷', grupo: 'L', ranking: 11 },
        { id: 'gha', nombre: 'Ghana', bandera: '🇬🇭', grupo: 'L', ranking: 75 },
        { id: 'pan', nombre: 'Panamá', bandera: '🇵🇦', grupo: 'L', ranking: 66 }
    ],

    // Canales tentativos basados en derechos históricos
    // caracol = Caracol (abierta), winsports = Win Sports+/Online, directv = DirecTV
    partidos: [
        // ========== JORNADA 1 - 11 AL 17 DE JUNIO ==========
        // 11 JUNIO
        { id: 1, fecha: '2026-06-11', hora: '15:00', equipo1: 'mex', equipo2: 'rsa', fase: 'grupos', grupo: 'A', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México', canales: ['caracol', 'winsports', 'directv'] },
        { id: 2, fecha: '2026-06-11', hora: '22:00', equipo1: 'kor', equipo2: 'cze', fase: 'grupos', grupo: 'A', estadio: 'Estadio Akron', ciudad: 'Guadalajara', canales: ['winsports', 'directv'] },

        // 12 JUNIO
        { id: 3, fecha: '2026-06-12', hora: '15:00', equipo1: 'can', equipo2: 'bih', fase: 'grupos', grupo: 'B', estadio: 'BMO Field', ciudad: 'Toronto', canales: ['winsports', 'directv'] },
        { id: 4, fecha: '2026-06-12', hora: '21:00', equipo1: 'usa', equipo2: 'par', fase: 'grupos', grupo: 'D', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', canales: ['caracol', 'winsports', 'directv'] },

        // 13 JUNIO
        { id: 5, fecha: '2026-06-13', hora: '18:00', equipo1: 'qat', equipo2: 'sui', fase: 'grupos', grupo: 'B', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco', canales: ['winsports', 'directv'] },
        { id: 6, fecha: '2026-06-13', hora: '18:00', equipo1: 'bra', equipo2: 'mar', fase: 'grupos', grupo: 'C', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['caracol', 'winsports', 'directv'] },
        { id: 7, fecha: '2026-06-13', hora: '21:00', equipo1: 'hai', equipo2: 'sco', fase: 'grupos', grupo: 'C', estadio: 'Gillette Stadium', ciudad: 'Boston', canales: ['winsports', 'directv'] },
        { id: 8, fecha: '2026-06-14', hora: '00:00', equipo1: 'aus', equipo2: 'tur', fase: 'grupos', grupo: 'D', estadio: 'BC Place', ciudad: 'Vancouver', canales: ['winsports', 'directv'] },

        // 14 JUNIO
        { id: 9, fecha: '2026-06-14', hora: '13:00', equipo1: 'ger', equipo2: 'cuw', fase: 'grupos', grupo: 'E', estadio: 'NRG Stadium', ciudad: 'Houston', canales: ['winsports', 'directv'] },
        { id: 10, fecha: '2026-06-14', hora: '16:00', equipo1: 'ned', equipo2: 'jpn', fase: 'grupos', grupo: 'F', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['winsports', 'directv'] },
        { id: 11, fecha: '2026-06-14', hora: '19:00', equipo1: 'civ', equipo2: 'ecu', fase: 'grupos', grupo: 'E', estadio: 'Lincoln Financial Field', ciudad: 'Filadelfia', canales: ['winsports', 'directv'] },
        { id: 12, fecha: '2026-06-14', hora: '22:00', equipo1: 'swe', equipo2: 'tun', fase: 'grupos', grupo: 'F', estadio: 'Estadio BBVA', ciudad: 'Monterrey', canales: ['winsports', 'directv'] },

        // 15 JUNIO
        { id: 13, fecha: '2026-06-15', hora: '12:00', equipo1: 'esp', equipo2: 'cpv', fase: 'grupos', grupo: 'H', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['caracol', 'winsports', 'directv'] },
        { id: 14, fecha: '2026-06-15', hora: '15:00', equipo1: 'bel', equipo2: 'egy', fase: 'grupos', grupo: 'G', estadio: 'Lumen Field', ciudad: 'Seattle', canales: ['winsports', 'directv'] },
        { id: 15, fecha: '2026-06-15', hora: '18:00', equipo1: 'ksa', equipo2: 'uru', fase: 'grupos', grupo: 'H', estadio: 'Hard Rock Stadium', ciudad: 'Miami', canales: ['caracol', 'winsports', 'directv'] },
        { id: 16, fecha: '2026-06-15', hora: '21:00', equipo1: 'irn', equipo2: 'nzl', fase: 'grupos', grupo: 'G', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', canales: ['winsports', 'directv'] },

        // 16 JUNIO
        { id: 17, fecha: '2026-06-16', hora: '15:00', equipo1: 'fra', equipo2: 'sen', fase: 'grupos', grupo: 'I', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['caracol', 'winsports', 'directv'] },
        { id: 18, fecha: '2026-06-16', hora: '18:00', equipo1: 'irq', equipo2: 'nor', fase: 'grupos', grupo: 'I', estadio: 'Gillette Stadium', ciudad: 'Boston', canales: ['winsports', 'directv'] },
        { id: 19, fecha: '2026-06-16', hora: '21:00', equipo1: 'arg', equipo2: 'alg', fase: 'grupos', grupo: 'J', estadio: 'Arrowhead Stadium', ciudad: 'Kansas City', canales: ['caracol', 'winsports', 'directv'] },
        { id: 20, fecha: '2026-06-17', hora: '00:00', equipo1: 'aut', equipo2: 'jor', fase: 'grupos', grupo: 'J', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco', canales: ['winsports', 'directv'] },

        // 17 JUNIO
        { id: 21, fecha: '2026-06-17', hora: '13:00', equipo1: 'por', equipo2: 'cod', fase: 'grupos', grupo: 'K', estadio: 'NRG Stadium', ciudad: 'Houston', canales: ['caracol', 'winsports', 'directv'] },
        { id: 22, fecha: '2026-06-17', hora: '16:00', equipo1: 'eng', equipo2: 'cro', fase: 'grupos', grupo: 'L', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['caracol', 'winsports', 'directv'] },
        { id: 23, fecha: '2026-06-17', hora: '19:00', equipo1: 'gha', equipo2: 'pan', fase: 'grupos', grupo: 'L', estadio: 'BMO Field', ciudad: 'Toronto', canales: ['winsports', 'directv'] },
        { id: 24, fecha: '2026-06-17', hora: '22:00', equipo1: 'uzb', equipo2: 'col', fase: 'grupos', grupo: 'K', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México', canales: ['caracol', 'winsports', 'directv'] },

        // ========== JORNADA 2 - 18 AL 23 DE JUNIO ==========
        // 18 JUNIO
        { id: 25, fecha: '2026-06-18', hora: '12:00', equipo1: 'cze', equipo2: 'rsa', fase: 'grupos', grupo: 'A', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['winsports', 'directv'] },
        { id: 26, fecha: '2026-06-18', hora: '15:00', equipo1: 'sui', equipo2: 'bih', fase: 'grupos', grupo: 'B', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', canales: ['winsports', 'directv'] },
        { id: 27, fecha: '2026-06-18', hora: '18:00', equipo1: 'can', equipo2: 'qat', fase: 'grupos', grupo: 'B', estadio: 'BC Place', ciudad: 'Vancouver', canales: ['winsports', 'directv'] },
        { id: 28, fecha: '2026-06-18', hora: '21:00', equipo1: 'mex', equipo2: 'kor', fase: 'grupos', grupo: 'A', estadio: 'Estadio Akron', ciudad: 'Guadalajara', canales: ['caracol', 'winsports', 'directv'] },

        // 19 JUNIO
        { id: 29, fecha: '2026-06-19', hora: '15:00', equipo1: 'usa', equipo2: 'aus', fase: 'grupos', grupo: 'D', estadio: 'Lumen Field', ciudad: 'Seattle', canales: ['caracol', 'winsports', 'directv'] },
        { id: 30, fecha: '2026-06-19', hora: '18:00', equipo1: 'sco', equipo2: 'mar', fase: 'grupos', grupo: 'C', estadio: 'Gillette Stadium', ciudad: 'Boston', canales: ['winsports', 'directv'] },
        { id: 31, fecha: '2026-06-19', hora: '21:00', equipo1: 'bra', equipo2: 'hai', fase: 'grupos', grupo: 'C', estadio: 'Lincoln Financial Field', ciudad: 'Filadelfia', canales: ['caracol', 'winsports', 'directv'] },
        { id: 32, fecha: '2026-06-20', hora: '00:00', equipo1: 'tur', equipo2: 'par', fase: 'grupos', grupo: 'D', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco', canales: ['winsports', 'directv'] },

        // 20 JUNIO
        { id: 33, fecha: '2026-06-20', hora: '13:00', equipo1: 'ned', equipo2: 'swe', fase: 'grupos', grupo: 'F', estadio: 'NRG Stadium', ciudad: 'Houston', canales: ['winsports', 'directv'] },
        { id: 34, fecha: '2026-06-20', hora: '16:00', equipo1: 'ger', equipo2: 'civ', fase: 'grupos', grupo: 'E', estadio: 'BMO Field', ciudad: 'Toronto', canales: ['caracol', 'winsports', 'directv'] },
        { id: 35, fecha: '2026-06-20', hora: '20:00', equipo1: 'ecu', equipo2: 'cuw', fase: 'grupos', grupo: 'E', estadio: 'Arrowhead Stadium', ciudad: 'Kansas City', canales: ['winsports', 'directv'] },
        { id: 36, fecha: '2026-06-21', hora: '00:00', equipo1: 'tun', equipo2: 'jpn', fase: 'grupos', grupo: 'F', estadio: 'Estadio BBVA', ciudad: 'Monterrey', canales: ['winsports', 'directv'] },

        // 21 JUNIO
        { id: 37, fecha: '2026-06-21', hora: '12:00', equipo1: 'esp', equipo2: 'ksa', fase: 'grupos', grupo: 'H', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['caracol', 'winsports', 'directv'] },
        { id: 38, fecha: '2026-06-21', hora: '15:00', equipo1: 'bel', equipo2: 'irn', fase: 'grupos', grupo: 'G', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', canales: ['winsports', 'directv'] },
        { id: 39, fecha: '2026-06-21', hora: '18:00', equipo1: 'uru', equipo2: 'cpv', fase: 'grupos', grupo: 'H', estadio: 'Hard Rock Stadium', ciudad: 'Miami', canales: ['caracol', 'winsports', 'directv'] },
        { id: 40, fecha: '2026-06-21', hora: '21:00', equipo1: 'nzl', equipo2: 'egy', fase: 'grupos', grupo: 'G', estadio: 'BC Place', ciudad: 'Vancouver', canales: ['winsports', 'directv'] },

        // 22 JUNIO
        { id: 41, fecha: '2026-06-22', hora: '13:00', equipo1: 'arg', equipo2: 'aut', fase: 'grupos', grupo: 'J', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['caracol', 'winsports', 'directv'] },
        { id: 42, fecha: '2026-06-22', hora: '17:00', equipo1: 'fra', equipo2: 'irq', fase: 'grupos', grupo: 'I', estadio: 'Lincoln Financial Field', ciudad: 'Filadelfia', canales: ['caracol', 'winsports', 'directv'] },
        { id: 43, fecha: '2026-06-22', hora: '21:00', equipo1: 'nor', equipo2: 'sen', fase: 'grupos', grupo: 'I', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['winsports', 'directv'] },
        { id: 44, fecha: '2026-06-23', hora: '00:00', equipo1: 'jor', equipo2: 'alg', fase: 'grupos', grupo: 'J', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco', canales: ['winsports', 'directv'] },

        // 23 JUNIO
        { id: 45, fecha: '2026-06-23', hora: '13:00', equipo1: 'por', equipo2: 'uzb', fase: 'grupos', grupo: 'K', estadio: 'NRG Stadium', ciudad: 'Houston', canales: ['caracol', 'winsports', 'directv'] },
        { id: 46, fecha: '2026-06-23', hora: '16:00', equipo1: 'eng', equipo2: 'gha', fase: 'grupos', grupo: 'L', estadio: 'Gillette Stadium', ciudad: 'Boston', canales: ['caracol', 'winsports', 'directv'] },
        { id: 47, fecha: '2026-06-23', hora: '19:00', equipo1: 'pan', equipo2: 'cro', fase: 'grupos', grupo: 'L', estadio: 'BMO Field', ciudad: 'Toronto', canales: ['winsports', 'directv'] },
        { id: 48, fecha: '2026-06-23', hora: '22:00', equipo1: 'col', equipo2: 'cod', fase: 'grupos', grupo: 'K', estadio: 'Estadio Akron', ciudad: 'Guadalajara', canales: ['caracol', 'winsports', 'directv'] },

        // ========== JORNADA 3 - 24 AL 27 DE JUNIO ==========
        // 24 JUNIO
        { id: 49, fecha: '2026-06-24', hora: '15:00', equipo1: 'sui', equipo2: 'can', fase: 'grupos', grupo: 'B', estadio: 'BC Place', ciudad: 'Vancouver', canales: ['winsports', 'directv'] },
        { id: 50, fecha: '2026-06-24', hora: '15:00', equipo1: 'bih', equipo2: 'qat', fase: 'grupos', grupo: 'B', estadio: 'Lumen Field', ciudad: 'Seattle', canales: ['winsports', 'directv'] },
        { id: 51, fecha: '2026-06-24', hora: '18:00', equipo1: 'sco', equipo2: 'bra', fase: 'grupos', grupo: 'C', estadio: 'Hard Rock Stadium', ciudad: 'Miami', canales: ['caracol', 'winsports', 'directv'] },
        { id: 52, fecha: '2026-06-24', hora: '18:00', equipo1: 'mar', equipo2: 'hai', fase: 'grupos', grupo: 'C', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['winsports', 'directv'] },
        { id: 53, fecha: '2026-06-24', hora: '21:00', equipo1: 'cze', equipo2: 'mex', fase: 'grupos', grupo: 'A', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México', canales: ['caracol', 'winsports', 'directv'] },
        { id: 54, fecha: '2026-06-24', hora: '21:00', equipo1: 'rsa', equipo2: 'kor', fase: 'grupos', grupo: 'A', estadio: 'Estadio BBVA', ciudad: 'Monterrey', canales: ['winsports', 'directv'] },

        // 25 JUNIO
        { id: 55, fecha: '2026-06-25', hora: '16:00', equipo1: 'ecu', equipo2: 'ger', fase: 'grupos', grupo: 'E', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['winsports', 'directv'] },
        { id: 56, fecha: '2026-06-25', hora: '16:00', equipo1: 'cuw', equipo2: 'civ', fase: 'grupos', grupo: 'E', estadio: 'Lincoln Financial Field', ciudad: 'Filadelfia', canales: ['winsports', 'directv'] },
        { id: 57, fecha: '2026-06-25', hora: '19:00', equipo1: 'tun', equipo2: 'ned', fase: 'grupos', grupo: 'F', estadio: 'Arrowhead Stadium', ciudad: 'Kansas City', canales: ['winsports', 'directv'] },
        { id: 58, fecha: '2026-06-25', hora: '19:00', equipo1: 'jpn', equipo2: 'swe', fase: 'grupos', grupo: 'F', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['winsports', 'directv'] },
        { id: 59, fecha: '2026-06-25', hora: '22:00', equipo1: 'tur', equipo2: 'usa', fase: 'grupos', grupo: 'D', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', canales: ['winsports', 'directv'] },
        { id: 60, fecha: '2026-06-25', hora: '22:00', equipo1: 'par', equipo2: 'aus', fase: 'grupos', grupo: 'D', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco', canales: ['winsports', 'directv'] },

        // 26 JUNIO
        { id: 61, fecha: '2026-06-26', hora: '15:00', equipo1: 'nor', equipo2: 'fra', fase: 'grupos', grupo: 'I', estadio: 'Gillette Stadium', ciudad: 'Boston', canales: ['winsports', 'directv'] },
        { id: 62, fecha: '2026-06-26', hora: '15:00', equipo1: 'sen', equipo2: 'irq', fase: 'grupos', grupo: 'I', estadio: 'BMO Field', ciudad: 'Toronto', canales: ['winsports', 'directv'] },
        { id: 63, fecha: '2026-06-26', hora: '20:00', equipo1: 'uru', equipo2: 'esp', fase: 'grupos', grupo: 'H', estadio: 'Estadio Akron', ciudad: 'Guadalajara', canales: ['caracol', 'winsports', 'directv'] },
        { id: 64, fecha: '2026-06-26', hora: '20:00', equipo1: 'cpv', equipo2: 'ksa', fase: 'grupos', grupo: 'H', estadio: 'NRG Stadium', ciudad: 'Houston', canales: ['winsports', 'directv'] },
        { id: 65, fecha: '2026-06-27', hora: '00:00', equipo1: 'nzl', equipo2: 'bel', fase: 'grupos', grupo: 'G', estadio: 'BC Place', ciudad: 'Vancouver', canales: ['winsports', 'directv'] },
        { id: 66, fecha: '2026-06-27', hora: '00:00', equipo1: 'egy', equipo2: 'irn', fase: 'grupos', grupo: 'G', estadio: 'Lumen Field', ciudad: 'Seattle', canales: ['winsports', 'directv'] },

        // 27 JUNIO
        { id: 67, fecha: '2026-06-27', hora: '17:00', equipo1: 'pan', equipo2: 'eng', fase: 'grupos', grupo: 'L', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['caracol', 'winsports', 'directv'] },
        { id: 68, fecha: '2026-06-27', hora: '17:00', equipo1: 'cro', equipo2: 'gha', fase: 'grupos', grupo: 'L', estadio: 'Lincoln Financial Field', ciudad: 'Filadelfia', canales: ['winsports', 'directv'] },
        { id: 69, fecha: '2026-06-27', hora: '19:30', equipo1: 'col', equipo2: 'por', fase: 'grupos', grupo: 'K', estadio: 'Hard Rock Stadium', ciudad: 'Miami', canales: ['caracol', 'winsports', 'directv'] },
        { id: 70, fecha: '2026-06-27', hora: '19:30', equipo1: 'cod', equipo2: 'uzb', fase: 'grupos', grupo: 'K', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['winsports', 'directv'] },
        { id: 71, fecha: '2026-06-27', hora: '22:00', equipo1: 'jor', equipo2: 'arg', fase: 'grupos', grupo: 'J', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['caracol', 'winsports', 'directv'] },
        { id: 72, fecha: '2026-06-27', hora: '22:00', equipo1: 'alg', equipo2: 'aut', fase: 'grupos', grupo: 'J', estadio: 'Arrowhead Stadium', ciudad: 'Kansas City', canales: ['winsports', 'directv'] },

        // ========== FASES ELIMINATORIAS ==========
        // DIECISEISAVOS (32 equipos - 28 junio al 3 julio)
        // Estos son ejemplos de cruces, se definirán según posiciones en grupos

        // OCTAVOS DE FINAL (4-7 julio)
        { id: 201, fecha: '2026-07-04', hora: '13:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 1', estadio: 'NRG Stadium', ciudad: 'Houston', canales: ['caracol', 'winsports', 'directv'] },
        { id: 202, fecha: '2026-07-04', hora: '17:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 2', estadio: 'Lincoln Financial Field', ciudad: 'Filadelfia', canales: ['caracol', 'winsports', 'directv'] },
        { id: 203, fecha: '2026-07-05', hora: '16:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 3', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['caracol', 'winsports', 'directv'] },
        { id: 204, fecha: '2026-07-05', hora: '20:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 4', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México', canales: ['caracol', 'winsports', 'directv'] },
        { id: 205, fecha: '2026-07-06', hora: '15:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 5', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['caracol', 'winsports', 'directv'] },
        { id: 206, fecha: '2026-07-06', hora: '20:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 6', estadio: 'Lumen Field', ciudad: 'Seattle', canales: ['caracol', 'winsports', 'directv'] },
        { id: 207, fecha: '2026-07-07', hora: '12:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 7', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['caracol', 'winsports', 'directv'] },
        { id: 208, fecha: '2026-07-07', hora: '16:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'octavos', titulo: 'Octavos 8', estadio: 'BC Place', ciudad: 'Vancouver', canales: ['caracol', 'winsports', 'directv'] },

        // CUARTOS DE FINAL (9-11 julio)
        { id: 301, fecha: '2026-07-09', hora: '16:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'cuartos', titulo: 'Cuartos 1', estadio: 'Gillette Stadium', ciudad: 'Boston', canales: ['caracol', 'winsports', 'directv'] },
        { id: 302, fecha: '2026-07-10', hora: '15:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'cuartos', titulo: 'Cuartos 2', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', canales: ['caracol', 'winsports', 'directv'] },
        { id: 303, fecha: '2026-07-11', hora: '17:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'cuartos', titulo: 'Cuartos 3', estadio: 'Hard Rock Stadium', ciudad: 'Miami', canales: ['caracol', 'winsports', 'directv'] },
        { id: 304, fecha: '2026-07-11', hora: '21:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'cuartos', titulo: 'Cuartos 4', estadio: 'Arrowhead Stadium', ciudad: 'Kansas City', canales: ['caracol', 'winsports', 'directv'] },

        // SEMIFINALES (14-15 julio)
        { id: 401, fecha: '2026-07-14', hora: '15:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'semis', titulo: 'Semifinal 1', estadio: 'AT&T Stadium', ciudad: 'Dallas', canales: ['caracol', 'winsports', 'directv'] },
        { id: 402, fecha: '2026-07-15', hora: '15:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'semis', titulo: 'Semifinal 2', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta', canales: ['caracol', 'winsports', 'directv'] },

        // TERCER LUGAR (18 julio)
        { id: 501, fecha: '2026-07-18', hora: '17:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'finales', titulo: 'Tercer Lugar', estadio: 'Hard Rock Stadium', ciudad: 'Miami', canales: ['caracol', 'winsports', 'directv'] },

        // FINAL (19 julio)
        { id: 601, fecha: '2026-07-19', hora: '15:00', equipo1: 'tbd', equipo2: 'tbd', fase: 'finales', titulo: 'FINAL', estadio: 'MetLife Stadium', ciudad: 'Nueva York', canales: ['caracol', 'winsports', 'directv'] }
    ]
};

// Días de semana
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_SEMANA_COMPLETO = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Nombres de meses
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
