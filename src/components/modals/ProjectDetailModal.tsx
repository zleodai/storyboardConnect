import React from 'react';
import { Project } from '../../types/project.types';
import { Modal } from './Modal';
import { Button } from '../ui/Button';
import { GlassPanel } from '../ui/GlassPanel';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/80 to-transparent flex flex-col justify-end p-12 max-w-7xl mx-auto">
          <span className="text-accent font-bold tracking-wider mb-2">PROJECT DETAIL</span>
          <h1 className="text-6xl font-bold text-white mb-2">{project.title}</h1>
          <h2 className="text-2xl text-gray-300 font-light">{project.subtitle}</h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Logline */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-accent pl-3">
              Logline
            </h3>
            <div className="bg-gray-900/50 p-6 rounded-lg border-l-2 border-gray-700 italic text-gray-300 leading-relaxed text-lg">
              "{project.logline}"
            </div>
          </section>

          {/* Visual Deck */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-accent pl-3">
              Visual Deck
            </h3>
            <div className="w-full aspect-video bg-gray-800 rounded-xl overflow-hidden relative group border border-gray-700">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="secondary" className="transform group-hover:scale-105">
                  <i className="fas fa-eye mr-2"></i> View Pitch Deck
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Info Sidebar */}
        <div className="space-y-8">
          {/* Basic Information */}
          <GlassPanel className="p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-wider">
              Basic Information
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">Format</span>
                <span className="text-white">{project.format}</span>
              </div>
              {project.length && (
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-500">Length</span>
                  <span className="text-white">{project.length}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">Shotlist Ready</span>
                <span className={project.shotlistReady ? 'text-accent' : 'text-gray-400'}>
                  {project.shotlistReady ? (
                    <>
                      <i className="fas fa-check"></i> Yes
                    </>
                  ) : (
                    'No'
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-500">Location Secured</span>
                <span className={project.locationSecured ? 'text-accent' : 'text-gray-400'}>
                  {project.locationSecured ? (
                    <>
                      <i className="fas fa-check"></i> Yes
                    </>
                  ) : (
                    'No'
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timeline</span>
                <span className="text-white">{project.timeline}</span>
              </div>
            </div>
          </GlassPanel>

          {/* Contact Section */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
              Contact
            </h3>
            <Button variant="primary" className="w-full mb-4">
              Apply Now
            </Button>
            <div className="flex gap-4 justify-center">
              {project.contactInfo.twitter && (
                <a
                  href={project.contactInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center text-white hover:bg-accent transition"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {project.contactInfo.instagram && (
                <a
                  href={project.contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center text-white hover:bg-pink-600 transition"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {project.contactInfo.email && (
                <a
                  href={`mailto:${project.contactInfo.email}`}
                  className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center text-white hover:bg-accent transition"
                >
                  <i className="fas fa-envelope"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
