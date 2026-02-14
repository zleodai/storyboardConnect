import React from 'react';

export const CommunityPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#121212]">
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white">
          <i className="fab fa-discord"></i>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Join our Community</h2>
        <p className="text-gray-400 mb-8 text-xl">
          Connect with other artists, find gigs, and chat with alumni.
        </p>
        <a
          href="#"
          className="inline-block px-8 py-3 bg-[#5865F2] text-white font-bold rounded hover:brightness-110 transition"
        >
          Join us in our Discord channel
        </a>
      </div>
    </div>
  );
};
