import React, { useEffect } from 'react';
import { getProjectBySlug, getNextProject, PORTFOLIO_PROJECTS } from '../data/portfolioProjects';
import Logo from '../components/Logo';
import { useRouter } from '../utils/router';
import { ArrowLeft, ExternalLink, ArrowRight, Check, Sparkles, Building2 } from 'lucide-react';

export interface ProjectCaseStudyPageProps {
  slug: string;
}

export function ProjectCaseStudyPage({ slug }: ProjectCaseStudyPageProps) {
  const { navigate } = useRouter();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Étude de Cas | SALI DigiCom`;
    } else {
      document.title = 'Projet non trouvé | SALI DigiCom';
    }
    window.scrollTo(0, 0);
  }, [project, slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#1C2C46] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Projet introuvable</h1>
        <p className="text-[#B8C7DA] mb-6">Le projet demandé n'existe pas ou a été déplacé.</p>
        <button
          type="button"
          onClick={() => navigate('/projets')}
          className="px-6 py-3 rounded-full bg-[#1D9878] text-white font-bold text-xs"
        >
          Voir toutes nos réalisations
        </button>
      </div>
    );
  }

  const nextProject = getNextProject(project.slug);

  return (
    <div className="min-h-screen bg-[#1C2C46] text-white font-['Montserrat',sans-serif] selection:bg-[#1D9878] selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#1C2C46]/90 border-b border-[#243757]/70">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group focus:outline-none"
              aria-label="Accueil SALI DigiCom"
            >
              <Logo
                variant="digicom"
                type="horizontal"
                className="h-8 md:h-9 w-auto opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </button>
            <span className="hidden sm:inline-block h-4 w-px bg-[#283D60]" />
            <span className="hidden sm:inline-block text-[13px] tracking-wider uppercase text-[#1D9878] font-semibold">
              {project.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/projets')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toutes les réalisations</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/creation-de-site-web')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-xs font-bold text-white shadow-md shadow-[#1D9878]/25 transition-all"
            >
              <span>Démarrer un projet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12 lg:py-16">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1D9878]/15 text-[#1D9878] border border-[#1D9878]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878] animate-pulse" />
            {project.categoryLabel}
          </span>
          <span className="text-xs text-[#B8C7DA] uppercase tracking-wider">
            {project.city} · {project.year}
          </span>
        </div>

        {/* Title & Live Link */}
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
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1D9878]/25 shrink-0 self-start lg:self-end"
            >
              <span>Visiter le site en ligne</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Main Architectural Showcase — Portrait Board & Mockups */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Portrait Board (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl">
            <img
              src={project.portraitBoard || project.primaryImage}
              alt={`Planche projet ${project.title}`}
              className="w-full h-auto object-cover select-none"
            />
          </div>

          {/* Side Overview & Deliverables (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Client Card */}
            <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1D9878] uppercase tracking-wider">
                  Client &amp; Secteur
                </span>
                {project.whiteLogo && (
                  <img
                    src={project.whiteLogo}
                    alt={project.client}
                    className="h-7 w-auto object-contain max-w-[110px]"
                  />
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{project.client}</h3>
              <p className="mt-2 text-xs text-[#B8C7DA] leading-relaxed">
                {project.aboutClient}
              </p>
            </div>

            {/* Our Intervention */}
            <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757]">
              <span className="text-xs font-bold text-[#1D9878] uppercase tracking-wider block mb-3">
                L'intervention SALI DigiCom
              </span>
              <p className="text-xs text-[#B8C7DA] leading-relaxed">
                {project.ourIntervention}
              </p>
            </div>

            {/* Deliverables Checklist */}
            <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757]">
              <span className="text-xs font-bold text-[#1D9878] uppercase tracking-wider block mb-4">
                Livrables &amp; Réalisations
              </span>
              <ul className="space-y-3">
                {project.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-xs text-white">
                    <div className="w-4 h-4 rounded-full bg-[#1D9878]/20 border border-[#1D9878] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#1D9878]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-20">
            <div className="mb-8">
              <span className="text-xs font-bold text-[#1D9878] uppercase tracking-widest block mb-2">
                Galerie de Conception
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Détails des Écrans &amp; Identité
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((img, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33] group"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#0e1624]">
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 bg-[#131F33]/90 border-t border-[#243757]">
                    <p className="text-xs text-[#B8C7DA]">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Project Footer Bar */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#131F33] via-[#1C2C46] to-[#131F33] border border-[#243757] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#1D9878] font-bold block mb-1">
              Projet Suivant
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {nextProject.title}
            </h3>
            <p className="text-xs text-[#B8C7DA] mt-1">
              {nextProject.categoryLabel} · {nextProject.city}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/projet/${nextProject.slug}`)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1D9878]/30"
            >
              <span>Découvrir {nextProject.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#243757] py-8 text-center text-xs text-[#B8C7DA]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SALI DigiCom. Filiale digitale de SALI Capital Group.</p>
          <p>Casablanca &amp; Marrakech, Maroc · contact@sali-digicom.com · +212 713-370946</p>
        </div>
      </footer>
    </div>
  );
}
