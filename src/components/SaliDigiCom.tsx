import React, { useEffect, useRef, useState } from 'react';
import {
  MagneticCta,
  MagneticPrismCta,
  SplitChars,
  SplitLines,
  SuptitleTag,
  subscribeMotion,
  useInViewOnce,
} from './MotionPrimitives';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../data/portfolioProjects';
import { ProjectCaseStudy } from './ProjectCaseStudy';
import { ProjectsGalleryModal } from './ProjectsGalleryModal';
import { useRouter } from '../utils/router';
import { ArrowUpRight } from 'lucide-react';

export interface SaliDigiComProps {
  isActive: boolean;
  isReady?: boolean;
  onClose: () => void;
  currentSection: number;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  onOpenQuestionnaire: (
    type: 'website' | 'community' | 'branding',
    initialData?: { name?: string; phone?: string; email?: string; company?: string }
  ) => void;
  onOpenAllProjects?: () => void;
  onOpenProject?: (project: PortfolioProject) => void;
  runWithCurtain?: (action: () => void) => void;
}

interface PoleItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  summary: string;
  deliverables: string[];
  image: string;
  imageAlt: string;
  ctaLabel: string;
  action: 'website' | 'community' | 'branding' | 'direct';
  project: PortfolioProject;
}

const POLES: PoleItem[] = PORTFOLIO_PROJECTS.map((proj) => ({
  id: proj.id,
  tag: proj.categoryLabel,
  title: proj.title,
  subtitle: `${proj.client} · ${proj.city}`,
  summary: proj.excerpt,
  deliverables: proj.deliverables,
  image: proj.primaryImage,
  imageAlt: proj.title,
  ctaLabel: 'Découvrir l\'étude',
  action: proj.category === 'web' ? 'website' : proj.category === 'community' ? 'community' : 'branding',
  project: proj,
}));

const CLIENT_LOGOS = [
  { name: 'CAP Investment Solutions', logo: '/portfolio/logos/cap-white.png', sector: 'FinTech & Conseil · Dubaï / Casa', projectId: 'cap-investment' },
  { name: 'Gueliz Properties', logo: '/portfolio/logos/gueliz-white.png', sector: 'Immobilier de Luxe · Marrakech', projectId: 'gueliz-properties' },
  { name: 'Cabinet Imtiaz Taamine', logo: '/portfolio/logos/imtiaz-white.png', sector: 'Courtage & Assurance · Maroc', projectId: 'imtiaz-taamine' },
  { name: 'Axeon Media', logo: '/portfolio/logos/axeon-white.png', sector: 'Média & Événementiel · Maroc', projectId: 'axeon-media' },
  { name: 'CAP\'ASSUR', logo: '/portfolio/logos/capassur-white.png', sector: 'Assurances & Patrimoine · Maroc', projectId: 'capassur' },
];

const EXPERTISES = [
  {
    slug: 'web',
    title: 'Conception & Développement',
    detail:
      'Plateformes web haute performance, applications sur-mesure et architectures e-commerce robustes adaptées à vos objectifs d’acquisition.',
    image: '/portfolio/websites/cap-mobile.jpg',
    alt: 'Architecture web et mobile haute performance CAP Investment Solutions',
  },
  {
    slug: 'branding',
    title: 'Identité de Marque & Design',
    detail:
      'Logotype statutaire, charte graphique complète, design system et direction artistique sur mesure pour imposer votre autorité.',
    image: '/portfolio/branding/capassur-charte-cover.jpg',
    alt: 'Charte graphique officielle et identité statutaire CAP’ASSUR',
  },
  {
    slug: 'social-media',
    title: 'Stratégie & Visibilité',
    detail:
      'Stratégie éditoriale social media, campagnes de conversion ciblées, référencement naturel (SEO) et production visuelle continue.',
    image: '/portfolio/axeon/axeon-campagne-01.jpg',
    alt: 'Campagne de visibilité éditoriale et publicitaire Axeon Media',
  },
  {
    slug: 'ia-solutions',
    title: 'Intelligence Artificielle & Automatisation',
    detail:
      'Intégration d’agents intelligents, qualification automatisée de prospects, chatbots conversationnels et flux opérationnels optimisés.',
    image: '/portfolio/websites/imtiaz-mobile.jpg',
    alt: 'Automatisation des flux de devis et acquisition digitale Imtiaz Taamine',
  },
];

