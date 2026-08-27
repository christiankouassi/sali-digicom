import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Award, 
  TrendingUp, 
  Users, 
  Send,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Code,
  Sparkles,
  Search,
  MessageSquare,
  Cpu,
  Workflow
} from 'lucide-react';
import { translations, Language } from '../translations';
import Logo from './Logo';
import QuestionnaireFlow from './QuestionnaireFlow';
interface SaliDigiComProps {
  onBack: () => void;
  currentSection: number;
  onGoToSection?: (index: number) => void;
  lang?: Language;
  isDigiComDomain?: boolean;
  onOpenQuestionnaire?: (type: 'website' | 'community', contactInfo: any) => void;
  isSubmittedFromModal?: boolean;
  onResetForm?: () => void;
}

export default function SaliDigiCom({ 
  onBack, 
  currentSection, 
  onGoToSection, 
  lang, 
  isDigiComDomain = false, 
  onOpenQuestionnaire,
  isSubmittedFromModal = false,
  onResetForm
}: SaliDigiComProps) {
  const activeLang = lang || 'fr';
  const t = translations[activeLang];

  const sectionPadds = activeLang === 'ar' 
    ? 'lg:pr-[290px] xl:pr-[330px] lg:pl-10 xl:pl-16' 
    : 'lg:pl-[290px] xl:pl-[330px] lg:pr-10 xl:pr-16';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    projectType: 'web',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isSubmittedFromModal) {
      setIsSubmitted(true);
    }
  }, [isSubmittedFromModal]);

  const handleResetForm = () => {
    setIsSubmitted(false);
    onResetForm?.();
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      projectType: 'web',
      message: ''
    });
  };

  // Web Services
  const webServices = [
    { title: t.digicom.webServices.landing.title, desc: t.digicom.webServices.landing.desc, icon: <Layers className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.webServices.showcase.title, desc: t.digicom.webServices.showcase.desc, icon: <Globe className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.webServices.corporate.title, desc: t.digicom.webServices.corporate.desc, icon: <Code className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.webServices.ecommerce.title, desc: t.digicom.webServices.ecommerce.desc, icon: <TrendingUp className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.webServices.maintenance.title, desc: t.digicom.webServices.maintenance.desc, icon: <Workflow className="w-5 h-5 text-[#1d9878]" /> }
  ];

  // Branding Services
  const brandingServices = [
    { title: t.digicom.brandingServices.logo.title, desc: t.digicom.brandingServices.logo.desc, icon: <Award className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.brandingServices.charte.title, desc: t.digicom.brandingServices.charte.desc, icon: <Layers className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.brandingServices.card.title, desc: t.digicom.brandingServices.card.desc, icon: <Users className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.brandingServices.brochure.title, desc: t.digicom.brandingServices.brochure.desc, icon: <Sparkles className="w-5 h-5 text-[#1d9878]" /> }
  ];

  // Marketing Services
  const marketingServices = [
    { title: t.digicom.marketingServices.social.title, desc: t.digicom.marketingServices.social.desc, icon: <Users className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.marketingServices.ads.title, desc: t.digicom.marketingServices.ads.desc, icon: <TrendingUp className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.marketingServices.audit.title, desc: t.digicom.marketingServices.audit.desc, icon: <Search className="w-5 h-5 text-[#1d9878]" /> }
  ];

  // AI Services
  const aiServices = [
    { title: t.digicom.aiServices.chatbot.title, desc: t.digicom.aiServices.chatbot.desc, icon: <MessageSquare className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.aiServices.assistant.title, desc: t.digicom.aiServices.assistant.desc, icon: <Cpu className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.aiServices.automation.title, desc: t.digicom.aiServices.automation.desc, icon: <Workflow className="w-5 h-5 text-[#1d9878]" /> },
    { title: t.digicom.aiServices.consulting.title, desc: t.digicom.aiServices.consulting.desc, icon: <Sparkles className="w-5 h-5 text-[#1d9878]" /> }
  ];

  // 4 steps of our approach
  const approachSteps = [
    {
      name: activeLang === 'ar' ? 'الاستراتيجية والتدقيق' : activeLang === 'en' ? 'Strategy & Audit' : 'Stratégie & Audit',
      image: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: activeLang === 'ar' ? 'تصميم واجهة المستخدم' : activeLang === 'en' ? 'UX/UI Design' : 'Design UX/UI',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: activeLang === 'ar' ? 'تطوير برمجيات مخصصة' : activeLang === 'en' ? 'Custom Development' : 'Développement Sur Mesure',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: activeLang === 'ar' ? 'الذكاء الاصطناعي والأداء' : activeLang === 'en' ? 'AI & Performance' : 'IA & Performance',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.projectType === 'web') {
      onOpenQuestionnaire?.('website', formData);
      return;
    }
    if (formData.projectType === 'marketing') {
      onOpenQuestionnaire?.('community', formData);
      return;
    }

    setIsSending(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formType: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          projectType: formData.projectType,
          message: formData.message
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await response.json();
        setSubmitError(errData.error || "Une erreur s'est produite lors de l'envoi.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Impossible de se connecter au serveur d'envoi. Veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  // Replay section animations
  React.useEffect(() => {
    const digicomSecs = [
      'digicom-presentation',
      'digicom-services-1a',
      'digicom-services-1b',
      'digicom-services-2a',
      'digicom-services-2b',
      'digicom-products-1',
      'digicom-products-2',
      'digicom-contact'
    ];
    
    const activeId = digicomSecs[currentSection];
    digicomSecs.forEach((secId) => {
      if (secId !== activeId) {
        const secEl = document.getElementById(secId);
        if (secEl) {
          secEl.querySelectorAll('.ae').forEach(el => el.classList.remove('vis'));
        }
      }
    });

    const trigger = () => {
      if (activeId) {
        const activeSec = document.getElementById(activeId);
        if (activeSec) {
          const elements = activeSec.querySelectorAll('.ae');
          if (elements.length > 0) {
            elements.forEach(el => el.classList.add('vis'));
            return true;
          }
        }
      }
      return false;
    };

    trigger();
    const timers = [10, 30, 80, 150, 300, 600, 1000].map(delay => {
      return setTimeout(trigger, delay);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentSection]);

  return (
    <div className="absolute inset-0 bg-[#0b0f19] text-white overflow-hidden w-full h-full" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Slide Transition Wrapper */}
      <div 
        className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
        style={{ transform: `translateY(-${currentSection * 100}%)` }}
      >
        {/* PARALLAX SCREEN 0: PRESENTATION OF DIGICOM (Hero) */}
        <section id="digicom-presentation" className={`relative h-[100dvh] flex items-center justify-center px-[5vw] overflow-hidden ${sectionPadds}`}>
          <div className="absolute inset-0 z-0 bg-[#ebf1f8]">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015" 
              className="w-full h-full object-cover filter brightness-110 contrast-100 opacity-60" 
              alt="SALI DigiCom" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/70 backdrop-blur-[6px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-12">
            <div className="ae ae-pop flex flex-col items-center mb-6" data-d="1">
              <Logo 
                variant="digicom" 
                type="icon" 
                className="w-36 h-36 md:w-44 md:h-44 object-contain filter drop-shadow-sm select-none" 
              />
            </div>

            <p 
              className="ae ae-up text-lg md:text-xl lg:text-2xl text-[#1c2c46] font-bold tracking-wide leading-relaxed max-w-2xl"
              data-d="2"
              style={{ textShadow: '0 2px 4px rgba(235, 241, 248, 0.5)' }}
            >
              {t.digicom.heroSubtitle}
            </p>

            {!isDigiComDomain && (
              <div className="ae ae-up mt-8" data-d="3">
                <a 
                  href="https://www.sali-digicom.com"
                  className="inline-flex items-center bg-[#1d9878] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all hover:bg-[#157159]"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }}
                >
                  {activeLang === 'ar' ? 'لمعرفة المزيد' : activeLang === 'en' ? 'Learn More' : 'En savoir plus'}
                </a>
              </div>
            )}
          </div>
        </section>

        {isDigiComDomain && (
          <>

        {/* PARALLAX SCREEN 1: WEB DEPARTMENT */}
        <section id="digicom-services-1a" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=2069" 
              alt="Web Design & Development" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
              <div className="lg:col-span-12 flex flex-col justify-center lg:h-full p-4 lg:p-12">
                <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                  SALI DIGICOM
                </span>
                <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                  {t.digicom.webTitle}
                </h1>
                <p className="ae ae-left text-[12.5px] text-[#2d3e56] leading-relaxed max-w-lg mb-6" data-d="2.5">
                  {t.digicom.webDesc}
                </p>
                <div className="ae ae-left mb-4" data-d="2.8">
                  <button 
                    onClick={() => onOpenQuestionnaire?.('website')}
                    className="inline-flex items-center bg-[#1c2c46] hover:bg-[#1d9878] text-white px-6 py-3 text-[9.5px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer relative z-10" 
                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }} 
                  >
                    Obtenir un devis site web personnalisé
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-2">
                  {webServices.map((item, index) => (
                    <div 
                      key={index}
                      className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                      data-d={index + 3}
                    >
                      <div className="flex items-center gap-3.5 mb-2.5">
                        <div className="w-10 h-10 bg-[#1d9878]/10 border border-[#1d9878]/15 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <h3 className="text-[13px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors leading-tight">{item.title}</h3>
                      </div>
                      <p className="text-[11px] text-[#2d3e56]/90 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 2: BRANDING DEPARTMENT */}
        <section id="digicom-services-1b" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=2074" 
              alt="Brand Design & Visual Identity" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
              <div className="lg:col-span-12 flex flex-col justify-center lg:h-full p-4 lg:p-12">
                <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                  SALI DIGICOM
                </span>
                <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                  {t.digicom.brandingTitle}
                </h1>
                <p className="ae ae-left text-[12.5px] text-[#2d3e56] leading-relaxed max-w-lg mb-6" data-d="2.5">
                  {t.digicom.brandingDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mt-2">
                  {brandingServices.map((item, index) => (
                    <div 
                      key={index}
                      className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                      data-d={index + 3}
                    >
                      <div className="flex items-center gap-3.5 mb-2.5">
                        <div className="w-10 h-10 bg-[#1d9878]/10 border border-[#1d9878]/15 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <h3 className="text-[13px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors leading-tight">{item.title}</h3>
                      </div>
                      <p className="text-[11px] text-[#2d3e56]/90 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 3: MARKETING DEPARTMENT */}
        <section id="digicom-services-2a" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015" 
              alt="Digital Marketing Campaigns" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
              <div className="lg:col-span-12 flex flex-col justify-center lg:h-full p-4 lg:p-12">
                <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                  SALI DIGICOM
                </span>
                <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                  {t.digicom.marketingTitle}
                </h1>
                <p className="ae ae-left text-[12.5px] text-[#2d3e56] leading-relaxed max-w-lg mb-6" data-d="2.5">
                  {t.digicom.marketingDesc}
                </p>
                <div className="ae ae-left mb-4" data-d="2.8">
                  <button 
                    onClick={() => onOpenQuestionnaire?.('community')}
                    className="inline-flex items-center bg-[#1c2c46] hover:bg-[#1d9878] text-white px-6 py-3 text-[9.5px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer relative z-10" 
                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }} 
                  >
                    Obtenir un devis community management personnalisé
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mt-2">
                  {marketingServices.map((item, index) => (
                    <div 
                      key={index}
                      className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                      data-d={index + 3}
                    >
                      <div className="flex items-center gap-3.5 mb-2.5">
                        <div className="w-10 h-10 bg-[#1d9878]/10 border border-[#1d9878]/15 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <h3 className="text-[13px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors leading-tight">{item.title}</h3>
                      </div>
                      <p className="text-[11px] text-[#2d3e56]/90 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 4: AI & AUTOMATION */}
        <section id="digicom-services-2b" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2064" 
              alt="AI and Automation" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
              <div className="lg:col-span-12 flex flex-col justify-center lg:h-full p-4 lg:p-12">
                <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                  SALI DIGICOM
                </span>
                <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                  {t.digicom.aiTitle}
                </h1>
                <p className="ae ae-left text-[12.5px] text-[#2d3e56] leading-relaxed max-w-lg mb-6" data-d="2.5">
                  {t.digicom.aiDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mt-2">
                  {aiServices.map((item, index) => (
                    <div 
                      key={index}
                      className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                      data-d={index + 3}
                    >
                      <div className="flex items-center gap-3.5 mb-2.5">
                        <div className="w-10 h-10 bg-[#1d9878]/10 border border-[#1d9878]/15 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <h3 className="text-[13px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors leading-tight">{item.title}</h3>
                      </div>
                      <p className="text-[11px] text-[#2d3e56]/90 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 5: OUR APPROACH */}
        <section id="digicom-products-1" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
              alt="Creative Strategy Approach" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
              <div className="lg:col-span-6 flex flex-col justify-center h-full relative z-10">
                <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                  SALI DIGICOM
                </span>
                <h2 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                  {t.digicom.approachTitle}
                </h2>
                <p className="ae ae-left text-[12.5px] text-[#2d3e56] font-medium leading-relaxed mb-4" data-d="2">
                  {t.digicom.approachDesc}
                </p>
                
                {/* Notre Vision Section Integrated */}
                <div className="ae ae-left border-t border-[#1c2c46]/10 pt-4 mt-2 mb-6" data-d="2.5">
                  <h3 className="text-xs font-bold tracking-[2px] uppercase text-[#1d9878] mb-1.5">{t.digicom.reachTitle}</h3>
                  <p className="text-[12px] text-[#2d3e56] font-medium leading-relaxed">{t.digicom.reachDesc}</p>
                </div>
                
                <button 
                  onClick={() => onGoToSection?.(7)}
                  className="ae ae-up inline-flex items-center bg-[#1d9878] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer hover:bg-[#157159] relative z-10" 
                  style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }} 
                  data-d="3.5"
                >
                  {activeLang === 'ar' ? 'أطلق مشروعك' : activeLang === 'en' ? 'Launch Project' : 'Lancer un projet'}
                </button>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center relative w-full ae ae-pop" data-d="4">
                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                  {approachSteps.map((step, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-md border border-[#d3dfed] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                    >
                      <img 
                        src={step.image} 
                        alt={step.name} 
                        className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c2c46]/90 via-[#1c2c46]/35 to-transparent flex flex-col justify-end p-3 lg:p-4" />
                      <span className="absolute bottom-3 left-3 right-3 text-white text-[10.5px] lg:text-[12px] font-extrabold tracking-wide leading-tight drop-shadow-sm">
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 6: OUR VALUES */}
        <section id="digicom-products-2" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070" 
              alt="Our Corporate Values" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
              <div className="lg:col-span-6 flex flex-col justify-center h-full relative z-10">
                <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                  SALI DIGICOM
                </span>
                <h2 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                  {t.digicom.valuesTitle}
                </h2>
                <p className="ae ae-left text-[12.5px] text-[#2d3e56] font-medium leading-relaxed mb-6" data-d="2">
                  {t.digicom.valuesDesc}
                </p>
                
                <button 
                  onClick={() => onGoToSection?.(7)}
                  className="ae ae-up inline-flex items-center bg-[#1d9878] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer hover:bg-[#157159] relative z-10" 
                  style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }} 
                  data-d="3.5"
                >
                  {activeLang === 'ar' ? 'أطلق مشروعك' : activeLang === 'en' ? 'Launch Project' : 'Lancer un projet'}
                </button>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center relative w-full ae ae-pop" data-d="4">
                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                  {[
                    { key: 'strategy', icon: <Layers className="w-5 h-5 text-[#1d9878]" />, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800' },
                    { key: 'creativity', icon: <Award className="w-5 h-5 text-[#1d9878]" />, image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800' },
                    { key: 'performance', icon: <TrendingUp className="w-5 h-5 text-[#1d9878]" />, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800' },
                    { key: 'support', icon: <Users className="w-5 h-5 text-[#1d9878]" />, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' }
                  ].map((item, idx) => {
                    const val = t.digicom.valuesList[item.key as 'strategy' | 'creativity' | 'performance' | 'support'];
                    return (
                      <div 
                        key={idx} 
                        className="relative h-[145px] sm:h-[155px] md:h-[165px] lg:h-[190px] xl:h-[210px] rounded-2xl overflow-hidden group shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg bg-[#1c2c46] p-4 flex flex-col justify-between"
                      >
                        <img 
                          src={item.image} 
                          alt={val.title} 
                          className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c2c46] via-[#1c2c46]/75 to-[#1c2c46]/15 transition-all duration-300 group-hover:from-[#1c2c46]/95 group-hover:via-[#1c2c46]/85" />
                        
                        <div className="relative z-10 flex items-center justify-end w-full">
                          <span className="text-[11px] lg:text-[13px] font-black text-white/30">0{idx + 1}</span>
                        </div>
                        
                        <div className="relative z-10 mt-auto">
                          <h3 className="text-[11.5px] lg:text-[13.5px] font-black text-white mb-1 leading-tight">{val.title}</h3>
                          <p className="text-[9.5px] lg:text-[10.5px] leading-tight text-white/70 h-[34px] sm:h-[38px] lg:h-[42px] overflow-hidden">
                            {val.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* PARALLAX SCREEN 8: CONTACT */}
        <section id="digicom-contact" className="relative min-h-[100dvh] lg:h-[100dvh] bg-[#ebf1f8] overflow-y-auto lg:overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
             <img 
               src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070" 
               className="w-full h-full object-cover opacity-55 brightness-110 contrast-100" 
               alt="Contact Background" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>
          
          <div className={`relative z-10 w-full h-auto lg:h-full overflow-y-visible lg:overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-7xl mx-auto h-auto lg:h-full px-4 pt-12 lg:pt-0">
              <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 h-auto lg:h-full w-full border border-[#d3dfed] rounded-3xl overflow-hidden shadow-2xl bg-white">
                
                {/* Left Column */}
                <div className="flex flex-col justify-center p-8 lg:p-12 bg-[#1c2c46] border-b lg:border-b-0 lg:border-r border-[#d3dfed] w-full">
                  <h2 className="ae ae-left text-[clamp(28px,2.5vw,42px)] font-black tracking-[-1.5px] leading-[1.1] mb-5 text-white" data-d="1">
                    {activeLang === 'ar' ? 'أطلق مشروعك' : activeLang === 'en' ? 'Launch Your Project' : 'Lancez votre projet'}
                  </h2>
                  <div className="ae ae-pop flex items-center gap-4 mb-5" data-d="1.5">
                     <div className="w-10 h-[2px] bg-[#1d9878]" />
                     <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878]">SALI DigiCom</span>
                  </div>
                  <p className="ae ae-left text-[11px] lg:text-[13px] text-white/70 leading-relaxed font-semibold mb-6 max-w-sm" data-d="1.8">
                    {t.contact.formTitleDigicom}
                  </p>

                  <div className="space-y-5 lg:space-y-8 mt-2">
                    <div className="ae ae-up flex items-center gap-4" data-d="2">
                      <div className="w-9 h-9 lg:w-12 lg:h-12 bg-[#1d9878]/15 border border-[#1d9878]/25 rounded-xl flex items-center justify-center text-[#1d9878]">
                        <Phone size={16} />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-0.5">{t.contact.phoneLabel}</span>
                        <a href="tel:+212713370946" className="text-xs lg:text-base font-semibold text-white hover:text-[#1d9878] transition-colors">+212 713-370946</a>
                      </div>
                    </div>
                    <div className="ae ae-up flex items-center gap-4" data-d="2.5">
                      <div className="w-9 h-9 lg:w-12 lg:h-12 bg-[#1d9878]/15 border border-[#1d9878]/25 rounded-xl flex items-center justify-center text-[#1d9878]">
                        <Mail size={16} />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-0.5">{t.contact.emailLabel}</span>
                        <a href="mailto:contact@sali-digicom.com" className="text-xs lg:text-base font-semibold text-white hover:text-[#1d9878] transition-colors">contact@sali-digicom.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Form) */}
                <div className="flex flex-col justify-center p-8 lg:p-12 bg-white text-[#1c2c46] w-full overflow-y-visible">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="ae ae-up flex flex-col gap-1.5" data-d="3">
                            <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.fullName}</label>
                            <input 
                              required
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                              placeholder={t.contact.placeholderName}
                            />
                          </div>
                          <div className="ae ae-up flex flex-col gap-1.5" data-d="3.5">
                            <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.phoneLabel}</label>
                            <input 
                              required
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                              placeholder={t.contact.placeholderPhone} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="ae ae-up flex flex-col gap-1.5" data-d="4">
                            <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.emailLabel}</label>
                            <input 
                              required
                              type="email"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                              placeholder={t.contact.placeholderEmail} 
                            />
                          </div>
                          <div className="ae ae-up flex flex-col gap-1.5" data-d="4.5">
                            <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.companyLabel}</label>
                            <input 
                              required
                              value={formData.company}
                              onChange={e => setFormData({...formData, company: e.target.value})}
                              className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                              placeholder={t.contact.placeholderCompany}
                            />
                          </div>
                        </div>

                        <div className="ae ae-up flex flex-col gap-1.5" data-d="5">
                          <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{activeLang === 'ar' ? 'نوع المشروع' : activeLang === 'en' ? 'Project Type' : 'Type de Projet'}</label>
                          <select 
                            value={formData.projectType}
                            onChange={e => setFormData({...formData, projectType: e.target.value})}
                            className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]"
                          >
                            <option value="web">{t.digicom.webTitle}</option>
                            <option value="branding">{t.digicom.brandingTitle}</option>
                            <option value="marketing">{t.digicom.marketingTitle}</option>
                            <option value="ai">{t.digicom.aiTitle}</option>
                            <option value="other">{activeLang === 'ar' ? 'آخر' : activeLang === 'en' ? 'Other' : 'Autre'}</option>
                          </select>
                        </div>

                        <div className="ae ae-up flex flex-col gap-1.5" data-d="5.5">
                           <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.messageLabel}</label>
                           <textarea 
                             required={formData.projectType !== 'web' && formData.projectType !== 'marketing'}
                             value={formData.message}
                             onChange={e => setFormData({...formData, message: e.target.value})}
                             className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3.5 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all resize-none rounded-lg text-[#1c2c46]" 
                             placeholder={t.contact.placeholderMessageDigicom}
                             rows={3} 
                           />
                         </div>

                        {submitError && (
                          <div className="ae ae-up text-red-500 text-[11px] font-semibold mt-2" data-d="5.8">
                            {submitError}
                          </div>
                        )}

                        <button 
                          type="submit"
                          disabled={isSending}
                          className="ae ae-up bg-[#1c2c46] hover:bg-[#1d9878] hover:border-[#1d9878] disabled:opacity-50 text-white px-10 py-4 text-[10px] font-bold tracking-[2px] uppercase border-2 border-[#1c2c46] transition-all mt-4 self-start cursor-pointer inline-flex items-center gap-2"
                          style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                          data-d="6"
                        >
                          {isSending 
                            ? 'Envoi en cours...' 
                            : (formData.projectType === 'web' || formData.projectType === 'marketing' 
                                ? 'Remplir le formulaire' 
                                : t.contact.btnSendDigicom)} 
                          {formData.projectType === 'web' || formData.projectType === 'marketing' 
                            ? <ArrowRight size={14} strokeWidth={3} /> 
                            : <Send size={14} strokeWidth={3} />}
                        </button>
                      </form>
                    ) : (
                      <motion.div 
                        key="success"
                        className="flex flex-col items-center justify-center text-center py-4 h-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="w-12 h-12 bg-[#1d9878]/10 border border-[#1d9878]/25 rounded-full flex items-center justify-center text-[#1d9878] mb-4 animate-pulse">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-[#1c2c46] mb-1">{t.contact.successTitle}</h4>
                        <p className="text-[10px] text-[#5a6a7a] max-w-sm leading-relaxed mb-4">
                          {t.contact.successDescDigicom.split('contact@sali-digicom.com').map((part, index) => (
                            <React.Fragment key={index}>
                              {part}
                              {index === 0 && <strong className="text-[#1c2c46]">contact@sali-digicom.com</strong>}
                            </React.Fragment>
                          ))}
                        </p>
                        <button 
                          onClick={handleResetForm}
                          className="text-[9px] font-bold uppercase tracking-[2px] text-[#1d9878] border border-[#1d9878]/30 px-5 py-2 rounded-full hover:bg-[#1d9878]/5 transition-all cursor-pointer"
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
          </>
        )}
      </div>
    </div>
  );
}
