import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, BookOpen,
  ChevronRight, Zap, Lock, Unlock, Clock, Grid, Check, Users, Eye, RefreshCw, CheckCircle2, XCircle
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
  'Broncos': 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png'
};

const NFL_SHIELD_URL = 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png';

const INITIAL_GAMES = [
  { id: 16, week: 2, home: 'Chiefs', away: 'Ravens', datetime: '2026-09-20T13:00:00', status: 'upcoming', winner: null },
  { id: 17, week: 2, home: '49ers', away: 'Cowboys', datetime: '2026-09-20T16:25:00', status: 'upcoming', winner: null },
  { id: 18, week: 2, home: 'Bills', away: 'Dolphins', datetime: '2026-09-20T13:00:00', status: 'upcoming', winner: null },
  { id: 19, week: 2, home: 'Commanders', away: 'Eagles', datetime: '2026-09-20T13:00:00', status: 'upcoming', winner: null },
  { id: 20, week: 2, home: 'Lions', away: 'Packers', datetime: '2026-09-20T15:05:00', status: 'upcoming', winner: null },
  { id: 21, week: 2, home: 'Bengals', away: 'Steelers', datetime: '2026-09-20T13:00:00', status: 'upcoming', winner: null },
  { id: 22, week: 2, home: 'Cowboys', away: 'Giants', datetime: '2026-09-21T19:15:00', status: 'upcoming', winner: null },
  { id: 23, week: 2, home: 'Rams', away: 'Seahawks', datetime: '2026-09-20T16:25:00', status: 'upcoming', winner: null }
];

