"use client"

import React from 'react'
import { FaPlay } from 'react-icons/fa'

// interface 

const PlayButton = () => {
  return (
    <button 
        className='transition p-4
        opacity-0 rounded-full flex items-center bg-green-500 
        translate-x-0 translate-y-1/4 
        group-hover:opacity-100 group-hover:translate-y-0 
        hover:scale-110'
    >
        <FaPlay className='text-black' />
    </button>
  );
}

export default PlayButton;