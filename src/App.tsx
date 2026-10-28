import React, { useState, useEffect, useRef, useCallback } from 'react';
import WebGLPrism from './components/WebGLPrism';
import { SaliDigiCom } from './components/SaliDigiCom';
import QuestionnaireFlow from './components/QuestionnaireFlow';
import Logo from './components/Logo';
import {
  SmoothScrollbar,
  CurvedCurtainTransition,
  subscribeMotion,
} from './components/MotionPrimitives';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [digicomCurrentSection, setDigicomCurrentSection] = useState(0);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<'website' | 'community' | 'branding' | null>(null);
  const [questionnaireInitialData, setQuestionnaireInitialData] = useState<
    { name?: string; phone?: string; email?: string; company?: string } | undefined
  >(undefined);

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
    document.title = 'SALI DigiCom | Agence Digitale, Plateformes Web, Marque & Acquisition';
  }, []);

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

  // Header scroll-reactive "Menu" label hide after 0.5 * vh (K.prototype.scroll in mod-954-core.js)
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
    if (isMenuOpen || activeQuestionnaire) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, activeQuestionnaire]);

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
    (
      type: 'website' | 'community' | 'branding',
      initialData?: { name?: string; phone?: string; email?: string; company?: string }
    ) => {
      runWithCurtain(() => {
        setQuestionnaireInitialData(initialData);
        setActiveQuestionnaire(type);
        setIsMenuOpen(false);
      });
    },
    [runWithCurtain]
  );

  const formattedPct = `${loaderPct < 10 ? `0${loaderPct}` : loaderPct}%`;
  const pctChars = formattedPct.split('');

  const menuItems = [
    { label: 'Expertises', id: 'expertises', idx: 2 },
    { label: 'Nos pôles', id: 'poles', idx: 1 },
    { label: 'Le studio', id: 'atelier', idx: 3 },
    { label: 'Nous contacter', id: 'contact', idx: 4 },
  ];

  return (
    <div className={`min-h-[100svh] w-full bg-[#1C2C46] text-white relative ${isReady ? 'is-ready' : ''}`}>
      {/* =====================================================================
          RIGHT-EDGE INERTIAL SCROLLBAR THUMB (.c-scrollbar)
         ===================================================================== */}
      <SmoothScrollbar />

      {/* =====================================================================
          CURVED DOUBLE-BEZIER SVG CURTAIN OVERLAY (Ee.prototype)
         ===================================================================== */}
      <CurvedCurtainTransition
        transitionId={curtainId}
        onMidpoint={handleCurtainMidpoint}
      />

      {/* =====================================================================
          MINIMALIST LOADER (00% -> 100% + SPLIT BASELINE DROP)
         ===================================================================== */}
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

      {/* =====================================================================
          INTERACTIVE 3D WEBGL MOBIUS OBSIDIAN-CHROME PRISM (#gl)
         ===================================================================== */}
      <WebGLPrism menuOpen={isMenuOpen} isReady={isReady} />

      {/* =====================================================================
          FIXED TWO-CORNER HEADER (mix-blend-mode: difference)
         ===================================================================== */}
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

          {/* Right: Menu / Scrolled-Blank / Fermer + 45.9x45.9 Rounded-Diamond SVG */}
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

      {/* =====================================================================
          FULL-VIEWPORT MENU OVERLAY (.menu) WITH STAGGERED MASKED TITLES
         ===================================================================== */}
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
                <svg width="24" height="16" viewBox="0 0 34 22" fill="none" aria-hidden="true">
                  <path
                    d="M23.9805 20.5705L31.4172 13.1338C32.7142 11.8367 32.7142 9.73378 31.4172 8.43673L23.9805 1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M32.5 10.7773H0" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Configurateur Site Web</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenQuestionnaire('community')}
              className="dc-pill-btn"
            >
              <span className="dc-pill-btn-fill" />
              <span className="dc-pill-btn-content">
                <svg width="24" height="16" viewBox="0 0 34 22" fill="none" aria-hidden="true">
                  <path
                    d="M23.9805 20.5705L31.4172 13.1338C32.7142 11.8367 32.7142 9.73378 31.4172 8.43673L23.9805 1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M32.5 10.7773H0" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Configurateur Social Media</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN DIGITAL-COVER MONOCHROME STAGE
         ===================================================================== */}
      <main id="viewport" className={`dc-stage ${isMenuOpen ? 'is-menu-open' : ''}`}>
        <SaliDigiCom
          isActive={true}
          isReady={isReady}
          onClose={() => scrollToId('intro', 0)}
          currentSection={digicomCurrentSection}
          setCurrentSection={setDigicomCurrentSection}
          onOpenQuestionnaire={handleOpenQuestionnaire}
          runWithCurtain={runWithCurtain}
        />
      </main>

      {/* =====================================================================
          INTERACTIVE QUESTIONNAIRE MODAL OVERLAY (PORTALED)
         ===================================================================== */}
      {activeQuestionnaire && (
        <QuestionnaireFlow
          type={activeQuestionnaire}
          initialContactInfo={
            questionnaireInitialData
              ? {
                  name: questionnaireInitialData.name || '',
                  email: questionnaireInitialData.email || '',
                  phone: questionnaireInitialData.phone || '',
                  company: questionnaireInitialData.company || '',
                }
              : null
          }
          onClose={() => {
            setActiveQuestionnaire(null);
            setQuestionnaireInitialData(undefined);
          }}
        />
      )}
    </div>
  );
}
