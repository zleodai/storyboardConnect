import React from 'react';
import { Button } from '../ui/Button';

export const EventsPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#121212]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
          Upcoming Events
        </h2>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded text-sm font-bold mb-3">
              02/05/2026
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Speed Date: Director/Storyboard Artist workshop
            </h3>
            <p className="text-gray-400 max-w-xl">
              A fast-paced networking event to pair directors with visualizers for the upcoming
              thesis season. Don't miss this opportunity to find your creative partner.
            </p>
          </div>
          <Button variant="primary" className="whitespace-nowrap">
            RSVP Now
          </Button>
        </div>
      </div>
    </div>
  );
};
