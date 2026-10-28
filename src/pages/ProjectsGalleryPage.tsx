import React, { useState, useEffect } from 'react';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../data/portfolioProjects';
import Logo from '../components/Logo';
import { useRouter } from '../utils/router';
import { ArrowLeft, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

type FilterCategory = 'all' | 'web' | 'brand' | 'community';

export function ProjectsGalleryPage() {
  const { navigate } = useRouter();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  useEffect(() => {
    document.title = 'Nos Réalisations | SALI DigiCom — Agence de Marketing & Communication Digitale';
    window.scrollTo(0, 0);
  }, []);

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
              Portfolio &amp; Études de Cas
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l'accueil</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12 lg:py-16">
        {/* Page Hero */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D9878]/15 border border-[#1D9878]/30 text-[#1D9878] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878] animate-pulse" />
            Agence de Marketing &amp; Communication Digitale
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Nos Réalisations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#B8C7DA] leading-relaxed">
            Découvrez nos productions concrètes pour CAP Investment, Gueliz Properties, Imtiaz Taamine, Axeon et CAP'ASSUR. Chaque projet est conçu sur-mesure pour atteindre l’excellence esthétique et des résultats mesurables.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 pb-8 mb-10 border-b border-[#243757]">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1D9878] text-white shadow-lg shadow-[#1D9878]/30'
                    : 'bg-[#131F33] text-[#B8C7DA] hover:text-white hover:bg-[#243757] border border-[#243757]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#1C2C46] text-[#B8C7DA]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group relative rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33] flex flex-col hover:border-[#1D9878] transition-all duration-500 hover:shadow-2xl hover:shadow-[#1D9878]/10"
            >
              {/* Image Frame — Portrait Board */}
              <div
                className="relative aspect-[10/14] overflow-hidden bg-[#0e1624] cursor-pointer"
                onClick={() => navigate(`/projet/${project.slug}`)}
              >
                <img
                  src={project.portraitBoard || project.primaryImage}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                />

                {/* Subtle Gradient Scrim at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131F33] via-transparent to-transparent opacity-80" />

                {/* Client White Logo Tag */}
                {project.whiteLogo && (
                  <div className="absolute top-4 right-4 p-2 rounded-xl bg-[#131F33]/85 backdrop-blur-md border border-[#243757]/80">
                    <img
                      src={project.whiteLogo}
                      alt={`Logo ${project.client}`}
                      className="h-6 w-auto object-contain max-w-[90px]"
                    />
                  </div>
                )}

                {/* Category Pill */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1C2C46]/85 backdrop-blur-md text-[#1D9878] border border-[#1D9878]/30">
                    {project.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#B8C7DA] mb-2">
                    <span>{project.client}</span>
                    <span>{project.city} · {project.year}</span>
                  </div>

                  <h2
                    className="text-xl font-bold text-white group-hover:text-[#1D9878] transition-colors cursor-pointer"
                    onClick={() => navigate(`/projet/${project.slug}`)}
                  >
                    {project.title}
                  </h2>

                  <p className="mt-2 text-xs text-[#B8C7DA] leading-relaxed line-clamp-2">
                    {project.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#1C2C46] text-[#B8C7DA] border border-[#243757]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-[#243757] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/projet/${project.slug}`)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#1D9878] transition-colors"
                  >
                    <span>Explorer l'étude</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#1C2C46] hover:bg-[#1D9878]/20 text-[#B8C7DA] hover:text-white border border-[#243757] transition-colors"
                      title="Visiter le site en ligne"
                      aria-label={`Visiter le site ${project.title} en ligne`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <section className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#131F33] to-[#1C2C46] border border-[#243757] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D9878]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D9878]/15 border border-[#1D9878]/30 text-[#1D9878] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Votre Projet Clé en Main</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Prêt à hisser votre présence digitale au sommet ?
            </h2>
            <p className="mt-3 text-sm text-[#B8C7DA]">
              Sélectionnez votre domaine d'intervention pour recevoir un cadrage stratégique et une proposition détaillée sous 24h.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/creation-de-site-web')}
                className="px-6 py-3 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-xs font-bold text-white shadow-lg shadow-[#1D9878]/25 transition-all"
              >
                Création de Site Web
              </button>

              <button
                type="button"
                onClick={() => navigate('/community-management')}
                className="px-6 py-3 rounded-full bg-[#131F33] hover:bg-[#243757] border border-[#243757] hover:border-[#1D9878] text-xs font-bold text-white transition-all"
              >
                Community Management
              </button>

              <button
                type="button"
                onClick={() => navigate('/identite-visuelle')}
                className="px-6 py-3 rounded-full bg-[#131F33] hover:bg-[#243757] border border-[#243757] hover:border-[#1D9878] text-xs font-bold text-white transition-all"
              >
                Identité Visuelle &amp; Branding
              </button>
            </div>
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
