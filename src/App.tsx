import React, { useState, useEffect, useRef, useCallback } from 'react';
import WebGLPrism from './components/WebGLPrism';
import { SaliDigiCom } from './components/SaliDigiCom';
import Logo from './components/Logo';
import {
  SmoothScrollbar,
  CurvedCurtainTransition,
  subscribeMotion,
} from './components/MotionPrimitives';
import { RouterProvider, useRouter } from './utils/router';
import { ProjectsGalleryPage } from './pages/ProjectsGalleryPage';
import { ProjectCaseStudyPage } from './pages/ProjectCaseStudyPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { Globe, Share2, Sparkles, FolderKanban } from 'lucide-react';

function AppContent() {
  const { route, navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [digicomCurrentSection, setDigicomCurrentSection] = useState(0);

  // Curved Bezier curtain transition state (Ee.prototype from mod-954-core.js)
  const [curtainId, setCurtainId] = useState(0);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const skipIntroLoader = (() => {
    if (typeof window === 'undefined') return true;
    return (
      Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  })();

  const [loaderPct, setLoaderPct] = useState<number>(() => (skipIntroLoader ? 100 : 0));
  const [loaderExiting, setLoaderExiting] = useState<boolean>(() => skipIntroLoader);
  const [isReady, setIsReady] = useState<boolean>(() => skipIntroLoader);

  useEffect(() => {
    if (route.type === 'home') {
      document.title = 'SALI DigiCom | Agence de Marketing & Communication Digitale';
    }
  }, [route.type]);

  // Authentic Loader sequence: count 00% -> 100%, then drop split digits into baseline mask + collapse line + spin in Prism
  useEffect(() => {
    if (skipIntroLoader) {
      setLoaderExiting(true);
      setIsReady(true);
      return;
    }

    let frame = 0;
    let readyTimer = 0;
    const start = performance.now();
    const countDuration = 680;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / countDuration);
      const eased = 1 - Math.pow(1 - p, 3);
      setLoaderPct(Math.round(eased * 100));

      if (p < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setLoaderExiting(true);
        readyTimer = window.setTimeout(() => {
          setIsReady(true);
        }, 380);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(readyTimer);
    };
  }, [skipIntroLoader]);

  // Header scroll-reactive "Menu" label hide after 0.5 * vh
  useEffect(() => {
    let lastScrolled = false;
    return subscribeMotion((s) => {
      const next = s.rawY > s.vh * 0.45;
      if (next !== lastScrolled) {
        lastScrolled = next;
        setIsHeaderScrolled(next);
      }
    });
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const runWithCurtain = useCallback((action: () => void) => {
    pendingActionRef.current = action;
    setCurtainId((n) => n + 1);
  }, []);

  const handleCurtainMidpoint = useCallback(() => {
    const fn = pendingActionRef.current;
    pendingActionRef.current = null;
    fn?.();
  }, []);

  const scrollToId = (id: string, idx: number, useCurtain = false) => {
    const performScroll = () => {
      setDigicomCurrentSection(idx);
      setIsMenuOpen(false);
      if (id === 'intro') {
        window.scrollTo({ top: 0, behavior: useCurtain ? 'auto' : 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: useCurtain ? 'auto' : 'smooth', block: 'start' });
      }
    };

    if (useCurtain) {
      runWithCurtain(performScroll);
    } else {
      performScroll();
    }
  };

  const handleOpenQuestionnaire = useCallback(
    (type: 'website' | 'community' | 'branding') => {
      setIsMenuOpen(false);
      const targetPath =
        type === 'website'
          ? '/creation-de-site-web'
          : type === 'community'
            ? '/community-management'
            : '/identite-visuelle';

      runWithCurtain(() => {
        navigate(targetPath);
      });
    },
    [navigate, runWithCurtain]
  );

  const handleOpenAllProjects = useCallback(() => {
    setIsMenuOpen(false);
    runWithCurtain(() => {
      navigate('/projets');
    });
  }, [navigate, runWithCurtain]);

  const handleOpenProject = useCallback(
    (proj: { slug: string }) => {
      setIsMenuOpen(false);
      runWithCurtain(() => {
        navigate(`/projet/${proj.slug}`);
      });
    },
    [navigate, runWithCurtain]
  );

  // Dedicated Route Views
  if (route.type === 'projects-gallery') {
    return (
      <div className="min-h-screen bg-[#1C2C46]">
        <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />
        <ProjectsGalleryPage />
      </div>
    );
  }

  if (route.type === 'project-case-study') {
    return (
      <div className="min-h-screen bg-[#1C2C46]">
        <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />
        <ProjectCaseStudyPage slug={route.slug} />
      </div>
    );
  }

  if (route.type === 'questionnaire-web') {
    return (
      <div className="min-h-screen bg-[#1C2C46]">
        <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />
        <QuestionnairePage type="website" />
      </div>
    );
  }

  if (route.type === 'questionnaire-community') {
    return (
      <div className="min-h-screen bg-[#1C2C46]">
        <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />
        <QuestionnairePage type="community" />
      </div>
    );
  }

  if (route.type === 'questionnaire-branding') {
    return (
      <div className="min-h-screen bg-[#1C2C46]">
        <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />
        <QuestionnairePage type="branding" />
      </div>
    );
  }

  if (route.type === 'service-detail') {
    return (
      <div className="min-h-screen bg-[#1C2C46]">
        <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />
        <ServiceDetailPage slug={route.slug} />
      </div>
    );
  }

  // Home Page View
  const formattedPct = `${loaderPct < 10 ? `0${loaderPct}` : loaderPct}%`;
  const pctChars = formattedPct.split('');

  const menuItems = [
    { label: 'Expertises', id: 'expertises', idx: 2 },
    { label: 'Nos réalisations', id: 'poles', idx: 1 },
    { label: 'Le studio', id: 'atelier', idx: 3 },
    { label: 'Nous contacter', id: 'contact', idx: 4 },
  ];

  return (
    <div className={`min-h-[100svh] w-full bg-[#1C2C46] text-white relative ${isReady ? 'is-ready' : ''}`}>
      {/* Scrollbar */}
      <SmoothScrollbar />

      {/* Curved SVG Curtain */}
      <CurvedCurtainTransition transitionId={curtainId} onMidpoint={handleCurtainMidpoint} />

      {/* Minimalist Loader */}
      <div
        className={`dc-loader ${loaderExiting ? 'is-exiting' : ''} ${isReady ? 'is-done' : ''}`}
        aria-hidden="true"
      >
        <div className="dc-loader-inner">
          <div className="dc-loader-percent">
            {pctChars.map((ch, idx) => (
              <span key={`ld-${idx}`} className="dc-loader-char-mask">
                <span
                  className="dc-loader-char"
                  style={{ transitionDelay: `${(idx * 0.055).toFixed(3)}s` }}
                >
                  {ch}
                </span>
              </span>
            ))}
          </div>
          <div className="dc-loader-track">
            <div
              className="dc-loader-bar"
              style={{
                transform: loaderExiting ? 'scaleX(0)' : `scaleX(${loaderPct / 100})`,
                transformOrigin: loaderExiting ? 'right center' : 'left center',
              }}
            />
          </div>
        </div>
      </div>

      {/* 3D WebGL Monogram SD */}
      <WebGLPrism menuOpen={isMenuOpen} isReady={isReady} />

      {/* Fixed Two-Corner Header */}
      <header className="dc-header">
        <div className="dc-container dc-header-row">
          {/* Left: Official Monochrome White SALI DigiCom Logo */}
          <button
            type="button"
            onClick={() => scrollToId('intro', 0, isMenuOpen)}
            aria-label="Retour en haut SALI DigiCom"
            className="dc-logo-btn group"
          >
            <Logo
              variant="digicom"
              type="horizontal"
              className="h-8 md:h-9 w-auto max-w-[170px] opacity-95 group-hover:opacity-100 transition-opacity"
            />
          </button>

          {/* Right: Menu Toggle */}
          <button
            id="burger-toggle"
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className={`dc-menu-toggler ${isMenuOpen ? 'is-open' : ''} ${
              isHeaderScrolled && !isMenuOpen ? 'is-scrolled' : ''
            }`}
          >
            <span className="dc-menu-label-mask">
              <span className="dc-menu-label-track">
                <span>Menu</span>
                <span aria-hidden="true">&nbsp;</span>
                <span>Fermer</span>
              </span>
            </span>
            <span className="dc-menu-diamond" aria-hidden="true">
              <svg viewBox="0 0 45.9 45.9" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  d="M23,1c1.7,0,3.5,0.7,4.8,2l15.2,15.2c2.6,2.6,2.6,6.9,0,9.6L27.7,42.9c-2.6,2.6-6.9,2.6-9.6,0L3,27.7c-2.6-2.6-2.6-6.9,0-9.6L18.2,3C19.5,1.7,21.2,1,23,1"
                />
              </svg>
              <span className="dc-menu-cross dc-menu-cross--a" />
              <span className="dc-menu-cross dc-menu-cross--b" />
            </span>
          </button>
        </div>
      </header>

      {/* Full-Viewport Menu Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation principale SALI DigiCom"
        className={`dc-menu-overlay ${isMenuOpen ? 'is-open' : ''}`}
      >
        <div className="dc-container-inset my-auto w-full">
          <nav className="dc-menu-list" aria-label="Sections">
            {menuItems.map((item, i) => (
              <div key={item.id} className="dc-menu-item-mask">
                <button
                  type="button"
                  onClick={() => scrollToId(item.id, item.idx, true)}
                  className="dc-menu-item"
                  style={{ transitionDelay: isMenuOpen ? `${(0.08 + i * 0.075).toFixed(3)}s` : '0s' }}
                >
                  {item.label}
                </button>
              </div>
            ))}

            {/* Direct Link to /projets in menu */}
            <div className="dc-menu-item-mask pt-2">
              <button
                type="button"
                onClick={handleOpenAllProjects}
                className="dc-menu-item text-[#1D9878] hover:text-white flex items-center gap-3 text-2xl sm:text-3xl"
              >
                <FolderKanban className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Voir toutes nos réalisations</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="dc-container dc-menu-footer">
          <a
            href="https://salicapitalgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="dc-pill-btn"
          >
            <span className="dc-pill-btn-fill" />
            <span className="dc-pill-btn-content">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M4.83869 1.16131C5.48006 0.519937 6.51994 0.519937 7.16131 1.16131L10.8387 4.83869C11.4801 5.48006 11.4801 6.51994 10.8387 7.16131L7.16131 10.8387C6.51994 11.4801 5.48006 11.4801 4.83869 10.8387L1.16131 7.16131C0.519937 6.51994 0.519937 5.48006 1.16131 4.83869L4.83869 1.16131Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              <span>SALI Capital Group</span>
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => handleOpenQuestionnaire('website')}
              className="dc-pill-btn"
            >
              <span className="dc-pill-btn-fill" />
              <span className="dc-pill-btn-content">
                <Globe className="w-3.5 h-3.5 text-[#1D9878]" />
                <span>Création de Site Web</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenQuestionnaire('community')}
              className="dc-pill-btn"
            >
              <span className="dc-pill-btn-fill" />
              <span className="dc-pill-btn-content">
                <Share2 className="w-3.5 h-3.5 text-[#1D9878]" />
                <span>Community Management</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenQuestionnaire('branding')}
              className="dc-pill-btn"
            >
              <span className="dc-pill-btn-fill" />
              <span className="dc-pill-btn-content">
                <Sparkles className="w-3.5 h-3.5 text-[#1D9878]" />
                <span>Identité Visuelle</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Digital Stage */}
      <main id="viewport" className={`dc-stage ${isMenuOpen ? 'is-menu-open' : ''}`}>
        <SaliDigiCom
          isActive={true}
          isReady={isReady}
          onClose={() => scrollToId('intro', 0)}
          currentSection={digicomCurrentSection}
          setCurrentSection={setDigicomCurrentSection}
          onOpenQuestionnaire={handleOpenQuestionnaire}
          onOpenAllProjects={handleOpenAllProjects}
          onOpenProject={handleOpenProject}
          runWithCurtain={runWithCurtain}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
