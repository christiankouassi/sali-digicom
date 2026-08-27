/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  Send, 
  ArrowRight
} from 'lucide-react';
import SaliCommodities from './components/SaliCommodities';
import FonciereDassouli from './components/FonciereDassouli';
import SaliDigiCom from './components/SaliDigiCom';
import QuestionnaireFlow from './components/QuestionnaireFlow';
import Logo from './components/Logo';
import { Language, translations } from './translations';
import * as Config from './config';

const safePushState = (state: any, url: string) => {
  try {
    window.history.pushState(state, '', url);
  } catch (e) {
    console.warn('History pushState is restricted or disabled in this iframe:', e);
  }
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Domain detection and helpers (defined at component root for unified state access)
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('192.168.');
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const buildMode = import.meta.env.MODE;
  const isDigiComDomain = true;

  useEffect(() => {
    const start = Date.now();
    const duration = 1500; // 1.5 seconds loading time for perfect feel
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(nextProgress);
      
      if (nextProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 250);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const [lang] = useState<Language>('fr');
  const t = translations[lang];

  const [currentSection, setCurrentSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [activePage, setActivePage] = useState<'main' | 'commodities' | 'dassouli' | 'digicom'>('main');
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<'website' | 'community' | null>(null);
  const [prefilledContactInfo, setPrefilledContactInfo] = useState<any>(null);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [activePill, setActivePill] = useState<keyof typeof t.about.pills>('integrity');
  const [openBoxIndex, setOpenBoxIndex] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [activeContactTab, setActiveContactTab] = useState(0);

  const sectionPadds = lang === 'ar' 
    ? 'lg:pr-[290px] xl:pr-[330px] lg:pl-10 xl:pl-16' 
    : 'lg:pl-[290px] xl:pl-[330px] lg:pr-10 xl:pr-16';

  const activeConfig = Config.PAGES_CONFIG[activePage] || Config.PAGES_CONFIG.main;
  const activeSections = activeConfig.sections;
  const activeNames = t.sections[activePage] || t.sections.main;

  // Persistent references to ensure touch and scroll states are robust and do not reset on transition
  const currentSectionRef = useRef(currentSection);
  const activeSectionsRef = useRef(activeSections);
  const isMovingRef = useRef(isMoving);
  const isMenuOpenRef = useRef(isMenuOpen);
  const touchYRef = useRef(0);
  const hasTriggeredSwipeRef = useRef(false);
  const transitionLockRef = useRef(false);

  // Sync references with React state variables on every render
  currentSectionRef.current = currentSection;
  activeSectionsRef.current = activeSections;
  isMovingRef.current = isMoving;
  isMenuOpenRef.current = isMenuOpen;

  const handleSectionClick = (index: number) => {
    goToSection(index);
  };
  
  // Contact Form Fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Router for direct link support and popstate back action
  useEffect(() => {
    const handleUrlRouting = () => {
      if (isDigiComDomain) {
        setActivePage('digicom');
        return;
      }

      let path = window.location.pathname.toLowerCase();
      // Normalize pathname by removing trailing slash
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      // Normalize pathname by removing index.html
      if (path.endsWith('/index.html')) {
        path = path.slice(0, -11);
      }
      // Remove trailing slash again if it was /salidigicom/index.html
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      const hash = window.location.hash.toLowerCase();
      if (path === '/salicommodities' || hash === '#salicommodities') {
        setActivePage('commodities');
      } else if (path === '/dassouli' || hash === '#dassouli' || path === '/foncieredassouli' || hash === '#foncieredassouli') {
        setActivePage('dassouli');
      } else if (path === '/salidigicom' || hash === '#salidigicom' || path === '/digicom' || hash === '#digicom') {
        setActivePage('digicom');
      } else {
        setActivePage('main');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  // Update document title and favicon dynamically based on page & language
  useEffect(() => {
    let title = "SALI Capital | Société d'investissement";
    let iconUrl = "https://i.pinimg.com/1200x/b7/9d/31/b79d31fa6a30faac8ad1f97ddfcf7b00.jpg";
    
    if (activePage === 'commodities') {
      title = lang === 'ar' 
        ? 'سالي كوموديتيز | تجارة واستيراد وتصدير' 
        : lang === 'en' 
          ? 'SALI Commodities | Trade & Agroindustry' 
          : 'SALI Commodities | Négoce & Agroalimentaire';
      iconUrl = "https://i.postimg.cc/fbhrdVzD/5.png";
    } else if (activePage === 'dassouli') {
      title = lang === 'ar' 
        ? 'فونسير الدسولي | استثمار عقاري' 
        : lang === 'en' 
          ? 'Foncière Dassouli | Rental Real Estate Investment' 
          : 'Foncière Dassouli | Investissement Immobilier Locatif';
      iconUrl = "https://i.postimg.cc/SRm07fwV/Dassouli.png";
    } else if (activePage === 'digicom') {
      title = lang === 'ar' 
        ? 'سالي ديجي كوم | وكالة تسويق رقمي' 
        : lang === 'en' 
          ? 'SALI DigiCom | Digital Marketing Agency' 
          : 'SALI DigiCom | Agence de Marketing & Communication Digitale';
      iconUrl = "/favicon.png";
    } else {
      title = lang === 'ar' 
        ? 'سالي كابيتال | شركة استثمارية' 
        : lang === 'en' 
          ? 'SALI Capital | Investment Company' 
          : 'SALI Capital | Société d\'investissement';
      iconUrl = "https://i.pinimg.com/1200x/b7/9d/31/b79d31fa6a30faac8ad1f97ddfcf7b00.jpg";
    }
    
    document.title = title;
    
    // Update favicons in head dynamically
    const linkIcon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (linkIcon) {
      linkIcon.href = iconUrl;
    }
    const appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (appleIcon) {
      appleIcon.href = iconUrl;
    }
  }, [activePage, lang]);

  const changePage = (page: 'main' | 'commodities' | 'dassouli' | 'digicom', targetSection: number = 0) => {
    transitionLockRef.current = false;
    hasTriggeredSwipeRef.current = false;

    if (!isLocalhost) {
      if (isDigiComDomain) {
        if (page !== 'digicom') {
          let redirectPath = '';
          if (page === 'commodities') redirectPath = '/salicommodities';
          else if (page === 'dassouli') redirectPath = '/foncieredassouli';

          window.location.href = `https://sali-capital.com${redirectPath}`;
          return;
        }
      }
    } else {
      // Localhost simulation URL sync
      if (page === 'digicom' && searchParams?.get('domain') === 'digicom') {
        // Keep domain parameter if already simulating it
      } else if (page !== 'digicom') {
        // Clean query params when navigating back to holding
        const cleanUrl = window.location.pathname;
        window.history.pushState(null, '', cleanUrl);
      }
    }

    setActivePage(page);
    setCurrentSection(targetSection);
    if (page === 'commodities') {
      safePushState(null, '/salicommodities');
    } else if (page === 'dassouli') {
      safePushState(null, '/foncieredassouli');
    } else if (page === 'digicom') {
      safePushState(null, '/salidigicom');
    } else {
      safePushState(null, '/');
      setTimeout(() => {
        const sectionId = Config.PAGES_CONFIG.main.sections[targetSection] || 'hero';
        triggerAnimationsWithRetry(sectionId);
      }, 150);
    }
  };

  // Handle Cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    let rafId: number;
    const animateCursor = () => {
      setCursorPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.14,
        y: prev.y + (mousePos.y - prev.y) * 0.14
      }));
      rafId = requestAnimationFrame(animateCursor);
    };
    rafId = requestAnimationFrame(animateCursor);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mousePos]);

  const triggerAnimations = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return false;
    
    // Add 'vis' class immediately to start snappy cascading animations
    const elements = section.querySelectorAll('.ae');
    if (elements.length === 0) return false;

    elements.forEach(el => {
      el.classList.add('vis');
    });
    return true;
  }, []);

  const triggerAnimationsWithRetry = useCallback((sectionId: string) => {
    if (triggerAnimations(sectionId)) return;

    // Retry quickly multiple times then slightly later on delay to cover any mounting lag
    const delays = [10, 30, 80, 150, 300, 600, 1000];
    delays.forEach(delay => {
      setTimeout(() => {
        triggerAnimations(sectionId);
      }, delay);
    });
  }, [triggerAnimations]);

  const goToSection = useCallback((index: number) => {
    if (transitionLockRef.current || index < 0 || index >= activeSectionsRef.current.length) return;
    
    transitionLockRef.current = true;
    setIsMoving(true);
    setCurrentSection(index);
    
    // Settle transition lock quickly to match new snappier style
    setTimeout(() => {
      setIsMoving(false);
      transitionLockRef.current = false;
    }, 700); 
  }, []);

  // Handle Wheel and Touch
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (transitionLockRef.current || isMovingRef.current || isMenuOpenRef.current) return;
      
      const target = e.target as HTMLElement | null;
      const scrollable = target && typeof target.closest === 'function' 
        ? target.closest('.overflow-y-auto') as HTMLElement 
        : null;
        
      if (scrollable) {
        const hasOverflow = scrollable.scrollHeight > scrollable.clientHeight;
        if (hasOverflow) {
          const isAtTop = scrollable.scrollTop <= 0;
          const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
          
          if (e.deltaY > 0 && !isAtBottom) {
            return; // Let the section scroll down naturally
          }
          if (e.deltaY < 0 && !isAtTop) {
            return; // Let the section scroll up naturally
          }
        }
      }

      // We are transitioning sections: prevent standard scroll rubber-banding
      if (e.cancelable) {
        try {
          e.preventDefault();
        } catch (err) {
          console.warn('Scroll prevention not allowed in this event phase:', err);
        }
      }

      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0) {
        if (currentSectionRef.current < activeSectionsRef.current.length - 1) {
          goToSection(currentSectionRef.current + 1);
        }
      } else {
        if (currentSectionRef.current > 0) {
          goToSection(currentSectionRef.current - 1);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => { 
      touchYRef.current = e.touches[0].clientY; 
      hasTriggeredSwipeRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (transitionLockRef.current || isMovingRef.current || isMenuOpenRef.current) return;
      if (hasTriggeredSwipeRef.current) {
        // Prevent supplementary triggers during this swipe motion
        return;
      }
      
      const target = e.target as HTMLElement | null;
      let insideScrollable = false;

      const scrollable = target && typeof target.closest === 'function'
        ? target.closest('.overflow-y-auto, .overflow-x-auto, .scrollbar-hide') as HTMLElement
        : null;
        
      if (scrollable) {
        const isAtTop = scrollable.scrollTop <= 0;
        const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
        
        const currentTouchY = e.touches[0].clientY;
        const diffY = touchYRef.current - currentTouchY;
        
        if (scrollable.classList.contains('overflow-x-auto')) {
          if (Math.abs(diffY) < 30) {
            insideScrollable = true;
          }
        } else if (scrollable.classList.contains('overflow-y-auto') || scrollable.classList.contains('scrollbar-hide')) {
          const movingUp = diffY > 0; // swiping up (scrolling down)
          const movingDown = diffY < 0; // swiping down (scrolling up)
          
          if ((movingUp && !isAtBottom) || (movingDown && !isAtTop)) {
            insideScrollable = true;
          }
        }
      }

      if (insideScrollable) {
        // Let continuous touch movements proceed inside scrollable div
        return;
      }

      // Transitioning sections: cancel standard mobile drag bounce/refresh
      if (e.cancelable) {
        e.preventDefault();
      }

      const currentTouchY = e.touches[0].clientY;
      const diff = touchYRef.current - currentTouchY;
      if (Math.abs(diff) < 40) return;
      
      if (diff > 0) {
        if (currentSectionRef.current < activeSectionsRef.current.length - 1) {
          hasTriggeredSwipeRef.current = true;
          goToSection(currentSectionRef.current + 1);
        }
      } else {
        if (currentSectionRef.current > 0) {
          hasTriggeredSwipeRef.current = true;
          goToSection(currentSectionRef.current - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [goToSection]);

  // Automatic trigger and reset for all section animations on scroll/page changes (Point 3)
  useEffect(() => {
    const activeSecId = activeSections[currentSection];
    if (!activeSecId) return;

    // Reset loopable animations: remove 'vis' from all sections across all pages
    const allSections = [
      ...Config.PAGES_CONFIG.main.sections,
      ...Config.PAGES_CONFIG.commodities.sections,
      ...Config.PAGES_CONFIG.dassouli.sections
    ];

    allSections.forEach((secId) => {
      if (secId !== activeSecId) {
        const secEl = document.getElementById(secId);
        if (secEl) {
          secEl.querySelectorAll('.ae').forEach(el => el.classList.remove('vis'));
        }
      }
    });

    // Run animations instantly with retry-safeguard to avoid any empty delays or missing initial triggers
    triggerAnimationsWithRetry(activeSecId);
  }, [currentSection, activePage, activeSections, triggerAnimationsWithRetry]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0f19]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="noise" />
      
      {/* Preloader Screen with signature light off-white background */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -30,
              transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#ebf1f8] select-none"
          >
            <div className="relative flex flex-col items-center justify-center">
              {/* Animated logo entry */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-[160px] h-[160px] md:w-[190px] md:h-[190px]"
              >
                <Logo 
                  variant={isDigiComDomain ? "digicom" : "capital"} 
                  type="icon" 
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(29,152,120,0.12)]" 
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      <div 
        className="fixed w-2.5 h-2.5 bg-[#1d9878] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 lg:block hidden"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div 
        className="fixed w-9 h-9 border border-[#1d9878]/45 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 lg:block hidden"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

       {/* Unified Header Mobile (Prevents any overlap and offers superb UX on small screens) */}
      <header className={`fixed top-0 left-0 right-0 h-24 md:h-28 border-b z-[850] flex items-center justify-between px-4 lg:hidden shadow-sm transition-all duration-300 ${
        isMenuOpen 
          ? 'bg-[#ebf1f8] border-[#d3dfed]/60 shadow-none' 
          : 'bg-[#ebf1f8]/95 backdrop-blur-md border-[#d3dfed]/60'
      }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Left Section: Back Button and Sali Logo */}
        <div className="flex items-center gap-3">
          {activePage !== 'main' && !isDigiComDomain && !isMenuOpen && (
            <button
              onClick={() => changePage('main', 2)}
              className="w-12 h-12 border border-[#1d9878]/30 rounded-full flex items-center justify-center text-[#1d9878] bg-white hover:bg-[#1d9878]/5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm shadow-[#1d9878]/5"
              title={t.sidebar.backBtn}
            >
              <ChevronLeft size={18} strokeWidth={3.5} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
          )}
          <div 
            onClick={() => {
              if (isDigiComDomain) {
                goToSection(0);
              } else if (activePage !== 'main') {
                changePage('main', 0);
              } else {
                goToSection(0);
              }
            }}
            className="cursor-pointer flex items-center shrink-0 transition-transform active:scale-95"
          >
            <Logo 
              variant={activePage === 'commodities' ? 'commodities' : activePage === 'dassouli' ? 'dassouli' : activePage === 'digicom' ? 'digicom' : 'capital'}
              type="icon"
              className="w-[85px] h-[85px] md:w-[105px] md:h-[105px] object-contain"
              light={activePage === 'dassouli' ? false : undefined}
            />
          </div>
        </div>

        {/* Right Section: Compact burger menu trigger button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 bg-[#1c2c46] border border-[#1d9878]/35 rounded-full flex flex-col items-center justify-center gap-[4.5px] shadow-sm hover:bg-[#1d9878] hover:border-[#1d9878] transition-all cursor-pointer group"
          aria-label="Toggle menu"
        >
          <span className={`h-[1.5px] bg-white transition-all duration-400 ${isMenuOpen ? 'w-[16px] translate-y-[6px] rotate-45' : 'w-[16px]'}`} />
          <span className={`h-[1.5px] bg-white transition-all duration-400 ${isMenuOpen ? 'w-0 opacity-0' : 'w-[11px]'}`} />
          <span className={`h-[1.5px] bg-white transition-all duration-400 ${isMenuOpen ? 'w-[16px] -translate-y-[6px] -rotate-45' : 'w-[16px]'}`} />
        </button>
      </header>

      {/* Navigation Sidebar */}
      <nav className={`fixed top-0 bottom-0 w-[260px] xl:w-[290px] z-[700] flex flex-col items-center justify-between py-10 xl:py-12 bg-[#ebf1f8]/60 backdrop-blur-[6px] lg:flex hidden transition-all duration-500 ${
        lang === 'ar' ? 'right-0 border-l border-[#d3dfed]' : 'left-0 border-r border-[#d3dfed]'
      }`}>
        <div 
          className={`absolute top-0 w-1 bg-[#1d9878] transition-all duration-500 shadow-[0_0_14px_rgba(29,152,120,0.7)] ${
            lang === 'ar' ? 'left-0' : 'right-0'
          }`}
          style={{ height: `${activeSections.length > 1 ? (currentSection / (activeSections.length - 1)) * 100 : 100}%` }}
        />
        <div className="relative z-10 flex flex-col items-center w-full grow-0 px-6">
          <div className="relative w-[130px] h-[130px] xl:w-[150px] xl:h-[150px] mb-2 xl:mb-3 transition-all duration-300">
            <Logo 
              variant={activePage === 'dassouli' ? 'dassouli' : activePage === 'commodities' ? 'commodities' : activePage === 'digicom' ? 'digicom' : 'capital'}
              type="icon"
              className="w-full h-full"
              light={false}
            />
          </div>
          
          <AnimatePresence mode="popLayout">
            {activePage !== 'main' && !isDigiComDomain && (
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center w-full text-center mt-1 xl:mt-2"
              >
                {/* Back button (just arrow, no text) */}
                <button
                  id="nav-back-button"
                  onClick={() => changePage('main', 2)}
                  className="mt-2.5 p-2 rounded-full border border-[#1c2c46]/10 bg-[#1c2c46]/5 text-[#1c2c46] hover:text-white hover:border-[#1d9878] hover:bg-[#1d9878] hover:scale-110 transition-all cursor-pointer flex items-center justify-center shadow-md hover:shadow-[#1d9878]/25"
                  title={t.sidebar.backBtn}
                >
                  <ChevronLeft size={16} strokeWidth={3.5} className={lang === 'ar' ? 'rotate-180' : ''} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`flex flex-col items-start gap-4 xl:gap-6 w-full z-10 ${lang === 'ar' ? 'pr-8 xl:pr-10' : 'pl-8 xl:pl-10'}`}>
          {activePage === 'commodities' ? (
            (() => {
              const subMenus = lang === 'ar' ? [
                {
                  title: '',
                  items: [
                    { name: 'سالي للسلع', index: 0 }
                  ]
                },
                {
                  title: 'خدماتنا',
                  items: [
                    { name: 'التوريد والتجارة', index: 1 },
                    { name: 'اللوجستيات والجودة', index: 2 },
                    { name: 'علامة تجارية خاصة', index: 3 },
                    { name: 'الاستشارة والرقمنة', index: 4 }
                  ]
                },
                {
                  title: 'منتجاتنا',
                  items: [
                    { name: 'أصل المغرب', index: 5 },
                    { name: 'منتجات دولية', index: 6 }
                  ]
                },
                {
                  title: 'شبكتنا والاتصال',
                  items: [
                    { name: 'أسواقنا', index: 7 },
                    { name: 'انضم إلى شبكتنا', index: 8 }
                  ]
                }
              ] : lang === 'en' ? [
                {
                  title: '',
                  items: [
                    { name: 'SALI Commodities', index: 0 }
                  ]
                },
                {
                  title: 'Our services',
                  items: [
                    { name: 'Sourcing & trade', index: 1 },
                    { name: 'Logistics & quality', index: 2 },
                    { name: 'Private label', index: 3 },
                    { name: 'Consulting & digital', index: 4 }
                  ]
                },
                {
                  title: 'Our products',
                  items: [
                    { name: 'Morocco origin', index: 5 },
                    { name: 'International products', index: 6 }
                  ]
                },
                {
                  title: 'Network & contact',
                  items: [
                    { name: 'Our markets', index: 7 },
                    { name: 'Join our network', index: 8 }
                  ]
                }
              ] : [
                {
                  title: '',
                  items: [
                    { name: 'SALI Commodities', index: 0 }
                  ]
                },
                {
                  title: 'Nos services',
                  items: [
                    { name: 'Approvisionnement & commerce', index: 1 },
                    { name: 'Logistique & qualité', index: 2 },
                    { name: 'Marque blanche', index: 3 },
                    { name: 'Conseil & digital', index: 4 }
                  ]
                },
                {
                  title: 'Nos produits',
                  items: [
                    { name: 'Origine Maroc', index: 5 },
                    { name: 'Produits internationaux', index: 6 }
                  ]
                },
                {
                  title: 'Réseau & contact',
                  items: [
                    { name: 'Nos marchés', index: 7 },
                    { name: 'Rejoignez notre réseau', index: 8 }
                  ]
                }
              ];

              return (
                <div className="w-full flex flex-col gap-3.5 xl:gap-5 overflow-y-auto max-h-[60dvh] pr-2">
                  {subMenus.map((cat, catIdx) => (
                    <div key={catIdx} className="w-full flex flex-col gap-1.5">
                      <span className={`text-[8.5px] lg:text-[9px] font-black tracking-[2px] uppercase text-[#1d9878]/90 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {cat.title}
                      </span>
                      <div className={`flex flex-col gap-1.5 border-l border-[#1c2c46]/10 pl-3 ${lang === 'ar' ? 'border-l-0 border-r pr-3 pl-0' : ''}`}>
                        {cat.items.map((item) => {
                          const isSelected = currentSection === item.index;
                          return (
                            <button 
                              id={`nav-dot-${item.index}`}
                              key={item.index}
                              onClick={() => handleSectionClick(item.index)}
                              className={`relative group flex items-center gap-2 transition-all duration-300 ${
                                lang === 'ar' ? 'flex-row-reverse' : ''
                              } ${isSelected ? 'text-[#1d9878]' : 'text-[#1c2c46]/50 hover:text-[#1c2c46]'}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full border border-[#1c2c46]/15 transition-all duration-300 ${isSelected ? 'bg-[#1d9878] border-[#1d9878] scale-110 shadow-[0_0_8px_rgba(29,152,120,0.8)]' : 'group-hover:border-[#1c2c46]'}`} />
                              <span className={`text-[10px] xl:text-[10.5px] font-bold uppercase tracking-[0.5px] transition-all duration-300 text-left ${lang === 'ar' ? 'text-right' : ''} ${
                                isSelected 
                                  ? `opacity-100 font-extrabold ${lang === 'ar' ? '-translate-x-0.5' : 'translate-x-0.5'}` 
                                  : 'opacity-60 group-hover:opacity-100'
                              }`}>
                                {item.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          ) : activePage === 'digicom' ? (
            (() => {
              if (!isDigiComDomain) {
                return (
                  <div className="w-full flex flex-col gap-3.5 xl:gap-5 overflow-y-auto max-h-[60dvh] pr-2">
                    <div className="w-full flex flex-col gap-1.5">
                      <div className={`flex flex-col gap-1.5 border-l border-[#1c2c46]/10 pl-3 ${lang === 'ar' ? 'border-l-0 border-r pr-3 pl-0' : ''}`}>
                        <button 
                          id="nav-dot-0"
                          onClick={() => handleSectionClick(0)}
                          className={`relative group flex items-center gap-2 transition-all duration-300 text-[#1d9878] ${
                            lang === 'ar' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full border border-[#1d9878] bg-[#1d9878] scale-110 shadow-[0_0_8px_rgba(29,152,120,0.8)]" />
                          <span className={`text-[10px] xl:text-[10.5px] font-extrabold uppercase tracking-[0.5px] transition-all duration-300 text-left ${lang === 'ar' ? 'text-right' : ''} ${lang === 'ar' ? '-translate-x-0.5' : 'translate-x-0.5'}`}>
                            SALI DigiCom
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              const subMenusDigi = lang === 'ar' ? [
                { name: 'خدماتنا', index: 1 },
                { name: 'منهجيتنا', index: 5 },
                { name: 'ركائزنا الأربعة', index: 6 },
                { name: 'اتصل بنا', index: 7 }
              ] : lang === 'en' ? [
                { name: 'Our services', index: 1 },
                { name: 'Our approach', index: 5 },
                { name: 'Our 4 pillars', index: 6 },
                { name: 'Contact us', index: 7 }
              ] : [
                { name: 'Nos prestations', index: 1 },
                { name: 'Notre approche', index: 5 },
                { name: 'Nos 4 piliers', index: 6 },
                { name: 'Nous contacter', index: 7 }
              ];

              return (
                <div className="w-full flex flex-col gap-3.5 xl:gap-5 overflow-y-auto max-h-[60dvh] pr-2">
                  <div className={`flex flex-col gap-3 border-l border-[#1c2c46]/10 pl-3 ${lang === 'ar' ? 'border-l-0 border-r pr-3 pl-0' : ''}`}>
                    {subMenusDigi.map((item) => {
                      const isSelected = item.index === 1 
                        ? (currentSection >= 1 && currentSection <= 4)
                        : (currentSection === item.index);
                      return (
                        <button 
                          id={`nav-dot-${item.index}`}
                          key={item.index}
                          onClick={() => handleSectionClick(item.index)}
                          className={`relative group flex items-center gap-2 transition-all duration-300 py-1.5 ${
                            lang === 'ar' ? 'flex-row-reverse' : ''
                          } ${isSelected ? 'text-[#1d9878]' : 'text-[#1c2c46]/50 hover:text-[#1c2c46]'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full border border-[#1c2c46]/15 transition-all duration-300 ${isSelected ? 'bg-[#1d9878] border-[#1d9878] scale-110 shadow-[0_0_8px_rgba(29,152,120,0.8)]' : 'group-hover:border-[#1c2c46]'}`} />
                          <span className={`text-[10px] xl:text-[10.5px] font-bold uppercase tracking-[0.5px] transition-all duration-300 text-left ${lang === 'ar' ? 'text-right' : ''} ${
                            isSelected 
                              ? `opacity-100 font-extrabold ${lang === 'ar' ? '-translate-x-0.5' : 'translate-x-0.5'}` 
                              : 'opacity-60 group-hover:opacity-100'
                          }`}>
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : (
            activeNames.map((name, i) => (
              <button 
                id={`nav-dot-${i}`}
                key={name}
                onClick={() => handleSectionClick(i)}
                className={`relative group flex items-center gap-3 transition-all duration-300 ${
                  lang === 'ar' ? 'flex-row-reverse' : ''
                } ${currentSection === i ? 'text-[#1d9878]' : 'text-[#1c2c46]/45 hover:text-[#1c2c46]'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full border border-[#1c2c46]/20 transition-all duration-300 ${currentSection === i ? 'bg-[#1d9878] border-[#1d9878] scale-110 shadow-[0_0_10px_rgba(29,152,120,0.8)]' : 'group-hover:border-[#1c2c46]'}`} />
                <span className={`text-[11px] xl:text-[12.5px] font-bold uppercase tracking-[1.5px] transition-all duration-300 ${
                  currentSection === i 
                    ? `opacity-100 font-extrabold ${lang === 'ar' ? '-translate-x-0.5' : 'translate-x-0.5'}` 
                    : 'opacity-55 group-hover:opacity-100'
                }`}>
                  {name}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex flex-col items-center gap-4 z-10" />
      </nav>

      {/* Burger Button - Desktop Only */}
      <button 
        id="burger-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-8 z-[850] w-[54px] h-[54px] bg-[#1c2c46] border border-[#1d9878]/30 rounded-full lg:flex hidden flex-col items-center justify-center gap-[5px] shadow-lg hover:bg-[#1d9878] hover:border-[#1d9878] transition-all group cursor-pointer ${
          lang === 'ar' ? 'left-8' : 'right-8'
        }`}
      >
        <span className={`h-[2px] bg-white transition-all duration-400 ${isMenuOpen ? 'w-[22px] translate-y-[7px] rotate-45' : 'w-[22px]'}`} />
        <span className={`h-[2px] bg-white transition-all duration-400 ${isMenuOpen ? 'w-0 opacity-0' : 'w-[15px]'}`} />
        <span className={`h-[2px] bg-white transition-all duration-400 ${isMenuOpen ? 'w-[22px] -translate-y-[7px] rotate-[-45deg]' : 'w-[22px]'}`} />
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ clipPath: lang === 'ar' ? 'circle(0% at 32px 32px)' : 'circle(0% at calc(100% - 32px) 32px)' }}
            animate={{ clipPath: lang === 'ar' ? 'circle(175% at 32px 32px)' : 'circle(175% at calc(100% - 32px) 32px)' }}
            exit={{ clipPath: lang === 'ar' ? 'circle(0% at 32px 32px)' : 'circle(0% at calc(100% - 32px) 32px)' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-[800] bg-[#ebf1f8] flex lg:flex-row flex-col items-start lg:items-center justify-center lg:justify-start pt-32 lg:pt-0 pb-12 lg:pb-0 overflow-y-auto pl-[10vw] pr-[10vw] gap-[6vh] lg:gap-[8vw] ${
              lang === 'ar' ? 'lg:pr-[240px] lg:pl-[10vw]' : 'lg:pl-[240px] lg:pr-[10vw]'
            }`}
          >
            <ul className="flex flex-col gap-4 list-none">
              {(isDigiComDomain
                ? (lang === 'ar' ? [
                    { id: 'prestations', name: 'خدماتنا', index: 1 },
                    { id: 'approach', name: 'منهجيتنا', index: 5 },
                    { id: 'pillars', name: 'ركائزنا الأربعة', index: 6 },
                    { id: 'contact', name: 'اتصل بنا', index: 7 }
                  ] : lang === 'en' ? [
                    { id: 'prestations', name: 'Our services', index: 1 },
                    { id: 'approach', name: 'Our approach', index: 5 },
                    { id: 'pillars', name: 'Our 4 pillars', index: 6 },
                    { id: 'contact', name: 'Contact us', index: 7 }
                  ] : [
                    { id: 'prestations', name: 'Nos prestations', index: 1 },
                    { id: 'approach', name: 'Notre approche', index: 5 },
                    { id: 'pillars', name: 'Nos 4 piliers', index: 6 },
                    { id: 'Nous contacter', name: 'Nous contacter', index: 7 }
                  ])
                : [
                    { id: 'main', name: t.menu.holding },
                    { id: 'commodities', name: t.menu.commodities },
                    { id: 'dassouli', name: t.menu.dassouli },
                    { id: 'digicom', name: t.menu.digicom },
                    { id: 'contact', name: t.menu.contact }
                  ]
              ).map((item, i) => {
                const isItemActive = isDigiComDomain
                  ? (item.index === 1 
                      ? (currentSection >= 1 && currentSection <= 4)
                      : (currentSection === item.index))
                  : (item.id === 'contact' 
                      ? (activePage === 'main' && currentSection === 3) 
                      : (activePage === item.id && !(activePage === 'main' && currentSection === 3)));

                return (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a 
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          if (isDigiComDomain) {
                            handleSectionClick(item.index!);
                          } else {
                            if (item.id === 'contact') {
                              setActivePage('main');
                              setCurrentSection(3);
                              safePushState(null, window.location.pathname);
                            } else {
                              changePage(item.id as 'main' | 'commodities' | 'dassouli' | 'digicom');
                            }
                          }
                        }, 400);
                      }}
                      className={`block text-[clamp(28px,4vw,64px)] lg:text-[clamp(32px,5vw,76px)] font-black tracking-[-2px] leading-[1.1] transition-colors ${isItemActive ? 'text-[#1d9878]' : 'text-[#1c2c46]/20 hover:text-[#1c2c46]'}`}
                    >
                      {item.name}
                    </motion.a>
                  </li>
                );
              })}
            </ul>
            
            {/* Removed menu description and contact info */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="fixed inset-0 h-[100dvh] overflow-hidden z-10 transition-all duration-500">
        <div 
          className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
          style={{ transform: `translateY(-${currentSection * 100}%)` }}
        >
          {/* Section Indicator */}
          {!(activePage === 'main' && currentSection === 0) && (
            <div className={`fixed bottom-9 z-[300] pointer-events-none lg:block hidden ${
              lang === 'ar' ? 'left-11 text-left' : 'right-11 text-right'
            }`}>
              <div className={`text-[9px] font-bold tracking-[3px] uppercase mb-1 transition-colors ${activePage === 'main' && (currentSection === 1 || currentSection === 2) ? 'text-[#1c2c46]/40' : 'text-[#1d9878]'}`}>
                {activeNames[currentSection]}
              </div>
              <div className={`text-[11px] font-bold opacity-30 transition-colors ${activePage === 'main' && (currentSection === 1 || currentSection === 2) ? 'text-[#1c2c46]' : 'text-[#1d9878]'}`}>
                0{currentSection + 1} / 0{activeSections.length}
              </div>
            </div>
          )}

          {/* HERO SECTION */}
          <section id="hero" className={`relative h-[100dvh] bg-[#ebf1f8] flex items-center justify-center px-[5vw] overflow-hidden ${sectionPadds}`}>
            <div className="absolute inset-0 z-0 bg-[#ebf1f8]">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover filter brightness-110 contrast-100 opacity-55" alt="Modern Business" />
              <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
            </div>
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(29,152,120,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(29,152,120,.04)_1px,transparent_1px)] bg-[length:80px_80px]" />
            
            <div className="relative z-[3] max-w-3xl text-center flex flex-col items-center">
              <h1 className="ae ae-down text-[clamp(40px,6vw,80px)] font-black leading-[0.95] tracking-[-3px] text-center text-[#1c2c46]" data-d="1">
                {lang === 'ar' ? (
                  <>
                    <span>سالي</span><br />
                    <span className="text-[#1d9878]">كابيتال</span>
                  </>
                ) : (
                  <>
                    <span>SALI</span><br />
                    <span className="text-[#1d9878]">CAPITAL</span>
                  </>
                )}
              </h1>
              <div className="ae ae-pop mb-6 flex items-center justify-center gap-4 mt-8" data-d="2">
                <div className="w-12 h-[1px] bg-[#1d9878]" />
                <span className="text-[10px] font-bold tracking-[4px] uppercase text-[#1d9878]">{t.hero.investmentComp}</span>
                <div className="w-12 h-[1px] bg-[#1d9878]" />
              </div>
              <p className="ae ae-left mt-6 text-[13px] lg:text-[14px] text-[#1c2c46]/80 leading-[1.8] max-w-md mx-auto text-center" data-d="3">
                {t.hero.desc}
              </p>
              <div className="ae ae-up mt-6 md:mt-10 flex flex-wrap gap-5 justify-center" data-d="4">
                <button 
                  onClick={() => goToSection(1)}
                  className="bg-[#1d9878] text-white px-10 py-4 text-[11px] font-bold tracking-[2px] uppercase border-2 border-[#1d9878] hover:bg-transparent hover:text-[#1d9878] transition-all cursor-pointer"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }}
                >
                  {t.hero.btnDiscover}
                </button>
                <button 
                  onClick={() => goToSection(2)}
                  className="bg-transparent text-[#1c2c46]/60 px-10 py-4 text-[11px] font-bold tracking-[2px] uppercase border border-[#1c2c46]/15 hover:border-[#1d9878]/50 hover:text-[#1d9878] transition-all cursor-pointer"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }}
                >
                  {t.hero.btnSubs}
                </button>
              </div>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden">
            <div className="absolute inset-0 z-0 h-full w-full">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-55" alt="About" />
              <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
            </div>
            
            <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-7xl mx-auto min-h-full py-4">
                {/* Left logo column on desktop - transparent, no blue frame, watermark logo fondu dans l'arrière-plan */}
                <div className="relative hidden lg:flex items-center justify-center p-12 lg:col-span-4 h-[70dvh] select-none pointer-events-none">
                  <div className="ae ae-left text-center relative z-10 opacity-[0.09]" data-d="2">
                     <Logo variant="capital" type="full" className="w-56 h-56 text-[#1c2c46]" />
                  </div>
                </div>
                
                {/* Right content column */}
                <div className="flex flex-col justify-center p-4 lg:p-12 text-[#1c2c46] relative lg:col-span-8 h-full">
                  {/* Mobile Background Accent */}
                  <div className="absolute inset-0 lg:hidden pointer-events-none opacity-[0.03] z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#1d9878] rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#1c2c46] rounded-full blur-[100px]" />
                  </div>
                  
                  <h2 className="ae ae-up relative z-10 text-[clamp(20px,2.5vw,34px)] font-black tracking-[-1.5px] leading-tight mb-3 text-[#1c2c46]" data-d="1">
                    {t.about.title}
                  </h2>
                  <div className="ae ae-pop flex items-center gap-4 mb-3" data-d="2">
                     <div className="w-10 h-[2px] bg-[#1d9878]" />
                     <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878]">{t.about.tag}</span>
                  </div>
                  <p className="ae ae-left text-[12.5px] md:text-[13.5px] text-[#243655] font-medium leading-relaxed max-w-xl mb-4 relative z-10" data-d="3">
                    {t.about.desc}
                  </p>
                  
                  <div className="ae ae-pop flex flex-wrap gap-2 mb-4 relative z-10" data-d="4">
                    {(['integrity', 'performance', 'innovation', 'globalVision', 'engagement'] as const).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setActivePill(key)}
                        className={`px-3 py-1.5 border rounded-full text-[10px] lg:text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                          activePill === key 
                            ? 'border-[#1d9878] text-[#1d9878] bg-[#1d9878]/10 shadow-[0_4px_12px_rgba(29,152,120,0.12)] scale-102' 
                            : 'border-[#d3dfed] text-[#33435c] hover:border-[#1d9878]/50 hover:text-[#1d9878] hover:bg-[#1d9878]/5'
                        }`}
                      >
                        {t.about.pills[key]}
                      </button>
                    ))}
                  </div>
                  
                  {/* Automatically switching text based on selected pill - clean design, no borders */}
                  <div className="min-h-[100px] lg:min-h-[80px] mb-6 border-l-2 border-l-[#1d9878] pl-4 ae ae-pop relative z-10" data-d="4.5">
                    <AnimatePresence mode="wait">
                      <motion.p 
                         key={activePill}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: 10 }}
                         transition={{ duration: 0.3 }}
                         className="text-[12px] lg:text-[13px] text-[#243655] font-medium leading-relaxed"
                      >
                        {t.about.pillTexts[activePill]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
   
                  <button 
                    onClick={() => goToSection(2)}
                    className="ae ae-up inline-flex items-center gap-2 bg-[#1d9878] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer hover:bg-[#157159]" 
                    style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }} 
                    data-d="5"
                  >
                    {t.about.btnExpertise} {lang === 'ar' ? <ArrowRight size={14} strokeWidth={3} className="rotate-180" /> : <ArrowRight size={14} strokeWidth={3} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* EXPERTISE SECTION */}
          <section id="expertise" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden">
            <div className="absolute inset-0 z-0 h-full w-full">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" className="w-full h-full object-cover opacity-55" alt="Expertise BG" />
              <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
            </div>
            
            <div className={`relative z-10 w-full h-full overflow-y-auto pt-28 pb-12 lg:py-12 px-[5vw] ${sectionPadds} flex flex-col justify-start lg:justify-center`}>
              <div className="w-full max-w-7xl mx-auto relative flex flex-col justify-center h-auto lg:h-full">
              <div className="mb-6 lg:mb-8 text-center flex flex-col items-center">
                <h2 className="ae ae-left text-[clamp(24px,3.2vw,40px)] font-black text-[#1c2c46] tracking-[-2px]" data-d="1">
                  {lang === 'ar' ? (
                    <>
                      <span className="italic text-[#1d9878]">شركاتنا</span> التابعة
                    </>
                  ) : lang === 'en' ? (
                    <>
                      Our <span className="italic text-[#1d9878]">Subsidiaries</span>
                    </>
                  ) : (
                    <>
                      Nos <span className="italic text-[#1d9878]">Filiales</span>
                    </>
                  )}
                </h2>
                <div className="ae ae-pop flex items-center gap-4 mt-2 justify-center" data-d="2">
                   <div className="w-10 h-[2px] bg-[#1d9878]" />
                   <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878]">{t.expertise.holding}</span>
                </div>
              </div>

               {/* Mobile Accordion (visible on mobile, hidden on desktop) */}
              <div className="flex lg:hidden flex-col gap-3 w-full max-w-md mx-auto z-10">
                {[
                  { n: '01', title: t.expertise.subs.holding.title, desc: t.expertise.subs.holding.desc, action: () => goToSection(1), btnLabel: t.expertise.subs.holding.btn, keyIndex: 0, logoVariant: 'capital' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: false, isCommodities: false },
                  { n: '02', title: t.expertise.subs.commodities.title, desc: t.expertise.subs.commodities.desc, action: () => changePage('commodities'), btnLabel: t.expertise.subs.commodities.btn, keyIndex: 1, logoVariant: 'commodities' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: false, isCommodities: true },
                  { n: '03', title: t.expertise.subs.dassouli.title, desc: t.expertise.subs.dassouli.desc, action: () => changePage('dassouli'), btnLabel: t.expertise.subs.dassouli.btn, keyIndex: 2, logoVariant: 'dassouli' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: true, isCommodities: false },
                  { n: '04', title: t.expertise.subs.digicom.title, desc: t.expertise.subs.digicom.desc, action: () => changePage('digicom'), btnLabel: t.expertise.subs.digicom.btn, keyIndex: 3, logoVariant: 'digicom' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: false, isCommodities: false }
                ].map((f) => {
                  const isExpanded = activeSubTab === f.keyIndex;
                  return (
                    <div 
                      key={f.n} 
                      onClick={() => {
                        if (isExpanded) {
                          f.action();
                        } else {
                          setActiveSubTab(f.keyIndex);
                        }
                      }}
                      className={`overflow-hidden border rounded-xl transition-all duration-300 w-full cursor-pointer ${
                        f.highlight 
                          ? 'bg-[#1c2c46] text-white border-white/10' 
                          : f.isCommodities 
                            ? 'bg-[#f4fdf9] text-[#1c2c46] border-[#1d9878]/15' 
                            : 'bg-white text-[#1c2c46] border-black/5'
                      } ${isExpanded ? 'ring-1 ring-[#1d9878]/50 shadow-[0_4px_16px_rgba(29,152,120,0.1)]' : ''}`}
                    >
                      {/* Accordion Header Container */}
                      <div
                        className={`w-full flex items-center justify-between p-4 transition-colors ${
                          lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
                        }`}
                        style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                      >
                        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[11px] font-black tracking-[1px] uppercase">
                            {f.title}
                          </span>
                        </div>
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight size={14} className="text-[#1d9878]" />
                        </div>
                      </div>

                      {/* Accordion Panels content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className={`p-4 pt-0 border-t flex flex-col gap-3 ${
                              f.highlight ? 'border-white/5' : 'border-black/5'
                            }`}>
                              {/* Subsidiary Corporate Logo taking up significant space */}
                              <div className="h-28 w-full mt-3 select-none flex items-center justify-start">
                                <Logo 
                                  variant={f.logoVariant} 
                                  type="icon" 
                                  className="h-full w-auto max-w-[85%] object-contain" 
                                  light={f.highlight}
                                />
                              </div>

                              <p className={`text-[11px] leading-[1.65] mt-1 ${f.highlight ? 'text-white/80' : 'text-[#7a8799]'}`}>
                                {f.desc}
                              </p>
                              
                              <div 
                                className={`inline-flex items-center gap-2 text-[9px] font-bold tracking-[2px] uppercase text-[#1d9878] mt-1 self-start ${
                                  lang === 'ar' ? 'flex-row-reverse' : ''
                                }`}
                              >
                                {f.btnLabel} {lang === 'ar' ? <ArrowRight size={11} strokeWidth={3} className="rotate-180" /> : <ArrowRight size={11} strokeWidth={3} />}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
 
               {/* Desktop Cards Grid (hidden on mobile) */}
              <div className="hidden lg:flex flex-row gap-5 justify-center items-center w-full">
                {[
                  { n: '01', title: t.expertise.subs.holding.title, desc: t.expertise.subs.holding.desc, action: () => goToSection(1), btnLabel: t.expertise.subs.holding.btn, keyIndex: 0, logoVariant: 'capital' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: false, isCommodities: false },
                  { n: '02', title: t.expertise.subs.commodities.title, desc: t.expertise.subs.commodities.desc, action: () => changePage('commodities'), btnLabel: t.expertise.subs.commodities.btn, keyIndex: 1, logoVariant: 'commodities' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: false, isCommodities: true },
                  { n: '03', title: t.expertise.subs.dassouli.title, desc: t.expertise.subs.dassouli.desc, action: () => changePage('dassouli'), btnLabel: t.expertise.subs.dassouli.btn, keyIndex: 2, logoVariant: 'dassouli' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: true, isCommodities: false },
                  { n: '04', title: t.expertise.subs.digicom.title, desc: t.expertise.subs.digicom.desc, action: () => changePage('digicom'), btnLabel: t.expertise.subs.digicom.btn, keyIndex: 3, logoVariant: 'digicom' as 'capital' | 'commodities' | 'dassouli' | 'digicom', highlight: false, isCommodities: false }
                ].map((f, i) => {
                  return (
                    <div 
                      key={f.n} 
                      onClick={() => f.action()}
                      className={`ae ae-right overflow-hidden relative border transition-all duration-300 ease-in-out p-6 lg:p-8 rounded-2xl cursor-pointer flex flex-col justify-between group flex-1 shadow-md hover:shadow-2xl hover:scale-[1.015] hover:border-[#1d9878] h-[310px] lg:h-[430px] w-full max-w-md lg:max-w-none
                        ${f.highlight 
                          ? 'bg-[#1c2c46] text-white border-white/10' 
                          : f.isCommodities 
                            ? 'bg-[#f4fdf9] text-[#1c2c46] border-[#1d9878]/15' 
                            : 'bg-white text-[#1c2c46] border-black/5'}
                      `}
                      data-d={3 + i}
                    >
                      <div>
                        {/* Subsidiary Corporate Logo (takes up 45% of the card) */}
                        <div className="h-28 lg:h-[180px] w-full mb-6 flex items-center justify-start select-none">
                          <Logo 
                            variant={f.logoVariant} 
                            type="icon" 
                            className="h-full w-auto max-w-[85%] object-contain" 
                            light={f.highlight}
                          />
                        </div>

                        <h3 className={`text-sm lg:text-lg font-extrabold mb-1.5 group-hover:text-[#1d9878] transition-colors ${f.highlight ? 'text-white' : 'text-[#1c2c46]'}`}>{f.title}</h3>
                        
                        <p className={`text-[11px] lg:text-[12px] leading-[1.6] ${f.highlight ? 'text-white/80' : 'text-[#7a8799]'}`}>
                          {f.desc}
                        </p>
                      </div>
 
                      <div className="mt-3 lg:mt-0 pt-1 z-10">
                        <span 
                          className={`inline-flex items-center gap-2 text-[9px] lg:text-[10px] font-bold tracking-[2px] uppercase text-[#1d9878] group-hover:gap-4 transition-all ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          {f.btnLabel} {lang === 'ar' ? <ArrowRight size={14} strokeWidth={3} className="rotate-180" /> : <ArrowRight size={14} strokeWidth={3} />}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 h-1 bg-[#1d9878] w-0 group-hover:w-full transition-all duration-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

                  {/* CONTACT SECTION */}
          <section id="contact" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden">
            <div className="absolute inset-0 z-0 h-full w-full">
               <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-55 brightness-110 contrast-100" alt="Contact" />
               <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
            </div>
            
            <div className={`relative z-10 w-full h-full overflow-y-auto pt-20 lg:pt-24 pb-12 lg:pb-16 px-[5vw] ${sectionPadds}`}>
              <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col justify-center min-h-full py-4">
                <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 min-h-full w-full border border-[#d3dfed] rounded-3xl overflow-hidden shadow-2xl bg-white">
                  
                  {/* Left Column - dark split */}
                  <div className="col-span-12 lg:col-span-5 flex flex-col justify-center p-8 lg:p-12 bg-[#1c2c46] border-b lg:border-b-0 lg:border-r border-[#d3dfed] w-full">
                    <h2 className="ae ae-left text-[clamp(24px,3vw,42px)] font-black tracking-[-1.5px] leading-[1.1] mb-6 text-white" data-d="1">
                      {lang === 'ar' ? 'تواصل معنا' : lang === 'en' ? 'Contact Us' : 'Contactez-nous'}
                    </h2>
                    <div className="ae ae-pop flex items-center gap-4 mb-6" data-d="1.5">
                       <div className="w-10 h-[2px] bg-[#1d9878]" />
                       <span className="text-[10px] font-bold tracking-[3.1px] uppercase text-[#1d9878]">SALI Capital</span>
                    </div>
                    <p className="ae ae-left text-[11px] lg:text-[13px] text-white/70 leading-relaxed font-semibold mb-6 max-w-sm" data-d="1.8">
                      {t.contact.formTitle}
                    </p>
                    <div className="space-y-6 lg:space-y-8 mt-4">
                      <div className="ae ae-up flex items-center gap-5" data-d="2">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#1d9878]/15 border border-[#1d9878]/25 rounded-xl flex items-center justify-center text-[#1d9878]">
                          <Phone size={18} />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold tracking-[2px] uppercase text-white/30 mb-1">{t.contact.phoneLabel}</span>
                          <a href="tel:+212661373937" className="text-sm lg:text-base font-semibold text-white hover:text-[#1d9878] transition-colors">+212 6 61 37 39 37</a>
                        </div>
                      </div>
                      <div className="ae ae-up flex items-center gap-5" data-d="2.5">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#1d9878]/15 border border-[#1d9878]/25 rounded-xl flex items-center justify-center text-[#1d9878]">
                          <Mail size={18} />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold tracking-[2px] uppercase text-white/30 mb-1">{t.contact.emailLabel}</span>
                          <a href="mailto:hd@sali-capital.com" className="text-sm lg:text-base font-semibold text-white hover:text-[#1d9878] transition-colors">hd@sali-capital.com</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - white form */}
                  <div className="col-span-12 lg:col-span-7 flex flex-col justify-center p-8 lg:p-12 bg-white text-[#1c2c46] w-full overflow-y-visible">
                    <AnimatePresence mode="wait">
                      {!isFormSubmitted ? (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          setIsFormSubmitted(true);
                          const subjectObj = encodeURIComponent(`Contact SALI Capital`);
                          const bodyObj = encodeURIComponent(
                            `Nom Complet: ${formName}\n` +
                            `Téléphone: ${formPhone}\n` +
                            `E-mail: ${formEmail}\n\n` +
                            `Message:\n${formMessage}`
                          );
                          window.location.href = `mailto:hd@sali-capital.com?subject=${subjectObj}&body=${bodyObj}`;
                        }} className="space-y-4 w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="ae ae-up flex flex-col gap-1.5" data-d="3">
                              <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.fullName}</label>
                              <input 
                                required
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                                placeholder={t.contact.placeholderName} 
                              />
                            </div>
                            <div className="ae ae-up flex flex-col gap-1.5" data-d="3.5">
                              <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.phoneLabel}</label>
                              <input 
                                required
                                value={formPhone}
                                onChange={e => setFormPhone(e.target.value)}
                                className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                                placeholder={t.contact.placeholderPhone} 
                              />
                            </div>
                          </div>

                          <div className="ae ae-up flex flex-col gap-1.5" data-d="4">
                            <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.emailLabel}</label>
                            <input 
                              required
                              type="email"
                              value={formEmail}
                              onChange={e => setFormEmail(e.target.value)}
                              className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                              placeholder={t.contact.placeholderEmail} 
                            />
                          </div>

                          <div className="ae ae-up flex flex-col gap-1.5" data-d="4.5">
                            <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.messageLabel}</label>
                            <textarea 
                              required
                              value={formMessage}
                              onChange={e => setFormMessage(e.target.value)}
                              className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3.5 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all resize-none rounded-lg text-[#1c2c46]" 
                              placeholder={t.contact.placeholderMessage} 
                              rows={3} 
                            />
                          </div>

                          <button 
                            type="submit"
                            className="bg-[#1c2c46] hover:bg-[#1d9878] hover:border-[#1d9878] text-white px-10 py-4 text-[10px] font-bold tracking-[2px] uppercase border-2 border-[#1c2c46] transition-all mt-4 self-start cursor-pointer inline-flex items-center gap-2"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                          >
                            {t.contact.btnSend || 'Envoyer'} <Send size={14} strokeWidth={3} />
                          </button>
                        </form>
                      ) : (
                        <motion.div 
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center text-center py-4"
                        >
                          <div className="w-12 h-12 bg-[#1d9878]/10 border border-[#1d9878]/25 rounded-full flex items-center justify-center text-[#1d9878] mb-3 animate-pulse">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold text-[#1c2c46] mb-1">{t.contact.successTitle}</h4>
                          <p className="text-[10px] text-[#5a6a7a] max-w-sm leading-relaxed mb-4">
                            {t.contact.successDesc}
                          </p>
                          <button 
                            onClick={() => {
                              setIsFormSubmitted(false);
                              setFormMessage('');
                              setFormSubject('');
                            }}
                            className="text-[9px] font-bold uppercase tracking-[2px] text-[#1d9878] border border-[#1d9878]/30 px-4 py-2 rounded-full hover:bg-[#1d9878]/5 transition-all cursor-pointer"
                          >
                            {t.contact.btnWriteAnother}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Sub-pages overlays */}
      <AnimatePresence>
        {activePage === 'commodities' && (
          <motion.div 
            key="commodities-overlay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[400] overflow-hidden"
          >
            <SaliCommodities 
              onBack={() => changePage('main', 2)} 
              currentSection={currentSection} 
              onGoToSection={(index) => goToSection(index)}
              lang={lang} 
            />
          </motion.div>
        )}
        {activePage === 'dassouli' && (
          <motion.div 
            key="dassouli-overlay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[400] overflow-hidden"
          >
            <FonciereDassouli 
              onBack={() => changePage('main', 2)} 
              currentSection={currentSection} 
              onGoToSection={(index) => goToSection(index)}
              lang={lang}
            />
          </motion.div>
        )}
        {activePage === 'digicom' && (
          <motion.div 
            key="digicom-overlay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[400] overflow-hidden"
          >
            <SaliDigiCom 
              onBack={() => changePage('main', 2)} 
              currentSection={currentSection} 
              onGoToSection={(index) => goToSection(index)}
              lang={lang}
              isDigiComDomain={isDigiComDomain}
              onOpenQuestionnaire={(type, contactData) => {
                setPrefilledContactInfo(contactData);
                setActiveQuestionnaire(type);
              }}
              isSubmittedFromModal={isContactSubmitted}
              onResetForm={() => setIsContactSubmitted(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen Questionnaire Overlay */}
      <AnimatePresence>
        {activeQuestionnaire !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[1000] w-full h-full bg-[#ebf1f8] text-[#1c2c46] overflow-y-auto"
          >
            <div className="min-h-full w-full flex items-center justify-center p-0 md:p-6 lg:p-12">
              <QuestionnaireFlow 
                type={activeQuestionnaire}
                initialContactInfo={{
                  name: prefilledContactInfo?.name || '',
                  email: prefilledContactInfo?.email || '',
                  phone: prefilledContactInfo?.phone || '',
                  company: prefilledContactInfo?.company || '',
                  message: prefilledContactInfo?.message || ''
                }}
                onClose={() => setActiveQuestionnaire(null)}
                onSuccess={() => {
                  setIsContactSubmitted(true);
                  setActiveQuestionnaire(null);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
