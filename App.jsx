import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, ListChecks, Shield, RefreshCw, 
  CheckCircle2, Lock, ChevronRight, User, AlertCircle, Menu, X
} from 'lucide-react';

export default function QuinielaApp() {
  const [tabActiva, setTabActiva] = useState('partidos');
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  
  // Manejo de usuario y menú de configuración
  const [usuarioActual, setUsuarioActual] = useState(localStorage.getItem('quiniela_user') || '');
  const [tempUsuario, setTempUsuario] = useState('');
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  
  const [picks, setPicks] = useState({}); // { idPartido: 'Equipo Elegido' }
  const [misPicksGuardados, setMisPicksGuardados] = useState({});
  const [usersList, setUsersList] = useState([]);

  // URL de tu Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWS-DseQZSxhYSzs_as6_YQUO5XbI-C0st5hNDHUEnkg3A8Qeup0pvZUEkPu8rD78bZA/exec';

  // Cargar partidos y usuarios desde Google Sheets
  const cargarDatos = async () => {
    setLoading(true);
    setErrorConexion(false);
    try {
      // Cargar partidos
      const responsePartidos = await fetch(GOOGLE_SCRIPT_URL);
      const dataPartidos = await responsePartidos.json();
      if (Array.isArray(dataPartidos)) {
        setPartidos(dataPartidos);
      } else {
        setErrorConexion(true);
      }

      // Cargar usuarios para persistencia
      const responseUsers = await fetch(`${GOOGLE_SCRIPT_URL}?action=getUsers`);
      const dataUsers = await responseUsers.json();
      if (Array.isArray(dataUsers)) {
        setUsersList(dataUsers);
        const encontrado = dataUsers.find(u => u.Name === usuarioActual);
        if (encontrado && encontrado.Picks) {
          setMisPicksGuardados(encontrado.Picks);
          setPicks(encontrado.Picks);
        }
      }
    } catch (error) {
      console.error("Error al conectar con Google Sheets:", error);
      setErrorConexion(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!tempUsuario.trim()) return;
    const nombre = tempUsuario.trim();
    setUsuarioActual(nombre);
    localStorage.setItem('quiniela_user', nombre);
    
    const encontrado = usersList.find(u => u.Name === nombre);
    if (encontrado && encontrado.Picks) {
      setMisPicksGuardados(encontrado.Picks);
      setPicks(encontrado.Picks);
    } else {
      setPicks({});
      setMisPicksGuardados({});
    }
    setTempUsuario('');
  };

  const handleSeleccionPick = (partidoId, equipo) => {
    setPicks({
      ...picks,
      [partidoId]: equipo
    });
  };

  const guardarPicks = async () => {
    const nuevosPicks = { ...misPicksGuardados, ...picks };
    setMisPicksGuardados(nuevosPicks);
    
    // Guardar en Google Sheets para que persista y se detecte el usuario independiente
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: usuarioActual, locked: false, picks: nuevosPicks })
      });
      alert("¡Pronósticos guardados con éxito en Google Sheets!");
    } catch (err) {
      console.error("Error al guardar en sheets", err);
      alert("¡Pronósticos guardados localmente!");
    }
  };

  // Pantalla de Bienvenida Original con el botón "¡Que juegue!"
  if (!usuarioActual) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 text-slate-100 font-sans shadow-2xl overflow-hidden border-x border-slate-800 items-center justify-center p-4">
        <div className="bg-slate-800 border border-red-600/50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Kiki Niela NFL</h1>
          <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold">LA CASA DE LAS APUESTAS</p>
          
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <input 
              type="text" 
              placeholder="Tu nombre..." 
              value={tempUsuario}
              onChange={(e) => setTempUsuario(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 text-sm"
            />
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-red-600/30 text-sm"
            >
              ¡Que juegue!
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 text-slate-100 font-sans shadow-2xl overflow-hidden border-x border-slate-800 relative">
      
      {/* Header móvil con menú de 3 líneas */}
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between relative">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 p-1.5 rounded-lg text-slate-950 font-black text-sm tracking-wider">
            NFL
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Kikiniela</h1>
            <p className="text-xs text-slate-400">{usuarioActual}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={cargarDatos} 
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition"
            title="Actualizar datos"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-amber-400" : ""} />
          </button>
          
          {/* Botón de configuración con 3 líneas */}
          <button 
            onClick={() => setShowConfigMenu(!showConfigMenu)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition"
            title="Configuración"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Menú Desplegable de Configuración */}
        {showConfigMenu && (
          <div className="absolute right-4 top-14 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
            <button 
              onClick={() => {
                setUsuarioActual('');
                localStorage.removeItem('quiniela_user');
                setShowConfigMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-slate-700/50 transition font-medium flex items-center space-x-2"
            >
              <span>Cambiar de usuario</span>
            </button>
            <button 
              onClick={() => {
                cargarDatos();
                setShowConfigMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-700/50 transition font-medium flex items-center space-x-2"
            >
              <span>Sincronizar datos</span>
            </button>
          </div>
        )}
      </header>

      {/* Contenido principal según la pestaña */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 bg-slate-900">
        
        {/* TAB: PARTIDOS */}
        {tabActiva === 'partidos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Jornada Activa</h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                En vivo desde Sheets
              </span>
            </div>

            {loading && partidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <RefreshCw className="animate-spin text-amber-500" size={32} />
                <p className="text-sm text-slate-400">Cargando partidos de la NFL...</p>
              </div>
            ) : errorConexion ? (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-2">
                <AlertCircle className="mx-auto text-red-400" size={28} />
                <p className="text-sm font-medium text-red-200">No se pudieron cargar los datos de Google Sheets.</p>
                <button 
                  onClick={cargarDatos}
                  className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold transition"
                >
                  Reintentar conexión
                </button>
              </div>
            ) : (
              partidos.map((partido) => {
                const isFinalizado = partido.Estatus === 'Finalizado' || partido.Estatus === 'final';
                const seleccionActual = picks[partido.ID] || misPicksGuardados[partido.ID];

                return (
                  <div key={partido.ID} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-md space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-700/50 pb-2">
                      <span className="font-medium text-amber-400">Semana {partido.Semana}</span>
                      <span>{partido['Fecha / Hora']}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Local */}
                      <button 
                        onClick={() => !isFinalizado && handleSeleccionPick(partido.ID, partido.Local)}
                        disabled={isFinalizado}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition relative ${
                          seleccionActual === partido.Local 
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold' 
                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-xs text-slate-400 mb-1">Local</span>
                        <span className="text-sm text-center leading-tight">{partido.Local}</span>
                        {isFinalizado && partido['Ganador Oficial'] === partido.Local && (
                          <span className="absolute top-2 right-2 text-emerald-400 text-xs">✓ Ganó</span>
                        )}
                      </button>

                      {/* Visitante */}
                      <button 
                        onClick={() => !isFinalizado && handleSeleccionPick(partido.ID, partido.Visitante)}
                        disabled={isFinalizado}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition relative ${
                          seleccionActual === partido.Visitante 
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold' 
                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-xs text-slate-400 mb-1">Visitante</span>
                        <span className="text-sm text-center leading-tight">{partido.Visitante}</span>
                        {isFinalizado && partido['Ganador Oficial'] === partido.Visitante && (
                          <span className="absolute top-2 right-2 text-emerald-400 text-xs">✓ Ganó</span>
                        )}
                      </button>
                    </div>

                    {isFinalizado ? (
                      <div className="text-center text-xs bg-slate-900/80 py-1.5 rounded-lg text-slate-400 font-medium">
                        Marcador final: <span className="text-white font-bold">{partido['Marcador Local']} - {partido['Marcador Visitante']}</span> ({partido.Estatus})
                      </div>
                    ) : (
                      <div className="text-center text-xs text-amber-400/90 font-medium">
                        {seleccionActual ? `Tu pronóstico: ${seleccionActual}` : 'Selecciona tu ganador'}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {!loading && partidos.length > 0 && (
              <button 
                onClick={guardarPicks}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 mt-4"
              >
                <CheckCircle2 size={18} />
                <span>Guardar Pronósticos</span>
              </button>
            )}
          </div>
        )}

        {/* TAB: PRONÓSTICOS */}
        {tabActiva === 'pronosticos' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pronósticos del Grupo</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center space-y-2">
              <Lock className="mx-auto text-amber-400" size={28} />
              <p className="text-sm font-medium text-white">Se desvelan al iniciar cada juego</p>
              <p className="text-xs text-slate-400">Aquí podrás ver qué eligieron tus amigos una vez que cierren las quinielas de la semana.</p>
            </div>
          </div>
        )}

        {/* TAB: TABLA */}
        {tabActiva === 'tabla' && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tabla General</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-md">
              <div className="grid grid-cols-12 bg-slate-900/60 p-3 text-xs font-semibold text-slate-400 border-b border-slate-700">
                <span className="col-span-2 text-center">#</span>
                <span className="col-span-7">Participante</span>
                <span className="col-span-3 text-center">Pts</span>
              </div>
              <div className="divide-y divide-slate-700/50">
                {usersList.length > 0 ? (
                  usersList.map((u, idx) => (
                    <div key={idx} className={`grid grid-cols-12 p-3 text-sm items-center ${u.Name === usuarioActual ? 'bg-amber-500/10 font-medium' : 'text-slate-300'}`}>
                      <span className="col-span-2 text-center text-amber-400 font-bold">{idx + 1}</span>
                      <span className="col-span-7 text-white">{u.Name}</span>
                      <span className="col-span-3 text-center font-bold text-amber-400">{u.PuntajeTotal || 0}</span>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-12 p-3 text-sm items-center bg-amber-500/10 font-medium">
                    <span className="col-span-2 text-center text-amber-400 font-bold">1</span>
                    <span className="col-span-7 text-white">{usuarioActual}</span>
                    <span className="col-span-3 text-center font-bold text-amber-400">0</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Navegación Inferior (Estilo App móvil original) */}
      <nav className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950 border-t border-slate-800 px-6 py-2.5 flex justify-between items-center text-xs">
        <button 
          onClick={() => setTabActiva('partidos')}
          className={`flex flex-col items-center space-y-1 transition ${tabActiva === 'partidos' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Calendar size={20} />
          <span>Partidos</span>
        </button>
        <button 
          onClick={() => setTabActiva('pronosticos')}
          className={`flex flex-col items-center space-y-1 transition ${tabActiva === 'pronosticos' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <ListChecks size={20} />
          <span>Pronósticos</span>
        </button>
        <button 
          onClick={() => setTabActiva('tabla')}
          className={`flex flex-col items-center space-y-1 transition ${tabActiva === 'tabla' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Trophy size={20} />
          <span>Posiciones</span>
        </button>
      </nav>

    </div>
  );
}
