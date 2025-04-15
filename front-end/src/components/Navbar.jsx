import React, { useState } from 'react'
import { FaCircle } from 'react-icons/fa6'
import { IoFootball } from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({isLive}) => {

    const location = useLocation();
    const isHome = location.pathname === '/home';
    
  return (
    <div className='sticky top-3 z-50'>
        <div className=''>
            <header className=" w-full bg-[#10141e] text-white p-4 border border-[#282c35] mb-6 rounded-lg">
                <div className="max-w-6xl mx-auto lg:px-5 flex items-center justify-between">
                    <div className="flex items-center space-x-1 lg:space-x-2">
                        <div className="mr-3  rounded-full p-1 w-10 h-10 flex items-center justify-center">
                            <IoFootball  size={32} />
                        </div>
                        <Link to="/" className="flex flex-col">
                            <h1 className="text-xs lg:text-2xl text-left  font-bold text-white">PRO <span className="text-[#00bcff]">FOOSBALL </span> LEAGUE</h1>
                            <h3 className="text-[10px] lg:text-xs flex justify-start text-left text-[#8b9eaf]">The Ultimate Battleground</h3>
                        </Link>
                    </div>
                    <div className="text-[10px] lg:text-sm font-semibold  px-2 lg:px-4 py-1 rounded-full bg-[#00bcff] text-white hover:bg-[#00a3e0] transition duration-300">
                    {isHome ? (
                        <Link className="match-link" to="/">Match</Link>
                    ) : (
                        <Link className="stats-link" to="/home">Statistics</Link>
                    )}
                    </div>
                </div>
            </header>
        </div>
    </div>
  )
}

export default Navbar