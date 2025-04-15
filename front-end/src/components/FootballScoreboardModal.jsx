import { useState, useEffect } from 'react';
import { Timer, Trophy, Users2, Clock, X } from 'lucide-react';

export default function FootballScoreboardModal({ isModalOpen, selectedMatch, setIsModalOpen, formatDate }) {
  const [flashWinner, setFlashWinner] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      const interval = setInterval(() => {
        setFlashWinner(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isModalOpen]);

  if (!isModalOpen || !selectedMatch) return null;

  const redTeamWon = selectedMatch.winner === "Team 1";
  const blueTeamWon = selectedMatch.winner === "Team 2";
  
  return (
    <div className="fixed inset-0 bg-opacity-75 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-lg shadow-2xl w-11/12 max-w-3xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-blue-900 text-white py-3 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="mr-2 text-yellow-400" />
            <h2 className="text-2xl font-bold">MATCH #{selectedMatch.id}</h2>
          </div>
          <div className="text-gray-300 flex items-center">
            <Clock className="mr-2" />
            <span>{formatDate(selectedMatch.date)}</span>
          </div>
        </div>
        
        {/* Scoreboard */}
        <div className="py-6 px-8">
          <div className="grid grid-cols-5 gap-2 mb-8">
            {/* Team 1 */}
            <div className={`col-span-2 bg-red-900 text-white p-4 rounded-l-lg border-2 ${redTeamWon ? "border-yellow-400" : "border-red-900"}`}>
              <h3 className="font-bold text-2xl text-center mb-2">RED TEAM</h3>
              <div className="flex items-center justify-center mb-3">
                <Users2 className="mr-2" />
                <p className="text-lg">{selectedMatch.team1.join(" & ")}</p>
              </div>
            </div>
            
            {/* Score */}
            <div className="col-span-1 flex flex-col items-center justify-center bg-black text-white text-4xl font-bold p-4 border-2 border-gray-700">
              <div className="flex items-center justify-center w-full">
                <span className="text-red-500 px-3">{selectedMatch.score[0]}</span>
                <span className="text-gray-400">-</span>
                <span className="text-blue-500 px-3">{selectedMatch.score[1]}</span>
              </div>
            </div>
            
            {/* Team 2 */}
            <div className={`col-span-2 bg-blue-900 text-white p-4 rounded-r-lg border-2 ${blueTeamWon ? "border-yellow-400" : "border-blue-900"}`}>
              <h3 className="font-bold text-2xl text-center mb-2">BLUE TEAM</h3>
              <div className="flex items-center justify-center mb-3">
                <Users2 className="mr-2" />
                <p className="text-lg">{selectedMatch.team2.join(" & ")}</p>
              </div>
            </div>
          </div>
          
          {/* Winner Banner */}
          <div className={`mb-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg text-center ${flashWinner ? 'opacity-100' : 'opacity-80'}`}>
            <div className="flex items-center justify-center">
              <Trophy className="text-white mr-2" />
              <h3 className="text-xl font-bold text-white">
                WINNER: {redTeamWon ? "RED TEAM" : "BLUE TEAM"}
              </h3>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center"
            >
              <X className="mr-2" size={18} />
              Close Scoreboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}