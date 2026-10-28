import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { PortfolioProject, PORTFOLIO_PROJECTS } from '../data/portfolioProjects';
import { Logo } from './Logo';

export interface ProjectCaseStudyProps {
  project: PortfolioProject;
  onClose: () => void;
  onNavigateNext: (nextSlug: string) => void;
  onOpenQuestionnaire?: (service?: 'website' | 'community' | 'branding') => void;
}

export function ProjectCaseStudy({
  project,
  onClose,
  onNavigateNext,
  onOpenQuestionnaire,
}: ProjectCaseStudyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Find next project in circular list
  const currentIndex = PORTFOLIO_PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject =
    PORTFOLIO_PROJECTS[(currentIndex + 1) % PORTFOLIO_PROJECTS.length] || PORTFOLIO_PROJECTS[0];

  // Lock body scroll while case study is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const content = (
    <div
      ref={containerRef}
      style={{ zIndex: 120 }}
      data-ui="project-case-study"
      className="fixed inset-0 overflow-y-auto bg-[#1C2C46] text-[#FFFFFF] font-['Montserrat',sans-serif] selection:bg-[#1D9878] selection:text-[#FFFFFF]"
      role="dialog"
      aria-modal="true"
      aria-label={`Étude de cas : ${project.title}`}
    >
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12 backdrop-blur-md bg-[#1C2C46]/85 border-b border-[#243757]/60">
        <div className="flex items-center gap-4">
          <Logo variant="digicom" type="horizontal" className="h-8 w-auto text-white" />
          <span className="hidden sm:inline-block h-4 w-px bg-[#283D60]" />
          <span className="hidden sm:inline-block text-[13px] tracking-wider uppercase text-[#1D9878] font-semibold">
            {project.categoryLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 transition-all duration-300"
          aria-label="Fermer l'étude de cas"
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

      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-16 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1D9878]/15 text-[#1D9878] border border-[#1D9878]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878] animate-pulse" />
            {project.categoryLabel}
          </span>
          <span className="text-xs text-[#B8C7DA] uppercase tracking-wider">
            {project.city} · {project.year}
          </span>
        </div>

        {/* Title & Live URL */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              {project.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#B8C7DA] max-w-3xl leading-relaxed">
              {project.excerpt}
            </p>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1D9878] hover:bg-[#178568] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#1D9878]/25 hover:shadow-[#1D9878]/40 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap self-start lg:self-auto"
            >
              <span>Voir le site en ligne</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* 3D Slanted Primary Visual Stage */}
        <div className="relative rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#131F33] via-transparent to-transparent opacity-40 z-10 pointer-events-none" />
          <img
            src={project.primaryImage}
            alt={`Aperçu principal de ${project.title}`}
            className="w-full h-auto object-cover max-h-[720px] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
          {project.whiteLogo && (
            <div className="absolute bottom-6 right-6 z-20 p-4 rounded-xl backdrop-blur-md bg-[#131F33]/85 border border-[#243757]">
              <img src={project.whiteLogo} alt={`Logo ${project.client}`} className="h-10 w-auto object-contain" />
            </div>
          )}
        </div>
      </section>

      {/* Two-Column Editorial Narrative */}
      <section className="px-6 py-16 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#243757]/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#1D9878] text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rotate-45 bg-[#1D9878]" />
              Contexte & Enjeux
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              À propos de {project.client}
            </h2>
            <p className="text-base md:text-lg text-[#B8C7DA] leading-relaxed">
              {project.aboutClient}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 text-[#1D9878] text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rotate-45 bg-[#1D9878]" />
              Expertise & Réalisation
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              L'intervention SALI DigiCom
            </h2>
            <p className="text-base md:text-lg text-[#B8C7DA] leading-relaxed mb-6">
              {project.ourIntervention}
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {project.deliverables.map((item) => (
                <span
                  key={item}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#131F33] border border-[#243757] text-[#FFFFFF] flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#1D9878] shrink-0" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Asset Gallery Grid */}
      <section className="px-6 py-16 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#243757]/60">
        <div className="flex items-center gap-2 mb-8 text-[#1D9878] text-xs font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rotate-45 bg-[#1D9878]" />
          Galerie des Écrans & Supports
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.gallery.map((img, idx) => (
            <div
              key={`${img.src}-${idx}`}
              className="group rounded-xl overflow-hidden border border-[#243757] bg-[#131F33] hover:border-[#1D9878]/50 transition-all duration-300"
            >
              <div className="overflow-hidden bg-[#131F33]">
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-auto object-cover max-h-[480px] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4 border-t border-[#243757] bg-[#131F33]">
                <p className="text-xs text-[#B8C7DA] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878]" />
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Questionnaire Hook */}
      <section className="px-6 py-16 md:px-12 max-w-5xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-b from-[#131F33] to-[#1C2C46] border border-[#243757]">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Un projet similaire pour votre entreprise ?
          </h3>
          <p className="text-[#B8C7DA] text-base max-w-xl mx-auto mb-8">
            Obtenez un cadrage sur mesure et une proposition chiffrée adaptée à vos objectifs en quelques étapes.
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenQuestionnaire) {
                const service =
                  project.category === 'web'
                    ? 'website'
                    : project.category === 'community'
                    ? 'community'
                    : 'branding';
                onOpenQuestionnaire(service);
              }
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1D9878] hover:bg-[#178568] text-white font-bold text-sm tracking-wide shadow-xl transition-all"
          >
            <span>Démarrer un projet</span>
            <span className="w-2 h-2 rotate-45 bg-white" />
          </button>
        </div>
      </section>

      {/* Bottom Next Project Banner */}
      <section className="border-t border-[#243757] bg-[#131F33]">
        <button
          type="button"
          onClick={() => onNavigateNext(nextProject.slug)}
          className="group w-full py-16 px-6 md:px-12 text-left relative overflow-hidden transition-colors hover:bg-[#152238]"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#1D9878] font-bold block mb-2">
                Projet suivant →
              </span>
              <h4 className="text-3xl md:text-5xl font-extrabold text-white group-hover:text-[#1D9878] transition-colors">
                {nextProject.title}
              </h4>
              <p className="text-sm text-[#B8C7DA] mt-2">
                {nextProject.categoryLabel} · {nextProject.city}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#B8C7DA] group-hover:text-white transition-colors">
                Découvrir l'étude
              </span>
              <div className="w-12 h-12 rounded-full border border-[#243757] group-hover:border-[#1D9878] flex items-center justify-center bg-[#1C2C46] group-hover:bg-[#1D9878] transition-all">
                <svg className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      </section>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
