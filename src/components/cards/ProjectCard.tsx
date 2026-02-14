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
      </div>
    </div>
  );
};
