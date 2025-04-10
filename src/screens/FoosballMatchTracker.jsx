import { useState, useEffect } from "react";
import React from 'react'
// Main App Component
export default function FoosballMatchTracker() {
  const [match, setMatch] = useState({
    isActive: false,
    elapsedTime: 0,
    team1Score: 0,
    team2Score: 0,
    players: {
      team1: [
        { id: 1, name: "Player 1", position: "goalkeeper", scores: 0 },
        { id: 2, name: "Player 2", position: "striker", scores: 0 }
      ],
      team2: [
        { id: 3, name: "Player 3", position: "goalkeeper", scores: 0 },
        { id: 4, name: "Player 4", position: "striker", scores: 0 }
      ]
    }
  });
  
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Timer functions
  const startMatch = () => {
    if (!match.isActive) {
      setMatch({ ...match, isActive: true });
      const interval = setInterval(() => {
        setMatch(prevMatch => ({
          ...prevMatch,
          elapsedTime: prevMatch.elapsedTime + 1
        }));
      }, 1000);
      setTimerInterval(interval);
    }
  };
  
  const pauseMatch = () => {
    if (match.isActive) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setMatch({ ...match, isActive: false });
    }
  };
  
  const resetMatch = () => {
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
  };
  
  // Clean up interval on unmount
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
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center p-2 sm:p-8 w-full mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-3xl font-bold my-3 sm:mb-6 text-blue-700">Foosball Match Tracker</h1>
      
      {/* Match controls - responsive button layout */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 w-full">
        <button 
          onClick={startMatch} 
          disabled={match.isActive}
          className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded font-semibold disabled:bg-gray-400"
        >
          Start
        </button>
        <button 
          onClick={pauseMatch} 
          disabled={!match.isActive}
          className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-yellow-500 text-white rounded font-semibold disabled:bg-gray-400"
        >
          Pause
        </button>
        <button 
          onClick={resetMatch}
          className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded font-semibold"
        >
          Reset
        </button>
      </div>
      
      {/* Match timer and score - stack on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-4 sm:mb-8 p-2 sm:p-4 bg-white rounded-lg shadow">
        <div className="text-base sm:text-xl mb-2 sm:mb-0">
          <span className="font-bold">Timer:</span> {formatTime(match.elapsedTime)}
        </div>
        <div className="text-2xl font-bold mb-2 sm:mb-0">
          {match.team1Score} - {match.team2Score}
        </div>
        <div className="text-sm sm:text-xl">
          <span className={match.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {match.isActive ? "Match Active" : "Match Paused"}
          </span>
        </div>
      </div>
      
      {/* Foosball table visualization - responsive height */}
      <div className="relative w-full max-w-2xl h-64 sm:h-96 bg-green-700 rounded-lg border-4 sm:border-8 border-yellow-800 mb-4 sm:mb-8 overflow-hidden">
        {/* Table markings */}
        <div className="absolute top-0 left-1/2 w-2 sm:w-4 h-full -ml-1 sm:-ml-2 bg-white opacity-50"></div>
        <div className="absolute top-1/2 left-0 w-full h-2 sm:h-4 -mt-1 sm:-mt-2 bg-white opacity-50 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-10 sm:w-16 h-10 sm:h-16 -ml-5 sm:-ml-8 -mt-5 sm:-mt-8 bg-white opacity-50 rounded-full"></div>
        
        {/* Goal areas */}
        <div className="absolute top-1/2 left-0 w-6 sm:w-12 h-16 sm:h-24 -mt-8 sm:-mt-12 border-2 border-white opacity-70"></div>
        <div className="absolute top-1/2 right-0 w-6 sm:w-12 h-16 sm:h-24 -mt-8 sm:-mt-12 border-2 border-white opacity-70"></div>
        
        {/* Team 1 Players */}
        <div className="absolute top-1/4 left-8 sm:left-12 flex flex-col items-center">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer text-xs sm:text-base"
            onClick={() => handleScore(1, 1)}
          >
            <span className="text-white font-bold">GK</span>
          </div>
          <span className="text-white text-xs mt-1">{match.players.team1[0].scores}</span>
        </div>
        
        <div className="absolute top-2/3 left-1/4 flex flex-col items-center">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer text-xs sm:text-base"
            onClick={() => handleScore(1, 2)}
          >
            <span className="text-white font-bold">ST</span>
          </div>
          <span className="text-white text-xs mt-1">{match.players.team1[1].scores}</span>
        </div>
        
        {/* Team 2 Players */}
        <div className="absolute top-1/4 right-8 sm:right-12 flex flex-col items-center">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer text-xs sm:text-base"
            onClick={() => handleScore(2, 3)}
          >
            <span className="text-white font-bold">GK</span>
          </div>
          <span className="text-white text-xs mt-1">{match.players.team2[0].scores}</span>
        </div>
        
        <div className="absolute top-2/3 right-1/4 flex flex-col items-center">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer text-xs sm:text-base"
            onClick={() => handleScore(2, 4)}
          >
            <span className="text-white font-bold">ST</span>
          </div>
          <span className="text-white text-xs mt-1">{match.players.team2[1].scores}</span>
        </div>
        
        <div className="absolute bottom-2 sm:bottom-4 left-0 w-full text-center text-white text-xs sm:text-sm">
          Tap on a player to record a goal
        </div>
      </div>
      
      {/* Player Statistics - grid on desktop, stack on mobile */}
      <div className="w-full max-w-2xl">
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-center">Player Statistics</h2>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div className="bg-red-100 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-bold mb-2 text-red-800">Team 1</h3>
            <ul>
              {match.players.team1.map(player => (
                <li key={player.id} className="mb-2 flex justify-between text-sm sm:text-base">
                  <span>{player.name} ({player.position})</span>
                  <span className="font-bold">{player.scores} goals</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 sm:mt-4 pt-2 border-t border-red-300">
              <span className="font-bold text-sm sm:text-base">Total: {match.team1Score} goals</span>
            </div>
          </div>
          
          <div className="bg-blue-100 p-3 sm:p-4 rounded-lg mt-4 sm:mt-0">
            <h3 className="text-base sm:text-lg font-bold mb-2 text-blue-800">Team 2</h3>
            <ul>
              {match.players.team2.map(player => (
                <li key={player.id} className="mb-2 flex justify-between text-sm sm:text-base">
                  <span>{player.name} ({player.position})</span>
                  <span className="font-bold">{player.scores} goals</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 sm:mt-4 pt-2 border-t border-blue-300">
              <span className="font-bold text-sm sm:text-base">Total: {match.team2Score} goals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}