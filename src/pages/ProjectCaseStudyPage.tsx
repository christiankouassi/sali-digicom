import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getProjectBySlug, getNextProject, PORTFOLIO_PROJECTS, PortfolioProject } from '../data/portfolioProjects';
import Logo from '../components/Logo';
import { useRouter } from '../utils/router';
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  Check,
  Zap,
  Monitor,
  Smartphone,
  Palette,
  Sparkles,
  Layers,
  ShieldCheck,
  TrendingUp,
  Clock,
  Eye,
  Maximize2,
  X,
  ChevronRight
} from 'lucide-react';

export interface ProjectCaseStudyPageProps {
  slug: string;
  onNavigateWithCurtain?: (path: string) => void;
}

// FadeIn helper matching Cap Investment Solutions & Digital Cover easing [0.22, 1, 0.36, 1]
const FadeIn = ({
  children,
  delay = 0,
  y = 35,
  x = 0,
  duration = 1.3,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y, x }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Specific Project Metrics & Tokens dictionary
const PROJECT_DETAILS_MAP: Record<
  string,
  {
    metrics: Array<{ value: string; label: string; desc: string }>;
    colors: Array<{ name: string; hex: string; role: string }>;
    typography: { primary: string; secondary: string; style: string };
    architectureNotes: string;
  }
> = {
  'cap-investment-solutions': {
    metrics: [
      { value: '100%', label: 'Sur-Mesure', desc: 'Architecture sur-mesure zéro template' },
      { value: '< 1.1s', label: 'Vitesse LCP', desc: 'Score optimal Google Core Web Vitals' },
      { value: '4+', label: 'Supports Déclinés', desc: 'Expérience cross-device irréprochable' },
      { value: '24h', label: 'Délai de Devis', desc: 'Réponse commerciale sous 24 heures' },
    ],
    colors: [
      { name: 'Bleu Royal Suisse', hex: '#0B1B3D', role: 'Fond dominant & autorité' },
      { name: 'Bleu Nuit Studio', hex: '#1C2C46', role: 'Architecture & contrastes' },
      { name: 'Vert Digital', hex: '#1D9878', role: 'Points de conversion & focus' },
      { name: 'Blanc Pur', hex: '#FFFFFF', role: 'Typographie statutaire' },
    ],
    typography: {
      primary: 'Montserrat (SemiBold / ExtraBold)',
      secondary: 'Inter & Helvetica Neue',
      style: 'Statutaire, rigoureux, lisibilité financière suisse',
    },
    architectureNotes:
      'Structure modulaire Next.js & React 19 avec navigation cinétique 100vh sans scrollbar apparente, transitions douces et score de performance Awwwards-tier.',
  },
  'gueliz-properties': {
    metrics: [
      { value: '3.2×', label: 'Taux de Conversion', desc: 'Demandes de conciergerie directe' },
      { value: '< 1.2s', label: 'Temps de Chargement', desc: 'Compression d’images haute fidélité' },
      { value: '100%', label: 'Identité Créée', desc: 'Logotype, Brand Book & Papeterie' },
      { value: '24h', label: 'Délai de Devis', desc: 'Accompagnement commercial sur mesure' },
    ],
    colors: [
      { name: 'Vert Sauge Forêt', hex: '#2D4A3E', role: 'Accent luxe organique' },
      { name: 'Ivoire Minéral', hex: '#F7F5F0', role: 'Pureté & clarté des intérieurs' },
      { name: 'Sable Chaud Marrakech', hex: '#D4C5B9', role: 'Chaleur territoriale' },
      { name: 'Bleu Nuit Studio', hex: '#1C2C46', role: 'Socle architectural SALI' },
    ],
    typography: {
      primary: 'Cormorant Garamond (Serif Élégance)',
      secondary: 'Montserrat & Inter',
      style: 'Prestige hôtelier, raffinement contemporain et distinction',
    },
    architectureNotes:
      'Mise en valeur immersive des résidences de prestige avec typographie éditoriale haute couture et passerelle directe de réservation WhatsApp.',
  },
  'imtiaz-taamine': {
    metrics: [
      { value: '+120%', label: 'Leads Qualifiés', desc: 'Génération de prospects en ligne' },
      { value: '3 Clics', label: 'Parcours Devis', desc: 'Tunnel simplifié de demande d’assurance' },
      { value: '1ère Page', label: 'SEO Google Local', desc: 'Indexation ciblée Marrakech & Maroc' },
      { value: '24h', label: 'Délai de Devis', desc: 'Étude personnalisée des contrats' },
    ],
    colors: [
      { name: 'Vert Digital Confiance', hex: '#1D9878', role: 'Sécurité & validation garanties' },
      { name: 'Bleu Institutionnel', hex: '#131F33', role: 'Sérieux & pérennité du cabinet' },
      { name: 'Blanc Pur', hex: '#FFFFFF', role: 'Lisibilité contractuelle' },
      { name: 'Bleu Nuit SALI', hex: '#1C2C46', role: 'Socle chromatique studio' },
    ],
    typography: {
      primary: 'Montserrat (Bold / Medium)',
      secondary: 'Inter System',
      style: 'Clarté légale, transparence et accessibilité immédiate',
    },
    architectureNotes:
      'Tunnel d’acquisition interactif orienté devis avec calculateurs modulaires et intégration des flux de contact direct d’urgence.',
  },
  'axeon-media': {
    metrics: [
      { value: '+240%', label: 'Portée Cumulée', desc: 'Visibilité organique sur les réseaux' },
      { value: '8+', label: 'Formats Graphiques', desc: 'Affiches, carrousels, reels, stories' },
      { value: '3.5×', label: 'Taux d’Interaction', desc: 'Engagement communautaire actif' },
      { value: '24h', label: 'Délai de Devis', desc: 'Planification stratégique immédiate' },
    ],
    colors: [
      { name: 'Magenta Événementiel', hex: '#E63946', role: 'Vibration & appel à l’action' },
      { name: 'Bleu Nuit Profond', hex: '#131F33', role: 'Fond contrasté haute tenue' },
      { name: 'Vert Émeraude', hex: '#1D9878', role: 'Énergie & signature digitale' },
      { name: 'Blanc Pur', hex: '#FFFFFF', role: 'Typographie des posters' },
    ],
    typography: {
      primary: 'Montserrat ExtraBold (Posters & Titres)',
      secondary: 'Inter (Corps & Légendes)',
      style: 'Impact événementiel, composition rythmée et modernité visuelle',
    },
    architectureNotes:
      'Direction artistique de flux social media : grille typographique audacieuse, carrousels pédagogiques à forte rétention et bannières multiformats.',
  },
  'cap-assur': {
    metrics: [
      { value: '42+', label: 'Normes de Marque', desc: 'Déclinaisons dans le Brand Book officiel' },
      { value: '100%', label: 'Vectoriel Pur', desc: 'Fichiers SVG/EPS pour tous supports' },
      { value: '4', label: 'Formats Réseaux', desc: 'Bannières LinkedIn, Facebook, etc.' },
      { value: '24h', label: 'Délai de Devis', desc: 'Prise en charge personnalisée' },
    ],
    colors: [
      { name: 'Bleu Mandat AXA', hex: '#002B66', role: 'Légitimité statutaire de marque' },
      { name: 'Vert Confiance', hex: '#1D9878', role: 'Modernité & touche SALI DigiCom' },
      { name: 'Ardoise Technique', hex: '#475569', role: 'Hiérarchie des sous-titres' },
      { name: 'Blanc Pur', hex: '#FFFFFF', role: 'Éclat vectoriel monochrome' },
    ],
    typography: {
      primary: 'Montserrat (SemiBold / Bold)',
      secondary: 'Inter Corporate',
      style: 'Institutionnel, robuste, rigueur conforme aux chartes d’assurance',
    },
    architectureNotes:
      'Création intégrale du monogramme CA, élaboration du guide complet des normes graphiques et kit papeterie corporate pour l’agence générale AXA.',
  },
};

export function ProjectCaseStudyPage({ slug, onNavigateWithCurtain }: ProjectCaseStudyPageProps) {
  const { navigate } = useRouter();
  const project = getProjectBySlug(slug);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<{ src: string; caption: string } | null>(null);

  const handleNav = (path: string) => {
    if (onNavigateWithCurtain) {
      onNavigateWithCurtain(path);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Étude de Cas | SALI DigiCom`;
    } else {
      document.title = 'Projet introuvable | SALI DigiCom';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project, slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#1C2C46] text-white flex flex-col items-center justify-center p-6 text-center font-['Montserrat',sans-serif]">
        <h1 className="text-3xl font-bold mb-4">Projet introuvable</h1>
        <p className="text-[#B8C7DA] mb-6">Le projet demandé n'existe pas ou a été déplacé.</p>
        <button
          type="button"
          onClick={() => handleNav('/projets')}
          className="px-6 py-3 rounded-full bg-[#1D9878] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
        >
          Voir toutes nos réalisations
        </button>
      </div>
    );
  }

  const nextProject = getNextProject(project.slug);
  const details = PROJECT_DETAILS_MAP[project.slug] || PROJECT_DETAILS_MAP['cap-investment-solutions'];

  return (
    <div className="min-h-screen bg-[#1C2C46] text-white font-['Montserrat',sans-serif] selection:bg-[#1D9878] selection:text-white relative overflow-x-hidden">
      {/* =====================================================================
          HEADER FIXE DIGITAL COVER STYLE
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#131F33]/95 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNav('/')}
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
            <span className="hidden sm:inline-block text-[12px] tracking-wider uppercase text-[#1D9878] font-bold">
              {project.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('/projets')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toutes les réalisations</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/creation-de-site-web')}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-xs font-bold text-white shadow-md shadow-[#1D9878]/25 transition-all cursor-pointer"
            >
              <span>Demander un devis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          SECTION 1 : HERO MONUMENTAL AVEC KINETIC SPLIT-TITLE & PLANCHE RESTREINTE
         ===================================================================== */}
      <section className="pt-44 md:pt-48 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Meta badges row */}
        <FadeIn delay={0.1} y={20} duration={1.0}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1D9878]/15 text-[#1D9878] border border-[#1D9878]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9878] animate-pulse" />
              {project.categoryLabel}
            </span>
            <span className="text-xs text-[#B8C7DA] uppercase tracking-wider font-medium">
              {project.client} · {project.city} · {project.year}
            </span>
          </div>
        </FadeIn>

        {/* Monumental Kinetic Title (Cap Investment & Digital Cover style) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-4xl">
            <FadeIn delay={0.25} y={50} duration={1.4}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                {project.title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.4} y={30} duration={1.2}>
              <p className="mt-5 text-base sm:text-lg md:text-xl text-[#B8C7DA] max-w-3xl leading-relaxed font-light">
                {project.excerpt}
              </p>
            </FadeIn>
          </div>

          {project.liveUrl && (
            <FadeIn delay={0.5} y={25} duration={1.2}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#1D9878]/30 shrink-0 self-start lg:self-end hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Visiter le site en ligne</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </FadeIn>
          )}
        </div>

        {/* Centered Handcrafted Portrait Board (Calibré strictement à 62.5% - 70% pour respiration) */}
        <FadeIn delay={0.6} y={45} duration={1.5} className="flex justify-center my-12">
          <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 bg-[#131F33] shadow-[0_32px_80px_-20px_rgba(10,16,26,0.95)] hover:border-[#1D9878] transition-all duration-500 group relative">
            <img
              src={project.portraitBoard || project.primaryImage}
              alt={`Planche officielle ${project.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
            />
            {/* Subtle floating badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl backdrop-blur-md bg-[#131F33]/80 border border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[11px] font-bold text-white tracking-wide">{project.title}</span>
              <span className="text-[10px] uppercase font-mono text-[#1D9878]">{project.year}</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* =====================================================================
          CHIFFRES CLÉS DU PROJET (4 BLOCS METRICS HAUTE PERFORMANCE)
         ===================================================================== */}
      <section className="py-14 border-y border-white/10 bg-[#131F33]/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {details.metrics.map((m, idx) => (
              <FadeIn key={m.label} delay={idx * 0.12} y={25} duration={1.1}>
                <div className="border-l-2 border-[#1D9878] pl-5 py-1">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#1D9878] font-bold mt-1">
                    {m.label}
                  </div>
                  <p className="text-xs text-[#B8C7DA] mt-1 font-light leading-snug">
                    {m.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2 : INTRODUCTION ÉDITORIALE 2 COLONNES (c-intro-project)
         ===================================================================== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Colonne Gauche : Contexte Client */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.1} y={30} duration={1.2}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
                01 / Le Contexte Client
              </span>
              <div className="flex items-center gap-4 mb-4">
                {project.whiteLogo && (
                  <img
                    src={project.whiteLogo}
                    alt={project.client}
                    className="h-9 w-auto object-contain max-w-[140px] opacity-90"
                  />
                )}
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {project.client}
                </h2>
              </div>
              <p className="text-sm md:text-base text-[#B8C7DA] leading-relaxed font-light mb-6">
                {project.aboutClient}
              </p>
              <div className="p-4 rounded-xl bg-[#131F33] border border-[#243757] text-xs text-[#B8C7DA] font-mono">
                📍 {project.city} · Mandat d'accompagnement {project.year}
              </div>
            </FadeIn>
          </div>

          {/* Colonne Droite : L'Intervention SALI DigiCom */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.25} y={30} duration={1.2}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
                02 / L'Intervention SALI DigiCom
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5 leading-tight">
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
                    className="px-4 py-2 rounded-full bg-[#131F33] border border-[#243757] text-[#B8C7DA] text-xs font-medium hover:border-[#1D9878] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3 : GRILLE ASYMÉTRIQUE DES VISUELS (b-media-grid Digital Cover)
         ===================================================================== */}
      <section className="py-24 px-6 md:px-12 bg-[#131F33]/45 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <FadeIn delay={0.1} y={25} duration={1.1}>
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
                03 / Immersion Visuelle
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                Déclinaisons Interfaces &amp; Supports
              </h2>
              <p className="text-sm text-[#B8C7DA] mt-3 font-light">
                Chaque écran et chaque support sont sculptés au pixel près pour garantir distinction et clarté.
              </p>
            </div>
          </FadeIn>

          {/* Asymmetric Duo: Left Mobile Mockup (smartphone frame) + Right Desktop Mockup (browser frame) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Mobile Column (4 cols) */}
            {project.mobileImage && (
              <FadeIn delay={0.2} x={-30} duration={1.3} className="lg:col-span-4 flex justify-center">
                <div className="w-[280px] sm:w-[300px] h-[580px] sm:h-[620px] rounded-[44px] p-3.5 bg-[#0A101A] border-2 border-white/20 shadow-2xl flex flex-col justify-between shrink-0 relative">
                  {/* Speaker notch */}
                  <div className="w-20 h-4 bg-[#1C2C46] rounded-full mx-auto mb-2 shrink-0" />
                  <div
                    className="flex-1 w-full rounded-[30px] overflow-hidden bg-[#0E1624] border border-white/10 group cursor-pointer relative"
                    onClick={() =>
                      setSelectedGalleryImg({
                        src: project.mobileImage!,
                        caption: `${project.title} — Navigation Mobile`,
                      })
                    }
                  >
                    <img
                      src={project.mobileImage}
                      alt={`${project.title} - Mobile`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 select-none"
                    />
                  </div>
                  {/* Home indicator bar */}
                  <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-2.5 shrink-0" />
                </div>
              </FadeIn>
            )}

            {/* Desktop Column (8 cols) */}
            <FadeIn
              delay={0.3}
              x={30}
              duration={1.3}
              className={project.mobileImage ? 'lg:col-span-8' : 'lg:col-span-12'}
            >
              <div
                className="w-full h-[580px] sm:h-[620px] rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl flex flex-col group cursor-pointer"
                onClick={() =>
                  setSelectedGalleryImg({
                    src: project.primaryImage || project.secondaryImage,
                    caption: `${project.title} — Interface Desktop`,
                  })
                }
              >
                {/* Browser top bar */}
                <div className="px-5 py-3.5 bg-[#1A2A42] border-b border-white/10 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    <span className="ml-4 text-xs font-mono text-[#A0B4CC]">
                      {project.liveUrl || 'https://sali-digicom.com'}
                    </span>
                  </div>
                  <Maximize2 className="w-4 h-4 text-[#A0B4CC] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 w-full overflow-hidden bg-[#0e1624] relative">
                  <img
                    src={project.primaryImage || project.secondaryImage}
                    alt={`${project.title} - Desktop`}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700 select-none"
                  />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Full-Bleed Panoramic View */}
          {(project.secondaryImage || project.detailImage) && (
            <FadeIn delay={0.4} y={35} duration={1.3}>
              <div
                className="rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl group cursor-pointer"
                onClick={() =>
                  setSelectedGalleryImg({
                    src: project.secondaryImage || project.detailImage!,
                    caption: `${project.title} — Détail d'interface & supports`,
                  })
                }
              >
                <div className="w-full h-[360px] sm:h-[460px] overflow-hidden bg-[#0e1624]">
                  <img
                    src={project.secondaryImage || project.detailImage}
                    alt={`${project.title} - Détail`}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 select-none"
                  />
                </div>
                <div className="p-5 bg-[#131F33] border-t border-[#243757] flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-[#B8C7DA]">
                    Détail d'interface, rigueur des grilles &amp; contrastes de marque
                  </span>
                  <span className="text-xs text-[#1D9878] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Agrandir</span>
                  </span>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Interactive Project Gallery (All Remaining Views) */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-6 pt-6">
              <FadeIn delay={0.1} y={20} duration={1.0}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                    <Layers className="w-5 h-5 text-[#1D9878]" />
                    <span>Galerie des Composants &amp; Déclinaisons</span>
                  </h3>
                  <span className="text-xs text-[#B8C7DA] font-mono">
                    {project.gallery.length} vues capturées
                  </span>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((item, idx) => (
                  <FadeIn key={item.src} delay={0.1 + idx * 0.08} y={30} duration={1.1}>
                    <div
                      className="group rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33] hover:border-[#1D9878] transition-all duration-300 cursor-pointer shadow-lg"
                      onClick={() => setSelectedGalleryImg(item)}
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-[#0E1624]">
                        <img
                          src={item.src}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 bg-[#131F33] border-t border-white/5 flex items-center justify-between">
                        <p className="text-xs text-[#B8C7DA] truncate max-w-[85%]">{item.caption}</p>
                        <Eye className="w-4 h-4 text-[#1D9878] opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4 : DESIGN SYSTEM & PALETTE CHROMATIQUE DU PROJET
         ===================================================================== */}
      <section className="py-24 px-6 md:px-12 border-t border-white/10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Palette Couleurs */}
          <div className="lg:col-span-6 space-y-8">
            <FadeIn delay={0.1} y={30} duration={1.2}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
                04 / Système &amp; Identité
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Palette Chromatique &amp; Typographie
              </h2>
              <p className="text-sm text-[#B8C7DA] font-light mt-2 leading-relaxed">
                Une harmonisation stricte garantissant distinction statutaire, contraste WCAG AAA et reconnaissance immédiate.
              </p>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {details.colors.map((c) => (
                  <div
                    key={c.hex}
                    className="p-4 rounded-2xl bg-[#131F33] border border-[#243757] flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-8 h-8 rounded-full border border-white/20 shrink-0 shadow-md"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{c.name}</div>
                        <div className="text-[11px] font-mono text-[#1D9878]">{c.hex}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#B8C7DA] font-light">{c.role}</span>
                  </div>
                ))}
              </div>

              {/* Typography Box */}
              <div className="p-6 rounded-2xl bg-[#131F33] border border-[#243757] space-y-3 mt-6">
                <div className="flex items-center gap-2 text-[#1D9878] font-bold text-xs uppercase tracking-wider">
                  <Palette className="w-4 h-4" />
                  <span>Direction Typographique</span>
                </div>
                <div className="text-base font-bold text-white">{details.typography.primary}</div>
                <div className="text-xs text-[#B8C7DA]">{details.typography.secondary}</div>
                <p className="text-xs text-[#1D9878] italic font-light pt-2 border-t border-white/10">
                  « {details.typography.style} »
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Livrables & Méthodologie */}
          <div className="lg:col-span-6 space-y-8">
            <FadeIn delay={0.25} y={30} duration={1.2}>
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
                    onClick={() => handleNav('/creation-de-site-web')}
                    className="px-6 py-3.5 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1D9878]/25 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                  >
                    Demander un devis
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5 : PROJET SUIVANT SIGNATURE DIGITAL COVER (c-next)
         ===================================================================== */}
      <section className="py-28 px-6 md:px-12 bg-gradient-to-b from-[#1C2C46] via-[#131F33] to-[#0D1522] border-t border-white/10 relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1D9878]/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn delay={0.2} y={40} duration={1.3}>
            <div
              data-ui="next-project-card"
              role="button"
              tabIndex={0}
              onClick={() => handleNav(`/projet/${nextProject.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNav(`/projet/${nextProject.slug}`);
                }
              }}
              className="p-8 sm:p-16 md:p-20 rounded-3xl bg-[#131F33]/90 border border-[#243757] hover:border-[#1D9878] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 group transition-all duration-700 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] cursor-pointer"
            >
              <div className="max-w-3xl">
                <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#1D9878] font-bold block mb-4 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D9878] animate-pulse" />
                  <span>Projet Suivant</span>
                </span>
                <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white group-hover:text-[#1D9878] transition-colors duration-500 leading-[0.95] tracking-tight">
                  {nextProject.title}
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-[#B8C7DA] mt-5 font-light">
                  {nextProject.categoryLabel} · {nextProject.city} · {nextProject.year}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0 self-start lg:self-center">
                <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-36 md:h-48 rounded-2xl overflow-hidden border border-white/20 bg-[#0E1624] shadow-2xl group-hover:scale-105 group-hover:border-[#1D9878] transition-all duration-500">
                  <img
                    src={nextProject.portraitBoard || nextProject.primaryImage}
                    alt={nextProject.title}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                <button
                  type="button"
                  data-ui="next-project-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNav(`/projet/${nextProject.slug}`);
                  }}
                  className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-[#1D9878] group-hover:bg-[#167d63] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#1D9878]/30 group-hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Découvrir le projet</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Lightbox Modal for Gallery Images */}
      <AnimatePresence>
        {selectedGalleryImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A101A]/95 backdrop-blur-md p-6 flex flex-col items-center justify-center"
            onClick={() => setSelectedGalleryImg(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-[#131F33] text-white hover:text-[#1D9878] border border-white/20 cursor-pointer transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="max-w-5xl max-h-[82vh] rounded-2xl overflow-hidden border border-white/20 bg-[#131F33] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedGalleryImg.src}
                alt={selectedGalleryImg.caption}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
              <div className="p-4 bg-[#131F33] border-t border-white/10 text-center text-xs text-[#B8C7DA]">
                {selectedGalleryImg.caption}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer minimaliste */}
      <footer className="border-t border-[#243757] py-8 text-center text-xs text-[#B8C7DA]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SALI DigiCom. Filiale digitale de SALI Capital Group.</p>
          <p>Casablanca &amp; Marrakech, Maroc · contact@sali-digicom.com · +212 713-370946</p>
        </div>
      </footer>
    </div>
  );
}
