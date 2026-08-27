import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Layers, 
  Truck, 
  CheckCircle2, 
  Package, 
  Award, 
  TrendingUp, 
  Users, 
  Scale, 
  ShieldCheck,
  Send,
  Phone,
  Mail
} from 'lucide-react';
import { translations, Language } from '../translations';
import Logo from './Logo';

interface SaliCommoditiesProps {
  onBack: () => void;
  currentSection: number;
  onGoToSection?: (index: number) => void;
  lang?: Language;
}

export default function SaliCommodities({ onBack, currentSection, onGoToSection, lang }: SaliCommoditiesProps) {
  const activeLang = lang || 'fr';
  const t = translations[activeLang];

  const sectionPadds = activeLang === 'ar' 
    ? 'lg:pr-[290px] xl:pr-[330px] lg:pl-10 xl:pl-16' 
    : 'lg:pl-[290px] xl:pl-[330px] lg:pr-10 xl:pr-16';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    role: 'Distributeur',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeMarocProduct, setActiveMarocProduct] = useState(0);
  const [activeAfricaProduct, setActiveAfricaProduct] = useState(0);
  const [activeContactTab, setActiveContactTab] = useState(0);

  // Split services in two packs
  const servicesPack1 = [
    {
      title: t.commodities.services.sourcing.title,
      icon: <Layers className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.sourcing.p1,
        t.commodities.services.sourcing.p2,
        t.commodities.services.sourcing.p3,
        t.commodities.services.sourcing.p4,
        t.commodities.services.sourcing.p5
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.commercial.title,
      icon: <Users className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.commercial.p1,
        t.commodities.services.commercial.p2,
        t.commodities.services.commercial.p3,
        t.commodities.services.commercial.p4,
        t.commodities.services.commercial.p5
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.logistics.title,
      icon: <Truck className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.logistics.p1,
        t.commodities.services.logistics.p2,
        t.commodities.services.logistics.p3,
        t.commodities.services.logistics.p4,
        t.commodities.services.logistics.p5
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.quality.title,
      icon: <ShieldCheck className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.quality.p1,
        t.commodities.services.quality.p2,
        t.commodities.services.quality.p3,
        t.commodities.services.quality.p4,
        t.commodities.services.quality.p5
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.storage.title,
      icon: <Package className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.storage.p1,
        t.commodities.services.storage.p2,
        t.commodities.services.storage.p3,
        t.commodities.services.storage.p4,
        t.commodities.services.storage.p5
      ].filter(Boolean) as string[]
    }
  ];

  const servicesPack2 = [
    {
      title: t.commodities.services.brand.title,
      icon: <Award className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.brand.p1,
        t.commodities.services.brand.p2,
        t.commodities.services.brand.p3,
        t.commodities.services.brand.p4,
        t.commodities.services.brand.p5
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.admin.title,
      icon: <Scale className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.admin.p1,
        t.commodities.services.admin.p2,
        t.commodities.services.admin.p3,
        t.commodities.services.admin.p4,
        t.commodities.services.admin.p5,
        t.commodities.services.admin.p6
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.consulting.title,
      icon: <TrendingUp className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.consulting.p1,
        t.commodities.services.consulting.p2,
        t.commodities.services.consulting.p3,
        t.commodities.services.consulting.p4,
        t.commodities.services.consulting.p5
      ].filter(Boolean) as string[]
    },
    {
      title: t.commodities.services.digital.title,
      icon: <TrendingUp className="w-5 h-5 text-[#1d9878]" />,
      points: [
        t.commodities.services.digital.p1,
        t.commodities.services.digital.p2,
        t.commodities.services.digital.p3,
        t.commodities.services.digital.p4,
        t.commodities.services.digital.p5
      ].filter(Boolean) as string[]
    }
  ];

  // Moroccan agricultural exports
  const productsMorocco = [
    {
      name: t.commodities.products.citrus.name,
      category: t.commodities.products.citrus.cat,
      desc: t.commodities.products.citrus.desc,
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: t.commodities.products.tomatoes.name,
      category: t.commodities.products.tomatoes.cat,
      desc: t.commodities.products.tomatoes.desc,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: t.commodities.products.berries.name,
      category: t.commodities.products.berries.cat,
      desc: t.commodities.products.berries.desc,
      image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: t.commodities.products.oliveOil.name,
      category: t.commodities.products.oliveOil.cat,
      desc: t.commodities.products.oliveOil.desc,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: t.commodities.products.avocado.name,
      category: t.commodities.products.avocado.cat,
      desc: t.commodities.products.avocado.desc,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // West African & Special products
  const productsAfrica = [
    {
      name: t.commodities.products.cashew.name,
      category: t.commodities.products.cashew.cat,
      desc: t.commodities.products.cashew.desc,
      image: 'https://i.pinimg.com/1200x/6e/b9/40/6eb940db28046623f6782a0d93aba710.jpg'
    },
    {
      name: t.commodities.products.mango.name,
      category: t.commodities.products.mango.cat,
      desc: t.commodities.products.mango.desc,
      image: 'https://i.pinimg.com/1200x/42/00/ac/4200ac09886b04bd5d789dbb2149de27.jpg'
    },
    {
      name: t.commodities.products.driedMango.name,
      category: t.commodities.products.driedMango.cat,
      desc: t.commodities.products.driedMango.desc,
      image: 'https://i.pinimg.com/1200x/ed/51/ab/ed51ab69fa73bcff0663b3ef81e54d2d.jpg'
    },
    {
      name: t.commodities.products.mangoPuree.name,
      category: t.commodities.products.mangoPuree.cat,
      desc: t.commodities.products.mangoPuree.desc,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: t.commodities.products.onion.name,
      category: t.commodities.products.onion.cat,
      desc: t.commodities.products.onion.desc,
      image: 'https://i.pinimg.com/1200x/14/0b/7c/140b7c705d5162b1c84814a1b4b05e8c.jpg'
    }
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const subject = encodeURIComponent(`Contact SALI Commodities - de ${formData.company}`);
    const body = encodeURIComponent(
      `Nom Complet: ${formData.name}\n` +
      `Entreprise: ${formData.company}\n` +
      `Téléphone: ${formData.phone}\n` +
      `E-mail: ${formData.email}\n` +
      `Profil: ${formData.role}\n\n` +
      `Message:\n${formData.message}`
    );
    window.location.href = `mailto:hd@sali-capital.com?subject=${subject}&body=${body}`;
  };

  // Guard animation trigger specifically for Commodities sections to ensure they are visible on entry
  React.useEffect(() => {
    const commodSecs = [
      'commodities-presentation',
      'commodities-services-1a',
      'commodities-services-1b',
      'commodities-services-2a',
      'commodities-services-2b',
      'commodities-products-1',
      'commodities-products-2',
      'commodities-markets',
      'commodities-contact'
    ];
    
    // Clear other commodities sections to make animations loopable/replayable
    const activeId = commodSecs[currentSection];
    commodSecs.forEach((secId) => {
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

    // Run immediately and queue multiple fast and delayed retries
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
        {/* PARALLAX SCREEN 0: PRESENTATION OF COMMODITIES */}
        <section id="commodities-presentation" className={`relative h-[100dvh] flex items-center justify-center px-[5vw] overflow-hidden ${sectionPadds}`}>
          <div className="absolute inset-0 z-0 bg-[#ebf1f8]">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2074" 
              className="w-full h-full object-cover filter brightness-110 contrast-100 opacity-60" 
              alt="Organic produce Sali Commodities" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/70 backdrop-blur-[6px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-12">
            <div 
              className="ae ae-pop flex flex-col items-center mb-6"
              data-d="1"
            >
              <Logo 
                variant="commodities" 
                type="icon" 
                className="w-36 h-36 md:w-44 md:h-44 object-contain filter drop-shadow-sm select-none" 
              />
            </div>

            <p 
              className="ae ae-up text-lg md:text-xl lg:text-2xl text-[#1c2c46] font-black tracking-wide leading-relaxed max-w-2xl mb-8"
              data-d="2"
              style={{ textShadow: '0 2px 4px rgba(235, 241, 248, 0.5)' }}
            >
              {activeLang === 'ar' 
                ? "سالي للسلع هي شركة استيراد وتصدير متخصصة في المنتجات الغذائية والمواد الخام." 
                : activeLang === 'en'
                ? "SALI Commodities is an import-export company specialized in agri-food and raw materials."
                : "SALI Commodities, société d’import-export, spécialisée dans l’agro-alimentaire ainsi que les matières premières."}
            </p>

            <div className="ae ae-up flex flex-wrap items-center justify-center gap-4 mt-2" data-d="3">
              <button
                onClick={() => onGoToSection && onGoToSection(1)}
                className="bg-[#1d9878] hover:bg-[#157159] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all cursor-pointer shadow-md shadow-[#1d9878]/10 inline-flex items-center gap-2"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              >
                Nos Services
              </button>
              <button
                onClick={() => onGoToSection && onGoToSection(5)}
                className="bg-[#1c2c46] hover:bg-[#253957] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              >
                Nos Produits
              </button>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 1A: SERVICES I (Approvisionnement & Commerce) */}
        <section id="commodities-services-1a" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          {/* Fullscreen background image with subtle corporate overlay */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2070" 
              alt="Logistics Port Background" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            {/* Content column - updated to lg:col-span-12 for full width with logo removed */}
            <div className="lg:col-span-12 flex flex-col justify-center lg:h-full p-4 lg:p-12">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">{t.commodities.importExportTag}</span>
              <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                {t.commodities.servicesTitle}
                {t.commodities.servicesSubtitle && (
                  <>
                    <br />
                    <span className="italic text-[#1d9878]">{t.commodities.servicesSubtitle}</span>
                  </>
                )}
              </h1>
              <p className="ae ae-left text-[12.5px] text-[#2d3e56] leading-relaxed max-w-lg mb-6" data-d="2.5">
                {t.commodities.servicesDesc}
              </p>

              {/* Grid of services in bright luxury cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mt-2">
                {servicesPack1.slice(0, 2).map((item, index) => (
                  <div 
                    id={`service-card-${index}`}
                    key={index}
                    className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                    data-d={index + 3}
                  >
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="w-10 h-10 bg-[#1d9878]/10 border border-[#1d9878]/15 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <h3 className="text-[13.5px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors">{item.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {item.points.map((p, pIdx) => (
                        <li key={pIdx} className="text-[11px] text-[#2d3e56]/90 leading-tight flex items-start gap-1.5">
                          <span className="text-[#1d9878] font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 1B: SERVICES I PARTIE II (Logistique, Qualité, Stockage) */}
        <section id="commodities-services-1b" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2070" 
              alt="Logistics Port Background" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            {/* Descriptive column on the left */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center lg:h-full">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">{t.commodities.importExportTag}</span>
              <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="2">
                {activeLang === 'ar' ? 'الخدمات اللوجستية' : activeLang === 'en' ? 'Our Services' : 'Nos services'} <br />
                <span className="italic text-[#1d9878]">{activeLang === 'ar' ? 'اللوجستيات ومراقبة الجودة' : activeLang === 'en' ? 'Logistics & quality control' : 'Logistique et contrôle qualité'}</span>
              </h1>
              <p className="ae ae-left text-[12.5px] text-[#2d3e56] leading-relaxed max-w-md" data-d="3">
                {activeLang === 'ar' 
                  ? 'نضمن نقلاً آمناً وتخزيناً متطوراً لجميع منتجاتنا لمطابقة معايير الجودة العالمية بكفاءة.' 
                  : activeLang === 'en' 
                    ? 'We guarantee rigorous transit and state-of-the-art cold storage to secure pristine quality for global markets.' 
                    : 'Nous assurons un transit très rigoureux et du stockage de pointe pour préserver la qualité finale.'}
              </p>
            </div>

            {/* Grid of services in bright cards fit to background */}
            <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center lg:h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {servicesPack1.slice(2, 5).map((item, index) => (
                  <div 
                    id={`service-card-b-${index}`}
                    key={index}
                    className="ae ae-pop bg-white border border-[#d3dfed] p-4.5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                    data-d={index + 2}
                  >
                    <div className="flex flex-col mb-3">
                      <div className="w-10 h-10 bg-[#1d9878]/10 border border-[#1d9878]/15 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform mb-2">
                        {item.icon}
                      </div>
                      <h3 className="text-[12.5px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors leading-snug">{item.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {item.points.map((p, pIdx) => (
                        <li key={pIdx} className="text-[10.5px] text-[#2d3e56]/90 leading-tight flex items-start gap-1">
                          <span className="text-[#1d9878] font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 2A: SERVICES II PARTIE I (Mise en marché & Sourcing Privé) */}
        <section id="commodities-services-2a" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          {/* Fullscreen background image with subtle corporate overlay */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070" 
              alt="Strategy Meeting Background" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            {/* Descriptive column on the left */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:h-full">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">{t.commodities.importExportTag}</span>
              <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="2">
                {t.commodities.servicesTitle} <br />
                <span className="italic text-[#1d9878]">{t.commodities.coordSubtitle}</span>
              </h1>
              <p className="ae ae-left text-[12.5px] text-[#2d3e56] font-medium leading-relaxed max-w-md" data-d="3">
                {t.commodities.coordDesc}
              </p>
            </div>

            {/* Grid of services pack 2 */}
            <div className="lg:col-span-8 flex flex-col justify-center lg:h-full">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                {servicesPack2.slice(0, 2).map((item, index) => (
                  <div 
                    id={`service-card-2-${index}`}
                    key={index}
                    className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                    data-d={index + 2}
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-10 h-10 bg-[#1d9878]/10 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <h3 className="text-[13.5px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors">{item.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {item.points.map((p, pIdx) => (
                        <li key={pIdx} className="text-[11px] text-[#2d3e56]/90 leading-snug flex items-start gap-1.5">
                           <span className="text-[#1d9878] font-bold">•</span>
                           <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 2B: SERVICES II PARTIE II (Conseil & Traçabilité Digitale) */}
        <section id="commodities-services-2b" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070" 
              alt="Strategy Meeting Background" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            {/* Descriptive column on the left */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:h-full">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">{t.commodities.importExportTag}</span>
              <h1 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="2">
                {t.commodities.servicesTitle} <br />
                <span className="italic text-[#1d9878]">
                  {activeLang === 'ar' ? 'الاستشارة والخدمات الرقمية' : activeLang === 'en' ? 'Advisory & Digital' : 'Conseil & Digital'}
                </span>
              </h1>
              <p className="ae ae-left text-[12.5px] text-[#2d3e56] font-medium leading-relaxed max-w-md" data-d="3">
                {activeLang === 'ar' 
                  ? 'نرافق شركاءنا باستشارات استراتيجية مخصصة لأسواقهم وخدمات رقمية وبناء العلامات التجارية.' 
                  : activeLang === 'en' 
                    ? 'We support our business partners with advice on their strategy depending on their target market and products. We also assist them on a number of digital and branding services.' 
                    : 'Nous accompagnons nos partenaires avec des conseils sur leur stratégie dépendamment de leur marché-cible et de leurs produits. Nous les assistons également sur un certain nombre de services digitaux et de branding.'}
              </p>
            </div>

            {/* Grid of services pack 2 */}
            <div className="lg:col-span-8 flex flex-col justify-center lg:h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                {servicesPack2.slice(2, 4).map((item, index) => (
                  <div 
                    id={`service-card-2b-${index}`}
                    key={index}
                    className="ae ae-pop bg-white border border-[#d3dfed] p-5 rounded-2xl relative hover:border-[#1d9878] hover:bg-white hover:shadow-xl transition-all duration-300 group shadow-md"
                    data-d={index + 2}
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-10 h-10 bg-[#1d9878]/10 rounded-lg flex items-center justify-center text-[#1d9878] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <h3 className="text-[13.5px] font-bold text-[#1c2c46] group-hover:text-[#1d9878] transition-colors">{item.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {item.points.map((p, pIdx) => (
                        <li key={pIdx} className="text-[11px] text-[#2d3e56]/90 leading-snug flex items-start gap-1.5">
                           <span className="text-[#1d9878] font-bold">•</span>
                           <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 3: PRODUITS I (Origine Maroc) */}
        <section id="commodities-products-1" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2070" 
              alt="Agricultural background" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            {/* Left Content column */}
            <div className="lg:col-span-6 flex flex-col justify-center h-full relative z-10">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                {t.commodities.importExportTag}
              </span>
              <h2 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                {t.commodities.moroccoTitle} <br />
                <span className="italic text-[#1d9878]">{t.commodities.moroccoSubtitle}</span>
              </h2>
              <p className="ae ae-left text-[12.5px] text-[#2d3e56] font-medium leading-relaxed mb-6" data-d="2">
                {t.commodities.moroccoDesc}
              </p>
              
              {/* Action Contact Button */}
              <button 
                onClick={() => onGoToSection?.(7)}
                className="ae ae-up inline-flex items-center bg-[#1d9878] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer hover:bg-[#157159] relative z-10" 
                style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }} 
                data-d="3.5"
              >
                {activeLang === 'ar' ? 'اطلب الآن' : activeLang === 'en' ? 'Inquire Now' : 'S’approvisionner'}
              </button>
            </div>

            {/* Right side: 2x2 static image gallery */}
            <div className="lg:col-span-6 flex flex-col justify-center relative w-full ae ae-pop" data-d="4">
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                {productsMorocco.slice(0, 4).map((product, pIdx) => (
                  <div 
                    key={pIdx} 
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-md border border-[#d3dfed] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c2c46]/90 via-[#1c2c46]/35 to-transparent flex flex-col justify-end p-3 lg:p-4" />
                    <span className="absolute bottom-3 left-3 right-3 text-white text-[10px] lg:text-[11.5px] font-extrabold tracking-wide leading-tight drop-shadow-sm">
                      {product.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 4: PRODUITS II (Cajou & Fruits tropicaux) */}
        <section id="commodities-products-2" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          {/* Fullscreen background image with light overlay to create an immersive, premium feel */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2070" 
              alt="Agricultural background" 
              className="w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            {/* Left Content column - Expanded to lg:col-span-6 */}
            <div className="lg:col-span-6 flex flex-col justify-center h-full relative z-10">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">
                {t.commodities.southSouthTag}
              </span>
              <h2 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                {t.commodities.tropTitle} <br />
                <span className="italic text-[#1d9878]">{t.commodities.tropSubtitle}</span>
              </h2>
              <p className="ae ae-left text-[12.5px] text-[#2d3e56] font-medium leading-relaxed mb-6" data-d="2">
                {t.commodities.tropDesc}
              </p>
              
              {/* Action Contact Button */}
              <button 
                onClick={() => onGoToSection?.(8)}
                className="ae ae-up inline-flex items-center bg-[#1d9878] text-white px-8 py-3.5 text-[10px] font-bold tracking-[2px] uppercase transition-all self-start cursor-pointer hover:bg-[#157159] relative z-10" 
                style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }} 
                data-d="3.5"
              >
                {activeLang === 'ar' ? 'اطلب الآن' : activeLang === 'en' ? 'Inquire Now' : 'S’approvisionner'}
              </button>
            </div>

            {/* Right side: Elegant 2x2 static image gallery of the 4 products with names overlayed */}
            <div className="lg:col-span-6 flex flex-col justify-center relative w-full ae ae-pop" data-d="4">
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                {[productsAfrica[0], productsAfrica[1], productsAfrica[2], productsAfrica[4]].map((product, pIdx) => (
                  <div 
                    key={pIdx} 
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-md border border-[#d3dfed] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    {/* High-contrast gradient overlay for absolute legibility of the product's name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c2c46]/90 via-[#1c2c46]/35 to-transparent flex flex-col justify-end p-3 lg:p-4" />
                    <span className="absolute bottom-3 left-3 right-3 text-white text-[10px] lg:text-[11.5px] font-extrabold tracking-wide leading-tight drop-shadow-sm">
                      {product.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 5: LOGISTIQUE ET FLUX (Carte Interactive en mode clair) */}
        <section id="commodities-markets" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
             <img 
               src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070" 
               className="w-full h-full object-cover opacity-25 brightness-110 contrast-100" 
               alt="Global Map BG" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-[#ebf1f8]/45 backdrop-blur-[6px]" />
          </div>

          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center justify-center w-full max-w-none lg:max-w-[95%] mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="ae ae-left text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-5 inline-block self-start" data-d="1">{t.commodities.importExportTag}</span>
              <h2 className="ae ae-left text-3xl lg:text-4.5xl font-black tracking-tight leading-none text-[#1c2c46] mb-5" data-d="1.5">
                {t.commodities.servicesTitle} <br />
                <span className="italic text-[#1d9878]">{t.commodities.marketsSubtitle}</span>
              </h2>
              <p className="ae ae-left text-[13.5px] text-[#2d3e56] font-medium leading-relaxed mb-6" data-d="2">
                {t.commodities.marketsDesc}
              </p>
            </div>

            {/* World Map SVG stylized cleanly for light bg - Significantly enlarged to match Point 6 */}
            <div className="lg:col-span-8 p-0 m-0 flex flex-col items-center justify-center relative min-h-[400px] lg:min-h-[600px] w-full ae ae-pop" data-d="3">
              <div className="absolute inset-0 bg-[#1d9878]/3 rounded-2xl blur-[40px] pointer-events-none" />
               
              <svg viewBox="0 0 1000 600" className="w-full h-auto max-w-[1153px] relative z-10 opacity-95 transition-all duration-300 scale-110 sm:scale-115 md:scale-120 lg:scale-130 xl:scale-135 origin-center m-0 p-0">
                <defs>
                  <pattern id="dotGridLight" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="rgba(28, 44, 70, 0.05)" />
                  </pattern>
                </defs>
                <rect width="1000" height="600" fill="url(#dotGridLight)" rx="24" stroke="rgba(28,44,70,0.06)" className="shadow-md" />

                {/* SENEGAL LANE */}
                <motion.path 
                  d="M 450 330 Q 250 450, 100 520" 
                  fill="none" 
                  stroke="#1d9878" 
                  strokeWidth="5" 
                  strokeDasharray="6,6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                {/* ESPAGNE LANE */}
                <motion.path 
                  d="M 450 330 Q 310 240, 230 180" 
                  fill="none" 
                  stroke="#1d9878" 
                  strokeWidth="5" 
                  strokeDasharray="6,6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* FRANCE LANE */}
                <motion.path 
                  d="M 450 330 Q 510 180, 520 80" 
                  fill="none" 
                  stroke="#1d9878" 
                  strokeWidth="5" 
                  strokeDasharray="6,6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />

                {/* RUSSIA LANE */}
                <motion.path 
                  d="M 450 330 Q 700 160, 900 80" 
                  fill="none" 
                  stroke="#1d9878" 
                  strokeWidth="5" 
                  strokeDasharray="7,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Connection paths pulsing lines */}
                <path d="M 450 330 Q 250 450, 100 520" fill="none" stroke="rgba(29,152,120,0.22)" strokeWidth="11" />
                <path d="M 450 330 Q 310 240, 230 180" fill="none" stroke="rgba(29,152,120,0.22)" strokeWidth="11" />
                <path d="M 450 330 Q 510 180, 520 80" fill="none" stroke="rgba(29,152,120,0.22)" strokeWidth="11" />
                <path d="M 450 330 Q 700 160, 900 80" fill="none" stroke="rgba(29,152,120,0.22)" strokeWidth="11" />

                {/* Pulsing Dot over Senegal */}
                <circle cx="100" cy="520" r="30" fill="rgba(29, 152, 120, 0.22)">
                  <animate attributeName="r" values="18;38;18" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="520" r="11" fill="#1d9878" />
                <text x="125" y="528" fill="#1c2c46" fontSize="24" fontWeight="black" stroke="#ebf1f8" strokeWidth="5.5" paintOrder="stroke fill">SÉNÉGAL</text>

                {/* Pulsing Dot over Morocco */}
                <circle cx="450" cy="330" r="42" fill="rgba(29, 152, 120, 0.35)">
                  <animate attributeName="r" values="24;50;24" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="450" cy="330" r="16" fill="#1d9878" />
                <text x="480" y="340" fill="#1d9878" fontSize="32" fontWeight="black" stroke="#ebf1f8" strokeWidth="7" paintOrder="stroke fill">MAROC (SALI)</text>

                {/* Pulsing Dot over Spain */}
                <circle cx="230" cy="180" r="24" fill="rgba(28, 44, 70, 0.15)">
                  <animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="230" cy="180" r="9" fill="#1c2c46" />
                <text x="255" y="188" fill="#1c2c46" fontSize="24" fontWeight="black" stroke="#ebf1f8" strokeWidth="5.5" paintOrder="stroke fill">ESPAGNE</text>

                {/* Pulsing Dot over France */}
                <circle cx="520" cy="80" r="24" fill="rgba(28, 44, 70, 0.15)">
                  <animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="520" cy="80" r="9" fill="#1c2c46" />
                <text x="545" y="88" fill="#1c2c46" fontSize="24" fontWeight="black" stroke="#ebf1f8" strokeWidth="5.5" paintOrder="stroke fill">FRANCE</text>

                {/* Pulsing Dot over Russia */}
                <circle cx="900" cy="80" r="24" fill="rgba(28, 44, 70, 0.15)">
                  <animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="900" cy="80" r="9" fill="#1c2c46" />
                <text x="750" y="88" fill="#1c2c46" fontSize="24" fontWeight="black" stroke="#ebf1f8" strokeWidth="5.5" paintOrder="stroke fill">RUSSIE</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

        {/* PARALLAX SCREEN 6: CONTACT (Perfect design consistency as requested in Point 6) */}
        <section id="commodities-contact" className="relative h-[100dvh] bg-[#ebf1f8] overflow-hidden text-[#1c2c46]">
          <div className="absolute inset-0 z-0 h-full w-full">
             <img 
               src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070" 
               className="w-full h-full object-cover opacity-55 brightness-110 contrast-100" 
               alt="Contact BG" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>
          
          <div className={`relative z-10 w-full h-full overflow-y-auto pt-24 pb-20 lg:py-12 px-[5vw] ${sectionPadds}`}>
            <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-7xl mx-auto min-h-full lg:h-full px-4 pt-12 lg:pt-0">
            <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 min-h-full w-full border border-[#d3dfed] rounded-3xl overflow-hidden shadow-2xl bg-white">
              {/* Left side: dark corporate info side */}
              <div className="flex flex-col justify-center p-8 lg:p-12 bg-[#1c2c46] border-b lg:border-b-0 lg:border-r border-[#d3dfed] w-full">
                <h2 className="ae ae-left text-[clamp(28px,2.5vw,42px)] font-black tracking-[-1.5px] leading-[1.1] mb-5 text-white" data-d="1">
                  {activeLang === 'ar' ? 'انضم إلى شبكتنا' : activeLang === 'en' ? 'Join Our Network' : 'Rejoignez notre réseau'}
                </h2>
                <div className="ae ae-pop flex items-center gap-4 mb-5" data-d="1.5">
                   <div className="w-10 h-[2px] bg-[#1d9878]" />
                   <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878]">SALI Commodities</span>
                </div>
                <p className="ae ae-left text-[11px] lg:text-[13px] text-white/70 leading-relaxed font-semibold mb-6 max-w-sm" data-d="1.8">
                  {t.contact.formTitleCommodities}
                </p>
                <div className="space-y-5 lg:space-y-8 mt-2">
                  <div className="ae ae-up flex items-center gap-4" data-d="2">
                    <div className="w-9 h-9 lg:w-12 lg:h-12 bg-[#1d9878]/15 border border-[#1d9878]/25 rounded-xl flex items-center justify-center text-[#1d9878]">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-0.5">{t.contact.phoneLabel}</span>
                      <a href="tel:+212661373937" className="text-xs lg:text-base font-semibold text-white hover:text-[#1d9878] transition-colors">+212 6 61 37 39 37</a>
                    </div>
                  </div>
                  <div className="ae ae-up flex items-center gap-4" data-d="2.5">
                    <div className="w-9 h-9 lg:w-12 lg:h-12 bg-[#1d9878]/15 border border-[#1d9878]/25 rounded-xl flex items-center justify-center text-[#1d9878]">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold tracking-[2px] uppercase text-white/30 mb-0.5">{t.contact.emailLabel}</span>
                      <a href="mailto:hd@sali-capital.com" className="text-xs lg:text-base font-semibold text-white hover:text-[#1d9878] transition-colors">hd@sali-capital.com</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: standard white contact form input */}
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
                        <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.roleLabel}</label>
                        <select 
                          value={formData.role}
                          onChange={e => setFormData({...formData, role: e.target.value})}
                          className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]"
                        >
                          <option value="Distributeur">{t.contact.roles.distributor}</option>
                          <option value="Intermédiaire">{t.contact.roles.broker}</option>
                          <option value="Producteur">{t.contact.roles.producer}</option>
                          <option value="Autre">{t.contact.roles.other}</option>
                        </select>
                      </div>

                      <div className="ae ae-up flex flex-col gap-1.5" data-d="5.5">
                        <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.messageLabel}</label>
                        <textarea 
                          required
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3.5 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all resize-none rounded-lg text-[#1c2c46]" 
                          placeholder={t.contact.placeholderMessageCommodities}
                          rows={3} 
                        />
                      </div>

                      <button 
                        type="submit"
                        className="ae ae-up bg-[#1c2c46] hover:bg-[#1d9878] hover:border-[#1d9878] text-white px-10 py-4 text-[10px] font-bold tracking-[2px] uppercase border-2 border-[#1c2c46] transition-all mt-4 self-start cursor-pointer inline-flex items-center gap-2"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                        data-d="6"
                      >
                        {t.contact.btnSendCommodities} <Send size={14} strokeWidth={3} />
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
                        {t.contact.successDescCommodities.split('hd@sali-capital.com').map((part, index) => (
                          <React.Fragment key={index}>
                            {part}
                            {index === 0 && <strong className="text-[#1c2c46]">hd@sali-capital.com</strong>}
                          </React.Fragment>
                        ))}
                      </p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
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
      </div>
    </div>
  );
}
