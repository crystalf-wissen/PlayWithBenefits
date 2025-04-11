import { useState, useEffect } from "react";
import React from 'react'
import axios from "axios";
import { IoFootball } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import Confetti from 'react-confetti';
import {toast, ToastContainer} from 'react-toastify';

export default function FoosballMatchTracker() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [playersSelected, setPlayersSelected] = useState(false);
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
        { id: 1, name: "", position: "Goalkeeper", scores: 0 },
        { id: 2, name: "", position: "Striker", scores: 0 }
      ],
      team2: [
        { id: 3, name: "", position: "Goalkeeper", scores: 0 },
        { id: 4, name: "", position: "Striker", scores: 0 }
      ]
    }
  });
  const allPlayersSelected = match.players.team1.every(player => player.name !== "") &&
                           match.players.team2.every(player => player.name !== "");
  const [timerInterval, setTimerInterval] = useState(null);
 
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
 
  const endMatch = (updatedMatch) => {
    if (match.isActive) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setMatch(prevMatch => ({ ...prevMatch, isActive: false }));
    }
 
    const winner =
      updatedMatch.team1Score > updatedMatch.team2Score
        ? "Red Team"
        : "Blue Team";
 
    const toastColor = winner === "Red Team" ? "toast-red" : "toast-blue";
    const toastPosition = winner === "Red Team" ? "top-left" : "top-right";
 
    toast(`${winner} wins the match!`, {
      position: toastPosition,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: toastColor,
    });
 
    // Send match data to the backend
    axios.post("https://aca3-125-18-187-66.ngrok-free.app/submit", updatedMatch)
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
      if ((team === "team1" && updatedMatch.team1Score < 10) || (team === "team2" && updatedMatch.team2Score < 10)) {
        updatedMatch.players[team][playerIndex].scores += 1;
 
        // Update team score
        if (team === "team1") {
          updatedMatch.team1Score += 1;
        } else {
          updatedMatch.team2Score += 1;
        }
 
        setMatch(updatedMatch);
 
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
 
        if (updatedMatch.team1Score === 10 || updatedMatch.team2Score === 10) {
          endMatch(updatedMatch);
        }
      }
    }
  };
 
  const handlePlayerChange = (teamId, playerId, newName) => {
    const updatedMatch = { ...match };
    const team = teamId === 1 ? "team1" : "team2";
    const playerIndex = updatedMatch.players[team].findIndex(p => p.id === playerId);
 
    if (playerIndex !== -1) {
      updatedMatch.players[team][playerIndex].name = newName;
      setMatch(updatedMatch);
      const allSelected = updatedMatch.players.team1.every(player => player.name !== "") &&
      updatedMatch.players.team2.every(player => player.name !== "");
      setPlayersSelected(allSelected);
    }
  };
 
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
 
  
  return (
    <div className="flex flex-col items-center w-full mx-auto bg-[#030712] min-h-screen text-white p-4 lg:px-20">
      <ToastContainer/>
      <header className="w-full bg-[#10141e] p-4 border border-[#282c35] mb-6 rounded-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3  rounded-full p-1 w-10 h-10 flex items-center justify-center">
              <IoFootball  size={32} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl  font-bold text-white">PRO <span className="text-[#00bcff]">FOOSBALL </span> LEAGUE</h1>
              <h3 className="text-xs flex justify-start text-[#8b9eaf]">The Ultimate Battleground</h3>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="bg-[#00bcff]  flex space-x-2 px-3 py-1 rounded-full font-bold text-sm">
              <div className="flex items-center text-[#e94a4d] animate-pulse">
                <FaCircle size={9} />
              </div>
              <div className="text-white">   
                LIVE MATCH
              </div>
            </div>
          </div>
          
        </div>
      </header>
      
      <main className="w-full max-w-6xl mx-auto ">
        <div className="bg-[#10141e] rounded-xl mb-6 overflow-hidden border border-[#282c35]">
          <div className="p-4 border-b border-[#808a8f] mx-6">
            <h2 className="text-center font-bold text-lg text-[#00bcff]">OFFICIAL MATCH</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between p-4">
            {/* Team 1 */}
            <div className="flex flex-col items-center sm:items-end sm:w-2/5 mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-[#ff6161] rounded-full flex items-center justify-center mb-2 ">
                <span className="text-xl font-bold">RED</span>
              </div>
              <h3 className="text-xl font-bold">RED TEAM</h3>
              <div className="text-sm text-[#c6c7c9] ">
                {match.players.team1[0].name} • {match.players.team1[1].name}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center sm:w-1/5">
              <div className={`text-5xl font-extrabold mb-2 ${match.isActive ? "animate-pulse text-white" : "text-[#c6c7c9]"}`}>
                {match.team1Score} - {match.team2Score}
              </div>
              <div className="px-4 py-2 bg-[#1c2029] bg-opacity-50 rounded-lg text-center">
                <div className="text-sm text-gray-400">MATCH TIME</div>
                <div className="text-xl font-mono">{formatTime(match.elapsedTime)}</div>
              </div>
              <div className="mt-2">
                {match.isActive ? (
                  <span className="inline-flex items-center bg-green-800 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-[#00dc82] rounded-full mr-2 animate-pulse"></span>
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
            
            <div className="flex flex-col items-center mt-3 sm:mt-0 sm:items-start sm:w-2/5">
              <div className="w-16 h-16 bg-[#00bcff] rounded-full flex items-center justify-center mb-2 ">
                <span className="text-xl font-bold">BLUE</span>
              </div>
              <h3 className="text-xl font-bold">BLUE TEAM</h3>
              <div className="text-sm  text-[#c6c7c9]">
                {match.players.team2[0].name} • {match.players.team2[1].name}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={startMatch} 
            disabled={!playersSelected || match.isActive}
            className="px-4 py-2 text-sm bg-[#00dc82] text-white rounded-lg  font-semibold  hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <div className="">
              <FaPlay />
            </div>
            <div className="">
              KICK OFF
            </div>
          </button>
          <button 
            onClick={resetMatch}
            className="px-4 py-2 text-base bg-[#ff6161] text-white rounded-lg font-semibold  hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            RESET
          </button>
          <button 
            onClick={endMatch}
            className="px-4 py-2 text-base bg-[#ecd67e] text-black rounded-lg font-semibold  hover:bg-yellow-200 transition-colors flex items-center space-x-2"
          >
           <div className="">
              <FaSquare/>
            </div>
            <div className="">
              FULL TIME
            </div>
          </button>
        </div>
        {match.isActive && (
          <div className="relative w-full  mx-auto h-72 sm:h-96 bg-gradient-to-r from-green-800 to-green-700 rounded-2xl border-3 mb-8 overflow-hidden ">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} initialVelocityY={{min: 5, max: 20}}/>}
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
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white "
                onClick={() => handleScore(1, 1)}
              >
                <span className="text-white font-bold">GK</span>
              </div>
              <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
                <span className="text-yellow-400 text-xs font-bold">{match.players.team1[0].scores} goals</span>
              </div>
            </div>
            
            <div className="absolute top-1/3   sm:top-2/3 left-1/3 flex flex-col items-center transform hover:scale-110 transition-transform">
              <div className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full mb-1">
                <span className="text-white text-xs font-bold">{match.players.team1[1].name}</span>
              </div>
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white "
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
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white "
                onClick={() => handleScore(2, 3)}
              >
                <span className="text-white font-bold">GK</span>
              </div>
              <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
                <span className="text-yellow-400 text-xs font-bold">{match.players.team2[0].scores} goals</span>
              </div>
            </div>
            
            <div className="absolute top-1/3 sm:top-2/3 right-1/3 flex flex-col items-center transform hover:scale-110 transition-transform">
              <div className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full mb-1">
                <span className="text-white text-xs font-bold">{match.players.team2[1].name}</span>
              </div>
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white "
                onClick={() => handleScore(2, 4)}
              >
                <span className="text-white font-bold">ST</span>
              </div>
              <div className="mt-1 bg-black bg-opacity-70 px-2 py-0.5 rounded text-center min-w-max">
                <span className="text-yellow-400 text-xs font-bold">{match.players.team2[1].scores} goals</span>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-white rounded-full "></div>
          </div>
        )}


        {match.isActive &&(
          <div className="w-full  mx-auto bg-[#10141e] rounded-2xl overflow-hidden  mb-8 border border-[#282c35]">
            <div className="bg-[#1c2029] p-3 border-b border-[#282c35]">
              <h2 className="text-lg font-bold text-center text-[#758a8f] flex items-center justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                MATCH STATISTICS
              </h2>
            </div>
            
            <div className="px-4 py-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-400 font-bold">{match.team1Score}</span>
                  <span className="text-gray-400 text-sm">Goals</span>
                  <span className="text-blue-400 font-bold">{match.team2Score}</span>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#ff6161] to-red-400 h-2"
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
                      className="bg-gradient-to-r from-[#ff6161] to-red-400 h-2"
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Team 1 */}
          <div className="bg-[#10141e] rounded-2xl overflow-hidden border border-[#282c35] ">
            <div className="bg-[#ff6161] p-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <div className="w-6 h-6 bg-[#ff6161] rounded-full flex items-center justify-center mr-2 border border-white">
                  <span className="text-xs text-white font-bold">1</span>
                </div>
                RED TEAM PLAYERS
              </h3>
            </div>
            
            <div className="p-4">
              {match.players.team1.map(player => (
                <div key={player.id} className="mb-3 bg-[#1c2029] border border-[#282c35] rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-[#ff6161] rounded-full flex items-center justify-center mr-3 shadow">
                      <span className="text-white font-bold text-sm">{player.position === "Goalkeeper" ? "GK" : "ST"}</span>
                    </div>
                    <div className="flex-1">
                      <select
                        value={player.name}
                        onChange={(e) => handlePlayerChange(1, player.id, e.target.value)}
                        className="w-full p-2 border border-gray-500 rounded-lg bg-[#1d202a] text-white text-sm"
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
          
          <div className="bg-[#10141e] rounded-2xl overflow-hidden border border-[#282c35] ">
            <div className="bg-[#00bcff] p-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <div className="w-6 h-6 bg-[#00bcff] rounded-full flex items-center justify-center mr-2 border border-white">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
                BLUE TEAM PLAYERS
              </h3>
            </div>
            
            <div className="p-4">
              {match.players.team2.map(player => (
                <div key={player.id} className="mb-3 bg-[#1c2029] border border-[#282c35] rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-[#00bcff] rounded-full flex items-center justify-center mr-3 shadow">
                      <span className="text-white font-bold text-sm">{player.position === "Goalkeeper" ? "GK" : "ST"}</span>
                    </div>
                    <div className="flex-1">
                      <select
                        value={player.name}
                        onChange={(e) => handlePlayerChange(2, player.id, e.target.value)}
                        className="w-full p-2 border border-gray-500 rounded-lg bg-[#1d202a]  text-white text-sm"
                      >
                        <option className="" value="">Select Player</option>
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
      <footer className="w-full bg-[#10141e] border border-[#282c35] rounded-2xl p-4 text-center text-gray-500 text-xs">
        <p>&copy; 2023 PRO FOOSBALL LEAGUE. All rights reserved.</p>
        <p>Designed by Wissen Guys</p>
      </footer>
    </div>
  );
}