import React from 'react';
import { useApp } from '../../hooks/useApp';

export const LandingPage: React.FC = () => {
  const { enterSite } = useApp();

  return (
    <div className="flex-1 flex w-full h-full">
      {/* Artist Side */}
      <div
        className="w-1/2 h-full flex flex-col justify-center items-center hover:bg-gray-900 transition-all duration-500 cursor-pointer border-r border-gray-800 group"
        onClick={() => enterSite('artist')}
      >
        <h1 className="text-4xl font-bold mb-4 group-hover:scale-105 transition">
          Storyboard Artist
        </h1>
        <p className="text-gray-400 group-hover:text-white font-light">
          I'm looking for projects
        </p>
      </div>

      {/* Filmmaker Side */}
      <div
        className="w-1/2 h-full flex flex-col justify-center items-center hover:bg-gray-900 transition-all duration-500 cursor-pointer group"
        onClick={() => enterSite('filmmaker')}
      >
        <h1 className="text-4xl font-bold mb-4 group-hover:scale-105 transition">
          Filmmaker
        </h1>
        <p className="text-gray-400 group-hover:text-white font-light">
          I'm looking for Artists
        </p>
      </div>
    </div>
  );
};
