//V3.5 final

import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, BookOpen,
  ChevronRight, Lock, Unlock, Clock, Grid, Check, Eye, CheckCircle2, XCircle, MinusCircle, ShieldCheck, Award, Menu, ChevronDown
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
  const [isLockedByButton, setIsLockedByButton] = useState(() => {
    return localStorage.getItem('kiki_quiniela_locked') === 'true';
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUserForPicks, setSelectedUserForPicks] = useState(null);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [showWeeksAccordion, setShowWeeksAccordion] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAllDataInitial();
  }, []);

  const fetchAllDataInitial = async () => {
    try {
      await fetchAllDataSilent();
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const fetchAllDataSilent = async () => {
    try {
      const resGames = await fetch(SCRIPT_URL);
      const dataGames = await resGames.json();
      if (Array.isArray(dataGames) && dataGames.length > 0) {
        const formattedGames = dataGames.map((item, index) => ({
          id: Number(item.ID) || index + 1,
          week: String(item.Semana || '2').trim(),
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
            setUserPicks(prev => ({ ...(found.picks || {}), ...prev }));
            if (found.locked) {
              setIsLockedByButton(true);
              localStorage.setItem('kiki_quiniela_locked', 'true');
            }
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
      setIsLockedByButton(false);
      localStorage.setItem('kiki_quiniela_locked', 'false');
      await syncUserToSheet(name, false, {});
    } else {
      const mergedPicks = { ...(existing.picks || {}), ...userPicks };
      setUserPicks(mergedPicks);
      const isUserLocked = existing.locked || false;
      setIsLockedByButton(isUserLocked);
      localStorage.setItem('kiki_quiniela_locked', isUserLocked ? 'true' : 'false');
      await syncUserToSheet(name, isUserLocked, mergedPicks);
    }
    fetchAllDataSilent();
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
    return false; // Desactivado por completo
  };

  const handlePick = async (gameId, team, gameDatetime) => {
    if (isLockedByButton) return;
    if (isDayLocked(gameDatetime)) return;

    setUserPicks(prevPicks => {
      const updatedPicks = { ...prevPicks, [gameId]: team };
      
      setUsers(users.map(u => u.name === currentUser ? { ...u, picks: updatedPicks } : u));
      syncUserToSheet(currentUser, isLockedByButton, updatedPicks);
      
      return updatedPicks;
    });
  };

  const lockAndSubmitPicks = async () => {
    if (Object.keys(userPicks).length === 0) return;
    setIsLockedByButton(true);
    localStorage.setItem('kiki_quiniela_locked', 'true');
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

  if (isLoadingInitial) {
    return (