const SENTENCE_LINES = [
  'Quel que soit votre secteur,',
  'nous hissons votre image digitale',
  'au niveau d’exigence de votre marque.',
];

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function SaliDigiCom({
  isReady = true,
  setCurrentSection,
  onOpenQuestionnaire,
  onOpenAllProjects,
  onOpenProject,
  runWithCurtain,
}: SaliDigiComProps) {
  const { navigate } = useRouter();

  const handleOpenService = (slug: string) => {
    if (runWithCurtain) {
      runWithCurtain(() => navigate(`/services/${slug}`));
    } else {
      navigate(`/services/${slug}`);
    }
  };
  // Hero refs (chunk-930.js)
  const introRef = useRef<HTMLElement | null>(null);
  const topWordRef = useRef<HTMLDivElement | null>(null);
  const bottomWordRef = useRef<HTMLDivElement | null>(null);
  const heroLineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [heroCtaMotion, setHeroCtaMotion] = useState({ x: 0, opacity: 1 });

  // Statement parallax CTA ref (chunk-198.js)
  const statementSecRef = useRef<HTMLElement | null>(null);
  const [statementCtaY, setStatementCtaY] = useState(0);

  // Showreel video & cursor-chasing diamond refs (chunk-174.js + module 2959)
  const videoStageRef = useRef<HTMLDivElement | null>(null);
  const videoFollowerRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoInView = useInViewOnce(0.08);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Sticky kinetic sentence refs (chunk-239.js)
  const sentenceRef = useRef<HTMLElement | null>(null);
  const sentenceLineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // 3D Z-space perspective tunnel gallery refs (chunk-500.js)
  const tunnelSecRef = useRef<HTMLElement | null>(null);
  const tunnelPlateRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hoveredPoleRef = useRef<number | null>(null);
  const activePoleRef = useRef<number>(0);
  const [activePoleIndex, setActivePoleIndex] = useState(0);
  const [isAllProjectsPassed, setIsAllProjectsPassed] = useState(false);
  const isAllProjectsPassedRef = useRef(false);
  const [poleSwitchDir, setPoleSwitchDir] = useState<1 | -1>(1);
  const [prismDashOffset, setPrismDashOffset] = useState(340);
  const [inspectedPole, setInspectedPole] = useState<PoleItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleOpenProject = (proj: PortfolioProject) => {
    if (onOpenProject) {
      if (runWithCurtain) {
        runWithCurtain(() => onOpenProject(proj));
      } else {
        onOpenProject(proj);
      }
    } else {
      if (runWithCurtain) {
        runWithCurtain(() => setSelectedProject(proj));
      } else {
        setSelectedProject(proj);
      }
    }
  };

  const handleOpenAllProjects = () => {
    if (onOpenAllProjects) {
      if (runWithCurtain) {
        runWithCurtain(() => onOpenAllProjects());
      } else {
        onOpenAllProjects();
      }
    } else {
      setIsGalleryOpen(true);
    }
  };

  const handleNavigateNextProject = (nextSlug: string) => {
    const next = PORTFOLIO_PROJECTS.find((p) => p.slug === nextSlug);
    if (!next) return;
    handleOpenProject(next);
  };

  // Editorial Services directional counter-slide curtain refs (chunk-46.js)
  const serviceSlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const serviceImgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const prevExpertiseRef = useRef<number>(0);
  const [activeExpertise, setActiveExpertise] = useState(0);

  // Hollow Key Figures refs (chunk-842.js)
  const skfWrap = useInViewOnce(0.14);
  const skfColRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Footer Casablanca floating cursor preview card (Q.prototype mod-954)
  const cityLinkRef = useRef<HTMLAnchorElement | null>(null);
  const cityCardRef = useRef<HTMLDivElement | null>(null);
  const cityHoverRef = useRef(false);

  // Direct contact selector & form state
  const [selectedChoice, setSelectedChoice] = useState<'website' | 'community' | 'direct'>('direct');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{
    kind: 'idle' | 'success' | 'error';
    text: string;
  }>({ kind: 'idle', text: '' });

  // Initialize Services slides: slide 0 visible at 0%, slides 1..4 parked at +100%/-100%
  useEffect(() => {
    serviceSlideRefs.current.forEach((slide, idx) => {
      const img = serviceImgRefs.current[idx];
      if (!slide || !img) return;
      slide.style.transition = 'none';
      img.style.transition = 'none';
      if (idx === 0) {
        slide.style.zIndex = '2';
        slide.style.transform = 'translate3d(0, 0%, 0)';
        img.style.transform = 'translate3d(0, 0%, 0) scale(1)';
      } else {
        slide.style.zIndex = '1';
        slide.style.transform = 'translate3d(0, 102%, 0)';
        img.style.transform = 'translate3d(0, -102%, 0) scale(1.2)';
      }
    });
  }, []);

  const switchExpertise = (nextIdx: number) => {
    const prevIdx = prevExpertiseRef.current;
    if (nextIdx === prevIdx) return;

    const dir = nextIdx < prevIdx ? 1 : -1;
    const incomingSlide = serviceSlideRefs.current[nextIdx];
    const incomingImg = serviceImgRefs.current[nextIdx];
    const outgoingSlide = serviceSlideRefs.current[prevIdx];
    const outgoingImg = serviceImgRefs.current[prevIdx];

    if (incomingSlide && incomingImg && outgoingSlide && outgoingImg) {
      // Park incoming slide at 100% * dir and inner img at -100% * dir scale(1.22)
      incomingSlide.style.transition = 'none';
      incomingImg.style.transition = 'none';
      incomingSlide.style.zIndex = '3';
      outgoingSlide.style.zIndex = '2';
      incomingSlide.style.transform = `translate3d(0, ${100 * dir}%, 0)`;
      incomingImg.style.transform = `translate3d(0, ${-100 * dir}%, 0) scale(1.22)`;
      void incomingSlide.offsetWidth;

      const ease = '0.82s cubic-bezier(0.23, 1, 0.32, 1)';
      incomingSlide.style.transition = `transform ${ease}`;
      incomingImg.style.transition = `transform ${ease}`;
      outgoingSlide.style.transition = `transform ${ease}`;
      outgoingImg.style.transition = `transform ${ease}`;

      incomingSlide.style.transform = 'translate3d(0, 0%, 0)';
      incomingImg.style.transform = 'translate3d(0, 0%, 0) scale(1)';
      outgoingSlide.style.transform = `translate3d(0, ${-100 * dir}%, 0)`;
      outgoingImg.style.transform = `translate3d(0, ${100 * dir}%, 0) scale(1.08)`;
    }

    prevExpertiseRef.current = nextIdx;
    setActiveExpertise(nextIdx);
  };

  // Master 60/120fps choreography subscriber (Hero Split, Video Follower, Sentence Scrub, 3D Z-Tunnel, SKF Parallax, City Preview)
  useEffect(() => {
    const videoFollower = {
      inside: false,
      lerpX: 0,
      lerpY: 0,
      rot: 0,
    };

    const cityFollower = {
      lerpX: 0,
      lerpY: 0,
      opacity: 0,
    };

    const stageEl = videoStageRef.current;
    const onVideoEnter = () => {
      videoFollower.inside = true;
    };
    const onVideoLeave = () => {
      videoFollower.inside = false;
    };
    stageEl?.addEventListener('mouseenter', onVideoEnter);
    stageEl?.addEventListener('mouseleave', onVideoLeave);

    let lastDash = -1;
    let lastHeroCtaBucket = -1;
    let lastStmtBucket = -999;

    const unsub = subscribeMotion((s) => {
      const vh = s.vh;
      const vw = s.vw;
      const isDesktop = vw >= 1024;
      const scrollLag = s.rawY - s.smoothY; // inertial offset

      // 1. HERO FULL OFF-SCREEN SPLIT & MASKED LINE EXIT (chunk-930.js)
      if (introRef.current && topWordRef.current && bottomWordRef.current) {
        if (vw >= 900 && !s.reducedMotion) {
          const rect = introRef.current.getBoundingClientRect();
          const dampedTop = rect.top + scrollLag;
          const span = Math.max(1, rect.height - vh);
          const hp = clamp(-dampedTop / span, 0, 1);

          const leftExitDist = vw * 0.68 + 120;
          const rightExitDist = vw * 0.68 + 120;

          topWordRef.current.style.transform = `translate3d(${(-hp * leftExitDist).toFixed(1)}px, 0, 0)`;
          bottomWordRef.current.style.transform = `translate3d(${(hp * rightExitDist).toFixed(1)}px, 0, 0)`;

          heroLineRefs.current.forEach((lineEl, i) => {
            if (!lineEl) return;
            if (hp <= 0.002) {
              lineEl.style.transition = '';
              lineEl.style.transform = '';
            } else {
              const staggeredP = clamp((hp - i * 0.055) / 0.68, 0, 1);
              lineEl.style.transition = 'none';
              lineEl.style.transform = `translate3d(0, ${(-staggeredP * 114).toFixed(1)}%, 0)`;
            }
          });

          const ctaBucket = Math.round(hp * 100);
          if (ctaBucket !== lastHeroCtaBucket) {
            lastHeroCtaBucket = ctaBucket;
            setHeroCtaMotion({
              x: hp * (vw * 0.22 + 60),
              opacity: clamp(1 - hp * 1.45, 0, 1),
            });
          }
        } else {
          topWordRef.current.style.transform = 'none';
          bottomWordRef.current.style.transform = 'none';
          heroLineRefs.current.forEach((lineEl) => {
            if (lineEl) lineEl.style.transform = 'none';
          });
        }
      }

      // 2. STATEMENT CTA VERTICAL PARALLAX (chunk-198.js)
      if (statementSecRef.current && vw >= 900 && !s.reducedMotion) {
        const sr = statementSecRef.current.getBoundingClientRect();
        const norm = clamp((vh * 0.5 - (sr.top + sr.height * 0.5)) / vh, -1, 1);
        const py = Math.round(norm * -32);
        if (py !== lastStmtBucket) {
          lastStmtBucket = py;
          setStatementCtaY(py);
        }
      }

      // 3. SHOWREEL CURSOR-CHASING DIAMOND BUTTON (chunk-174.js + module 2959)
      if (stageEl && videoFollowerRef.current) {
        if (vw >= 900 && !s.reducedMotion) {
          const vr = stageEl.getBoundingClientRect();
          let targetX = 0;
          let targetY = 0;
          if (
            videoFollower.inside &&
            s.cursorX >= vr.left &&
            s.cursorX <= vr.right &&
            s.cursorY >= vr.top &&
            s.cursorY <= vr.bottom
          ) {
            const maxX = Math.max(0, vr.width * 0.42);
            const maxY = Math.max(0, vr.height * 0.34);
            targetX = clamp(s.cursorX - (vr.left + vr.width * 0.5), -maxX, maxX);
            targetY = clamp(s.cursorY - (vr.top + vr.height * 0.5), -maxY, maxY);
          }
          videoFollower.lerpX += (targetX - videoFollower.lerpX) * 0.095;
          videoFollower.lerpY += (targetY - videoFollower.lerpY) * 0.095;
          const targetRot = videoFollower.inside ? clamp(s.cursorDeltaX * 0.65, -14, 14) : 0;
          videoFollower.rot += (targetRot - videoFollower.rot) * 0.12;

          videoFollowerRef.current.style.transform = `translate3d(calc(-50% + ${videoFollower.lerpX.toFixed(1)}px), calc(-50% + ${videoFollower.lerpY.toFixed(1)}px), 0) rotate(${videoFollower.rot.toFixed(2)}deg)`;
        } else {
          videoFollowerRef.current.style.transform = 'translate3d(-50%, -50%, 0)';
        }
      }

      // 4. STICKY KINETIC SENTENCE LINE-BY-LINE IN -> HOLD -> OUT (chunk-239.js)
      if (sentenceRef.current) {
        const sr = sentenceRef.current.getBoundingClientRect();
        if (vw >= 768 && !s.reducedMotion) {
          const dampedTop = sr.top + scrollLag;
          const span = Math.max(1, sr.height - vh);
          const sp = clamp((vh * 0.24 - dampedTop) / (span + vh * 0.36), 0, 1);

          sentenceLineRefs.current.forEach((lineEl, i) => {
            if (!lineEl) return;
            let yPct = 0;
            if (sp < 0.24) {
              const enterP = clamp((sp - i * 0.04) / 0.16, 0, 1);
              const eased = 1 - Math.pow(1 - enterP, 3);
              yPct = (1 - eased) * 108;
            } else if (sp <= 0.78) {
              yPct = 0;
            } else {
              const exitP = clamp((sp - 0.78 - i * 0.035) / 0.15, 0, 1);
              const eased = exitP * exitP;
              yPct = -eased * 110;
            }
            const lineAlpha = clamp(1 - Math.abs(yPct) / 26, 0, 1);
            lineEl.style.opacity = lineAlpha.toFixed(3);
            lineEl.style.transform = `translate3d(0, ${yPct.toFixed(2)}%, 0)`;
          });
        } else {
          sentenceLineRefs.current.forEach((lineEl) => {
            if (lineEl) {
              lineEl.style.opacity = '1';
              lineEl.style.transform = 'translate3d(0, 0%, 0)';
            }
          });
        }
      }

      // 5. PINNED 3D Z-SPACE PERSPECTIVE TUNNEL GALLERY (chunk-500.js)
      if (tunnelSecRef.current) {
        const tr = tunnelSecRef.current.getBoundingClientRect();
        const dampedTop = tr.top + scrollLag;
        if (isDesktop && !s.reducedMotion) {
          const span = Math.max(1, tr.height - vh);
          const gp = clamp(-dampedTop / span, 0, 1);

          // Scrub PrismCTA strokeDashoffset 481 -> 0 (chunk-500 progress)
          const strokeProg = clamp(gp / 0.94, 0, 1);
          const nextDash = Math.round(481 * (1 - strokeProg));
          if (nextDash !== lastDash) {
            lastDash = nextDash;
            setPrismDashOffset(nextDash);
          }

          // Camera Z travel through all 5 architectural plates (-150 -> +3850)
          const spacingZ = 750;
          const cameraZ = -150 + gp * 3950;
          const allPassed = gp >= 0.76;
          if (allPassed !== isAllProjectsPassedRef.current) {
            isAllProjectsPassedRef.current = allPassed;
            setIsAllProjectsPassed(allPassed);
          }

          const waveBendX = clamp(s.velocity * 0.075, -8.5, 8.5);
          const cursorParX = s.normX * -14;
          const cursorParY = s.normY * 10;

          let closestIdx = 0;
          let closestDist = Infinity;

          tunnelPlateRefs.current.forEach((plateEl, idx) => {
            if (!plateEl) return;
            const baseZ = -idx * spacingZ;
            const relZ = baseZ + cameraZ; // negative = ahead in tunnel, positive = passing camera

            const distToFocus = Math.abs(relZ + 60);
            if (distToFocus < closestDist) {
              closestDist = distToFocus;
              closestIdx = idx;
            }

            const sideSign = idx % 2 === 0 ? -1 : 1;
            const posX = sideSign * vw * 0.23 + cursorParX;
            const posY = -relZ * 0.12 + 10 + cursorParY;

            // Smooth emergence out of deep darkness & fade past camera
            let alpha = 1;
            if (relZ < -550) {
              alpha = clamp((relZ + 2100) / 1550, 0, 1);
            } else if (relZ > 240) {
              alpha = clamp(1 - (relZ - 240) / 360, 0, 1);
            }

            const isHovered = hoveredPoleRef.current === idx;
            const hoverScale = isHovered ? 0.96 : 1.0;
            const sideYaw = sideSign * -4.5;

            plateEl.style.opacity = alpha.toFixed(3);
            plateEl.style.pointerEvents = alpha > 0.32 ? 'auto' : 'none';
            plateEl.style.zIndex = String(20 + idx * 2 + (isHovered ? 10 : 0));
            plateEl.style.transform = `translate3d(calc(-50% + ${posX.toFixed(1)}px), calc(-50% + ${posY.toFixed(1)}px), ${relZ.toFixed(1)}px) rotateX(${waveBendX.toFixed(2)}deg) rotateY(${sideYaw.toFixed(2)}deg) scale(${hoverScale})`;
          });

          const desiredPole = hoveredPoleRef.current !== null ? hoveredPoleRef.current : closestIdx;
          if (desiredPole !== activePoleRef.current) {
            const switchDirection: 1 | -1 = desiredPole > activePoleRef.current ? 1 : -1;
            activePoleRef.current = desiredPole;
            setPoleSwitchDir(switchDirection);
            setActivePoleIndex(desiredPole);
          }
        } else {
          // Tablet / mobile stroke progress fallback
          const mProg = clamp((vh * 0.8 - tr.top) / Math.max(1, tr.height), 0.2, 1);
          const nextDash = Math.round(481 * (1 - mProg));
          if (nextDash !== lastDash) {
            lastDash = nextDash;
            setPrismDashOffset(nextDash);
          }
        }
      }

      // 6. HOLLOW KEY FIGURES DIFFERENTIAL PARALLAX (chunk-842.js)
      if (vw >= 900 && !s.reducedMotion) {
        skfColRefs.current.forEach((col, idx) => {
          if (!col) return;
          const cr = col.getBoundingClientRect();
          const norm = clamp((vh * 0.65 - cr.top) / vh, -0.5, 1.2);
          const baseOffset = idx * 26;
          const parallaxShift = idx * -14 * norm;
          col.style.transform = `translate3d(0, ${(baseOffset + parallaxShift).toFixed(1)}px, 0)`;
        });
      } else {
        skfColRefs.current.forEach((col) => {
          if (col) col.style.transform = 'none';
        });
      }

      // 7. FOOTER CASABLANCA FLOATING CURSOR CARD (Q.prototype mod-954)
      if (cityCardRef.current) {
        const targetOp = cityHoverRef.current && vw >= 900 && !s.reducedMotion ? 1 : 0;
        cityFollower.opacity += (targetOp - cityFollower.opacity) * 0.14;
        cityFollower.lerpX += (s.cursorX - cityFollower.lerpX) * 0.10;
        cityFollower.lerpY += (s.cursorY - cityFollower.lerpY) * 0.10;
        const tilt = clamp(s.cursorDeltaX * 0.7, -14, 14);
        cityCardRef.current.style.visibility = cityFollower.opacity > 0.02 ? 'visible' : 'hidden';
        cityCardRef.current.style.opacity = cityFollower.opacity.toFixed(3);
        cityCardRef.current.style.transform = `translate3d(${(cityFollower.lerpX + 24).toFixed(1)}px, ${(cityFollower.lerpY - 130).toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${(0.88 + cityFollower.opacity * 0.12).toFixed(3)})`;
      }
    });

    return () => {
      unsub();
      stageEl?.removeEventListener('mouseenter', onVideoEnter);
      stageEl?.removeEventListener('mouseleave', onVideoLeave);
    };
  }, []);

  // Section tracking for navigation sync
  useEffect(() => {
    const secMap: Array<{ id: string; index: number }> = [
      { id: 'intro', index: 0 },
      { id: 'poles', index: 1 },
      { id: 'expertises', index: 2 },
      { id: 'atelier', index: 3 },
      { id: 'contact', index: 4 },
    ];
    const secIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = secMap.find((s) => s.id === entry.target.id);
            if (match) setCurrentSection(match.index);
          }
        });
      },
      { threshold: 0.2 }
    );
    secMap.forEach((s) => {
      const node = document.getElementById(s.id);
      if (node) secIo.observe(node);
    });
    return () => secIo.disconnect();
  }, [setCurrentSection]);

  // Respect prefers-reduced-motion on decorative background video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      vid.pause();
      setIsVideoPlaying(false);
    }
  }, []);

  const toggleShowreel = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsVideoPlaying(true);
    } else {
      vid.pause();
      setIsVideoPlaying(false);
    }
  };

  const scrollToContactDirect = () => {
    const go = () => {
      setSelectedChoice('direct');
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: runWithCurtain ? 'auto' : 'smooth', block: 'start' });
    };
    if (runWithCurtain) runWithCurtain(go);
    else go();
  };

  const openPoleModal = (pole: PoleItem) => {
    handleOpenProject(pole.project);
  };

  const handleChoiceSelect = (choice: 'website' | 'community' | 'direct') => {
    setSelectedChoice(choice);
    if (choice === 'website' || choice === 'community') {
      onOpenQuestionnaire(choice, {
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        company: contactForm.company,
      });
    }
  };

  const handlePoleAction = (pole: PoleItem) => {
    if (pole.action === 'website' || pole.action === 'community') {
      setInspectedPole(null);
      onOpenQuestionnaire(pole.action);
    } else {
      setInspectedPole(null);
      scrollToContactDirect();
    }
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactFeedback({
        kind: 'error',
        text: 'Merci de renseigner votre nom, votre adresse e-mail et l’objet de votre demande.',
      });
      return;
    }

    setContactSending(true);
    setContactFeedback({ kind: 'idle', text: '' });

    try {
      const isLocal =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isNetlify = window.location.hostname.includes('netlify.app');
      const endpoint = isLocal
        ? '/api/send-email'
        : isNetlify
          ? '/.netlify/functions/send-email'
          : '/api/send-email.php';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact_direct',
          clientInfo: {
            name: contactForm.name.trim(),
            email: contactForm.email.trim(),
            phone: contactForm.phone.trim() || 'Non renseigné',
            company: contactForm.company.trim() || 'Non renseigné',
            position: 'Contact direct site web',
            whatsapp: 'Oui',
          },
          responses: [
            {
              category: 'DEMANDE DIRECTE SALI DIGICOM',
              question: 'Message transmis depuis le studio digital',
              answer: contactForm.message.trim(),
            },
          ],
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      setContactFeedback({
        kind: 'success',
        text: 'Votre message a bien été transmis à l’équipe SALI DigiCom. Nous revenons vers vous sous 24 heures.',
      });
      setContactForm({ name: '', email: '', phone: '', company: '', message: '' });
    } catch {
      setContactFeedback({
        kind: 'error',
        text: 'La connexion au serveur d’envoi a échoué. Vous pouvez aussi nous joindre directement à contact@sali-digicom.com.',
      });
    } finally {
      setContactSending(false);
    }
  };

  const activePole = POLES[activePoleIndex] || POLES[0];

  return (
    <div className="w-full">
      {/* =====================================================================
          SEQUENCE 1 — HERO FULL OFF-SCREEN CURTAIN SPLIT (section#intro.c-intro)
         ===================================================================== */}
      <section id="intro" ref={introRef} className="dc-intro">
        <div className="dc-intro-sticky">
          <div className="dc-container dc-intro-top-row">
            <div ref={topWordRef} className="dc-word-monument dc-word-monument--top">
              <SplitChars word="SALI" baseDelay={0.08} rollOnHover revealed={isReady} />
            </div>

            <div className="shrink-0">
              <MagneticCta
                label="Démarrer un projet"
                onClick={scrollToContactDirect}
                offsetX={heroCtaMotion.x}
                fadeOpacity={heroCtaMotion.opacity}
              />
            </div>
          </div>

          <div className="dc-container dc-intro-bottom-row">
            <div className="max-w-sm">
              <h1
                className="dc-hero-h1"
                aria-label="L’agence qui façonne votre présence digitale."
              >
                <span className="dc-line-mask block" aria-hidden="true">
                  <span
                    ref={(el) => {
                      heroLineRefs.current[0] = el;
                    }}
                    className="dc-hero-line block"
                    style={{ transitionDelay: '0.16s' }}
                  >
                    L’agence qui façonne
                  </span>
                </span>
                <span className="dc-line-mask block" aria-hidden="true">
                  <span
                    ref={(el) => {
                      heroLineRefs.current[1] = el;
                    }}
                    className="dc-hero-line block"
                    style={{ transitionDelay: '0.24s' }}
                  >
                    votre présence digitale.
                  </span>
                </span>
              </h1>
              <p
                className="mt-3 text-[16px] leading-relaxed text-[#9a9a9a]"
                aria-label="Plateformes web, identité visuelle et acquisition à Casablanca."
              >
                <span className="dc-line-mask block" aria-hidden="true">
                  <span
                    ref={(el) => {
                      heroLineRefs.current[2] = el;
                    }}
                    className="dc-hero-line block"
                    style={{ transitionDelay: '0.32s' }}
                  >
                    Plateformes web, identité visuelle
                  </span>
                </span>
                <span className="dc-line-mask block" aria-hidden="true">
                  <span
                    ref={(el) => {
                      heroLineRefs.current[3] = el;
                    }}
                    className="dc-hero-line block"
                    style={{ transitionDelay: '0.40s' }}
                  >
                    et acquisition à Casablanca.
                  </span>
                </span>
              </p>
            </div>

            <div ref={bottomWordRef} className="dc-word-monument dc-word-monument--bottom">
              <SplitChars word="DigiCom" baseDelay={0.18} rollOnHover revealed={isReady} />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 2 — EDITORIAL STATEMENT + PARALLAX MAGNETIC CTA (b-content-button)
         ===================================================================== */}
      <section ref={statementSecRef} className="dc-section-space">
        <div className="dc-container-inset">
          <div className="dc-statement-grid">
            <SplitLines
              as="p"
              className="dc-statement max-w-[34ch]"
              lines={[
                "Nous combinons l'esprit de création artistique",
                "à la rigueur technique pour concevoir",
                "des expériences numériques remarquables.",
              ]}
            />
            <div>
              <MagneticCta
                label="Simuler un site"
                offsetY={statementCtaY}
                onClick={() => onOpenQuestionnaire('website')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 3 — PANORAMIC SHOWCASE STAGE & CURSOR-CHASING DIAMOND (b-video)
         ===================================================================== */}
      <section id="atelier" className="bg-[#1C2C46] pb-16 md:pb-28">
        <div className="dc-container-inset">
          <div ref={videoInView.ref}>
            <div
              ref={videoStageRef}
              onClick={toggleShowreel}
              className={`dc-video-stage ${videoInView.inView ? 'is-inview' : ''}`}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/sali-digicom-showreel-poster.jpg"
                className="dc-video-media"
                aria-hidden="true"
              >
                <source src="/assets/sali-digicom-showreel.webm" type="video/webm" />
                <source src="/assets/sali-digicom-showreel.mp4" type="video/mp4" />
              </video>
              <div className="dc-video-scrim" />

              <button
                ref={videoFollowerRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleShowreel();
                }}
                aria-label={isVideoPlaying ? 'Mettre la vidéo en pause' : 'Lancer la vidéo'}
                className={`dc-video-diamond-btn ${isVideoPlaying ? 'is-playing' : ''}`}
              >
                <svg
                  width="74"
                  height="74"
                  viewBox="0 0 63 63"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M24.5124 2.84309C28.2917 -0.936244 34.4192 -0.936244 38.1986 2.84309L59.8677 24.5122C63.647 28.2916 63.6471 34.4191 59.8677 38.1984L38.1986 59.8676C34.4192 63.6469 28.2917 63.6469 24.5124 59.8676L2.84322 38.1984C-0.936114 34.4191 -0.936111 28.2916 2.84322 24.5122L24.5124 2.84309Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <span className="dc-video-diamond-label">
                  <span className="dc-video-label-mask">
                    <span className="dc-video-label-track">
                      <span>Pause</span>
                      <span>Lecture</span>
                    </span>
                  </span>
                </span>
              </button>
            </div>

            {/* Légende épurée sous la vidéo (zéro obstruction sur le showreel) */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6 px-2">
              <div>
                <p className="text-base text-white font-bold">
                  Studio SALI DigiCom, filiale digitale de SALI Capital Group
                </p>
                <p className="text-sm text-[#B8C7DA] mt-0.5">
                  Direction artistique, ingénierie front-end et stratégie d’acquisition unifiées.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenQuestionnaire('website')}
                className="dc-pill-btn"
              >
                <span className="dc-pill-btn-fill" />
                <span className="dc-pill-btn-content">
                  <span>Demander un devis</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 4 — STICKY KINETIC SENTENCE SCRUBBED OVER 3D PRISM (b-sentence)
         ===================================================================== */}
      <section id="sentence" ref={sentenceRef} className="dc-sentence">
        <div className="dc-sentence-sticky">
          <div className="dc-container-inset flex justify-center">
            <p
              className="dc-statement max-w-[33ch] text-center"
              aria-label={SENTENCE_LINES.join(' ')}
            >
              {SENTENCE_LINES.map((line, i) => (
                <span key={line} className="dc-line-mask block" aria-hidden="true">
                  <span
                    ref={(el) => {
                      sentenceLineRefs.current[i] = el;
                    }}
                    className="dc-sentence-line block"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 5 — PINNED 3D Z-SPACE TUNNEL GALLERY & 2 CTA BUTTONS
         ===================================================================== */}
      <section id="poles" ref={tunnelSecRef} className="dc-tunnel-section bg-[#1C2C46]">
        {/* Desktop Pinned 3D Z-Corridor (>= 1024px) */}
        <div className="dc-tunnel-sticky relative overflow-hidden">
          {/* Titre du projet actif sur le côté droit (conforme au modèle Digital Cover) */}
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
            {/* Bouton 2: Placé au centre géométrique de l'écran, en profondeur Z DERRIÈRE les planches de projets */}
            <div
              className={`dc-tunnel-center-behind-cta transition-opacity duration-700 ease-out ${
                isAllProjectsPassed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                type="button"
                onClick={handleOpenAllProjects}
                className="dc-tunnel-diamond-btn group"
                aria-label="Voir toutes nos réalisations"
              >
                <div className="dc-tunnel-diamond-content">
                  <svg className="w-6 h-6 text-[#1D9878] mb-1.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-[12px] font-bold text-white tracking-wider underline underline-offset-4 decoration-[#1D9878]">
                    Voir tous nos projets
                  </span>
                </div>
              </button>
            </div>

            {/* Planches de projets en format portrait (z-index 20+ passant DEVANT Bouton 2) */}
            {PORTFOLIO_PROJECTS.map((proj, idx) => (
              <button
                key={`tunnel-${proj.id}`}
                ref={(el) => {
                  tunnelPlateRefs.current[idx] = el;
                }}
                type="button"
                onMouseEnter={() => {
                  hoveredPoleRef.current = idx;
                  if (idx !== activePoleRef.current) {
                    setPoleSwitchDir(idx > activePoleRef.current ? 1 : -1);
                    activePoleRef.current = idx;
                    setActivePoleIndex(idx);
                  }
                }}
                onMouseLeave={() => {
                  hoveredPoleRef.current = null;
                }}
                onFocus={() => {
                  hoveredPoleRef.current = idx;
                  activePoleRef.current = idx;
                  setActivePoleIndex(idx);
                }}
                onBlur={() => {
                  hoveredPoleRef.current = null;
                }}
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

          {/* Bouton 1: Calé en BAS du viewport, actif sur les projets 1 à 4, disparaît à l'avant-dernier projet */}
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

        {/* Tablet & Mobile Ergonomic Showcase (< 1024px) */}
        <div className="dc-mobile-poles dc-container-inset">
          <div className="mb-10">
            <SuptitleTag label="Portfolio Réel" />
            <h2 className="dc-h2">Nos Réalisations Clientes</h2>
            <p className="text-[15px] text-[#B8C7DA] mt-3 max-w-[42ch]">
              Découvrez nos productions concrètes pour CAP Investment, Gueliz Properties, Imtiaz Taamine, Axeon et CAP'ASSUR.
            </p>
          </div>

          <div className="dc-gallery-grid">
            {PORTFOLIO_PROJECTS.map((proj, idx) => (
              <button
                key={`mob-${proj.id}`}
                type="button"
                onClick={() => {
                  setActivePoleIndex(idx);
                  handleOpenProject(proj);
                }}
                className="dc-gallery-plate group text-left rounded-2xl overflow-hidden border border-[#243757] bg-[#131F33]"
              >
                <div className="relative aspect-[10/14] overflow-hidden">
                  <img
                    src={proj.portraitBoard || proj.primaryImage}
                    alt={proj.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {proj.whiteLogo && (
                    <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-[#131F33]/85 backdrop-blur-md border border-[#243757]">
                      <img src={proj.whiteLogo} alt="" className="h-5 w-auto object-contain" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-[#1D9878] uppercase tracking-wider">
                    {proj.categoryLabel} · {proj.city}
                  </span>
                  <p className="text-xl font-bold text-white mt-1">
                    {proj.title}
                  </p>
                  <p className="mt-2 text-xs text-[#B8C7DA] line-clamp-2">
                    {proj.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#1D9878] font-semibold">
                    <span>Explorer l'étude</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleOpenAllProjects}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#131F33] hover:bg-[#1D9878] text-white border border-[#243757] hover:border-[#1D9878] font-bold text-sm tracking-wide transition-all shadow-lg"
            >
              <span>Découvrir toutes nos réalisations</span>
              <span className="w-2 h-2 rotate-45 bg-[#1D9878]" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          « ILS NOUS FONT CONFIANCE » — LOGOS CLIENTS ÉPURES SANS CADRE NI BOÎTE
         ===================================================================== */}
      <section id="confiance" className="py-24 bg-[#1C2C46]">
        <div className="dc-container-inset">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SuptitleTag label="Partenariats & Références" />
            <h2 className="dc-h2 mt-3">Ils nous font confiance</h2>
            <p className="text-sm md:text-base text-[#B8C7DA] mt-3">
              Des entreprises d'envergure qui confient leur présence digitale, leurs plateformes et leur image de marque à SALI DigiCom.
            </p>
          </div>

          {/* Bento Grid 3 en haut / 2 en bas : logos agrandis 1.6x, zéro texte superflu, zéro bordure sur fond #1C2C46 */}
          <div className="max-w-5xl mx-auto flex flex-col gap-10 md:gap-14">
            {/* Ligne 1 : 3 logos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center justify-items-center gap-8 md:gap-12">
              {CLIENT_LOGOS.slice(0, 3).map((client) => (
                <button
                  key={client.name}
                  type="button"
                  onClick={() => {
                    const proj = PORTFOLIO_PROJECTS.find((p) => p.id === client.projectId);
                    if (proj) handleOpenProject(proj);
                  }}
                  className="group flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer bg-transparent border-0 p-4 focus:outline-none w-full max-w-[260px] h-24 md:h-28"
                  aria-label={`Client ${client.name}`}
                >
                  <img
                    src={client.logo}
                    alt={`Logo ${client.name}`}
                    className="max-h-16 md:max-h-20 w-auto max-w-[200px] md:max-w-[230px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 select-none"
                  />
                </button>
              ))}
            </div>

            {/* Ligne 2 : 2 logos centrés */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {CLIENT_LOGOS.slice(3, 5).map((client) => (
                <button
                  key={client.name}
                  type="button"
                  onClick={() => {
                    const proj = PORTFOLIO_PROJECTS.find((p) => p.id === client.projectId);
                    if (proj) handleOpenProject(proj);
                  }}
                  className="group flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer bg-transparent border-0 p-4 focus:outline-none w-full sm:w-auto max-w-[260px] h-24 md:h-28"
                  aria-label={`Client ${client.name}`}
                >
                  <img
                    src={client.logo}
                    alt={`Logo ${client.name}`}
                    className="max-h-16 md:max-h-20 w-auto max-w-[200px] md:max-w-[230px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 select-none"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 6 — SERVICES DIRECTIONAL IMAGE CURTAIN & HOLLOW METRICS
         ===================================================================== */}
      <section id="expertises" className="dc-section-space bg-[#1C2C46]">
        <div className="dc-container-inset">
          <div className="dc-services-layout">
            {/* Left vertical architectural frame with double-counter-slide curtain (chunk-46.js) */}
            <div className="dc-services-visual">
              {EXPERTISES.map((exp, idx) => (
                <div
                  key={exp.title}
                  ref={(el) => {
                    serviceSlideRefs.current[idx] = el;
                  }}
                  className="dc-service-slide"
                >
                  <img
                    ref={(el) => {
                      serviceImgRefs.current[idx] = el;
                    }}
                    src={exp.image}
                    alt={exp.alt}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Right borderless typographic list with sibling dimming & accordion reveal */}
            <div>
              <SuptitleTag label="Savoir-faire" />
              <SplitLines as="h2" className="dc-h2" lines={['Nos expertises']} />

              <div className="dc-service-list">
                {EXPERTISES.map((item, idx) => {
                  const isCurrent = idx === activeExpertise;
                  return (
                    <div
                      key={item.title}
                      onMouseEnter={() => switchExpertise(idx)}
                      onFocus={() => switchExpertise(idx)}
                      onClick={() => handleOpenService(item.slug)}
                      className={`dc-service-row ${isCurrent ? 'is-active' : ''} group cursor-pointer`}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="dc-service-row-base" aria-hidden="true" />
                      <span className="dc-service-title">
                        <span>{item.title}</span>
                        <span
                          className="dc-service-arrow-pill"
                          title={`Découvrir la page dédiée : ${item.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenService(item.slug);
                          }}
                        >
                          <ArrowUpRight className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
                        </span>
                      </span>
                      <span className={`dc-service-desc-grid ${isCurrent ? 'is-open' : ''}`}>
                        <span className="dc-service-desc-inner">{item.detail}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                <MagneticCta
                  label="Démarrer un projet"
                  onClick={() => onOpenQuestionnaire('website')}
                />
              </div>
            </div>
          </div>

          {/* Hollow Stroked Key Figures (.b-skf — chunk-842.js staggered char rise + parallax) */}
          <div ref={skfWrap.ref} className="dc-skf-grid">
            <div
              ref={(el) => {
                skfColRefs.current[0] = el;
              }}
              className="dc-skf-item"
            >
              <span className="dc-hollow-num">
                <SplitChars word="4" baseDelay={0.04} stagger={0.05} revealed={skfWrap.inView} />
              </span>
              <SplitLines
                as="p"
                className="text-[16px] text-white"
                lines={['Pôles complémentaires intégrés au studio']}
              />
              <p className="text-[16px] text-[#9a9a9a] mt-1 max-w-[38ch]">
                Web, identité visuelle, acquisition sociale et automatisation réunis sous une même direction.
              </p>
            </div>

            <div
              ref={(el) => {
                skfColRefs.current[1] = el;
              }}
              className="dc-skf-item"
            >
              <span className="dc-hollow-num">
                <SplitChars word="100%" baseDelay={0.14} stagger={0.045} revealed={skfWrap.inView} />
              </span>
              <SplitLines
                as="p"
                className="text-[16px] text-white"
                lines={['Architectures conçues sur mesure']}
              />
              <p className="text-[16px] text-[#9a9a9a] mt-1 max-w-[38ch]">
                Aucun gabarit générique : chaque interface et chaque tunnel sont calibrés pour vos objectifs.
              </p>
            </div>

            <div
              ref={(el) => {
                skfColRefs.current[2] = el;
              }}
              className="dc-skf-item"
            >
              <span className="dc-hollow-num">
                <SplitChars word="24h" baseDelay={0.24} stagger={0.045} revealed={skfWrap.inView} />
              </span>
              <SplitLines
                as="p"
                className="text-[16px] text-white"
                lines={['Délai maximal de premier retour']}
              />
              <p className="text-[16px] text-[#9a9a9a] mt-1 max-w-[38ch]">
                Analyse rapide de votre cahier des charges et proposition d’accompagnement structurée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 7 — INTERACTIVE DIAMOND REQUEST SELECTOR (t-forms)
         ===================================================================== */}
      <section id="contact" className="dc-section-space">
        <div className="dc-container-inset">
          <div>
            <SuptitleTag label="Contact" />
            <SplitLines as="h2" className="dc-h2" lines={['Que recherchez-vous ?']} />

            <div className="dc-choices-list" role="radiogroup" aria-label="Type de demande">
              <button
                type="button"
                onClick={() => handleChoiceSelect('website')}
                className={`dc-choice-btn ${selectedChoice === 'website' ? 'is-selected' : ''}`}
              >
                <span className="dc-choice-diamond" aria-hidden="true" />
                <span>Démarrer mon projet Web</span>
              </button>

              <button
                type="button"
                onClick={() => handleChoiceSelect('community')}
                className={`dc-choice-btn ${selectedChoice === 'community' ? 'is-selected' : ''}`}
              >
                <span className="dc-choice-diamond" aria-hidden="true" />
                <span>Démarrer mon projet Social Media</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChoice('direct')}
                className={`dc-choice-btn ${selectedChoice === 'direct' ? 'is-selected' : ''}`}
              >
                <span className="dc-choice-diamond" aria-hidden="true" />
                <span>Écrire directement au studio</span>
              </button>
            </div>

            {/* Direct Pure-Monochrome Studio Brief Form (POST /api/send-email) */}
            <form onSubmit={handleDirectSubmit} className="dc-direct-form" noValidate>
              <div className="dc-field-grid">
                <div className="dc-field-wrap">
                  <label htmlFor="dc-name" className="sr-only">
                    Votre nom complet
                  </label>
                  <input
                    id="dc-name"
                    type="text"
                    required
                    placeholder="Votre nom complet *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    className="dc-input"
                  />
                  <span className="dc-field-focus-line" aria-hidden="true" />
                </div>

                <div className="dc-field-wrap">
                  <label htmlFor="dc-email" className="sr-only">
                    Adresse e-mail professionnelle
                  </label>
                  <input
                    id="dc-email"
                    type="email"
                    required
                    placeholder="Adresse e-mail *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    className="dc-input"
                  />
                  <span className="dc-field-focus-line" aria-hidden="true" />
                </div>

                <div className="dc-field-wrap">
                  <label htmlFor="dc-phone" className="sr-only">
                    Numéro de téléphone ou WhatsApp
                  </label>
                  <input
                    id="dc-phone"
                    type="tel"
                    placeholder="Téléphone / WhatsApp"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                    className="dc-input"
                  />
                  <span className="dc-field-focus-line" aria-hidden="true" />
                </div>

                <div className="dc-field-wrap">
                  <label htmlFor="dc-company" className="sr-only">
                    Société ou organisation
                  </label>
                  <input
                    id="dc-company"
                    type="text"
                    placeholder="Entreprise ou marque"
                    value={contactForm.company}
                    onChange={(e) => setContactForm((p) => ({ ...p, company: e.target.value }))}
                    className="dc-input"
                  />
                  <span className="dc-field-focus-line" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-7 dc-field-wrap">
                <label htmlFor="dc-message" className="sr-only">
                  Décrivez votre projet
                </label>
                <textarea
                  id="dc-message"
                  rows={3}
                  required
                  placeholder="Décrivez votre projet, vos objectifs et l’échéance souhaitée *"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  className="dc-textarea"
                />
                <span className="dc-field-focus-line" aria-hidden="true" />
              </div>

              {contactFeedback.kind !== 'idle' && (
                <p
                  role="status"
                  className={`mt-5 text-[15px] ${
                    contactFeedback.kind === 'success' ? 'text-white' : 'text-[#d4d4d4]'
                  }`}
                >
                  {contactFeedback.text}
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                <p className="text-[16px] text-[#9a9a9a] max-w-[36ch]">
                  Besoin d’un devis guidé étape par étape ? Sélectionnez l'une des démarches ci-dessus ou contactez directement notre studio.
                </p>
                <MagneticCta
                  type="submit"
                  disabled={contactSending}
                  label={contactSending ? 'Envoi...' : 'Envoyer le brief'}
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEQUENCE 8 — MONUMENTAL FOOTER AVEC DEMI-TRIANGLE GÉOMÉTRIQUE AU BAS
         ===================================================================== */}
      <footer className="dc-footer bg-[#1C2C46] relative overflow-hidden">
        <div className="dc-container-inset relative z-10">
          <div className="dc-footer-grid">
            <div>
              <p className="text-[18px] text-white mb-2">Où nous trouver</p>
              <a
                ref={cityLinkRef}
                href="mailto:contact@sali-digicom.com"
                onMouseEnter={() => {
                  cityHoverRef.current = true;
                }}
                onMouseLeave={() => {
                  cityHoverRef.current = false;
                }}
                className="dc-hollow-city"
              >
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
                <a
                  href="https://salicapitalgroup.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dc-pill-btn"
                >
                  <span className="dc-pill-btn-fill" />
                  <span className="dc-pill-btn-content">
                    <span>SALI Capital Group</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Espace architectural dédié pour l'icône SD 3D centrée en bas du footer */}
          <div className="py-12 flex items-center justify-center relative pointer-events-none" aria-hidden="true">
            <div className="w-16 h-16 opacity-0" />
          </div>

          <div className="dc-footer-bottom text-[16px] text-[#9a9a9a]">
            <p>© {new Date().getFullYear()} SALI DigiCom. Tous droits réservés.</p>
          </div>
        </div>

        {/* Floating Cursor-Following Monochrome Casablanca Studio Card (Q.prototype) */}
        <div ref={cityCardRef} className="dc-city-preview" aria-hidden="true">
          <img
            src="/assets/perth-au-elizabeth-quay-bridge-2019-0375.jpg"
            alt=""
          />
          <span className="dc-city-preview-caption">Studio Casablanca</span>
        </div>
      </footer>

      {/* =====================================================================
          MONOCHROME POLE DETAIL DRAWER / MODAL
         ===================================================================== */}
      {inspectedPole && (
        <div
          data-ui="pole-detail-modal"
          role="dialog"
          aria-modal="true"
          aria-label={inspectedPole.title}
          className="fixed inset-0 z-[95] bg-[#131F33]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 dc-modal-enter"
          onClick={() => setInspectedPole(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0e0e0e] border border-[#363636] p-7 sm:p-10 text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="dc-diamond-tag is-inview">
                  <span className="dc-diamond-tag-dot" aria-hidden="true" />
                  <span>{inspectedPole.tag}, SALI DigiCom</span>
                </div>
                <h3 className="text-[26px] sm:text-[32px] font-normal leading-tight">
                  {inspectedPole.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setInspectedPole(null)}
                aria-label="Fermer la fiche"
                className="dc-pill-btn shrink-0"
              >
                <span className="dc-pill-btn-fill" />
                <span className="dc-pill-btn-content">Fermer</span>
              </button>
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-[#c8c8c8]">
              {inspectedPole.summary}
            </p>

            <ul className="mt-6 space-y-3 text-[15.5px] text-white">
              {inspectedPole.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <span
                    className="w-2 h-2 mt-2 border border-white rotate-45 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => handlePoleAction(inspectedPole)}
                className="dc-pill-btn"
              >
                <span className="dc-pill-btn-fill" />
                <span className="dc-pill-btn-content">{inspectedPole.ctaLabel}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DETAILED PROJECT CASE STUDY VIEW / MODAL (/projet/<slug>)
         ===================================================================== */}
      {selectedProject && (
        <ProjectCaseStudy
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigateNext={handleNavigateNextProject}
          onOpenQuestionnaire={(service) => {
            setSelectedProject(null);
            onOpenQuestionnaire(service || 'website');
          }}
        />
      )}

      {/* =====================================================================
          FULL 3D SPATIAL / MULTI-CATEGORY PORTFOLIO GALLERY (/projets)
         ===================================================================== */}
      <ProjectsGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectProject={(proj) => {
          setIsGalleryOpen(false);
          handleOpenProject(proj);
        }}
      />
    </div>
  );
}
