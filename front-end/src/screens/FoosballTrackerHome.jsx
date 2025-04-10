import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

export default function FoosballLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filterOption, setFilterOption] = useState('winRate');
  const [activeTab, setActiveTab] = useState('leaderboard');

  const [matchHistory, setMatchHistory] = useState([]);



  useEffect(() => {
    axios.get("https://aca3-125-18-187-66.ngrok-free.app/allMatches",{
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
    .then(response => {
      const formattedMatches = response.data.map(match => ({
        id: match.id,
        date: "2023-04-09", 
        team1: match.teams
          .filter(team => team.teamSide === "team1")
          .map(team => team.name),
        team2: match.teams
          .filter(team => team.teamSide === "team2")
          .map(team => team.name),
        score: [match.team1Score, match.team2Score],
        winner: match.team1Score > match.team2Score ? "Team 1" : "Team 2",
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        teams: match.teams
      }));
      setMatchHistory(formattedMatches);
    })
    .catch(error => {
      console.error("Error fetching match history", error);
    });
}, []);

  const sortLeaderboard = (option) => {
    const sorted = [...leaderboardData].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b[option] - a[option];
      }
    });
    setLeaderboardData(sorted);
  };

  useEffect(() => {
    sortLeaderboard(filterOption);
  }, [filterOption]);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setActiveTab('playerDetails');
  };

  const getPlayerMatchHistory = (playerName) => {
    return matchHistory.filter(match => 
      match.team1.includes(playerName) || match.team2.includes(playerName)
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWinLossColor = (player, match) => {
    const isTeam1 = match.team1.includes(player);
    const isWinner = (isTeam1 && match.winner === "Team 1") || (!isTeam1 && match.winner === "Team 2");
    return isWinner ? "text-green-500" : "text-red-500";
  };

  const backToLeaderboard = () => {
    setActiveTab('leaderboard');
    setSelectedPlayer(null);
  };

  // Render form streak indicators
  const renderFormStreak = (matches) => {
    return (
      <div className="flex space-x-1">
        {matches.map((result, index) => (
          <div 
            key={index} 
            className={`w-2 h-4 rounded-sm ${result ? 'bg-green-500' : 'bg-red-500'}`} 
            title={result ? 'Win' : 'Loss'}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto bg-gray-900 min-h-screen text-white p-4">
      {/* Header with app name and logo */}
      <header className="w-full bg-gradient-to-r from-blue-800 to-blue-600 p-4 shadow-lg mb-6 rounded-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM10 2a8 8 0 100 16 8 8 0 000-16z" fillRule="evenodd" clipRule="evenodd"></path>
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">PRO FOOSBALL LEAGUE</h1>
          </div>
          <div className="hidden sm:block">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">STATISTICS</span>
          </div>
          
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto">
        {/* Tab navigation */}
        <div className="flex mb-6">
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 px-4 font-semibold text-center rounded-tl-lg rounded-bl-lg ${activeTab === 'leaderboard' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
              </svg>
              Leaderboard
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 font-semibold text-center ${activeTab === 'history' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              Match History
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('teamStats')}
            className={`flex-1 py-3 px-4 font-semibold text-center rounded-tr-lg rounded-br-lg ${activeTab === 'teamStats' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              Team Stats
            </div>
          </button>
        </div>

        {/* Leaderboard View */}
        {activeTab === 'leaderboard' && !selectedPlayer && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                  PLAYER LEADERBOARD
                </h2>
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-gray-300 text-sm">Sort by:</label>
                  <select 
                    id="sort"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm"
                  >
                    <option value="winRate">Win Rate</option>
                    <option value="wins">Wins</option>
                    <option value="goals">Goals</option>
                    <option value="matches">Matches</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-gray-300 text-sm border-b border-gray-600">
                    <th className="py-3 px-4 text-left">RANK</th>
                    <th className="py-3 px-4 text-left">PLAYER</th>
                    <th className="py-3 px-4 text-center">MATCHES</th>
                    <th className="py-3 px-4 text-center">WIN/LOSS</th>
                    <th className="py-3 px-4 text-center">GOALS</th>
                    <th className="py-3 px-4 text-center">WIN RATE</th>
                    <th className="py-3 px-4 text-center">FORM</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((player, index) => (
                    <tr 
                      key={player.id} 
                      className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => handlePlayerClick(player)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-800 font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center font-bold shadow-lg">
                            {player.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="font-bold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">Best with: {player.bestPartner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-medium">{player.matches}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-green-500 font-medium">{player.wins}</span>
                        <span className="mx-1">/</span>
                        <span className="text-red-500 font-medium">{player.losses}</span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium">{player.goals}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-600 h-2 rounded-full mr-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" 
                              style={{ width: `${player.winRate}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{player.winRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {renderFormStreak(player.recentMatches)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Player Details View */}
        {activeTab === 'playerDetails' && selectedPlayer && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4">
              <div className="flex items-center">
                <button 
                  onClick={backToLeaderboard}
                  className="mr-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-2xl shadow-lg">
                    {selectedPlayer.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                    <div className="text-gray-300">Rank #{leaderboardData.findIndex(p => p.id === selectedPlayer.id) + 1}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Player Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                  <div className="text-gray-400 text-sm mb-1">Win Rate</div>
                  <div className="text-3xl font-bold text-white">{selectedPlayer.winRate}%</div>
                  <div className="w-full bg-gray-600 h-2 rounded-full mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" 
                      style={{ width: `${selectedPlayer.winRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                  <div className="text-gray-400 text-sm mb-1">Match Record</div>
                  <div className="text-3xl font-bold text-white">
                    <span className="text-green-500">{selectedPlayer.wins}</span>
                    <span className="text-gray-400 text-2xl mx-2">-</span>
                    <span className="text-red-500">{selectedPlayer.losses}</span>
                  </div>
                  <div className="flex mt-2 text-sm text-gray-400">
                    <div className="flex-1">
                      <div>Wins</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div>Losses</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                  <div className="text-gray-400 text-sm mb-1">Goals Scored</div>
                  <div className="text-3xl font-bold text-white">{selectedPlayer.goals}</div>
                  <div className="text-sm text-gray-400 mt-2">
                    Avg per match: {(selectedPlayer.goals / selectedPlayer.matches).toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Recent Form */}
              <div className="bg-gray-700 rounded-lg p-4 shadow-md mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  Recent Form
                </h3>
                
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex space-x-2">
                      {selectedPlayer.recentMatches.map((result, index) => (
                        <div 
                          key={index} 
                          className={`w-full h-12 flex items-center justify-center rounded ${result ? 'bg-green-600' : 'bg-red-600'}`}
                        >
                          <span className="font-bold">{result ? 'W' : 'L'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-1">
                      {selectedPlayer.recentMatches.map((_, index) => (
                        <div key={index} className="w-full text-center text-xs text-gray-400">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Player Match History */}
              <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-600 px-4 py-3">
                  <h3 className="text-lg font-bold flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    Recent Matches
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-600 text-gray-300 text-sm">
                        <th className="py-2 px-4 text-left">DATE</th>
                        <th className="py-2 px-4 text-left">TEAMS</th>
                        <th className="py-2 px-4 text-center">SCORE</th>
                        <th className="py-2 px-4 text-right">RESULT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPlayerMatchHistory(selectedPlayer.name).map((match) => (
                        <tr key={match.id} className="border-t border-gray-600">
                          <td className="py-3 px-4 text-sm">
                            {formatDate(match.date)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                                <span className={match.team1.includes(selectedPlayer.name) ? "font-bold" : ""}>
                                  {match.team1.join(" & ")}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                                <span className={match.team2.includes(selectedPlayer.name) ? "font-bold" : ""}>
                                  {match.team2.join(" & ")}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold">
                            {match.score[0]} - {match.score[1]}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={getWinLossColor(selectedPlayer.name, match)}>
                              {(match.team1.includes(selectedPlayer.name) && match.winner === "Team 1") || 
                               (match.team2.includes(selectedPlayer.name) && match.winner === "Team 2") 
                                ? "WIN" : "LOSS"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match History View */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
                MATCH HISTORY
              </h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {matchHistory.map((match) => (
                  <div key={match.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-gray-600 px-4 py-2 flex justify-between items-center">
                      <div className="text-gray-300 text-sm">
                        Match #{match.id} • {formatDate(match.date)}
                      </div>
                      <div className="text-sm">
                        <span className="px-2 py-1 bg-blue-800 rounded-full text-xs font-medium">
                          {match.winner === "Team 1" ? "RED WINS" : "BLUE WINS"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Team 1 */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                            <span className="text-sm font-bold">RED</span>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{match.team1.join(" & ")}</div>
                            <div className={`text-3xl font-bold ${match.winner === "Team 1" ? "text-green-400" : "text-white"}`}>
                              {match.score[0]}
                            </div>
                          </div>
                        </div>
                        
                        {/* VS */}
                        <div className="text-gray-400">VS</div>
                        
                        {/* Team 2 */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                            <span className="text-sm font-bold">BLUE</span>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{match.team2.join(" & ")}</div>
                            <div className={`text-3xl font-bold ${match.winner === "Team 2" ? "text-green-400" : "text-white"}`}>
                              {match.score[1]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Stats View */}
        {activeTab === 'teamStats' && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
            <h2 className="text-xl font-bold text-white flex items-center">
  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
  </svg>
  TEAM STATS
</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Duos Card */}
                <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-600 px-4 py-3">
                    <h3 className="font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                      </svg>
                      Top Duos
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold z-10">C</div>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">S</div>
                          </div>
                          <div className="ml-3">
                            <div className="font-bold">Crystal & Sanat</div>
                            <div className="text-sm text-gray-400">10 matches together</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-500">80%</div>
                          <div className="text-sm text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold z-10">K</div>
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold">J</div>
                          </div>
                          <div className="ml-3">
                            <div className="font-bold">Karan & Jonathan</div>
                            <div className="text-sm text-gray-400">8 matches together</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-500">75%</div>
                          <div className="text-sm text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold z-10">J</div>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">S</div>
                          </div>
                          <div className="ml-3">
                            <div className="font-bold">Jonathan & Sanat</div>
                            <div className="text-sm text-gray-400">6 matches together</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-500">67%</div>
                          <div className="text-sm text-gray-400">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Best Team Combinations */}
                <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-600 px-4 py-3">
                    <h3 className="font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"></path>
                      </svg>
                      Team Chemistry
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Crystal plays best with</h4>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">S</div>
                          <div className="ml-3">
                            <div className="font-bold">Sanat</div>
                            <div className="flex items-center mt-1">
                              <div className="w-24 bg-gray-600 h-2 rounded-full mr-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                              </div>
                              <span className="text-sm">80%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Sanat plays best with</h4>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold">C</div>
                          <div className="ml-3">
                            <div className="font-bold">Crystal</div>
                            <div className="flex items-center mt-1">
                              <div className="w-24 bg-gray-600 h-2 rounded-full mr-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                              </div>
                              <span className="text-sm">80%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Karan plays best with</h4>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold">J</div>
                          <div className="ml-3">
                            <div className="font-bold">Jonathan</div>
                            <div className="flex items-center mt-1">
                              <div className="w-24 bg-gray-600 h-2 rounded-full mr-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm">75%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Team Performance Chart */}
                <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden md:col-span-2">
                  <div className="bg-gray-600 px-4 py-3">
                    <h3 className="font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Team Performance
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-gray-800 rounded p-3 text-center">
                        <div className="text-3xl font-bold text-yellow-500">
                          <div className="w-10 h-10 mx-auto rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black">C</div>
                        </div>
                        <div className="mt-2 font-bold">Crystal</div>
                        <div className="text-sm text-gray-400">64.28% win rate</div>
                      </div>
                      
                      <div className="bg-gray-800 rounded p-3 text-center">
                        <div className="text-3xl font-bold text-blue-500">
                          <div className="w-10 h-10 mx-auto rounded-full bg-blue-500 flex items-center justify-center font-bold text-black">S</div>
                        </div>
                        <div className="mt-2 font-bold">Sanat</div>
                        <div className="text-sm text-gray-400">68.75% win rate</div>
                      </div>
                      
                      <div className="bg-gray-800 rounded p-3 text-center">
                        <div className="text-3xl font-bold text-green-500">
                          <div className="w-10 h-10 mx-auto rounded-full bg-green-500 flex items-center justify-center font-bold text-black">K</div>
                        </div>
                        <div className="mt-2 font-bold">Karan</div>
                        <div className="text-sm text-gray-400">56.00% win rate</div>
                      </div>
                      
                      <div className="bg-gray-800 rounded p-3 text-center">
                        <div className="text-3xl font-bold text-purple-500">
                          <div className="w-10 h-10 mx-auto rounded-full bg-purple-500 flex items-center justify-center font-bold text-black">J</div>
                        </div>
                        <div className="mt-2 font-bold">Jonathan</div>
                        <div className="text-sm text-gray-400">56.67% win rate</div>
                      </div>
                      
                      <div className="bg-gray-800 rounded p-3 text-center">
                        <div className="text-3xl font-bold text-red-500">
                          <div className="w-10 h-10 mx-auto rounded-full bg-red-500 flex items-center justify-center font-bold text-black">M</div>
                        </div>
                        <div className="mt-2 font-bold">Madhav</div>
                        <div className="text-sm text-gray-400">50.00% win rate</div>
                      </div>
                    </div>
                    
                    {/* Simple chart placeholder */}
                    <div className="mt-6 bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <div>Player Performance Over Time</div>
                        <div>Last 10 matches</div>
                      </div>
                      <div className="h-40 flex items-end space-x-2">
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-yellow-500 opacity-70 rounded-t" style={{ height: '65%' }}></div>
                          <div className="mt-1 text-xs">Crystal</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-blue-500 opacity-70 rounded-t" style={{ height: '70%' }}></div>
                          <div className="mt-1 text-xs">Sanat</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-green-500 opacity-70 rounded-t" style={{ height: '55%' }}></div>
                          <div className="mt-1 text-xs">Karan</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-purple-500 opacity-70 rounded-t" style={{ height: '57%' }}></div>
                          <div className="mt-1 text-xs">Jonathan</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-red-500 opacity-70 rounded-t" style={{ height: '50%' }}></div>
                          <div className="mt-1 text-xs">Madhav</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="w-full bg-gray-900 p-4 text-center text-gray-500 text-sm">
        <p>&copy; 2023 PRO FOOSBALL LEAGUE. All rights reserved.</p>
        <p>Designed by Wissen Guys</p>
      </footer>
    </div>
  );
}