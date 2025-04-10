import { useState, useEffect } from "react";
import React from 'react'
import axios from "axios";
export default function FoosballMatchTracker() {
  const [availablePlayers, setAvailablePlayers] = useState([
    "Crystal",
    "Sanat",
    "Karan",
    "Jonathan",
    "Madhav"
  ]);

  const [match, setMatch] = useState({
    isActive: false,
    elapsedTime: 0,
    team1Score: 0,
    team2Score: 0,
    players: {
      team1: [
        { id: 1, name: "Player 1", position: "Goalkeeper", scores: 0 },
        { id: 2, name: "Player 2", position: "Striker", scores: 0 }
      ],
      team2: [
        { id: 3, name: "Player 3", position: "Goalkeeper", scores: 0 },
        { id: 4, name: "Player 4", position: "Striker", scores: 0 }
      ]
    }
  });
  
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Timer functions
  const startMatch = () => {
    if (!match.isActive) {
      setMatch(prevMatch => ({ ...prevMatch, isActive: true }));
      const interval = setInterval(() => {
        setMatch(prevMatch => ({
          ...prevMatch,
          elapsedTime: prevMatch.elapsedTime + 1
        }));
      }, 1000);
      setTimerInterval(interval);
    }
  };
    
  const resetMatch = () => {
    if (match.isActive) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setMatch({
        ...match,
        isActive: false,
        elapsedTime: 0,
        team1Score: 0,
        team2Score: 0,
        players: {
          team1: match.players.team1.map(p => ({ ...p, scores: 0 })),
          team2: match.players.team2.map(p => ({ ...p, scores: 0 }))
        }
      });
    }
  };
  
  const endMatch = () => {
    if (match.isActive) {
      clearInterval(timerInterval); 
      setTimerInterval(null);
      setMatch(prevMatch => ({ ...prevMatch, isActive: false }));
    }
    console.log(match);
    axios.post("https://aca3-125-18-187-66.ngrok-free.app/submit", match)
      .then(response => console.log("Match data sent successfully", response.data))
      .catch(error => console.error("Error sending match data", error));
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  // Score tracking function
  const handleScore = (teamId, playerId) => {
    const updatedMatch = { ...match };
    const team = teamId === 1 ? "team1" : "team2";
    const playerIndex = updatedMatch.players[team].findIndex(p => p.id === playerId);
    
    if (playerIndex !== -1) {
      // Update player score
      updatedMatch.players[team][playerIndex].scores += 1;
      
      // Update team score
      if (team === "team1") {
        updatedMatch.team1Score += 1;
      } else {
        updatedMatch.team2Score += 1;
      }
      
      setMatch(updatedMatch);
    }
  };

  const handlePlayerChange = (teamId, playerId, newName) => {
    const updatedMatch = { ...match };
    const team = teamId === 1 ? "team1" : "team2";
    const playerIndex = updatedMatch.players[team].findIndex(p => p.id === playerId);

    if (playerIndex !== -1) {
      updatedMatch.players[team][playerIndex].name = newName;
      setMatch(updatedMatch);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center w-full mx-auto bg-gray-900 min-h-screen text-white p-4">
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
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">LIVE MATCH</span>
          </div>
          
        </div>
      </header>
      
      <main className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-600">
            <h2 className="text-center font-bold text-lg text-yellow-400">OFFICIAL MATCH</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between p-4">
            {/* Team 1 */}
            <div className="flex flex-col items-center sm:items-end sm:w-2/5 mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-2xl font-bold">RED</span>
              </div>
              <h3 className="text-xl font-bold">RED TEAM</h3>
              <div className="text-sm text-gray-300 mt-1">
                {match.players.team1[0].name} • {match.players.team1[1].name}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center sm:w-1/5">
              <div className={`text-5xl font-extrabold mb-2 ${match.isActive ? "animate-pulse text-white" : "text-gray-400"}`}>
                {match.team1Score} - {match.team2Score}
              </div>
              <div className="px-4 py-2 bg-black bg-opacity-50 rounded-lg text-center">
                <div className="text-sm text-gray-400">MATCH TIME</div>
                <div className="text-xl font-mono">{formatTime(match.elapsedTime)}</div>
              </div>
              <div className="mt-2">
                {match.isActive ? (
                  <span className="inline-flex items-center bg-green-800 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-green-400 font-medium text-sm">LIVE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-red-900 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-red-400 font-medium text-sm">INACTIVE</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-start sm:w-2/5">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-2xl font-bold">BLUE</span>
              </div>
              <h3 className="text-xl font-bold">BLUE TEAM</h3>
              <div className="text-sm text-gray-300 mt-1">
                {match.players.team2[0].name} • {match.players.team2[1].name}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={startMatch} 
            disabled={match.isActive}
            className="px-4 py-2 text-base bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            KICK OFF
          </button>
          <button 
            onClick={resetMatch}
            className="px-4 py-2 text-base bg-red-600 text-white rounded-lg font-semibold shadow-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            RESET
          </button>
          <button 
            onClick={endMatch}
            className="px-4 py-2 text-base bg-yellow-500 text-black rounded-lg font-semibold shadow-lg hover:bg-yellow-600 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            FULL TIME
          </button>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto h-72 sm:h-96 bg-gradient-to-r from-green-800 to-green-700 rounded-lg border-8 border-yellow-700 mb-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 w-full h-8 bg-white"></div>
            <div className="absolute bottom-0 w-full h-8 bg-white"></div>
            <div className="absolute left-0 w-8 h-full bg-white"></div>
            <div className="absolute right-0 w-8 h-full bg-white"></div>
          </div>
          
          <div className="absolute top-0 left-1/2 w-2 sm:w-3 h-full -ml-1 sm:-ml-1.5 bg-white opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 w-12 sm:w-20 h-12 sm:h-20 -ml-6 sm:-ml-10 -mt-6 sm:-mt-10 border-4 border-white opacity-60 rounded-full"></div>
          
          <div className="absolute top-1/2 left-0 w-8 sm:w-16 h-24 sm:h-32 -mt-12 sm:-mt-16 border-2 border-white opacity-70 flex items-center justify-center">
            <div className="h-16 w-2 bg-white opacity-50"></div>
          </div>
          <div className="absolute top-1/2 right-0 w-8 sm:w-16 h-24 sm:h-32 -mt-12 sm:-mt-16 border-2 border-white opacity-70 flex items-center justify-center">
            <div className="h-16 w-2 bg-white opacity-50"></div>
          </div>
          
          <div className="absolute top-1/2 left-8 sm:left-16 w-16 sm:w-24 h-40 sm:h-48 -mt-20 sm:-mt-24 border-2 border-white opacity-30 rounded-l-lg"></div>
          <div className="absolute top-1/2 right-8 sm:right-16 w-16 sm:w-24 h-40 sm:h-48 -mt-20 sm:-mt-24 border-2 border-white opacity-30 rounded-r-lg"></div>
          
          <div className="absolute top-1/4 left-12 sm:left-24 flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full mb-1">
              <span className="text-white text-xs font-bold">{match.players.team1[0].name}</span>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg"
              onClick={() => handleScore(1, 1)}
            >
              <span className="text-white font-bold">GK</span>
            </div>
            <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
              <span className="text-yellow-400 text-xs font-bold">{match.players.team1[0].scores} goals</span>
            </div>
          </div>
          
          <div className="absolute top-2/3 left-1/3 flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full mb-1">
              <span className="text-white text-xs font-bold">{match.players.team1[1].name}</span>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg"
              onClick={() => handleScore(1, 2)}
            >
              <span className="text-white font-bold">ST</span>
            </div>
            <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
              <span className="text-yellow-400 text-xs font-bold">{match.players.team1[1].scores} goals</span>
            </div>
          </div>
          
          <div className="absolute top-1/4 right-12 sm:right-24 flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full mb-1">
              <span className="text-white text-xs font-bold">{match.players.team2[0].name}</span>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg"
              onClick={() => handleScore(2, 3)}
            >
              <span className="text-white font-bold">GK</span>
            </div>
            <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
              <span className="text-yellow-400 text-xs font-bold">{match.players.team2[0].scores} goals</span>
            </div>
          </div>
          
          <div className="absolute top-2/3 right-1/3 flex flex-col items-center transform hover:scale-110 transition-transform">
            <div className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full mb-1">
              <span className="text-white text-xs font-bold">{match.players.team2[1].name}</span>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg"
              onClick={() => handleScore(2, 4)}
            >
              <span className="text-white font-bold">ST</span>
            </div>
            <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
              <span className="text-yellow-400 text-xs font-bold">{match.players.team2[1].scores} goals</span>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-white rounded-full shadow-lg"></div>
          
      
        </div>
        
        <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-3">
            <h2 className="text-lg font-bold text-center text-white flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              MATCH STATISTICS
            </h2>
          </div>
          
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-400 font-bold">{match.team1Score}</span>
                <span className="text-gray-400 text-sm">Goals</span>
                <span className="text-blue-400 font-bold">{match.team2Score}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-red-400 h-2"
                    style={{ width: `${match.team1Score ? (match.team1Score / (match.team1Score + match.team2Score) * 100) : 50}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-400 font-bold">{match.players.team1.reduce((sum, player) => sum + player.scores, 0)}</span>
                <span className="text-gray-400 text-sm">Shots on Target</span>
                <span className="text-blue-400 font-bold">{match.players.team2.reduce((sum, player) => sum + player.scores, 0)}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-red-400 h-2"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Team 1 */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-red-800 to-red-600 p-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-2 border border-white">
                  <span className="text-xs text-white font-bold">1</span>
                </div>
                RED TEAM PLAYERS
              </h3>
            </div>
            
            <div className="p-4">
              {match.players.team1.map(player => (
                <div key={player.id} className="mb-3 bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3 shadow">
                      <span className="text-white font-bold text-sm">{player.position === "Goalkeeper" ? "GK" : "ST"}</span>
                    </div>
                    <div className="flex-1">
                      <select
                        value={player.name}
                        onChange={(e) => handlePlayerChange(1, player.id, e.target.value)}
                        className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white text-sm"
                      >
                        <option value="">Select Player</option>
                        {availablePlayers
                          .filter(playerName => {
                            return !match.players.team1.some(p => p.name === playerName && p.id !== player.id) &&
                                  !match.players.team2.some(p => p.name === playerName);
                          })
                          .map(playerName => (
                            <option key={playerName} value={playerName}>{playerName}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">Goals Scored</div>
                      <div className="flex items-center">
                        <div className="text-lg font-bold mr-2">{player.scores}</div>
                        <div className="w-full bg-gray-600 h-2 rounded-full">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${player.scores * 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between items-center">
                <div className="text-gray-300">Total Goals</div>
                <div className="text-2xl font-bold text-red-400">{match.team1Score}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2 border border-white">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
                BLUE TEAM PLAYERS
              </h3>
            </div>
            
            <div className="p-4">
              {match.players.team2.map(player => (
                <div key={player.id} className="mb-3 bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3 shadow">
                      <span className="text-white font-bold text-sm">{player.position === "Goalkeeper" ? "GK" : "ST"}</span>
                    </div>
                    <div className="flex-1">
                      <select
                        value={player.name}
                        onChange={(e) => handlePlayerChange(2, player.id, e.target.value)}
                        className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white text-sm"
                      >
                        <option value="">Select Player</option>
                        {availablePlayers
                          .filter(playerName => {
                            return !match.players.team1.some(p => p.name === playerName) &&
                                  !match.players.team2.some(p => p.name === playerName && p.id !== player.id);
                          })
                          .map(playerName => (
                            <option key={playerName} value={playerName}>{playerName}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">Goals Scored</div>
                      <div className="flex items-center">
                        <div className="text-lg font-bold mr-2">{player.scores}</div>
                        <div className="w-full bg-gray-600 h-2 rounded-full">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${player.scores * 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between items-center">
                <div className="text-gray-300">Total Goals</div>
                <div className="text-2xl font-bold text-blue-400">{match.team2Score}</div>
              </div>
            </div>
          </div>
        </div>
        </main>
      <footer className="w-full bg-gray-900 p-4 text-center text-gray-500 text-sm">
        <p>&copy; 2023 PRO FOOSBALL LEAGUE. All rights reserved.</p>
        <p>Designed by Wissen Guys</p>
      </footer>
    </div>
  );
}