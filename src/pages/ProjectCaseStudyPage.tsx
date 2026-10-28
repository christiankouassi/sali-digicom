import React, { useEffect, useState } from 'react';
import { getProjectBySlug, getNextProject, PORTFOLIO_PROJECTS } from '../data/portfolioProjects';
import Logo from '../components/Logo';
import { useRouter } from '../utils/router';
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Palette,
} from 'lucide-react';

export interface ProjectCaseStudyPageProps {
  slug: string;
}

export function ProjectCaseStudyPage({ slug }: ProjectCaseStudyPageProps) {
  const { navigate } = useRouter();
  const project = getProjectBySlug(slug);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Étude de Cas | SALI DigiCom`;
    } else {
      document.title = 'Projet non trouvé | SALI DigiCom';
    }
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
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
      {/* =====================================================================
          HEADER FIXE DIGITAL COVER
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1C2C46]/90 border-b border-[#243757]/70">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
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
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toutes les réalisations</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/creation-de-site-web')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-xs font-bold text-white shadow-md shadow-[#1D9878]/25 transition-all cursor-pointer"
            >
              <span>Demander un devis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          SECTION 1 : HERO MONUMENTAL (c-hero Digital Cover)
         ===================================================================== */}
      <section className="pt-32 sm:pt-40 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Meta tags bar */}
        <div
          className={`flex flex-wrap items-center gap-3 mb-6 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1D9878]/15 text-[#1D9878] border border-[#1D9878]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878] animate-pulse" />
            {project.categoryLabel}
          </span>
          <span className="text-xs text-[#B8C7DA] uppercase tracking-wider font-medium">
            {project.client} · {project.city} · {project.year}
          </span>
        </div>

        {/* Monumental Kinetic Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="overflow-hidden">
            <h1
              className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.06] max-w-4xl transition-transform duration-700 ease-out ${
                isLoaded ? 'translate-y-0' : 'translate-y-12'
              }`}
            >
              {project.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-[#B8C7DA] max-w-3xl leading-relaxed font-light">
              {project.excerpt}
            </p>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#1D9878]/25 shrink-0 self-start lg:self-end"
            >
              <span>Visiter le site en ligne</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Centered Handcrafted Portrait Board (Reduced 62.5% scale for breathing room) */}
        <div className="flex justify-center my-10">
          <div className="w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 bg-[#131F33] shadow-[0_32px_80px_-20px_rgba(10,16,26,0.9)] hover:border-[#1D9878] transition-all duration-500 group">
            <img
              src={project.portraitBoard || project.primaryImage}
              alt={`Planche projet ${project.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2 : INTRODUCTION ÉDITORIALE 2 COLONNES (c-intro-project)
         ===================================================================== */}
      <section className="py-20 px-6 md:px-12 border-t border-white/10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
              Le Contexte Client
            </span>
            <div className="flex items-center gap-4 mb-4">
              {project.whiteLogo && (
                <img
                  src={project.whiteLogo}
                  alt={project.client}
                  className="h-8 w-auto object-contain max-w-[130px] opacity-90"
                />
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {project.client}
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#B8C7DA] leading-relaxed font-light">
              {project.aboutClient}
            </p>
          </div>

          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
              L'Intervention SALI DigiCom
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Direction artistique, rigueur d'ingénierie et impact mesurable.
            </h3>
            <p className="text-sm md:text-base text-[#B8C7DA] leading-relaxed font-light mb-8">
              {project.ourIntervention}
            </p>

            {/* Tags Pills */}
            <div className="flex flex-wrap gap-2.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-[#131F33] border border-[#243757] text-[#B8C7DA] text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3 : GRILLE ASYMÉTRIQUE DES VISUELS (b-media-grid Digital Cover)
         ===================================================================== */}
      <section className="py-20 px-6 md:px-12 bg-[#131F33]/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
              Immersion Visuelle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Déclinaisons Interfaces &amp; Supports
            </h2>
          </div>

          {/* Asymmetric Duo: Left Mobile Mockup (narrow) + Right Desktop Mockup (wide) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Mobile Column (4 cols) */}
            {project.mobileImage && (
              <div className="lg:col-span-4 rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-xl p-4 flex justify-center">
                <div className="w-full max-w-[280px] aspect-[9/18] rounded-2xl overflow-hidden border border-white/20 bg-[#0E1624]">
                  <img
                    src={project.mobileImage}
                    alt={`${project.title} - Mobile`}
                    className="w-full h-full object-cover object-top select-none"
                  />
                </div>
              </div>
            )}

            {/* Desktop Column (8 cols) */}
            <div className={project.mobileImage ? "lg:col-span-8" : "lg:col-span-12"}>
              <div className="rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl">
                {/* Browser top bar */}
                <div className="px-5 py-3 bg-[#1A2A42] border-b border-white/10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-4 text-[11px] font-mono text-[#A0B4CC]">
                    {project.liveUrl || 'https://sali-digicom.com'}
                  </span>
                </div>
                <div className="aspect-[16/10] overflow-hidden bg-[#0e1624]">
                  <img
                    src={project.secondaryImage || project.primaryImage}
                    alt={`${project.title} - Desktop`}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full-Bleed Panoramic View */}
          {project.detailImage && (
            <div className="rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl">
              <div className="aspect-[21/9] max-h-[500px] overflow-hidden bg-[#0e1624]">
                <img
                  src={project.detailImage}
                  alt={`${project.title} - Détail`}
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="p-5 bg-[#131F33] border-t border-[#243757] flex items-center justify-between">
                <span className="text-xs text-[#B8C7DA]">Détail d'interface &amp; fluidité typographique</span>
                <span className="text-xs text-[#1D9878] font-bold uppercase">{project.categoryLabel}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4 : CONTENU DÉTAILLÉ & LIVRABLES (b-flexible-content)
         ===================================================================== */}
      <section className="py-20 px-6 md:px-12 border-t border-white/10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
                Piliers de Réalisation
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Méthodologie &amp; Rigueur
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757]">
                <div className="flex items-center gap-3 mb-2 text-[#1D9878]">
                  <Palette className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white">Direction Artistique &amp; Typographie</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#B8C7DA] leading-relaxed">
                  Harmonisation complète des teintes de marque, sélection typographique de caractère et contrastes optimisés pour une clarté irréprochable.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757]">
                <div className="flex items-center gap-3 mb-2 text-[#1D9878]">
                  <Monitor className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white">UX/UI &amp; Ergonomie Cognitive</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#B8C7DA] leading-relaxed">
                  Parcours utilisateurs fluides, réduction des frictions décisionnelles et valorisation immédiate des services clés.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757]">
                <div className="flex items-center gap-3 mb-2 text-[#1D9878]">
                  <Zap className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white">Performance &amp; Scalabilité</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#B8C7DA] leading-relaxed">
                  Chargement ultrarapide, indexabilité SEO native et compatibilité multi-plateformes irréprochable.
                </p>
              </div>
            </div>
          </div>

          {/* Deliverables Column */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#131F33] border border-[#243757] shadow-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
                Périmètre &amp; Livrables
              </span>
              <h3 className="text-2xl font-bold text-white mb-6">
                Livrables validés pour ce projet
              </h3>

              <ul className="space-y-4">
                {project.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3.5 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-[#1D9878]/20 border border-[#1D9878] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#1D9878]" />
                    </div>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#B8C7DA] block">Besoin d'un résultat similaire ?</span>
                  <span className="text-sm font-bold text-white">Obtenez votre devis sous 24h.</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/creation-de-site-web')}
                  className="px-6 py-3 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1D9878]/25 cursor-pointer shrink-0"
                >
                  Demander un devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5 : PROJET SUIVANT SIGNATURE DIGITAL COVER (c-next)
         ===================================================================== */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#1C2C46] to-[#131F33] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-14 rounded-3xl bg-[#131F33] border border-[#243757] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 group hover:border-[#1D9878]/60 transition-all duration-500 shadow-2xl">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#1D9878] font-bold block mb-2">
                Projet Suivant
              </span>
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white group-hover:text-[#1D9878] transition-colors duration-300">
                {nextProject.title}
              </h3>
              <p className="text-sm sm:text-base text-[#B8C7DA] mt-3 font-light">
                {nextProject.categoryLabel} · {nextProject.city}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/projet/${nextProject.slug}`)}
              className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-[#1D9878] group-hover:bg-[#167d63] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#1D9878]/30 shrink-0 cursor-pointer"
            >
              <span>Découvrir l'étude de cas</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#243757] py-8 text-center text-xs text-[#B8C7DA]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SALI DigiCom. Filiale digitale de SALI Capital Group.</p>
          <p>Casablanca &amp; Marrakech, Maroc · contact@sali-digicom.com · +212 713-370946</p>
        </div>
      </footer>
    </div>
  );
}
