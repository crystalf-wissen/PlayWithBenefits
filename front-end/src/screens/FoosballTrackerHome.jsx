import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Clock, ChevronDown, ChevronUp, Plus } from 'lucide-react';

export default function FoosballTrackerHome() {
  // Initialize state with the provided sample data
  const [matches, setMatches] = useState([
    {
      id: 1,
      team1: "Alice & Bob",
      team2: "Charlie & Dana",
      score1: 10,
      score2: 7,
      date: "2025-04-09"
    }
  ]);
  
  const [newMatch, setNewMatch] = useState({
    team1: "",
    team2: "",
    score1: 0,
    score2: 0,
    date: new Date().toISOString().split('T')[0]
  });
  
  const [activePlayers, setActivePlayers] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showNewMatchForm, setShowNewMatchForm] = useState(false);
  const [activeTab, setActiveTab] = useState('matches');
  
  // Calculate stats whenever matches change
  useEffect(() => {
    const players = new Set();
    matches.forEach(match => {
      match.team1.split(' & ').forEach(player => players.add(player.trim()));
      match.team2.split(' & ').forEach(player => players.add(player.trim()));
    });
    setActivePlayers(Array.from(players));
  }, [matches]);
  
  // Add a new match
  const handleAddMatch = () => {
    if (!newMatch.team1 || !newMatch.team2) {
      alert("Please enter both team names");
      return;
    }
    
    const matchToAdd = {
      ...newMatch,
      id: matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1,
      date: newMatch.date || new Date().toISOString().split('T')[0]
    };
    
    setMatches([...matches, matchToAdd]);
    setNewMatch({
      team1: "",
      team2: "",
      score1: 0,
      score2: 0,
      date: new Date().toISOString().split('T')[0]
    });
    setShowNewMatchForm(false);
  };
  
  // Delete a match
  const handleDeleteMatch = (id) => {
    setMatches(matches.filter(match => match.id !== id));
  };
  
  // Sort matches
  const sortedMatches = [...matches].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    // For future sorting options
    return 0;
  });
  
  // Calculate player stats
  const playerStats = activePlayers.map(player => {
    const playerMatches = matches.filter(match => 
      match.team1.includes(player) || match.team2.includes(player)
    );
    
    const wins = playerMatches.filter(match => 
      (match.team1.includes(player) && match.score1 > match.score2) ||
      (match.team2.includes(player) && match.score2 > match.score1)
    ).length;
    
    return {
      name: player,
      matches: playerMatches.length,
      wins,
      winRate: playerMatches.length ? Math.round((wins / playerMatches.length) * 100) : 0
    };
  }).sort((a, b) => b.winRate - a.winRate);
  
  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="bg-blue-600 text-white p-6 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <Trophy className="mr-2" /> Foosball Tracker
            </h1>
            <div className="text-sm bg-blue-500 px-3 py-1 rounded-full">
              {matches.length} Matches Tracked
            </div>
          </div>
          
          <div className="flex mt-6 border-b border-blue-500">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'matches' ? 'border-b-2 border-white' : 'text-blue-200'}`}
              onClick={() => setActiveTab('matches')}
            >
              Matches
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'leaderboard' ? 'border-b-2 border-white' : 'text-blue-200'}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              Leaderboard
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'stats' ? 'border-b-2 border-white' : 'text-blue-200'}`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
          </div>
        </header>
        
        <main className="bg-white p-6 rounded-b-lg shadow-lg">
          {activeTab === 'matches' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Match History</h2>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
                  onClick={() => setShowNewMatchForm(!showNewMatchForm)}
                >
                  <Plus size={18} className="mr-1" />
                  Add Match
                </button>
              </div>
              
              {showNewMatchForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                  <h3 className="text-lg font-medium mb-3">New Match</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team 1</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g. Alice & Bob"
                        value={newMatch.team1}
                        onChange={(e) => setNewMatch({...newMatch, team1: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team 2</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g. Charlie & Dana"
                        value={newMatch.team2}
                        onChange={(e) => setNewMatch({...newMatch, team2: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Score Team 1</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newMatch.score1}
                        onChange={(e) => setNewMatch({...newMatch, score1: parseInt(e.target.value)})}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Score Team 2</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newMatch.score2}
                        onChange={(e) => setNewMatch({...newMatch, score2: parseInt(e.target.value)})}
                        min="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newMatch.date}
                        onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button 
                      className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
                      onClick={() => setShowNewMatchForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      onClick={handleAddMatch}
                    >
                      Save Match
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teams
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('date')}
                      >
                        <div className="flex items-center">
                          Date
                          {sortField === 'date' && (
                            sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedMatches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900 flex items-center">
                            <Users size={16} className="mr-2 text-gray-500" />
                            <div>
                              <div className={match.score1 > match.score2 ? "font-bold" : ""}>{match.team1}</div>
                              <div className="text-sm text-gray-500">vs</div>
                              <div className={match.score2 > match.score1 ? "font-bold" : ""}>{match.team2}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-center bg-gray-100 rounded-lg py-2 px-3 inline-block">
                            <span className={`text-lg ${match.score1 > match.score2 ? "font-bold text-green-600" : ""}`}>{match.score1}</span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className={`text-lg ${match.score2 > match.score1 ? "font-bold text-green-600" : ""}`}>{match.score2}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {match.date}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteMatch(match.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {matches.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                          No matches recorded yet. Add your first match!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === 'leaderboard' && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Player Leaderboard</h2>
              
              {playerStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playerStats.map((player, index) => (
                    <div key={player.name} className="bg-white border rounded-lg shadow p-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg">{player.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>{player.matches} matches</span>
                          <span>{player.wins} wins</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{player.winRate}%</div>
                        <div className="text-xs text-gray-500">Win Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                  No player stats available yet. Add some matches first!
                </div>
              )}
            </>
          )}
          
          {activeTab === 'stats' && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Game Statistics</h2>
              
              {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-blue-800 font-medium mb-2">Total Matches</h3>
                    <p className="text-3xl font-bold">{matches.length}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-green-800 font-medium mb-2">Total Players</h3>
                    <p className="text-3xl font-bold">{activePlayers.length}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-purple-800 font-medium mb-2">Average Score</h3>
                    <p className="text-3xl font-bold">
                      {(matches.reduce((sum, match) => sum + match.score1 + match.score2, 0) / (matches.length * 2)).toFixed(1)}
                    </p>
                  </div>
                  
                  <div className="md:col-span-3 bg-white border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      {sortedMatches.slice(0, 5).map(match => (
                        <div key={match.id} className="flex items-center border-b border-gray-100 pb-2">
                          <div className="text-gray-400 mr-3">
                            <Clock size={16} />
                          </div>
                          <div className="flex-grow">
                            <span className="font-medium">{match.team1}</span>
                            <span className="mx-1 text-gray-500">vs</span>
                            <span className="font-medium">{match.team2}</span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-gray-500">{match.score1} - {match.score2}</span>
                          </div>
                          <div className="text-sm text-gray-500">{match.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                  No statistics available yet. Add some matches first!
                </div>
              )}
            </>
          )}
        </main>
        
        <footer className="mt-6 text-center text-gray-500 text-sm">
          <p>Foosball Score Tracker © 2025</p>
        </footer>
      </div>
    </div>
  );
}