import React, { useState, useEffect, useRef } from 'react';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../data/portfolioProjects';
import Logo from '../components/Logo';
import { useRouter } from '../utils/router';
import { subscribeMotion } from '../components/MotionPrimitives';

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

export interface ProjectsGalleryPageProps {
  onOpenProject?: (proj: PortfolioProject) => void;
  onNavigateWithCurtain?: (path: string) => void;
}

export function ProjectsGalleryPage({ onOpenProject, onNavigateWithCurtain }: ProjectsGalleryPageProps = {}) {
  const { navigate } = useRouter();
  const [activePoleIndex, setActivePoleIndex] = useState(0);
  const activePoleRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAllProjectsPassed, setIsAllProjectsPassed] = useState(false);

  const tunnelSecRef = useRef<HTMLElement | null>(null);
  const tunnelPlateRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleNav = (path: string) => {
    if (onNavigateWithCurtain) {
      onNavigateWithCurtain(path);
    } else {
      navigate(path);
    }
  };

  const handleOpenProject = (proj: PortfolioProject) => {
    if (onOpenProject) {
      onOpenProject(proj);
    } else if (onNavigateWithCurtain) {
      onNavigateWithCurtain(`/projet/${proj.slug}`);
    } else {
      navigate(`/projet/${proj.slug}`);
    }
  };

  useEffect(() => {
    document.title = 'Nos Réalisations | SALI DigiCom — Agence de Marketing & Communication Digitale';
    window.scrollTo(0, 0);

    const unsub = subscribeMotion((s) => {
      const secEl = tunnelSecRef.current;
      if (!secEl) return;
      const r = secEl.getBoundingClientRect();
      const vh = Math.max(1, window.innerHeight);
      const totalDist = Math.max(1, r.height - vh);
      const gp = clamp(-r.top / totalDist, 0, 1);

      setIsAllProjectsPassed(gp >= 0.78);

      const spacingZ = 750;
      const count = PORTFOLIO_PROJECTS.length;
      const totalDepth = (count - 1) * spacingZ;
      const cameraZ = -150 + gp * (totalDepth + 350);

      let closestIdx = 0;
      let minAbsZ = Infinity;

      tunnelPlateRefs.current.forEach((plateEl, idx) => {
        if (!plateEl) return;
        const plateZ = idx * spacingZ;
        const relZ = plateZ - cameraZ;
        const absRelZ = Math.abs(relZ);

        if (absRelZ < minAbsZ) {
          minAbsZ = absRelZ;
          closestIdx = idx;
        }

        const normDist = clamp((relZ + 1800) / 3600, 0, 1);
        let alpha = 1.0;
        if (relZ < -350) {
          alpha = clamp((relZ + 800) / 450, 0, 1);
        } else if (relZ > 2200) {
          alpha = clamp((3200 - relZ) / 1000, 0, 1);
        }

        const sideSign = idx % 2 === 0 ? -1 : 1;
        const lateralSpread = sideSign * (180 + normDist * 140);
        const posX = lateralSpread + (idx - closestIdx) * 35;
        const posY = Math.sin(idx * 1.3 + gp * 2.4) * 30;
        const waveBendX = -3.2 + Math.cos(gp * 3.14 + idx) * 2.0;
        const sideYaw = sideSign * -4.5;

        plateEl.style.opacity = alpha.toFixed(3);
        plateEl.style.pointerEvents = alpha > 0.32 ? 'auto' : 'none';
        plateEl.style.zIndex = String(20 + idx * 2);
        plateEl.style.transform = `translate3d(calc(-50% + ${posX.toFixed(1)}px), calc(-50% + ${posY.toFixed(1)}px), ${relZ.toFixed(1)}px) rotateX(${waveBendX.toFixed(2)}deg) rotateY(${sideYaw.toFixed(2)}deg)`;
      });

      if (closestIdx !== activePoleRef.current) {
        activePoleRef.current = closestIdx;
        setActivePoleIndex(closestIdx);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#1C2C46] text-white font-['Montserrat',sans-serif] selection:bg-[#1D9878] selection:text-white">
      {/* 3D Tunnel Réalisations */}
      <section ref={tunnelSecRef} className="dc-tunnel-section bg-[#1C2C46]">
        <div className="dc-tunnel-sticky relative overflow-hidden">
          {/* Top Header Fixed Bar */}
          <div className="absolute top-5 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-40 pointer-events-none">
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => handleNav('/')}
                className="group focus:outline-none cursor-pointer"
                aria-label="Accueil SALI DigiCom"
              >
                <Logo variant="digicom" type="horizontal" className="h-7 sm:h-8 md:h-9 w-auto opacity-95 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="flex items-center gap-4 pointer-events-auto">
              <button
                type="button"
                onClick={() => handleNav('/')}
                className="px-4 py-2 rounded-full border border-white/20 hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/15 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all shadow-md cursor-pointer"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </div>

          {/* Right side active project name typography */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-right pointer-events-none z-20 hidden md:block">
            <div className="text-[26px] lg:text-[32px] font-extrabold text-white tracking-tight drop-shadow-md">
              {PORTFOLIO_PROJECTS[activePoleIndex]?.title}
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#1D9878] font-bold mt-1">
              {PORTFOLIO_PROJECTS[activePoleIndex]?.categoryLabel}
            </div>
          </div>

          {/* 3D Perspective Stage */}
          <div className="dc-tunnel-stage" aria-label="Galerie 3D des réalisations SALI DigiCom">
            {PORTFOLIO_PROJECTS.map((proj, idx) => (
              <button
                key={`tunnel-page-${proj.id}`}
                ref={(el) => {
                  tunnelPlateRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => handleOpenProject(proj)}
                className="dc-tunnel-plate group"
                aria-label={`Étude de cas : ${proj.title}`}
              >
                <div className="dc-tunnel-single-card">
                  <img
                    src={proj.portraitBoard || proj.primaryImage}
                    alt={proj.title}
                    loading="eager"
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Bouton 1: Calé en BAS du viewport */}
          <div
            className={`dc-tunnel-bottom-cta transition-all duration-500 ease-out ${
              isAllProjectsPassed
                ? 'opacity-0 pointer-events-none translate-y-6'
                : 'opacity-100 pointer-events-auto translate-y-0'
            }`}
          >
            <button
              type="button"
              onClick={() => handleOpenProject(PORTFOLIO_PROJECTS[activePoleIndex])}
              className="dc-tunnel-diamond-btn group"
              aria-label={`Voir le projet ${PORTFOLIO_PROJECTS[activePoleIndex]?.title || ''}`}
            >
              <div className="dc-tunnel-diamond-content">
                <svg className="w-5 h-5 text-[#1D9878] mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-[12px] font-bold text-white tracking-wider underline underline-offset-4 decoration-[#1D9878]">
                  Voir le projet
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Monumental Footer avec Demi-triangle géométrique tout en bas */}
      <footer className="dc-footer bg-[#1C2C46] relative overflow-hidden">
        <div className="dc-container-inset relative z-10">
          <div className="dc-footer-grid">
            <div>
              <p className="text-[18px] text-white mb-2">Où nous trouver</p>
              <a href="mailto:contact@sali-digicom.com" className="dc-hollow-city">
                Casablanca
              </a>
              <div className="mt-4">
                <img
                  src="/logo-digicom-white-horizontal.png"
                  alt="SALI DigiCom"
                  className="h-7 w-auto opacity-80"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 text-[16px]">
              <a href="tel:+212713370946" className="text-white hover:opacity-75 transition-opacity">
                +212 713-370946
              </a>
              <a
                href="mailto:contact@sali-digicom.com"
                className="text-white hover:opacity-75 transition-opacity"
              >
                contact@sali-digicom.com
              </a>
              <p className="text-[#B8C7DA]">Casablanca, Maroc</p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => handleNav('/creation-de-site-web')}
                  className="dc-pill-btn"
                >
                  <span className="dc-pill-btn-fill" />
                  <span className="dc-pill-btn-content">
                    <span>Démarrer un projet</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="dc-footer-bottom text-[16px] text-[#9a9a9a]">
            <p>© {new Date().getFullYear()} SALI DigiCom. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
