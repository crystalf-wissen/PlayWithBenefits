import React, { useState } from 'react'
import { FaCircle } from 'react-icons/fa6'
import { IoFootball } from 'react-icons/io5'

const Navbar = ({isLive}) => {
    
  return (
    <div className='sticky top-3 z-50'>
        <div className=''>
            <header className=" w-full bg-[#10141e] text-white p-4 border border-[#282c35] mb-6 rounded-lg">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="mr-3  rounded-full p-1 w-10 h-10 flex items-center justify-center">
                            <IoFootball  size={32} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg lg:text-2xl  font-bold text-white">PRO <span className="text-[#00bcff]">FOOSBALL </span> LEAGUE</h1>
                            <h3 className="text-xs flex justify-start text-[#8b9eaf]">The Ultimate Battleground</h3>
                        </div>
                        <div className={`${isLive? "flex" : "hidden"} bg-[#00bcff] -mt-4   space-x-2 px-2 py-0.5 rounded-full font-bold text-sm`}>
                            <div className="flex items-center text-[#e94a4d] animate-pulse">
                                <FaCircle size={6} />
                            </div>
                            <div className="text-white text-xs">   
                                LIVE
                            </div>
                        </div>
                    </div>
                    <div className="">
                    </div>
                </div>
            </header>
        </div>
    </div>
  )
}

export default Navbar