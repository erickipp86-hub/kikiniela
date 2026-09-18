import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, ListChecks, Shield, RefreshCw, 
  CheckCircle2, Lock, ChevronRight, User, AlertCircle 
} from 'lucide-react';

export default function QuinielaApp() {
  const [tabActiva, setTabActiva] = useState('partidos');
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  
  // Usuario actual simulado (puedes cambiarlo o hacerlo dinámico después)
  const [usuarioActual, setUsuarioActual] = useState('Erick');
  const [picks, setPicks] = useState({}); // { idPartido: 'Equipo Elegido' }
  const [misPicksGuardados, setMisPicksGuardados] = useState({});

  // URL de tu Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWS-DseQZSxhYSzs_as6_YQUO5XbI-C0st5hNDHUEnkg3A8Qeup0pvZUEkPu8rD78bZA/exec';

  // Cargar partidos desde Google Sheets
  const cargarPartidos = async () => {
    setLoading(true);
    setErrorConexion(false);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPartidos(data);
      } else {
        setErrorConexion(true);
      }
    } catch (error) {
      console.error("Error al conectar con Google Sheets:", error);
      setErrorConexion(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPartidos();
  }, []);

  const handleSeleccionPick = (partidoId, equipo) => {
    setPicks({
      ...picks,
      [partidoId]: equipo
    });
  };

  const guardarPicks = () => {
    setMisPicksGuardados({ ...misPicksGuardados, ...picks });
    alert("¡Pronósticos guardados con éxito para la jornada!");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 text-slate-100 font-sans shadow-2xl overflow-hidden border-x border-slate-800">
      
      {/* Header móvil */}
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 p-1.5 rounded-lg text-slate-950 font-black text-sm tracking-wider">
            NFL
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Kikiniela</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={cargarPartidos} 
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition"
            title="Actualizar datos"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-amber-400" : ""} />
          </button>
          <div className="flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
            <User size={12} className="text-amber-400" />
            <span>{usuarioActual}</span>
          </div>
        </div>
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
                  onClick={cargarPartidos}
                  className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold transition"
                >
                  Reintentar conexión
                </button>
              </div>
            ) : (
              partidos.map((partido) => {
                const isFinalizado = partido.Estatus === 'Finalizado';
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
                <div className="grid grid-cols-12 p-3 text-sm items-center bg-amber-500/10 font-medium">
                  <span className="col-span-2 text-center text-amber-400 font-bold">1</span>
                  <span className="col-span-7 text-white flex items-center space-x-1">
                    <span>Erick</span>
                  </span>
                  <span className="col-span-3 text-center font-bold text-amber-400">0</span>
                </div>
                {/* Más participantes de ejemplo */}
                <div className="grid grid-cols-12 p-3 text-sm items-center text-slate-300">
                  <span className="col-span-2 text-center text-slate-400">2</span>
                  <span className="col-span-7">Amigo 2</span>
                  <span className="col-span-3 text-center font-bold">0</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Navegación Inferior (Estilo App móvil) */}
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
