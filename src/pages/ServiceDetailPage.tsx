import React, { useEffect } from 'react';
import { useRouter } from '../utils/router';
import { SERVICES_CATALOG } from '../data/servicesData';
import { PORTFOLIO_PROJECTS } from '../data/portfolioProjects';
import Logo from '../components/Logo';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap,
  ShieldCheck,
  Cpu,
  BarChart3,
  Flame,
} from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const service = SERVICES_CATALOG[slug] || SERVICES_CATALOG['web'];

  useEffect(() => {
    document.title = `${service.title} | SALI DigiCom`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [service]);

  // Related projects
  const relatedProjects = PORTFOLIO_PROJECTS.filter((p) =>
    service.relatedProjectIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-[#1C2C46] text-white selection:bg-[#1D9878] selection:text-white">
      {/* Top Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1C2C46]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group bg-transparent border-0 p-0 text-white cursor-pointer"
        >
          <Logo size="small" variant="horizontal" />
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B8C7DA] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const qRoute =
                slug === 'branding'
                  ? '/identite-visuelle'
                  : slug === 'social-media'
                  ? '/community-management'
                  : '/creation-de-site-web';
              navigate(qRoute);
            }}
            className="px-5 py-2.5 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1D9878]/25"
          >
            Demander un devis
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131F33] border border-[#243757] text-[#1D9878] text-xs font-bold uppercase tracking-widest mb-6">
          <span>Pôle d'Expertise {service.categoryNumber}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl">
          {service.title}
        </h1>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-[#B8C7DA] max-w-3xl font-light leading-relaxed">
          {service.tagline}
        </p>

        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <button
            type="button"
            onClick={() => {
              const qRoute =
                slug === 'branding'
                  ? '/identite-visuelle'
                  : slug === 'social-media'
                  ? '/community-management'
                  : '/creation-de-site-web';
              navigate(qRoute);
            }}
            className="px-8 py-4 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#1D9878]/30 flex items-center gap-3"
          >
            <span>Démarrer votre projet</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href="#details"
            className="px-7 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-sm transition-all"
          >
            Explorer les prestations
          </a>
        </div>

        {/* Hero Visual Scene */}
        <div className="mt-14 rounded-3xl overflow-hidden border border-[#243757] bg-[#131F33] shadow-2xl relative max-h-[540px]">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover object-top select-none opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2C46] via-transparent to-transparent opacity-80" />
        </div>
      </section>

      {/* Overview 2 Columns (Digital Cover style: Story & Vision) */}
      <section id="details" className="py-20 px-6 md:px-12 border-t border-white/10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
              Notre Approche
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              L'exigence d'un studio d'art, la rigueur d'ingénieurs.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#B8C7DA] text-base md:text-lg leading-relaxed font-light">
            <p>{service.heroExcerpt}</p>
            <p>{service.overview}</p>
          </div>
        </div>
      </section>

      {/* Sub-Services Bento Grid */}
      <section className="py-20 px-6 md:px-12 bg-[#131F33]/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
              Champs d'Action
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Prestations &amp; Savoir-faire
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#B8C7DA]">
              Un accompagnement modulaire de la stratégie à la livraison finale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.subServices.map((sub, idx) => (
              <div
                key={sub.title}
                className="p-8 rounded-2xl bg-[#131F33] border border-[#243757] hover:border-[#1D9878]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1C2C46] border border-white/10 flex items-center justify-center text-[#1D9878] mb-6 font-mono text-sm font-bold group-hover:scale-110 transition-transform">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#1D9878] transition-colors">
                    {sub.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#B8C7DA] leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Key Figures / Metrics */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.bentoFeatures.map((feat) => (
            <div
              key={feat.title}
              className="p-8 rounded-2xl bg-[#131F33] border border-[#243757] flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl md:text-5xl font-extrabold text-[#1D9878] block mb-4 font-mono">
                  {feat.metric}
                </span>
                <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-xs md:text-sm text-[#B8C7DA] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deliverables Checklist */}
      <section className="py-20 px-6 md:px-12 bg-[#131F33]/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
              Engagements Studio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ce que nous livrons clé en main.
            </h2>
            <p className="mt-4 text-sm text-[#B8C7DA]">
              Chaque livrable est validé rigoureusement avant transmission et accompagné d’une garantie de parfait achèvement.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {service.deliverables.map((item) => (
              <div
                key={item}
                className="p-4 rounded-xl bg-[#131F33] border border-[#243757] flex items-center gap-4"
              >
                <CheckCircle2 className="w-5 h-5 text-[#1D9878] shrink-0" />
                <span className="text-sm md:text-base text-white/90 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects Showcase */}
      {relatedProjects.length > 0 && (
        <section className="py-24 px-6 md:px-12 border-t border-white/10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-2">
                Réalisations
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                Projets associés à cette expertise
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/projets')}
              className="inline-flex items-center gap-2 text-sm text-[#1D9878] hover:text-white transition-colors self-start md:self-end font-semibold"
            >
              <span>Voir toutes nos réalisations</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/projet/${p.slug}`)}
                className="group text-left bg-transparent border-0 p-0 cursor-pointer block"
              >
                <div className="rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33] aspect-[3/4] max-w-[340px] mx-auto shadow-xl group-hover:border-[#1D9878] transition-all duration-500">
                  <img
                    src={p.portraitBoard || p.primaryImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  />
                </div>
                <div className="mt-4 max-w-[340px] mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D9878] block">
                    {p.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#1D9878] transition-colors mt-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#B8C7DA] mt-1 line-clamp-2">
                    {p.excerpt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA Block */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#1C2C46] to-[#131F33] border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1D9878] block mb-3">
            Passer à l'action
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Prêt à transformer votre présence avec cette expertise ?
          </h2>
          <p className="mt-5 text-base md:text-lg text-[#B8C7DA] max-w-xl mx-auto">
            Décrivez vos objectifs en quelques étapes simples pour recevoir un devis détaillé sous 24 heures.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => {
                const qRoute =
                  slug === 'branding'
                    ? '/identite-visuelle'
                    : slug === 'social-media'
                    ? '/community-management'
                    : '/creation-de-site-web';
                navigate(qRoute);
              }}
              className="px-8 py-4 rounded-full bg-[#1D9878] hover:bg-[#167d63] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#1D9878]/30 flex items-center gap-3"
            >
              <span>Demander un devis personnalisé</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-sm transition-all"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 px-6 text-center text-xs text-[#9a9a9a]">
        <p>© {new Date().getFullYear()} SALI DigiCom · Casablanca, Maroc · Filiale de SALI Capital Group.</p>
      </footer>
    </div>
  );
};
