import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  Send,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info,
  Phone,
  Mail
} from 'lucide-react';
import { translations, Language } from '../translations';
import Logo from './Logo';

interface FonciereDassouliProps {
  onBack: () => void;
  currentSection: number;
  onGoToSection?: (index: number) => void;
  lang?: Language;
}

export default function FonciereDassouli({ onBack, currentSection, onGoToSection, lang }: FonciereDassouliProps) {
  const activeLang = lang || 'fr';
  const t = translations[activeLang];
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    concept: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // 4 high-quality commercial / retail real estate photos
  const photos = [
    {
      url: 'https://i.pinimg.com/1200x/c1/79/b9/c179b9cb090ade8ee516d2ed03ef8f51.jpg',
      title: t.dassouli.photos.p1.title,
      desc: t.dassouli.photos.p1.desc
    },
    {
      url: 'https://i.pinimg.com/1200x/d2/5a/ed/d25aed5c37b33f0f8f31326fad63a023.jpg',
      title: t.dassouli.photos.p2.title,
      desc: t.dassouli.photos.p2.desc
    },
    {
      url: 'https://i.pinimg.com/1200x/86/d5/2d/86d52d557de66102c4cdc8a827e024b4.jpg',
      title: t.dassouli.photos.p3.title,
      desc: t.dassouli.photos.p3.desc
    },
    {
      url: 'https://i.pinimg.com/1200x/f8/03/f3/f803f3cfa3469a5db4038408a301ddec.jpg',
      title: t.dassouli.photos.p4.title,
      desc: t.dassouli.photos.p4.desc
    }
  ];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const subject = encodeURIComponent(`Contact Foncière Dassouli - Location Local B-Time`);
    const body = encodeURIComponent(
      `Nom Complet: ${formData.name}\n` +
      `Téléphone: ${formData.phone}\n` +
      `E-mail: ${formData.email}\n` +
      `Concept/Activité: ${formData.concept}\n\n` +
      `Message:\n${formData.message}`
    );
    window.location.href = `mailto:hd@sali-capital.com?subject=${subject}&body=${body}`;
  };

  // Guard animation trigger specifically for Dassouli sections to ensure they are visible on entry
  React.useEffect(() => {
    const dassouliSecs = ['dassouli-accueil', 'dassouli-biens', 'dassouli-contact'];
    
    // Clear other dassouli sections to make animations loopable/replayable
    const activeId = dassouliSecs[currentSection];
    dassouliSecs.forEach((secId) => {
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
    <div className={`absolute inset-0 bg-[#ebf1f8] text-[#1c2c46] overflow-hidden w-full h-full ${activeLang === 'ar' ? 'font-arabic' : ''}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#1c2c46]/95 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 w-full max-w-4xl relative">
              <button onClick={() => setShowGalleryModal(false)} className="absolute top-4 right-4 text-[#1c2c46] hover:text-[#1d9878]">Close</button>
              <h2 className="text-2xl font-black mb-2">{t.dassouli.galleryTitle} {t.dassouli.gallerySubtitle}</h2>
              <p className="text-sm text-[#5a6a7a] mb-6">{t.dassouli.galleryDesc}</p>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((p, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden">
                    <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Transition Wrapper */}
      <div 
        className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
        style={{ transform: `translateY(-${currentSection * 100}%)` }}
      >
        {/* PARALLAX SCREEN 0: ACCUEIL / LANDING FONCIÈRE DASSOULI */}
        <section id="dassouli-accueil" className={`relative h-[100dvh] flex items-center justify-center px-[5vw] overflow-y-auto bg-[#ebf1f8] pt-20 lg:pt-24 pb-12 lg:pb-16 text-[#1c2c46] ${activeLang === 'ar' ? 'lg:pr-[25%]' : 'lg:pl-[25%]'}`}>
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img 
                key={bgIndex}
                src={photos[bgIndex].url} 
                alt="Modern commercial property background" 
                className="absolute inset-0 w-full h-full object-cover select-none opacity-55 brightness-110 contrast-100" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px] z-10" />
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
            <div className="ae ae-pop mb-8" data-d="1">
              <Logo variant="dassouli" type="icon" className="w-48 h-48 md:w-56 md:h-56 text-[#1c2c46]" />
            </div>
            
            <p className="ae ae-up text-lg md:text-xl lg:text-2xl text-[#1c2c46] font-black tracking-wide leading-relaxed max-w-2xl mb-8" data-d="2" style={{ textShadow: '0 2px 4px rgba(235, 241, 248, 0.5)' }}>
              {activeLang === 'ar' 
                ? "شركة عقارية متخصصة في الاستثمارات العقارية وتأجير المحلات التجارية."
                : activeLang === 'en'
                  ? "Real estate company specialized in rental investment for commercial premises."
                  : "Société immobilière, spécialisée dans l’investissement locatif en locaux commerciaux."}
            </p>

            <button 
              onClick={() => onGoToSection && onGoToSection(1)}
              className="ae ae-up bg-[#1d9878] hover:bg-[#157159] text-white px-10 py-4 text-[11px] lg:text-[12px] font-black tracking-[2.5px] uppercase transition-all cursor-pointer shadow-lg shadow-[#1d9878]/20"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              data-d="3"
            >
              {activeLang === 'ar' ? 'اكتشف عقاراتنا المتاحة' : activeLang === 'en' ? 'Discover our available premises' : 'Découvrir nos biens'}
            </button>
          </div>
        </section>

        {/* PARALLAX SCREEN 1: PRÉSENTATION DES LOCAUX DISPONIBLES */}
        <section id="dassouli-biens" className={`relative h-[100dvh] flex items-start lg:items-center px-[5vw] overflow-y-auto bg-[#ebf1f8] pt-20 lg:pt-24 pb-12 lg:pb-16 text-[#1c2c46] ${activeLang === 'ar' ? 'lg:pr-[25%]' : 'lg:pl-[25%]'}`}>
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img 
                key={bgIndex}
                src={photos[bgIndex].url} 
                alt="Modern commercial property background" 
                className="absolute inset-0 w-full h-full object-cover select-none opacity-45 brightness-110 contrast-100" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-[#ebf1f8]/70 backdrop-blur-[6px] z-10" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto min-h-full lg:h-full py-4">
            {/* Left column - Title, Badge and CTA contact button */}
            <div className="lg:col-span-5 flex flex-col justify-center lg:h-full text-left p-4 lg:p-6">
              <div>
                <span className="ae ae-left text-[9px] font-bold tracking-[3.5px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-4 py-1.5 rounded-full mb-6 inline-block" data-d="1">
                  {t.dassouli.tag}
                </span>
                <h1 className="ae ae-left text-2xl md:text-3.5xl lg:text-4.5xl font-black text-[#1c2c46] tracking-tight mt-1 mb-4 leading-tight" data-d="1.5">
                  {t.dassouli.title} <span className="italic text-[#1d9878]">{t.dassouli.titleSpan}</span>
                </h1>
                <p className="ae ae-left text-[12.5px] lg:text-[13.5px] font-medium text-[#1c2c46]/75 mb-6 leading-relaxed" data-d="1.8">
                  {activeLang === 'ar'
                    ? "تصفح الصور الحقيقية للمجمع واكتشف مجسمات تهيئة وتصميم المحل بناءً على أبعاده الحقيقية."
                    : activeLang === 'en'
                      ? "Browse through real-life views of the complex and discover 3D spatial layout designs of the commercial unit based on its actual dimensions."
                      : "Naviguez parmi les prises de vue réelles du complexe et découvrez les modélisations d’aménagements du local sur la base des dimensions réelles de celui-ci."}
                </p>
              </div>

              <div className="ae ae-up flex flex-col sm:flex-row sm:items-center gap-5 mt-6 border-t border-[#d3dfed]/60 pt-6" data-d="2">
                <div className="text-left">
                  <p className="text-[#1c2c46]/85 font-black text-[14px] lg:text-[15px] leading-relaxed">
                    {activeLang === 'ar' 
                      ? "لمزيد من المعلومات حول المحل التجاري" 
                      : activeLang === 'en' 
                        ? "For more information on this commercial unit" 
                        : "Pour plus d’informations sur le local"}
                  </p>
                </div>
                <button 
                  onClick={() => onGoToSection && onGoToSection(2)}
                  className="bg-[#1d9878] hover:bg-[#157159] text-white px-8 py-3.5 text-[10.5px] font-black tracking-[2.5px] uppercase transition-all duration-300 cursor-pointer shadow-lg shadow-[#1d9878]/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 self-start"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                >
                  {activeLang === 'ar'
                    ? "تواصل معنا"
                    : activeLang === 'en'
                      ? "CONTACT US"
                      : "CONTACTEZ-NOUS"}
                </button>
              </div>
            </div>

            {/* Right column - Main Slideshow and Thumbnails Grid */}
            <div className="lg:col-span-7 flex flex-col justify-center p-4 lg:p-6 w-full">
              {/* Slideshow element */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-[#ebf1f8] border border-[#d3dfed]/45">
                <img 
                  src={photos[activeImage].url} 
                  alt={photos[activeImage].title} 
                  className="w-full h-full object-cover select-none transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Arrow Navigation */}
                <button 
                  onClick={handlePrevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1d9878]/90 hover:bg-[#1d9878]/100 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 z-20"
                >
                  <ChevronLeft size={20} className="stroke-[3px]" />
                </button>
                <button 
                  onClick={handleNextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1d9878]/90 hover:bg-[#1d9878]/100 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 z-20"
                >
                  <ChevronRight size={20} className="stroke-[3px]" />
                </button>

                {/* Counter */}
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full shadow-md text-[11px] font-extrabold text-[#1c2c46] tracking-wider z-20">
                  {activeImage + 1} / {photos.length}
                </div>

                {/* Text overlay bottom info block */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-12 pb-5 px-6 flex flex-col justify-end text-start select-none z-10">
                  <p className="text-white text-[12.5px] lg:text-[13.5px] font-medium leading-relaxed">
                    {photos[activeImage].desc}
                  </p>
                </div>
              </div>

              {/* Thumbnails row below */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                      activeImage === i 
                        ? 'border-[#1d9878] scale-[1.03] shadow-md shadow-[#1d9878]/10' 
                        : 'border-transparent opacity-75 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    <img src={p.url} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {activeImage === i && (
                      <div className="absolute inset-0 bg-[#1c2c46]/35 flex items-center justify-center text-white">
                        <Eye size={16} strokeWidth={3} className="animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX SCREEN 3: CONTACT (Design exactly identical to home contact as requested in Point 6) */}
        <section id="dassouli-contact" className={`relative h-[100dvh] flex items-start lg:items-center overflow-y-auto bg-[#ebf1f8] outline-none pt-20 lg:pt-24 pb-12 lg:pb-16 text-[#1c2c46] ${activeLang === 'ar' ? 'lg:pr-[25%]' : 'lg:pl-[25%]'}`}>
          <div className="absolute inset-0 z-0">
             <img 
               src="https://i.pinimg.com/1200x/d2/5a/ed/d25aed5c37b33f0f8f31326fad63a023.jpg" 
               className="w-full h-full object-cover opacity-55 brightness-110 contrast-100" 
               alt="Contact" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-[#ebf1f8]/60 backdrop-blur-[6px]" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 min-h-full w-full border border-[#d3dfed] rounded-3xl overflow-hidden shadow-2xl bg-white">
            {/* Left Column - dark split matching home page */}
            <div className="flex flex-col justify-center p-8 lg:p-12 bg-[#1c2c46] border-b lg:border-b-0 lg:border-r border-[#d3dfed] w-full">
              <h2 className="ae ae-left text-[clamp(24px,3vw,42px)] font-black tracking-[-1.5px] leading-[1.1] mb-6 text-white" data-d="1">
                {activeLang === 'ar' ? 'تواصل معنا' : activeLang === 'en' ? 'Contact Us' : 'Contactez-nous'}
              </h2>
              <div className="ae ae-pop flex items-center gap-4 mb-6" data-d="1.5">
                 <div className="w-10 h-[2px] bg-[#1d9878]" />
                 <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[#1d9878]">Foncière Dassouli</span>
              </div>
              <p className="ae ae-left text-[11px] lg:text-[13px] text-white/70 leading-relaxed font-semibold mb-6 max-w-sm" data-d="1.8">
                {t.contact.formTitleDassouli}
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

            {/* Right Column - white form exactly in corporate blue values */}
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
                        <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.conceptLabel}</label>
                        <input 
                          required
                          value={formData.concept}
                          onChange={e => setFormData({...formData, concept: e.target.value})}
                          className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all rounded-lg text-[#1c2c46]" 
                          placeholder={t.contact.placeholderConcept}
                        />
                      </div>
                    </div>

                    <div className="ae ae-up flex flex-col gap-1.5" data-d="5">
                      <label className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#1c2c46]/80">{t.contact.messageLabel}</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-[#ebf1f8] border border-[#d3dfed] px-4 py-3.5 text-[12px] lg:text-[12.5px] outline-none focus:bg-white focus:border-[#1d9878] transition-all resize-none rounded-lg text-[#1c2c46]" 
                        placeholder={t.contact.placeholderMessageDassouli}
                        rows={3} 
                      />
                    </div>

                    <button 
                      type="submit"
                      className="ae ae-up bg-[#1c2c46] hover:bg-[#1d9878] hover:border-[#1d9878] text-white px-10 py-4 text-[10px] font-bold tracking-[2px] uppercase border-2 border-[#1c2c46] transition-all mt-4 self-start cursor-pointer inline-flex items-center gap-2"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                      data-d="5.5"
                    >
                      {t.contact.btnSendDassouli} <Send size={14} strokeWidth={3} />
                    </button>
                  </form>
                ) : (
                  <motion.div 
                    key="success"
                    className="flex flex-col items-center justify-center text-center py-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-16 h-16 bg-[#1d9878]/10 border border-[#1d9878]/25 rounded-full flex items-center justify-center text-[#1d9878] mb-6 animate-pulse">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-[#1c2c46] mb-2.5">{t.contact.successTitleDassouli}</h4>
                    <p className="text-xs text-[#5a6a7a] max-w-sm leading-relaxed mb-8">
                      {t.contact.successDescDassouli.split('hd@sali-capital.com').map((part, index) => (
                        <React.Fragment key={index}>
                          {part}
                          {index === 0 && <strong className="text-[#1c2c46]">hd@sali-capital.com</strong>}
                        </React.Fragment>
                      ))}
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-bold uppercase tracking-[2px] text-[#1d9878] border border-[#1d9878]/30 px-6 py-2.5 rounded-full hover:bg-[#1d9878]/5 transition-all cursor-pointer"
                    >
                      {t.contact.btnWriteAnotherDassouli}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
