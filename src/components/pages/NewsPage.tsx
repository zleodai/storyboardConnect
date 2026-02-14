import React from 'react';

export const NewsPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#121212]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
          Latest News
        </h2>
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-accent">
            <div className="text-accent text-sm font-bold mb-2">Dec 09, 2025</div>
            <h3 className="text-xl font-bold text-white mb-2">New Update</h3>
            <p className="text-gray-400">
              We have updated the filter system to include specific film schools and production
              types. You can now filter by LMU, USC, and more!
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-gray-700">
            <div className="text-gray-500 text-sm font-bold mb-2">Nov 20, 2025</div>
            <h3 className="text-xl font-bold text-white mb-2">Platform Beta Launch</h3>
            <p className="text-gray-400">Welcome to Storyboard Connect. We are live!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
