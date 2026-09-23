import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, BookOpen,
  ChevronRight, Lock, Unlock, Clock, Grid, Check, Eye, CheckCircle2, XCircle, MinusCircle, ShieldCheck, Award, Menu
} from 'lucide-react';

const TEAM_LOGOS = {
  'Chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
  'Ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
  '49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  'Cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
  'Bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
  'Dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
  'Eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
  'Commanders': 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png',
  'Lions': 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
  'Packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
  'Bengals': 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
  'Steelers': 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
  'Giants': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
  'Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  'Rams': 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
  'Saints': 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
  'Buccaneers': 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',
  'Colts': 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
  'Browns': 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
  'Jaguars': 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png',
  'Titans': 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
  'Jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
  'Texans': 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
  'Falcons': 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
  'Panthers': 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
  'Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  'Vikings': 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
  'Raiders': 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
  'Chargers': 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
  'Cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
  'Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
  'Patriots': 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
};

const NFL_SHIELD_URL = 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWS-DseQZSxhYSzs_as6_YQUO5XbI-C0st5hNDHUEnkg3A8Qeup0pvZUEkPu8rD78bZA/exec';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('kiki_quiniela_user') || null;
  });
  const [inputName, setInputName] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('picks'); 
  const [picksViewMode, setPicksViewMode] = useState('cards'); 
  const [selectedWeek, setSelectedWeek] = useState('3'); 
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [userPicks, setUserPicks] = useState({});
  const [lockedWeeks, setLockedWeeks] = useState({}); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUserForPicks, setSelectedUserForPicks] = useState(null);
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const preventPullToRefresh = (e) => {
      if (window.scrollY === 0 && e.touches[0].clientY > 50) {
        // e.preventDefault();
      }
    };
    window.addEventListener('touchmove', preventPullToRefresh, { passive: true });
    return () => window.removeEventListener('touchmove', preventPullToRefresh);
  }, []);

  useEffect(() => {
    fetchAllDataSilent();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const weeks = Array.from(new Set(games.map(g => String(g.week))));
      if (weeks.includes('3') && selectedWeek !== '3') {
        setSelectedWeek('3');
      } else if (weeks.length > 0 && !weeks.includes(selectedWeek)) {
        setSelectedWeek(weeks[weeks.length - 1]);
      }
    }
  }, [games]);

  const fetchAllDataSilent = async () => {
    try {
      const resGames = await fetch(SCRIPT_URL);
      const dataGames = await resGames.json();
      if (Array.isArray(dataGames) && dataGames.length > 0) {
        const formattedGames = dataGames.map((item, index) => ({
          id: Number(item.ID) || index + 1,
          week: String(item.Semana || '2'),
          home: item.Local,
          away: item.Visitante,
          datetime: item['Fecha / Hora'] || '2026-09-20T13:00:00',
          status: (item.Estatus || 'upcoming').toLowerCase(),
          winner: item['Ganador Oficial'] || null,
          scoreHome: item['Marcador Local'] || '',
          scoreAway: item['Marcador Visitante'] || ''
        }));
        setGames(formattedGames);
      }

      const resUsers = await fetch(`${SCRIPT_URL}?action=getUsers`);
      const dataUsers = await resUsers.json();
      if (Array.isArray(dataUsers)) {
        const formattedUsers = dataUsers
          .filter(u => (u.Nombre || u.name))
          .map((u, idx) => ({
            id: String(idx + 1),
            name: u.Nombre || u.name,
            locked: String(u.Locked).toUpperCase() === 'TRUE' || u.locked === true,
            picks: u.Picks || u.picks || {},
            puntajeTotal: Number(u.PuntajeTotal || u.puntajeTotal || 0)
          }));
        setUsers(formattedUsers);

        const savedUser = localStorage.getItem('kiki_quiniela_user');
        if (savedUser) {
          const found = formattedUsers.find(u => u.name.toLowerCase() === savedUser.toLowerCase());
          if (found) {
            setUserPicks(found.picks || {});
            const isUserLocked = found.locked || false;
            // Si la hoja ya tiene bloqueado globalmente, puedes ajustarlo por semana si lo deseas
            setLockedWeeks(prev => ({ ...prev, [selectedWeek]: isUserLocked }));
          }
        }
      }
    } catch (e) {
      console.error("Silent Sync Error:", e);
    }
  };

  const syncUserToSheet = async (name, locked, picks) => {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ name, locked, picks })
      });
    } catch (e) {
      console.error("Error saving to sheet:", e);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setLoginError('');
    const name = inputName.trim();

    const existing = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    const localSaved = localStorage.getItem('kiki_quiniela_user');

    if (existing && localSaved && localSaved.toLowerCase() !== name.toLowerCase()) {
      setLoginError('Este nombre ya está registrado por otro usuario. Elige uno diferente.');
      return;
    }

    if (existing && !localSaved) {
      setLoginError('Este nombre ya está en uso. Si eres tú, usa tu dispositivo original o elige otro.');
      return;
    }

    setCurrentUser(name);
    localStorage.setItem('kiki_quiniela_user', name);

    if (!existing) {
      const newUser = { id: Date.now().toString(), name, locked: false, picks: {}, puntajeTotal: 0 };
      setUsers([...users, newUser]);
      await syncUserToSheet(name, false, {});
    } else {
      setUserPicks(existing.picks || {});
      setLockedWeeks(prev => ({ ...prev, [selectedWeek]: existing.locked || false }));
      await syncUserToSheet(name, existing.locked, existing.picks);
    }
    fetchAllDataSilent();
  };

  const isDayLocked = (gameDatetime) => {
    return false; // Desactivado por completo
  };

  const handlePick = async (gameId, team, gameDatetime) => {
    if (lockedWeeks[selectedWeek]) return;
    if (isDayLocked(gameDatetime)) return;

    const updatedPicks = { ...userPicks, [gameId]: team };
    setUserPicks(updatedPicks);
    setUsers(users.map(u => u.name === currentUser ? { ...u, picks: updatedPicks } : u));
    
    await syncUserToSheet(currentUser, lockedWeeks[selectedWeek] || false, updatedPicks);
  };

  const lockAndSubmitPicks = async () => {
    const weekGameIds = games.filter(g => String(g.week) === String(selectedWeek)).map(g => g.id);
    const hasPicksForWeek = weekGameIds.some(id => userPicks[id]);
    if (!hasPicksForWeek) return;

    setLockedWeeks(prev => ({ ...prev, [selectedWeek]: true }));
    setUsers(users.map(u => u.name === currentUser ? { ...u, locked: true, picks: userPicks } : u));
    
    await syncUserToSheet(currentUser, true, userPicks);
  };

  const calculateScore = (user) => {
    let score = user.puntajeTotal || 0;
    if (score === 0) {
      games.forEach(game => {
        if (game.status === 'final' && game.winner && user.picks && user.picks[game.id] === game.winner) {
          score += 1;
        }
      });
    }
    return score;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen text-white flex flex-col justify-center items-center p-4 select-none" style={{ backgroundColor: '#002855' }}>
        <div className="max-w-md w-full rounded-3xl p-8 border-2 shadow-2xl text-center relative overflow-hidden" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: '#D50A0A' }}></div>
          
          <div className="w-24 h-24 bg-white/10 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-inner mb-4 border border-white/20">
            <img src={NFL_SHIELD_URL} alt="NFL Shield" className="w-full h-full object-contain drop-shadow" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Kiki Niela NFL
          </h1>
          <p className="text-xs uppercase font-extrabold tracking-widest mt-1 mb-8 text-amber-300">
            la casa de las apuestas
          </p>

          {loginError && (
            <div className="mb-4 bg-red-950/80 border border-red-500/50 text-red-200 text-xs py-2 px-3 rounded-xl font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tu Nombre / NickName"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-[#002855] border-2 rounded-2xl px-5 py-4 text-lg text-white placeholder-slate-400 focus:outline-none transition-all text-center font-bold shadow-inner"
                style={{ borderColor: '#D50A0A' }}
                maxLength={20}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white font-black py-4 rounded-2xl text-lg shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#D50A0A' }}
            >
              ¡Que juegue! <ChevronRight className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const availableWeeks = games.length > 0 ? Array.from(new Set(games.map(g => String(g.week)))).sort() : ['2', '3'];

  const upcomingGamesForPicks = games
    .filter(g => String(g.week) === String(selectedWeek))
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const isCurrentWeekLocked = lockedWeeks[selectedWeek] || false;

  return (
    <div className="min-h-screen text-white pb-24 font-sans select-none" style={{ backgroundColor: '#002855' }}>
      <header className="pt-4 pb-3 px-4 rounded-b-3xl shadow-xl sticky top-0 z-40 backdrop-blur-md bg-opacity-95 border-b-2" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center p-2 shadow border border-white/20">
              <img src={NFL_SHIELD_URL} alt="NFL Shield" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-white leading-tight">Kiki Niela NFL</h1>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-300">la casa de las apuestas</p>
              <p className="text-xs font-bold text-amber-300 mt-0.5">{currentUser}</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowConfigMenu(!showConfigMenu)}
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/20 transition flex items-center justify-center text-white"
              title="Menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            {showConfigMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#001b3a] border border-white/20 rounded-2xl shadow-2xl py-2 z-50">
                <button
                  onClick={() => {
                    fetchAllDataSilent();
                    setShowConfigMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-white/10 transition font-bold"
                >
                  🔄 Sincronizar datos
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 bg-[#002855] p-1 rounded-xl border border-white/20 shadow-inner">
          <button
            onClick={() => setActiveTab('picks')}
            className={`py-1.5 rounded-lg text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${activeTab === 'picks' ? 'text-white shadow' : 'text-slate-300 hover:text-white'}`}
            style={{ backgroundColor: activeTab === 'picks' ? '#D50A0A' : 'transparent' }}
          >
            <Calendar className="w-3.5 h-3.5" /> Partidos
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-1.5 rounded-lg text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${activeTab === 'results' ? 'text-white shadow' : 'text-slate-300 hover:text-white'}`}
            style={{ backgroundColor: activeTab === 'results' ? '#D50A0A' : 'transparent' }}
          >
            <Check className="w-3.5 h-3.5" /> Resultados
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-1.5 rounded-lg text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${activeTab === 'leaderboard' ? 'text-white shadow' : 'text-slate-300 hover:text-white'}`}
            style={{ backgroundColor: activeTab === 'leaderboard' ? '#D50A0A' : 'transparent' }}
          >
            <Trophy className="w-3.5 h-3.5" /> Tabla
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-1.5 rounded-lg text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${activeTab === 'rules' ? 'text-white shadow' : 'text-slate-300 hover:text-white'}`}
            style={{ backgroundColor: activeTab === 'rules' ? '#D50A0A' : 'transparent' }}
          >
            <BookOpen className="w-3.5 h-3.5" /> Reglas
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-3 mt-1">
        {activeTab === 'picks' && (
          <div className="space-y-3">
            <div className="border rounded-2xl p-3 text-center shadow-md relative overflow-hidden space-y-2.5" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              
              {/* Selector de Semanas */}
              <div className="flex items-center justify-center gap-1.5 bg-[#002855] p-1 rounded-xl border border-white/20">
                {availableWeeks.map(w => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeek(w)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition ${String(selectedWeek) === String(w) ? 'bg-[#D50A0A] text-white shadow' : 'text-slate-300 hover:text-white'}`}
                  >
                    Semana {w}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {isCurrentWeekLocked ? (
                    <span className="text-red-400 font-bold text-xs flex items-center gap-1 bg-red-950/50 px-2.5 py-0.5 rounded-full border border-red-500/30">
                      <Lock className="w-3 h-3" /> Picks Enviados
                    </span>
                  ) : (
                    <span className="text-amber-300 font-bold text-xs flex items-center gap-1 bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      <Unlock className="w-3 h-3" /> Semana {selectedWeek} Abierta
                    </span>
                  )}
                </div>

                <div className="flex bg-[#002855] p-0.5 rounded-lg border border-white/20">
                  <button
                    onClick={() => setPicksViewMode('cards')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${picksViewMode === 'cards' ? 'bg-[#D50A0A] text-white shadow' : 'text-slate-300'}`}
                  >
                    <Grid className="w-3 h-3" /> Tarjetas
                  </button>
                  <button
                    onClick={() => setPicksViewMode('quick')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${picksViewMode === 'quick' ? 'bg-[#D50A0A] text-white shadow' : 'text-slate-300'}`}
                  >
                    <span>⚡ Rápida</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-300">Toca tu ganador o selecciona Empate abajo. Se guarda automáticamente.</p>
            </div>

            {picksViewMode === 'cards' && (
              <div className="space-y-2.5">
                {upcomingGamesForPicks.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-10 bg-[#001b3a] rounded-2xl border border-white/10">
                    No hay partidos programados para la Semana {selectedWeek}
                  </div>
                ) : (
                  upcomingGamesForPicks.map((game) => {
                    const selectedTeam = userPicks[game.id];
                    const isFinal = game.status === 'final';
                    const dayLocked = isDayLocked(game.datetime);
                    const isLocked = isCurrentWeekLocked || dayLocked || isFinal;

                    return (
                      <div key={game.id} className="border rounded-2xl p-3 shadow-md relative overflow-hidden space-y-2" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                        <div className="grid grid-cols-2 gap-2.5 items-center">
                          <button
                            disabled={isLocked}
                            onClick={() => handlePick(game.id, game.away, game.datetime)}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                              selectedTeam === game.away ? 'bg-[#D50A0A]/50 border-[#D50A0A] text-white shadow' : 'bg-[#002855]/70 border-white/10 text-slate-200'
                            } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <img src={TEAM_LOGOS[game.away]} alt={game.away} className="w-8 h-8 object-contain drop-shadow" onError={(e)=>{e.target.style.display='none'}} />
                            <span className="font-bold text-xs text-center truncate w-full">{game.away}</span>
                            {selectedTeam === game.away && <span className="text-white text-[9px] font-black px-1.5 py-0.2 rounded bg-[#D50A0A]">Pick</span>}
                          </button>

                          <button
                            disabled={isLocked}
                            onClick={() => handlePick(game.id, game.home, game.datetime)}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                              selectedTeam === game.home ? 'bg-[#D50A0A]/50 border-[#D50A0A] text-white shadow' : 'bg-[#002855]/70 border-white/10 text-slate-200'
                            } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <img src={TEAM_LOGOS[game.home]} alt={game.home} className="w-8 h-8 object-contain drop-shadow" onError={(e)=>{e.target.style.display='none'}} />
                            <span className="font-bold text-xs text-center truncate w-full">{game.home}</span>
                            {selectedTeam === game.home && <span className="text-white text-[9px] font-black px-1.5 py-0.2 rounded bg-[#D50A0A]">Pick</span>}
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                          <span className="text-slate-300 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-amber-400" /> {new Date(game.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <button
                            disabled={isLocked}
                            onClick={() => handlePick(game.id, 'Empate', game.datetime)}
                            className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold flex items-center gap-1 transition ${
                              selectedTeam === 'Empate' ? 'bg-amber-600 border-amber-400 text-white shadow' : 'bg-[#002855] border-white/10 text-amber-300 hover:bg-[#002855]/80'
                            } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <MinusCircle className="w-3 h-3" />
                            <span>Empate {selectedTeam === 'Empate' && '✓'}</span>
                          </button>

                          {isFinal ? (
                            <span className="text-emerald-300 font-bold">Finalizado</span>
                          ) : dayLocked ? (
                            <span className="text-red-300 font-bold">Cerrado</span>
                          ) : (
                            <span className="text-amber-300 font-bold flex items-center gap-0.5"><Unlock className="w-3 h-3" /> Abierto</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {picksViewMode === 'quick' && (
              <div className="bg-[#001b3a] border border-white/10 rounded-2xl p-3 shadow-md space-y-2">
                <div className="text-xs font-bold text-amber-300 mb-2 px-1 flex items-center justify-between">
                  <span>⚡ Vista Rápida (Semana {selectedWeek})</span>
                  <span>{upcomingGamesForPicks.filter(g => userPicks[g.id]).length} / {upcomingGamesForPicks.length} elegidos</span>
                </div>
                {upcomingGamesForPicks.map((game) => {
                  const selectedTeam = userPicks[game.id];
                  const isFinal = game.status === 'final';
                  const dayLocked = isDayLocked(game.datetime);
                  const isLocked = isCurrentWeekLocked || dayLocked || isFinal;

                  return (
                    <div key={game.id} className="bg-[#002855] p-2.5 rounded-xl border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-300">
                        <span className="font-semibold">{new Date(game.datetime).toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <button
                          disabled={isLocked}
                          onClick={() => handlePick(game.id, 'Empate', game.datetime)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedTeam === 'Empate' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-[#001b3a] border-white/10 text-amber-300'}`}
                        >
                          Empate {selectedTeam === 'Empate' && '✓'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          disabled={isLocked}
                          onClick={() => handlePick(game.id, game.away, game.datetime)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 truncate ${selectedTeam === game.away ? 'bg-[#D50A0A] text-white ring-1 ring-white' : 'bg-[#001b3a] text-slate-300'}`}
                        >
                          <img src={TEAM_LOGOS[game.away]} alt={game.away} className="w-4 h-4 object-contain" onError={(e)=>{e.target.style.display='none'}} />
                          <span className="truncate">{game.away}</span>
                        </button>
                        <button
                          disabled={isLocked}
                          onClick={() => handlePick(game.id, game.home, game.datetime)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 truncate ${selectedTeam === game.home ? 'bg-[#D50A0A] text-white ring-1 ring-white' : 'bg-[#001b3a] text-slate-300'}`}
                        >
                          <img src={TEAM_LOGOS[game.home]} alt={game.home} className="w-4 h-4 object-contain" onError={(e)=>{e.target.style.display='none'}} />
                          <span className="truncate">{game.home}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isCurrentWeekLocked && games.length > 0 && (
              <div className="pt-2 pb-4">
                <button
                  onClick={lockAndSubmitPicks}
                  className="w-full text-white font-black py-3 rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 border border-white/20"
                  style={{ backgroundColor: '#D50A0A' }}
                >
                  Enviar Mis Picks 🔒
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-3">
            <div className="border rounded-2xl p-3 text-center shadow-md" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <h2 className="font-black text-amber-300 text-sm mb-0.5">Resultados Históricos</h2>
              <p className="text-[11px] text-slate-300">Marcadores finales y tus aciertos.</p>
            </div>

            <div className="bg-[#001b3a] border border-white/10 rounded-2xl p-3 shadow-md space-y-2">
              {games.filter(g => g.status === 'final').length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-6">
                  Aún no hay partidos finalizados registrados en la hoja.
                </div>
              ) : (
                games.filter(g => g.status === 'final').map(game => {
                  const selectedTeam = userPicks[game.id];
                  const userGotItRight = selectedTeam && selectedTeam === game.winner;

                  return (
                    <div key={game.id} className="bg-[#002855] border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {userGotItRight ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-white text-xs">Sem. {game.week}: {game.away} vs {game.home}</p>
                          <p className="text-[10px] text-slate-300">Ganador: <span className="text-amber-300 font-bold">{game.winner}</span> {game.scoreAway !== '' && `(${game.scoreAway}-${game.scoreHome})`}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${userGotItRight ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'}`}>
                          {userGotItRight ? '+1 pt' : '0 pt'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            <div className="border rounded-2xl p-3 text-center shadow-md" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <h2 className="font-black text-amber-300 text-sm mb-0.5 flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Tabla de Posiciones Global
              </h2>
              <p className="text-[11px] text-slate-300">Toca un nombre para ver sus picks.</p>
            </div>

            <div className="space-y-2">
              {users.length === 0 ? (
                <div className="border rounded-2xl p-6 text-center text-slate-400 text-xs" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                  Aún no hay participantes registrados en Google Sheets. ¡Comparte tu link!
                </div>
              ) : (
                users
                  .map(user => ({ ...user, score: calculateScore(user) }))
                  .sort((a, b) => b.score - a.score)
                  .map((user, index) => (
                    <div key={user.id} className="border rounded-xl p-3 flex items-center justify-between shadow-md" style={{ backgroundColor: '#001b3a', borderColor: index === 0 ? '#F59E0B' : 'rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-[#002855] text-amber-300 shadow">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div>
                          <button onClick={() => setSelectedUserForPicks(user)} className="font-bold text-sm text-white flex items-center gap-1 hover:text-amber-300 transition text-left">
                            {user.name} {user.name === currentUser && <span className="text-[9px] text-white px-1.5 py-0.2 rounded font-black bg-[#D50A0A]">Tú</span>}
                            {user.locked && <span className="text-emerald-400 text-xs">🔒</span>}
                            <Eye className="w-3 h-3 text-amber-300 ml-0.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-amber-300">{user.score}</span>
                        <p className="text-[9px] uppercase font-bold text-slate-400">Pts</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {selectedUserForPicks && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="border-2 rounded-3xl max-w-sm w-full p-5 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl relative" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <h3 className="font-black text-base text-white">Picks de: <span className="text-amber-300">{selectedUserForPicks.name}</span></h3>
                <button onClick={() => setSelectedUserForPicks(null)} className="bg-white/10 text-white px-2.5 py-1 rounded-xl text-xs">✕</button>
              </div>
              <div className="space-y-2">
                {games.map((game) => {
                  const pick = selectedUserForPicks.picks ? selectedUserForPicks.picks[game.id] : null;
                  const isFinal = game.status === 'final';
                  const gotItRight = isFinal && game.winner && pick && pick === game.winner;

                  return (
                    <div key={game.id} className="bg-[#002855] border border-white/10 rounded-xl p-2.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-semibold">Sem. {game.week}: {game.away} vs {game.home}</span>
                        <span className={`font-black px-2 py-0.5 rounded-lg text-[10px] border ${
                          pick ? 'bg-[#D50A0A]/40 border-[#D50A0A] text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          {pick || 'Sin selección'}
                        </span>
                      </div>
                      
                      {isFinal ? (
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                          <span className="text-slate-400">Ganador: <strong className="text-amber-300">{game.winner}</strong></span>
                          <span className={`font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            gotItRight ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                          }`}>
                            {gotItRight ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                            {gotItRight ? '+1 pt' : '0 pt'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-amber-300/80">
                          <span>Partido en curso / pendiente</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="border rounded-2xl p-3 text-center shadow-md" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <h2 className="font-black text-amber-300 text-sm mb-0.5 flex items-center justify-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" /> Reglas de la Quiniela
              </h2>
              <p className="text-[11px] text-slate-300">Todo lo que necesitas saber para ganar.</p>
            </div>

            <div className="space-y-2.5">
              <div className="bg-[#001b3a] border border-white/10 rounded-2xl p-3.5 shadow-md space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>1. Selección de Pronósticos</span>
                </div>
                <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                  Toca tu equipo favorito o selecciona la opción de Empate ubicada en la parte inferior de cada tarjeta de partido. Tus cambios se guardan automáticamente en Google Sheets.
                </p>
              </div>

              <div className="bg-[#001b3a] border border-white/10 rounded-2xl p-3.5 shadow-md space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>2. Cierre de Partidos</span>
                </div>
                <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                  Cada bloque de partidos se cierra automáticamente 12 horas antes del inicio del primer encuentro de ese día. Asegúrate de enviar tus picks a tiempo.
                </p>
              </div>

              <div className="bg-[#001b3a] border border-white/10 rounded-2xl p-3.5 shadow-md space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>3. Sistema de Puntuación</span>
                </div>
                <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                  Obtienes <strong className="text-white">+1 punto</strong> por cada acierto oficial al finalizar los encuentros de la semana. Compite en tiempo real en la tabla de posiciones global.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
