import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { PortfolioProject, PORTFOLIO_PROJECTS } from '../data/portfolioProjects';
import { Logo } from './Logo';

export interface ProjectsGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: PortfolioProject) => void;
}

type FilterCategory = 'all' | 'web' | 'brand' | 'community';

export function ProjectsGalleryModal({
  isOpen,
  onClose,
  onSelectProject,
}: ProjectsGalleryModalProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  if (!isOpen) return null;

  const filteredProjects =
    activeCategory === 'all'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);

  const filterTabs: Array<{ id: FilterCategory; label: string; count: number }> = [
    { id: 'all', label: 'Toutes les réalisations', count: PORTFOLIO_PROJECTS.length },
    {
      id: 'web',
      label: 'Sites Web & Plateformes',
      count: PORTFOLIO_PROJECTS.filter((p) => p.category === 'web').length,
    },
    {
      id: 'brand',
      label: 'Identité & Branding',
      count: PORTFOLIO_PROJECTS.filter((p) => p.category === 'brand').length,
    },
    {
      id: 'community',
      label: 'Community Management',
      count: PORTFOLIO_PROJECTS.filter((p) => p.category === 'community').length,
    },
  ];

  const content = (
    <div
      style={{ zIndex: 120 }}
      data-ui="projects-gallery-modal"
      className="fixed inset-0 overflow-y-auto bg-[#1C2C46] text-[#FFFFFF] font-['Montserrat',sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-label="Galerie des projets SALI DigiCom"
    >
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12 backdrop-blur-md bg-[#1C2C46]/90 border-b border-[#243757]/60">
        <div className="flex items-center gap-4">
          <Logo variant="digicom" type="horizontal" className="h-8 w-auto text-white" />
          <span className="hidden sm:inline-block h-4 w-px bg-[#283D60]" />
          <span className="hidden sm:inline-block text-[13px] tracking-wider uppercase text-[#1D9878] font-semibold">
            Portfolio Réel & Études de Cas
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 transition-all duration-300"
          aria-label="Fermer la galerie"
        >
          <span className="text-[13px] uppercase tracking-wider text-[#B8C7DA] group-hover:text-white transition-colors">
            Fermer
          </span>
          <div className="w-5 h-5 flex items-center justify-center rotate-45 group-hover:rotate-135 transition-transform duration-500">
            <span className="absolute w-3.5 h-[1.5px] bg-[#FFFFFF] group-hover:bg-[#1D9878]" />
            <span className="absolute h-3.5 w-[1.5px] bg-[#FFFFFF] group-hover:bg-[#1D9878]" />
          </div>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        {/* Title & Introduction */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D9878]/15 border border-[#1D9878]/30 text-[#1D9878] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878]" />
            Galerie Complète
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Nos Réalisations
          </h1>
          <p className="mt-3 text-base md:text-lg text-[#B8C7DA] max-w-2xl">
            Découvrez nos productions concrètes pour nos clients à Casablanca, Marrakech, aux Émirats et à l’international.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 pb-8 mb-8 border-b border-[#243757]">
          {filterTabs.map((tab) => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#1D9878] text-white shadow-md shadow-[#1D9878]/25'
                    : 'bg-[#131F33] text-[#B8C7DA] hover:text-white border border-[#243757] hover:border-[#1D9878]/40'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#1C2C46] text-[#B8C7DA]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33] hover:border-[#1D9878] transition-all duration-300 transform hover:-translate-y-1.5 shadow-xl flex flex-col"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1C2C46]">
                <img
                  src={project.primaryImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131F33] via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#131F33]/85 backdrop-blur-md text-[#1D9878] border border-[#243757]">
                    {project.categoryLabel}
                  </span>
                  {project.liveUrl && (
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#1D9878] text-white">
                      En ligne ↗
                    </span>
                  )}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#B8C7DA] mb-1">
                    {project.client} · {project.city}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#1D9878] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-[#B8C7DA] line-clamp-2 leading-relaxed">
                    {project.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#243757]/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#1C2C46] text-[#B8C7DA]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs text-[#1D9878] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Voir l'étude →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