const INITIAL_USERS = []; 
 

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [inputName, setInputName] = useState('');
  const [activeTab, setActiveTab] = useState('picks'); 
  const [picksViewMode, setPicksViewMode] = useState('cards'); 
  const [games, setGames] = useState(INITIAL_GAMES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [userPicks, setUserPicks] = useState({});
  const [isLockedByButton, setIsLockedByButton] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUserForPicks, setSelectedUserForPicks] = useState(null);
  const [isUpdatingFromAI, setIsUpdatingFromAI] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('kiki_quiniela_user');
    const savedPicks = localStorage.getItem('kiki_quiniela_picks');
    const savedGames = localStorage.getItem('kiki_quiniela_games');
    const savedUsers = localStorage.getItem('kiki_quiniela_users');
    const savedLocked = localStorage.getItem('kiki_quiniela_locked');

    if (savedUser) setCurrentUser(savedUser);
    if (savedPicks) setUserPicks(JSON.parse(savedPicks));
    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedLocked) setIsLockedByButton(JSON.parse(savedLocked));
  }, []);

  useEffect(() => {
    fetchLiveNFLData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLiveNFLData = async () => {
    setIsUpdatingFromAI(true);
    showToast('🔄 Sincronizando partidos desde Google Sheets...');
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyWS-DseQZSxhYSzs_as6_YQUO5XbI-C0st5hNDHUEnkg3A8Qeup0pvZUEkPu8rD78bZA/exec');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const formattedGames = data.map((item, index) => ({
          id: Number(item.ID) || index + 1,
          week: item.Semana || '2',
          home: item.Local,
          away: item.Visitante,
          datetime: item['Fecha / Hora'] || '2026-09-20T13:00:00',
          status: (item.Estatus || 'upcoming').toLowerCase(),
          winner: item['Ganador Oficial'] || null
        }));
        setGames(formattedGames);
        localStorage.setItem('kiki_quiniela_games', JSON.stringify(formattedGames));
        showToast('✅ ¡Partidos sincronizados desde Google Sheets!');
      } else {
        showToast('⚠️ No se encontraron partidos en la hoja.');
      }
    } catch (e) {
      console.error("Sheet Sync Error:", e);
      showToast('❌ Error al conectar con Google Sheets.');
    } finally {
      setIsUpdatingFromAI(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    const name = inputName.trim();
    setCurrentUser(name);
    localStorage.setItem('kiki_quiniela_user', name);

    const existing = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
      const newUsersList = [...users, { id: Date.now().toString(), name, locked: false, picks: {} }];
      setUsers(newUsersList);
      localStorage.setItem('kiki_quiniela_users', JSON.stringify(newUsersList));
      setIsLockedByButton(false);
      setUserPicks({});
    } else {
      setUserPicks(existing.picks || {});
      setIsLockedByButton(existing.locked || false);
    }
    showToast(`¡Bienvenido a Kiki Niela NFL, ${name}! 🏈`);
  };

  const earliestGamePerDay = games.reduce((acc, game) => {
    const dateKey = game.datetime.split('T')[0];
    const gameTime = new Date(game.datetime).getTime();
    if (!acc[dateKey] || gameTime < acc[dateKey]) {
      acc[dateKey] = gameTime;
    }
    return acc;
  }, {});

  const isDayLocked = (gameDatetime) => {
    const dateKey = gameDatetime.split('T')[0];
    const earliestTime = earliestGamePerDay[dateKey];
    if (!earliestTime) return false;
    const diffHours = (earliestTime - currentTime.getTime()) / (1000 * 60 * 60);
    return diffHours < 12;
  };

  const handlePick = (gameId, team, gameDatetime) => {
    if (isLockedByButton) {
      showToast('🔒 Tus picks ya están enviados.');
      return;
    }
    if (isDayLocked(gameDatetime)) {
      showToast('⏳ Este día está cerrado (han pasado menos de 12 hrs para el primer partido del día).');
      return;
    }

    const updatedPicks = { ...userPicks, [gameId]: team };
    setUserPicks(updatedPicks);
    localStorage.setItem('kiki_quiniela_picks', JSON.stringify(updatedPicks));

    const updatedUsers = users.map(u => {
      if (u.name === currentUser) {
        return { ...u, picks: updatedPicks };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('kiki_quiniela_users', JSON.stringify(updatedUsers));
  };

  const lockAndSubmitPicks = () => {
    if (Object.keys(userPicks).length === 0) {
      showToast('⚠️ Selecciona al menos un ganador antes de enviar.');
      return;
    }
    setIsLockedByButton(true);
    localStorage.setItem('kiki_quiniela_locked', JSON.stringify(true));

    const updatedUsers = users.map(u => {
      if (u.name === currentUser) {
        return { ...u, locked: true, picks: userPicks };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('kiki_quiniela_users', JSON.stringify(updatedUsers));
    showToast('🔒 ¡Picks enviados con éxito!');
  };

  const calculateScore = (user) => {
    let score = 0;
    games.forEach(game => {
      if (game.status === 'final' && game.winner && user.picks && user.picks[game.id] === game.winner) {
        score += 1;
      }
    });
    return score;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen text-white flex flex-col justify-center items-center p-4" style={{ backgroundColor: '#002855' }}>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="NickName"
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
              ¡Que juegue!! <ChevronRight className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtrar solo los partidos de la semana actual o próxima para los picks (por ejemplo, Semana 2)
  const upcomingGamesForPicks = games.filter(g => String(g.week) === '2');

  return (
    <div className="min-h-screen text-white pb-24 font-sans select-none" style={{ backgroundColor: '#002855' }}>
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 text-white font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce" style={{ backgroundColor: '#D50A0A' }}>
          <Zap className="w-5 h-5 fill-white" /> {toast}
        </div>
      )}

      {/* Header */}
      <header className="pt-5 pb-4 px-5 rounded-b-3xl shadow-xl sticky top-0 z-40 backdrop-blur-md bg-opacity-95 border-b-2" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center p-2 shadow-lg border border-white/20">
              <img src={NFL_SHIELD_URL} alt="NFL Shield" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-white leading-tight">
                Kiki Niela NFL
              </h1>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                la casa de las apuestas
              </p>
              <p className="text-xs text-slate-200 font-medium mt-0.5">NickName: <span className="underline font-bold text-amber-300">{currentUser}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveNFLData}
              disabled={isUpdatingFromAI}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow border border-emerald-400/40 transition active:scale-95"
              title="Sincronizar partidos desde Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingFromAI ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('kiki_quiniela_user');
                setCurrentUser(null);
              }}
              className="bg-white/10 hover:bg-white/20 text-xs px-3 py-2 rounded-xl border border-white/20 font-semibold transition"
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#002855] p-1.5 rounded-2xl border border-white/20 shadow-inner">
          <button
            onClick={() => setActiveTab('picks')}
            className={`py-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeTab === 'picks' ? 'text-white shadow-lg' : 'text-slate-300 hover:text-white'
            }`}
            style={{ backgroundColor: activeTab === 'picks' ? '#D50A0A' : 'transparent' }}
          >
            <Calendar className="w-3.5 h-3.5" /> Partidos
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeTab === 'results' ? 'text-white shadow-lg' : 'text-slate-300 hover:text-white'
            }`}
            style={{ backgroundColor: activeTab === 'results' ? '#D50A0A' : 'transparent' }}
          >
            <Check className="w-3.5 h-3.5" /> Resultados
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeTab === 'leaderboard' ? 'text-white shadow-lg' : 'text-slate-300 hover:text-white'
            }`}
            style={{ backgroundColor: activeTab === 'leaderboard' ? '#D50A0A' : 'transparent' }}
          >
            <Trophy className="w-3.5 h-3.5" /> Tabla
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2 rounded-xl text-[11px] font-black flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeTab === 'rules' ? 'text-white shadow-lg' : 'text-slate-300 hover:text-white'
            }`}
            style={{ backgroundColor: activeTab === 'rules' ? '#D50A0A' : 'transparent' }}
          >
            <BookOpen className="w-3.5 h-3.5" /> Reglas
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-4 mt-2">
        {activeTab === 'picks' && (
          <div className="space-y-4">
            <div className="border rounded-2xl p-4 text-center shadow-lg relative overflow-hidden" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isLockedByButton ? (
                    <span className="text-red-400 font-bold text-xs flex items-center gap-1 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/30">
                      <Lock className="w-3.5 h-3.5" /> Picks Enviados
                    </span>
                  ) : (
                    <span className="text-amber-300 font-bold text-xs flex items-center gap-1 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30">
                      <Unlock className="w-3.5 h-3.5" /> Picks Abiertos (Semana 2)
                    </span>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-[#002855] p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => setPicksViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                      picksViewMode === 'cards' ? 'bg-[#D50A0A] text-white shadow' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Vista detallada"
                  >
                    <Grid className="w-3.5 h-3.5" /> Tarjetas
                  </button>
                  <button
                    onClick={() => setPicksViewMode('quick')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                      picksViewMode === 'quick' ? 'bg-[#D50A0A] text-white shadow' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Vista rápida"
                  >
                    <span className="font-bold">⚡ Rápida</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-200">
                Toca tu equipo favorito. Cada bloque de partidos se cierra automáticamente 12 horas antes del primer partido de ese día.
              </p>
            </div>

            {/* VIEW MODE 1: CARDS */}
            {picksViewMode === 'cards' && (
              <div className="space-y-3">
                {upcomingGamesForPicks.map((game) => {
                  const selectedTeam = userPicks[game.id];
                  const isFinal = game.status === 'final';
                  const dayLocked = isDayLocked(game.datetime);
                  const isLocked = isLockedByButton || dayLocked || isFinal;

                  return (
                    <div
                      key={game.id}
                      className="border rounded-2xl p-4 shadow-xl relative overflow-hidden transition-all"
                      style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}
                    >
                      <div className="flex justify-between items-center text-xs text-slate-300 mb-3 font-semibold">
                        <span className="bg-[#002855] px-2.5 py-1 rounded-full text-slate-200 flex items-center gap-1 border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> {new Date(game.datetime).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isFinal ? (
                          <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-500/30">
                            ✅ Finalizado
                          </span>
                        ) : dayLocked ? (
                          <span className="bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-red-500/30">
                            🔒 Cerrado (-12 hrs)
                          </span>
                        ) : (
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            <Unlock className="w-3.5 h-3.5" /> Abierto
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-1">
                        <button
                          disabled={isLocked}
                          onClick={() => handlePick(game.id, game.away, game.datetime)}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                            selectedTeam === game.away
                              ? 'bg-[#D50A0A]/40 border-[#D50A0A] text-white shadow-lg scale-[1.02]'
                              : 'bg-[#002855]/70 border-white/10 text-slate-200 hover:bg-[#002855]'
                          } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <img 
                            src={TEAM_LOGOS[game.away]} 
                            alt={game.away} 
                            className="w-12 h-12 object-contain drop-shadow" 
                            onError={(e)=>{e.target.style.display='none'}}
                          />
                          <span className="font-black text-sm text-center">{game.away}</span>
                          {selectedTeam === game.away && (
                            <span className="text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mt-0.5 shadow" style={{ backgroundColor: '#D50A0A' }}>
                              ¡Tu Pick!
                            </span>
                          )}
                        </button>

                        <button
                          disabled={isLocked}
                          onClick={() => handlePick(game.id, game.home, game.datetime)}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                            selectedTeam === game.home
                              ? 'bg-[#D50A0A]/40 border-[#D50A0A] text-white shadow-lg scale-[1.02]'
                              : 'bg-[#002855]/70 border-white/10 text-slate-200 hover:bg-[#002855]'
                          } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <img 
                            src={TEAM_LOGOS[game.home]} 
                            alt={game.home} 
                            className="w-12 h-12 object-contain drop-shadow" 
                            onError={(e)=>{e.target.style.display='none'}}
                          />
                          <span className="font-black text-sm text-center">{game.home}</span>
                          {selectedTeam === game.home && (
                            <span className="text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mt-0.5 shadow" style={{ backgroundColor: '#D50A0A' }}>
                              ¡Tu Pick!
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE 2: QUICK FILL (Con minilogos integrados) */}
            {picksViewMode === 'quick' && (
              <div className="space-y-2">
                <div className="bg-[#001b3a] border border-white/10 rounded-2xl p-3 shadow-lg">
                  <div className="text-xs font-bold text-amber-300 mb-2 px-1 flex items-center justify-between">
                    <span>⚡ Vista Rápida (Semana 2)</span>
                    <span>{Object.keys(userPicks).filter(id => upcomingGamesForPicks.some(g => g.id === Number(id))).length} / {upcomingGamesForPicks.length} elegidos</span>
                  </div>
                  <div className="space-y-2">
                    {upcomingGamesForPicks.map((game) => {
                      const selectedTeam = userPicks[game.id];
                      const isFinal = game.status === 'final';
                      const dayLocked = isDayLocked(game.datetime);
                      const isLocked = isLockedByButton || dayLocked || isFinal;

                      return (
                        <div key={game.id} className="bg-[#002855] p-3 rounded-xl border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-300 font-semibold">{new Date(game.datetime).toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              disabled={isLocked}
                              onClick={() => handlePick(game.id, game.away, game.datetime)}
                              className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                                selectedTeam === game.away
                                  ? 'bg-[#D50A0A] text-white shadow-md ring-1 ring-white'
                                  : 'bg-[#001b3a] text-slate-300 hover:bg-[#001b3a]/80 border border-white/10'
                              } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <img 
                                src={TEAM_LOGOS[game.away]} 
                                alt={game.away} 
                                className="w-5 h-5 object-contain shrink-0 drop-shadow" 
                                onError={(e)=>{e.target.style.display='none'}}
                              />
                              <span className="truncate">{game.away}</span>
                            </button>

                            <button
                              disabled={isLocked}
                              onClick={() => handlePick(game.id, game.home, game.datetime)}
                              className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                                selectedTeam === game.home
                                  ? 'bg-[#D50A0A] text-white shadow-md ring-1 ring-white'
                                  : 'bg-[#001b3a] text-slate-300 hover:bg-[#001b3a]/80 border border-white/10'
                              } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <img 
                                src={TEAM_LOGOS[game.home]} 
                                alt={game.home} 
                                className="w-5 h-5 object-contain shrink-0 drop-shadow" 
                                onError={(e)=>{e.target.style.display='none'}}
                              />
                              <span className="truncate">{game.home}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {!isLockedByButton && (
              <div className="pt-2 pb-6">
                <button
                  onClick={lockAndSubmitPicks}
                  className="w-full text-white font-black py-4 rounded-2xl text-base shadow-2xl flex items-center justify-center gap-2 border border-white/20 transform active:scale-95 transition"
                  style={{ backgroundColor: '#D50A0A' }}
                >
                  Enviar Mis Picks 🔒
                </button>
                <p className="text-[11px] text-slate-300 text-center mt-2">
                  Puedes enviar tus pronósticos cuando estés listo, o se cerrarán automáticamente 12 horas antes del primer partido de cada día.
                </p>
              </div>
            )}
          </div>
        )}

        {/* RESULTS HISTORY SECTION */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="border rounded-2xl p-4 text-center shadow-lg" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <h2 className="font-black text-amber-300 text-lg mb-1 flex items-center justify-center gap-2">
                <Check className="w-6 h-6 text-emerald-400" /> Resultados Históricos (Semana 1)
              </h2>
              <p className="text-xs text-slate-200">Historial de partidos finalizados y tus aciertos.</p>
            </div>

            <div className="space-y-3">
              {games.filter(g => g.status === 'final').length === 0 ? (
                <div className="border rounded-2xl p-8 text-center text-slate-400 text-xs" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                  Aún no hay partidos finalizados. ¡Usa "Actualizar"!
                </div>
              ) : (
                games.filter(g => g.status === 'final').map(game => {
                  const selectedTeam = userPicks[game.id];
                  const userGotItRight = selectedTeam && selectedTeam === game.winner;
                  const userGotItWrong = selectedTeam && selectedTeam !== game.winner;

                  return (
                    <div key={game.id} className="border rounded-2xl p-4 shadow-lg space-y-3" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                      <div className="flex justify-between items-center text-xs text-slate-300 font-semibold">
                        <span className="bg-[#002855] px-2.5 py-1 rounded-full text-slate-200">
                          Semana {game.week} - {new Date(game.datetime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-500/30">
                          ✅ Ganador: {game.winner}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className={`p-2.5 rounded-xl border ${game.winner === game.away ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-[#002855] border-white/10 text-slate-300'}`}>
                          {game.away} {game.winner === game.away && '🏆'}
                        </div>
                        <div className={`p-2.5 rounded-xl border ${game.winner === game.home ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-[#002855] border-white/10 text-slate-300'}`}>
                          {game.home} {game.winner === game.home && '🏆'}
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-bold border ${
                        userGotItRight ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' :
                        userGotItWrong ? 'bg-red-950/60 border-red-500/40 text-red-300' :
                        'bg-[#002855] border-white/10 text-slate-300'
                      }`}>
                        <span className="flex items-center gap-1.5">
                          {userGotItRight && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {userGotItWrong && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                          {!selectedTeam && <span>⚠️ No elegiste pick en este partido.</span>}
                          {userGotItRight && '¡Acertaste tu pronóstico! (+1 punto)'}
                          {userGotItWrong && `Fallaste (tu pick fue ${selectedTeam})`}
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
          <div className="space-y-4">
            <div className="border rounded-2xl p-4 text-center shadow-lg" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <h2 className="font-black text-amber-300 text-lg mb-1 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" /> Tabla de Posiciones y Pronósticos
              </h2>
              <p className="text-xs text-slate-200">Toca el nombre de cualquier participante para ver sus Pronósticos.</p>
            </div>

            <div className="space-y-3">
              {users
                .map(user => ({ ...user, score: calculateScore(user) }))
                .sort((a, b) => b.score - a.score)
                .map((user, index) => (
                  <div
                    key={user.id}
                    className={`border rounded-2xl p-4 flex items-center justify-between shadow-lg ${
                      index === 0 ? 'border-amber-400' : 'border-white/10'
                    }`}
                    style={{ backgroundColor: '#001b3a' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow ${
                        index === 0 ? 'bg-amber-400 text-slate-950 text-base' :
                        index === 1 ? 'bg-slate-300 text-slate-950' :
                        index === 2 ? 'bg-amber-700 text-white' : 'bg-[#002855] text-slate-300'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedUserForPicks(user)}
                          className="font-bold text-base text-white flex items-center gap-1.5 hover:text-amber-300 transition text-left"
                        >
                          {user.name} {user.name === currentUser && <span className="text-[10px] text-white px-2 py-0.5 rounded-full font-black shadow" style={{ backgroundColor: '#D50A0A' }}>Tú</span>}
                          {user.locked && <span className="text-emerald-400 text-xs" title="Picks enviados">🔒</span>}
                          <Eye className="w-3.5 h-3.5 text-amber-300 ml-1" />
                        </button>
                        <p className="text-xs text-slate-300">
                          Pronósticos: <span className="text-amber-300 font-bold underline">Ver picks</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-300">{user.score}</span>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Puntos</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Modal to view a specific user's picks */}
        {selectedUserForPicks && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="border-2 rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl relative" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-300" />
                  <h3 className="font-black text-lg text-white">Pronósticos de: <span className="text-amber-300">{selectedUserForPicks.name}</span></h3>
                </div>
                <button
                  onClick={() => setSelectedUserForPicks(null)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  Cerrar ✕
                </button>
              </div>

              <div className="space-y-2.5">
                {games.map((game) => {
                  const pick = selectedUserForPicks.picks ? selectedUserForPicks.picks[game.id] : null;
                  return (
                    <div key={game.id} className="bg-[#002855] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-semibold">{game.away} vs {game.home}</span>
                      <span className={`text-xs font-black px-3 py-1 rounded-xl shadow border ${
                        pick ? 'bg-[#D50A0A]/40 border-[#D50A0A] text-white' : 'bg-slate-800 border-white/10 text-slate-400'
                      }`}>
                        {pick || 'Sin selección'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setSelectedUserForPicks(null)}
                className="w-full text-white font-black py-3 rounded-2xl shadow-xl transition"
                style={{ backgroundColor: '#D50A0A' }}
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="border rounded-2xl p-4 text-center shadow-lg" style={{ backgroundColor: '#001b3a', borderColor: '#D50A0A' }}>
              <h2 className="font-black text-amber-300 text-lg mb-1 flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-300" /> Reglas de la Quiniela
              </h2>
              <p className="text-xs text-slate-200">!asi es como funciona la Kikiniela NFL</p>
            </div>

            <div className="space-y-3">
              <div className="border rounded-2xl p-4 shadow-lg space-y-2" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🏈</span> 1. Haz tus Pronósticos
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Entra a la sección de partidos y selecciona al equipo que crees que va a ganar cada encuentro. Puedes usar la vista de Tarjetas o la Vista Rápida.
                </p>
              </div>

              <div className="border rounded-2xl p-4 shadow-lg space-y-2" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>⚡</span> 2. Envío Anticipado
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Si ya estás seguro de tus selecciones antes de tiempo, puedes presionar el botón <span className="font-bold text-amber-300">"Enviar Mis Picks 🔒"</span> para sellar y asegurar tu plantilla al instante.
                </p>
              </div>

              <div className="border rounded-2xl p-4 shadow-lg space-y-2" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🔒</span> 3. Cierre Automático por Día (-12 hrs)
                </div>
                <p className="text-xs text-slate-200 leading-regular">
                  Si no enviaste tus picks antes, cada bloque de partidos se cierra automáticamente exactamente <span className="font-bold text-amber-300">12 horas antes</span> de que inicie el primer partido de esa fecha específica.
                </p>
              </div>

              <div className="border rounded-2xl p-4 shadow-lg space-y-2" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🏆</span> 4. Gana Puntos y Sube al Podio
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Gana <span className="font-bold text-amber-300">1 punto por cada acierto</span> en los partidos finalizados. Consulta la tabla de posiciones y toca el nombre de cualquier participante en la sección de <span className="font-bold text-amber-300">Pronósticos</span> para ver qué eligió cada quien en cuanto envíen sus picks.
                </p>
              </div>

              <div className="border rounded-2xl p-4 shadow-lg space-y-2" style={{ backgroundColor: '#001b3a', borderColor: '#003369' }}>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <span>🤝</span> 5. En caso de Empate
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Si dos o más participantes terminan empatados en el primer lugar de puntos, <span className="font-bold text-amber-300">el premio se divide</span> equitativamente entre los ganadores.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
