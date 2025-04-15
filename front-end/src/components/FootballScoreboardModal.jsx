import { useState, useEffect } from 'react';
import { Timer, Trophy, Users2, Clock, X } from 'lucide-react';
import { FaCircle } from 'react-icons/fa';

export default function FootballScoreboardModal({ isModalOpen, selectedMatch, setIsModalOpen, formatDate }) {
  const [flashWinner, setFlashWinner] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      const interval = setInterval(() => {
        setFlashWinner(prev => !prev);
      }, 800);
      document.body.style.overflow = 'hidden';

      return () => {
        clearInterval(interval);  
        document.body.style.overflow = 'auto'; // reset when modal unmounts
      };
    }
  }, [isModalOpen]);

  if (!isModalOpen || !selectedMatch) return null;

  const redTeamWon = selectedMatch.winner === "Team 1";
  const blueTeamWon = selectedMatch.winner === "Team 2";
  
  return (
    <div className="fixed inset-0 bg-opacity-75 backdrop-blur-xs flex items-center justify-center z-50 px-10">
      <div className="bg-[#10141e] border border-[#282c35]  rounded-2xl  w-11/12 max-w-3xl ">
        {/* Header Banner */}
        <div className="bg-[#1c2029] text-white py-3 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-bold">MATCH #{selectedMatch.id}</h2>
            <div>•</div>
            <div className="text-gray-300 text-sm flex items-center">
              <span>{formatDate(selectedMatch.date)}</span>
            </div>
          </div>
          <div>
            <button
                onClick={() => setIsModalOpen(false)}
              className="px-1 py-1  text-white rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center"
            >
              <X className="" size={18} />
            </button>
          </div>
        </div>
        
        {/* Scoreboard */}
        <div className="py-6 px-4 lg:px-8 flex flex-col justify-center ">
          <div className="grid grid-cols-5 gap-2 mb-8">
            {/* Team 1 */}
            <div className={`col-span-2 bg-[#ff6161] flex flex-col justify-center text-white p-2 lg:p-4 rounded-l-full lg:rounded-l-lg  `}>
              <h3 className="hidden lg:flex font-bold text-base lg:text-2xl text-center lg:mb-2">RED TEAM</h3>
              <div className="flex items-center justify-center lg:mb-3">
                <Users2 size={16} className="mr-2" />
                <p className="text-xs font-semibold lg:text-sm">{selectedMatch.team1.join(" & ")}</p>
              </div>
            </div>
            
            {/* Score */}
            <div className="col-span-1 flex flex-col items-center justify-center  text-white text-lg lg:text-4xl font-bold p-2 lg:p-4 ">
              <div className="flex   items-center justify-center w-full">
                <span className="text-red-500 px-3">{selectedMatch.score[0]}</span>
                <span className="text-gray-400">-</span>
                <span className="text-blue-500 px-3">{selectedMatch.score[1]}</span>
              </div>
            </div>
            
            {/* Team 2 */}
            <div className={`col-span-2 bg-[#00bcff] flex flex-col justify-center text-white p-2 lg:p-4 rounded-r-full lg:rounded-r-lg  `}>
              <h3 className="hidden lg:flex font-bold text-base lg:text-2xl text-center lg:mb-2">BLUE TEAM</h3>
              <div className="flex items-center justify-center text-sm lg:mb-3">
                <Users2 size={16} className="mr-2" />
                <p className="text-xs font-semibold lg:text-sm">{selectedMatch.team2.join(" & ")}</p>
              </div>
            </div>
          </div>
          
          {/* Winner Banner */}
          <div className={` py-2  rounded-lg text-center `}>
            <div className="flex items-center justify-center">
              <h3 className={`text-sm flex items-center   ${redTeamWon ? "text-[#ff6161]" : "text-[#00bcff]"}`}>
                <FaCircle size={12} className='mr-2' />  <span className='text-[#c6c7c9]'>Wins </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}