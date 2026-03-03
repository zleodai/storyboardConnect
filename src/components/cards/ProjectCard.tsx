import React from 'react';
import { Project } from '../../types/project.types';
import { Badge } from '../ui/Badge';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      className="bg-[#1a1a1a] rounded-lg overflow-hidden group hover:ring-2 ring-accent cursor-pointer transition shadow-lg"
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="h-40 w-full relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
        {/* Timeline Badge */}
        <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
          {project.timeline}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-white group-hover:text-accent transition">
            {project.title}
          </h3>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-gray-400 mb-3">
          {project.subtitle} • {project.format}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge>{project.productionType}</Badge>
          {project.isPaid && <Badge variant="accent">Paid</Badge>}
          {project.shotlistReady && <Badge>Shotlist Ready</Badge>}
        </div>

        {/* View Count */}
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span>{project.viewCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
