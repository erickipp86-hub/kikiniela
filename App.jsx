import React, { useState, useEffect } from 'react';

// URL de tu Apps Script (mantén la tuya actual)
const API_URL = "TU_URL_DE_APPS_SCRIPT_AQUI"; 

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('quiniela_user') || '');
  const [tempUser, setTempUser] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState({});
  const [activeTab, setActiveTab] = useState('partidos');
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  // Cargar usuarios y partidos
  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}?action=getUsers`);
      const data = await res.json();
      setUsersList(data);
      const found = data.find(u => u.Name === user);
      if (found) setPicks(found.Picks || {});
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error("Error al cargar partidos", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!tempUser.trim()) return;
    const userName = tempUser.trim();
    setUser(userName);
    localStorage.setItem('quiniela_user', userName);
    const found = usersList.find(u => u.Name === userName);
    setPicks(found ? found.Picks || {} : {});
    setTempUser('');
  };

  const handlePick = async (gameId, team) => {
    const updatedPicks = { ...picks, [gameId]: team };
    setPicks(updatedPicks);
    
    // Guardar automáticamente en Google Sheets
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user, locked: false, picks: updatedPicks })
      });
    } catch (err) {
      console.error("Error al guardar pronóstico", err);
    }
  };

  // Pantalla de Bienvenida (con el botón "¡Que juegue!")
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b132b] flex flex-col items-center justify-center p-4 text-white font-sans">
        <div className="bg-[#1c2541] border border-red-600/50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-2">Kiki Niela NFL</h1>
          <p className="text-amber-400 text-sm mb-6 tracking-widest uppercase">La Casa de las Apuestas</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Tu nombre..." 
              value={tempUser}
              onChange={(e) => setTempUser(e.target.value)}
              className="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
            />
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-red-600/30"
            >
              ¡Que juegue!
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b132b] text-white font-sans pb-10">
      {/* Header Superior */}
      <header className="flex justify-between items-center p-4 border-b border-slate-800 bg-[#1c2541]/50 backdrop-blur">
        <div>
          <h1 className="text-lg font-bold">Kiki Niela NFL</h1>
          <p className="text-xs text-amber-400">LA CASA DE LAS APUESTAS</p>
          <p className="text-sm font-semibold text-slate-300 mt-0.5">{user}</p>
        </div>

        {/* Menú de Configuración con 3 líneas (Esquina superior derecha) */}
        <div className="relative">
          <button 
            onClick={() => setShowConfigMenu(!showConfigMenu)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-white"
            title="Configuración"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Menú Desplegable */}
          {showConfigMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1c2541] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <button 
                onClick={() => {
                  setUser('');
                  localStorage.removeItem('quiniela_user');
                  setShowConfigMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition"
              >
                Cambiar de usuario
              </button>
              <button 
                onClick={() => {
                  fetchGames();
                  fetchUsers();
                  setShowConfigMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition"
              >
                Sincronizar datos
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Pestañas de Navegación */}
      <div className="flex justify-around p-3 bg-[#1c2541] border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('partidos')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${activeTab === 'partidos' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'}`}
        >
          Partidos
        </button>
        <button 
          onClick={() => setActiveTab('resultados')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${activeTab === 'resultados' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'}`}
        >
          Resultados
        </button>
        <button 
          onClick={() => setActiveTab('tabla')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${activeTab === 'tabla' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'}`}
        >
          Tabla
        </button>
        <button 
          onClick={() => setActiveTab('reglas')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${activeTab === 'reglas' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'}`}
        >
          Reglas
        </button>
      </div>

      {/* Contenido de Partidos */}
      <main className="p-4 max-w-xl mx-auto">
        {activeTab === 'partidos' && (
          <div className="space-y-4">
            {games.length === 0 ? (
              <p className="text-center text-slate-500 py-10">Cargando partidos...</p>
            ) : (
              games.map((game) => (
                <div key={game.ID} className="bg-[#1c2541] border border-slate-800 rounded-2xl p-4 shadow-md">
                  <div className="flex justify-between items-center mb-3 text-xs text-slate-400">
                    <span>{game["Fecha / Hora"]}</span>
                    <span className="uppercase font-bold">{game.Estatus}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handlePick(game.ID, game.Local)}
                      className={`p-3 rounded-xl font-bold border transition ${picks[game.ID] === game.Local ? 'bg-red-600/20 border-red-600 text-white' : 'bg-[#0b132b] border-slate-700 text-slate-300 hover:border-slate-500'}`}
                    >
                      {game.Local}
                    </button>
                    <button 
                      onClick={() => handlePick(game.ID, game.Visitante)}
                      className={`p-3 rounded-xl font-bold border transition ${picks[game.ID] === game.Visitante ? 'bg-red-600/20 border-red-600 text-white' : 'bg-[#0b132b] border-slate-700 text-slate-300 hover:border-slate-500'}`}
                    >
                      {game.Visitante}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'resultados' && (
          <div className="text-center py-10 text-slate-400">Sección de Resultados</div>
        )}
        {activeTab === 'tabla' && (
          <div className="text-center py-10 text-slate-400">Tabla general de posiciones</div>
        )}
        {activeTab === 'reglas' && (
          <div className="text-center py-10 text-slate-400">Reglas de la Quiniela</div>
        )}
      </main>
    </div>
  );
}
