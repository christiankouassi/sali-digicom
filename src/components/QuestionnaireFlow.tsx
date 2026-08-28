import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Check, AlertCircle, Send, CheckCircle } from 'lucide-react';

interface QuestionnaireFlowProps {
  type: 'website' | 'community';
  initialContactInfo?: {
    name: string;
    email: string;
    phone: string;
    company: string;
  } | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function QuestionnaireFlow({ type, initialContactInfo, onClose, onSuccess }: QuestionnaireFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset form state on open
  useEffect(() => {
    setCurrentStep(0);
    setFormData({
      clientName: initialContactInfo?.name || '',
      clientEmail: initialContactInfo?.email || '',
      clientPhone: initialContactInfo?.phone || '',
      companyInfo: initialContactInfo?.company || '',
      comments: initialContactInfo?.message || '',
      whatsapp: true
    });
    setSubmitStatus('idle');
    setIsSubmitting(false);
    setValidationError(null);
  }, [type]);

  // Scroll to top on step changes
  useEffect(() => {
    const container = document.querySelector('.fixed.inset-0.overflow-y-auto');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentStep]);

  const isWebsite = type === 'website';

  // Config steps
  const steps = isWebsite 
    ? [
        { id: 'project', title: 'Votre Entreprise' },
        { id: 'structure', title: 'Structure & Contenu' },
        { id: 'design', title: 'Design & Style' },
        { id: 'hosting', title: 'Hébergement' },
        { id: 'validation', title: 'Validation & Contact' }
      ]
    : [
        { id: 'brand', title: 'Votre Marque' },
        { id: 'objectives', title: 'Objectifs & Cible' },
        { id: 'social', title: 'Réseaux & Contenus' },
        { id: 'editorial', title: 'Ligne Éditoriale' },
        { id: 'validation', title: 'Validation & Contact' }
      ];

  // Questions definitions
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setValidationError(null);
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentValues = formData[field] || [];
    let newValues = [...currentValues];
    if (checked) {
      if (!newValues.includes(value)) newValues.push(value);
    } else {
      newValues = newValues.filter((val: string) => val !== value);
    }
    handleInputChange(field, newValues);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setValidationError("Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev: any) => ({
        ...prev,
        graphicCharterFile: file.name,
        graphicCharterFileData: reader.result,
      }));
      setValidationError(null);
    };
    reader.onerror = () => {
      setValidationError("Erreur lors de la lecture du fichier.");
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedFile = () => {
    setFormData((prev: any) => ({
      ...prev,
      graphicCharterFile: undefined,
      graphicCharterFileData: undefined
    }));
  };

  // Helper validation before next step
  const validateStep = (): boolean => {
    setValidationError(null);
    if (isWebsite) {
      if (currentStep === 0) {
        if (!formData.companyInfo?.trim()) {
          setValidationError("Veuillez renseigner les informations sur votre entreprise.");
          return false;
        }
        if (!formData.siteType?.trim()) {
          setValidationError("Veuillez choisir un type de site web.");
          return false;
        }
        if (!formData.companyDesc?.trim()) {
          setValidationError("Veuillez fournir une description de votre activité.");
          return false;
        }
        if (formData.hasSite === undefined) {
          setValidationError("Veuillez indiquer si vous possédez déjà un site web.");
          return false;
        }
      }
      if (currentStep === 2) {
        if (!formData.designQuote?.trim()) {
          setValidationError("Veuillez indiquer si vous disposez d'une charte graphique ou si vous souhaitez un devis.");
          return false;
        }
        if (formData.designQuote === 'oui' && !formData.graphicCharterFile) {
          setValidationError("Veuillez charger votre logo et/ou charte graphique.");
          return false;
        }
        if (!formData.likedSites?.trim()) {
          setValidationError("Veuillez renseigner des références de sites inspirants.");
          return false;
        }
      }
      if (currentStep === 3) {
        if (!formData.hostingMaintenance?.trim()) {
          setValidationError("Veuillez choisir une option pour la gestion technique.");
          return false;
        }
      }
      if (currentStep === 4) {
        if (!formData.clientName?.trim()) {
          setValidationError("Veuillez renseigner votre nom complet.");
          return false;
        }
        if (!formData.clientEmail?.trim() || !/\S+@\S+\.\S+/.test(formData.clientEmail)) {
          setValidationError("Veuillez renseigner une adresse e-mail valide.");
          return false;
        }
        if (!formData.clientPhone?.trim()) {
          setValidationError("Veuillez renseigner votre numéro de téléphone.");
          return false;
        }
        if (formData.whatsapp === undefined) {
          setValidationError("Veuillez indiquer si vous êtes joignable sur WhatsApp.");
          return false;
        }
      }
    } else {
      // Community Management validations
      if (currentStep === 0) {
        if (!formData.companyInfo?.trim()) {
          setValidationError("Veuillez renseigner les informations sur votre marque.");
          return false;
        }
        if (!formData.values?.trim()) {
          setValidationError("Veuillez renseigner vos valeurs ou éléments différenciants.");
          return false;
        }
      }
      if (currentStep === 1) {
        if (!formData.idealResult?.trim()) {
          setValidationError("Veuillez décrire le résultat idéal de notre accompagnement.");
          return false;
        }
        if (!formData.targetAudience?.trim()) {
          setValidationError("Veuillez décrire votre client idéal.");
          return false;
        }
      }
      if (currentStep === 3) {
        if (!formData.visualIdentity?.trim()) {
          setValidationError("Veuillez renseigner les informations sur votre identité visuelle.");
          return false;
        }
        if (formData.visualIdentity === 'oui' && !formData.graphicCharterFile) {
          setValidationError("Veuillez charger votre logo et/ou charte graphique.");
          return false;
        }
      }
      if (currentStep === 4) {
        if (formData.useAds === undefined) {
          setValidationError("Veuillez indiquer si vous souhaitez utiliser la publicité.");
          return false;
        }
        if (formData.hasSite === undefined) {
          setValidationError("Veuillez indiquer si vous possédez déjà un site web.");
          return false;
        }
        if (!formData.clientName?.trim()) {
          setValidationError("Veuillez renseigner votre nom complet.");
          return false;
        }
        if (!formData.clientEmail?.trim() || !/\S+@\S+\.\S+/.test(formData.clientEmail)) {
          setValidationError("Veuillez renseigner une adresse e-mail valide.");
          return false;
        }
        if (!formData.clientPhone?.trim()) {
          setValidationError("Veuillez renseigner votre numéro de téléphone.");
          return false;
        }
        if (formData.whatsapp === undefined) {
          setValidationError("Veuillez indiquer si vous êtes joignable sur WhatsApp.");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Build payload structure
    const clientInfo = {
      name: formData.clientName,
      email: formData.clientEmail,
      phone: formData.clientPhone,
      company: initialContactInfo?.company || formData.companyInfo || '',
      whatsapp: formData.whatsapp ? 'Oui' : 'Non'
    };

    let responses: Array<{ category: string; question: string; answer: any }> = [];

    if (isWebsite) {
      responses = [
        { category: '01 VOTRE ENTREPRISE & VOTRE PROJET', question: 'Nom de l\'entreprise, activité, ville et pays d\'exercice ?', answer: formData.companyInfo },
        { category: '01 VOTRE ENTREPRISE & VOTRE PROJET', question: 'Quel est l\'objectif principal du site ?', answer: [...(formData.objectives || []), formData.objectivesOther ? `Autre: ${formData.objectivesOther}` : ''].filter(Boolean) },
        { category: '01 VOTRE ENTREPRISE & VOTRE PROJET', question: 'Le site sera-t-il vitrine ou e-commerce ?', answer: formData.siteType },
        { category: '01 VOTRE ENTREPRISE & VOTRE PROJET', question: 'Pouvez-vous nous fournir une description de l\'activité de votre société ?', answer: formData.companyDesc },
        { category: '01 VOTRE ENTREPRISE & VOTRE PROJET', question: 'Avez-vous déjà un site web ?', answer: formData.hasSite ? `Oui - À conserver/améliorer: ${formData.siteFeedback || 'Non spécifié'}` : 'Non' },
        
        { category: '02 STRUCTURE & CONTENU', question: 'Quelles pages souhaitez-vous ?', answer: [...(formData.pages || []), formData.pagesOther ? `Autre: ${formData.pagesOther}` : ''].filter(Boolean) },
        { category: '02 STRUCTURE & CONTENU', question: 'Souhaitez-vous que nous fournissions le contenu pour vous ?', answer: formData.contentProvider },
        { category: '02 STRUCTURE & CONTENU', question: 'Quelles fonctionnalités sont nécessaires ?', answer: [...(formData.features || []), formData.featuresOther ? `Autre: ${formData.featuresOther}` : ''].filter(Boolean) },
        { category: '02 STRUCTURE & CONTENU', question: 'Dans quelle(s) langue(s) le site doit-il être disponible ?', answer: formData.languages },

        { category: '03 DESIGN & EXPÉRIENCE', question: 'Souhaitez-vous un devis pour logo / charte graphique ?', answer: formData.designQuote },
        { category: '03 DESIGN & EXPÉRIENCE', question: 'Quels sites appréciez-vous ? (Références + détails)', answer: formData.likedSites },
        { category: '03 DESIGN & EXPÉRIENCE', question: 'Quel style recherchez-vous ?', answer: [...(formData.style || []), formData.styleOther ? `Autre: ${formData.styleOther}` : ''].filter(Boolean) },
        { category: '03 DESIGN & EXPÉRIENCE', question: 'Souhaitez-vous des animations, ou une expérience plus statique ?', answer: formData.animations },
        { category: '03 DESIGN & EXPÉRIENCE', question: 'Y a-t-il des éléments visuels à éviter absolument ?', answer: formData.avoidVisuals },

        { category: '04 DOMAINE, HÉBERGEMENT & MAINTENANCE', question: 'Maintenance et hébergement', answer: formData.hostingMaintenance },
        
        { category: '05 PLANNING & VALIDATION', question: 'Échéance de mise en ligne précise ?', answer: formData.deadline },
        { category: '06 REMARQUES / AUTRES COMMENTAIRES', question: 'Remarques / Autres commentaires', answer: formData.comments }
      ];
    } else {
      responses = [
        { category: '01 VOTRE MARQUE', question: 'Nom de l\'entreprise, activité, produits / services et zone géographique ciblée ?', answer: formData.companyInfo },
        { category: '01 VOTRE MARQUE', question: 'Quelles sont vos valeurs ou vos éléments différenciants ?', answer: formData.values },
        { category: '01 VOTRE MARQUE', question: 'Quels sont les 3 mots qui doivent définir votre marque sur les réseaux sociaux ?', answer: formData.brandWordsSuggestion ? 'Suggestions demandées' : formData.brandWords },
        
        { category: '02 VOS OBJECTIFS', question: 'Vos objectifs', answer: [...(formData.objectives || []), formData.objectivesOther ? `Autre: ${formData.objectivesOther}` : ''].filter(Boolean) },
        { category: '02 VOS OBJECTIFS', question: 'Quel serait pour vous le résultat idéal de notre accompagnement dans les prochains mois ?', answer: formData.idealResult },
        
        { category: '03 VOTRE AUDIENCE', question: 'Qui est votre client idéal ?', answer: formData.targetAudience },

        { category: '04 VOS RÉSEAUX SOCIAUX', question: 'Réseaux sociaux à développer', answer: [...(formData.socialMedia || []), formData.socialMediaOther ? `Autre: ${formData.socialMediaOther}` : ''].filter(Boolean) },
        { category: '04 VOS RÉSEAUX SOCIAUX', question: 'Avez-vous déjà des comptes actifs ? (Liens, abonnés, priorités)', answer: formData.activeAccounts },
        
        { category: '05 VOTRE CONTENU', question: 'Disposez-vous déjà de contenu ou faut-il tout produire ?', answer: formData.existingContent },
        { category: '05 VOTRE CONTENU', question: 'Types de formats préférés', answer: [...(formData.formats || []), formData.formatsOther ? `Autre: ${formData.formatsOther}` : ''].filter(Boolean) },

        { category: '06 IDENTITÉ VISUELLE', question: 'Identité visuelle (devis logo/charte)', answer: formData.visualIdentity },

        { category: '07 VOTRE LIGNE ÉDITORIALE', question: 'Ligne éditoriale (style)', answer: [...(formData.editorialStyle || []), formData.editorialStyleOther ? `Autre: ${formData.editorialStyleOther}` : ''].filter(Boolean) },
        { category: '07 VOTRE LIGNE ÉDITORIALE', question: 'Sujets, mots, visuels ou pratiques à éviter absolument ?', answer: formData.avoidTopics },

        { category: '08 ORGANISATION', question: 'Fréquence, jours/heures, dates clés', answer: formData.scheduleNotes },
        { category: '08 ORGANISATION', question: 'Souhaitez-vous que nous gérions les commentaires et messages privés ?', answer: formData.manageComments ? 'Oui' : 'Non' },

        // Campaign & Site
        { category: '09 CAMPAGNES & PERFORMANCE', question: 'Souhaitez-vous utiliser la publicité (Meta / Google) ?', answer: formData.useAds ? `Oui - Budget/détails: ${formData.adsDetails || 'Non spécifié'}` : 'Non', },
        { category: '10 VOTRE SITE WEB', question: 'Disposez-vous déjà d\'un site web ?', answer: formData.hasSite ? `Oui - Lien: ${formData.siteUrl || 'Non renseigné'}` : `Non - Devis souhaité: ${formData.wantSiteQuote ? 'Oui' : 'Non'}` },
        { category: '11 AUTRES DEMANDES / COMMENTAIRES', question: 'Message initial / Remarques', answer: formData.comments || '' }
      ];
    }

    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const endpoint = isLocal ? '/api/send-email' : '/api/send-email.php';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formType: type,
          clientInfo,
          responses
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        onSuccess?.();
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="relative bg-[#1c2c46] border border-white/10 w-full rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl h-auto lg:h-[80vh]">
          {/* Header Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-30 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Left panel: Info & Progress (Desktop) */}
          <div className="md:w-2/5 bg-[#17253b] p-6 lg:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 lg:h-[80vh]">
            <div>
              <span className="text-[9px] font-bold tracking-[3px] uppercase text-[#1d9878] bg-[#1d9878]/10 border border-[#1d9878]/20 px-3.5 py-1 rounded-full mb-4 inline-block">
                SALI DIGICOM
              </span>
              <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight leading-snug">
                {isWebsite ? 'Cahier des charges' : 'Cahier des charges'}<br />
                <span className="text-[#1d9878] font-black">{isWebsite ? 'Création de Site Web' : 'Community Management'}</span>
              </h2>
              <p className="text-[11px] text-white/50 leading-relaxed mt-3 max-w-sm">
                Remplissez ce formulaire détaillé en quelques minutes pour nous aider à comprendre vos besoins, vous proposer la solution optimale et vous envoyer un devis pour sa réalisation.
              </p>
            </div>

            {/* Steps Progress List */}
            <div className="hidden md:flex flex-col gap-3 my-8">
              {steps.map((st, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                return (
                  <div key={st.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                      isActive 
                        ? 'bg-[#1d9878] border-[#1d9878] text-white shadow-md shadow-[#1d9878]/25' 
                        : isCompleted 
                          ? 'bg-[#1d9878]/20 border-[#1d9878] text-[#1d9878]' 
                          : 'border-white/10 text-white/30'
                    }`}>
                      {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                    </div>
                    <span className={`text-[11.5px] font-bold tracking-wide transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/30'}`}>
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile / Global progress indicator */}
            <div className="mt-4 md:mt-0">
              <div className="flex justify-between items-center text-[10.5px] font-bold text-white/50 mb-2">
                <span>PROGRESSION</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1d9878] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right panel: Dynamic form scrolling area */}
          <div className="flex-1 px-6 pt-6 pb-6 lg:p-10 flex flex-col overflow-hidden h-auto lg:h-[80vh]">
            
            {submitStatus === 'success' ? (
              /* Success view */
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                <div className="w-16 h-16 bg-[#1d9878]/10 border border-[#1d9878]/25 rounded-full flex items-center justify-center text-[#1d9878] mb-6 animate-bounce">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Cahier des charges transmis !</h3>
                <p className="text-[12.5px] text-white/60 leading-relaxed mb-8">
                  Votre questionnaire a été envoyé avec succès à l'équipe SALI DigiCom. Nous allons étudier vos besoins et vous recontacter avec une proposition sous 48 heures.
                </p>
                <button 
                  onClick={onClose}
                  className="bg-[#1d9878] hover:bg-[#157159] text-white font-bold uppercase tracking-[2px] text-[10px] px-8 py-3.5 rounded-full transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            ) : submitStatus === 'error' ? (
              /* Error view */
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center text-red-500 mb-6">
                  <AlertCircle size={36} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Erreur lors de l'envoi</h3>
                <p className="text-[12.5px] text-white/60 leading-relaxed mb-8">
                  Une erreur s'est produite lors de la transmission de vos réponses. Veuillez vérifier votre connexion et réessayer.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSubmitStatus('idle')}
                    className="border border-white/10 hover:bg-white/5 text-white font-bold uppercase tracking-[2px] text-[10px] px-6 py-3.5 rounded-full transition-all cursor-pointer"
                  >
                    Réessayer
                  </button>
                  <button 
                    onClick={onClose}
                    className="bg-[#1d9878] hover:bg-[#157159] text-white font-bold uppercase tracking-[2px] text-[10px] px-6 py-3.5 rounded-full transition-all cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Questionnaire active view */
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                
                {/* Steps Questions */}
                <div className="flex-1 overflow-y-auto pr-2 mb-4">
                  {validationError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11.5px] font-bold rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} />
                      {validationError}
                    </div>
                  )}

                  {/* Questionnaire site web */}
                  {isWebsite && (
                    <>
                      {/* Step 1: Projet */}
                      {currentStep === 0 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">01. Votre entreprise & Votre projet</h4>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Nom de l'entreprise, activité, ville et pays d'exercice ? * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.companyInfo || ''}
                              onChange={(e) => handleInputChange('companyInfo', e.target.value)}
                              placeholder="Ex: SALI DigiCom, Agence de Marketing Digital, Casablanca, Maroc..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[70px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quel est l'objectif principal du site ? (Facultatif)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {["Générer des demandes", "Vendre en ligne", "Permettre la prise de rendez-vous"].map(obj => {
                                const isChecked = (formData.objectives || []).includes(obj);
                                return (
                                  <label key={obj} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('objectives', obj, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={12} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-medium">{obj}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.objectivesOther || ''}
                              onChange={(e) => handleInputChange('objectivesOther', e.target.value)}
                              placeholder="Autre, précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quel type de site web souhaitez-vous ? * (Réponse obligatoire)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {[
                                "Site Vitrine (Présentation d'entreprise, services, etc.)",
                                "Site E-commerce (Vente en ligne, catalogue, paiement)",
                                "Landing Page / Site One-page (Conversion unique)",
                                "Application Web / Plateforme SaaS (Outil interactif)",
                                "Portail Web / Espace Membre (Zone sécurisée, profil)",
                                "Blog / Site Média (Actualités, articles, vidéos)"
                              ].map(type => {
                                const isSelected = formData.siteType === type;
                                return (
                                  <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="radio"
                                      name="siteType"
                                      checked={isSelected}
                                      onChange={() => handleInputChange('siteType', type)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                    </div>
                                    <span className="text-xs font-medium leading-tight">{type}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Pouvez-vous nous fournir une description de l'activité de votre société ? * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.companyDesc || ''}
                              onChange={(e) => handleInputChange('companyDesc', e.target.value)}
                              placeholder="Décrivez vos services, vos produits, votre cible..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[70px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Avez-vous déjà un site web ? * (Réponse obligatoire)</label>
                            <div className="flex gap-4">
                              {[
                                { val: true, label: "Oui" },
                                { val: false, label: "Non" }
                              ].map(opt => {
                                const isSelected = formData.hasSite === opt.val;
                                return (
                                  <label key={opt.label} className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="radio"
                                      name="hasSite"
                                      checked={isSelected}
                                      onChange={() => handleInputChange('hasSite', opt.val)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                    </div>
                                    <span className="text-xs font-medium">{opt.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                            {formData.hasSite === true && (
                              <textarea 
                                value={formData.siteFeedback || ''}
                                onChange={(e) => handleInputChange('siteFeedback', e.target.value)}
                                placeholder="Que souhaitez-vous conserver, améliorer ou remplacer sur votre site actuel ? (Facultatif)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y mt-2"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Structure & Contenu */}
                      {currentStep === 1 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">02. Structure & Contenu</h4>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quelles pages souhaitez-vous ? (Facultatif)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {["Accueil", "À propos", "Services", "Réalisations", "Blog", "Contact"].map(page => {
                                const isChecked = (formData.pages || []).includes(page);
                                return (
                                  <label key={page} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('pages', page, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-semibold">{page}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.pagesOther || ''}
                              onChange={(e) => handleInputChange('pagesOther', e.target.value)}
                              placeholder="Autre(s) page(s), précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Souhaitez-vous que nous fournissions le contenu pour vous ? (Facultatif)</label>
                            <div className="flex flex-col gap-2">
                              {[
                                "Non, nous allons vous fournir le contenu texte et image.",
                                "Vous fournissez uniquement le contenu texte.",
                                "Vous fournissez uniquement les images.",
                                "Vous fournissez le texte et les images."
                              ].map(option => {
                                const isSelected = formData.contentProvider === option;
                                return (
                                  <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="radio"
                                      name="contentProvider"
                                      checked={isSelected}
                                      onChange={() => handleInputChange('contentProvider', option)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                    </div>
                                    <span className="text-xs font-medium">{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quelles fonctionnalités sont nécessaires ? (Facultatif)</label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Formulaire", "Prise de rendez-vous", "Catalogue", "Paiement en ligne", "Chatbot"].map(feat => {
                                const isChecked = (formData.features || []).includes(feat);
                                return (
                                  <label key={feat} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('features', feat, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-semibold">{feat}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.featuresOther || ''}
                              onChange={(e) => handleInputChange('featuresOther', e.target.value)}
                              placeholder="Autre(s) fonctionnalité(s), précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Dans quelle(s) langue(s) le site doit-il être disponible ? (Facultatif)</label>
                            <input 
                              type="text"
                              value={formData.languages || ''}
                              onChange={(e) => handleInputChange('languages', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                      {currentStep === 2 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">03. Design & Expérience</h4>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Avez-vous un logo / charte graphique ? Souhaitez-vous un devis ? * (Réponse obligatoire)</label>
                            <div className="flex flex-col gap-2">
                              {[
                                { val: 'oui', text: "Oui, j'ai déjà un logo et/ou une charte graphique (Fichier requis)" },
                                { val: 'devis', text: "Non, je souhaite un devis (Logo & Charte graphique)" },
                                { val: 'aucun', text: "Non, je ne souhaite pas de devis" }
                              ].map(option => {
                                const isSelected = formData.designQuote === option.val;
                                return (
                                  <label key={option.val} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="radio"
                                      name="designQuote"
                                      checked={isSelected}
                                      onChange={() => handleInputChange('designQuote', option.val)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                    </div>
                                    <span className="text-xs font-medium leading-tight">{option.text}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {formData.designQuote === 'oui' && (
                              <div className="space-y-2 mt-2 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Chargez votre logo et/ou charte graphique * (Fichier requis)</label>
                                <div className="flex flex-wrap items-center gap-3">
                                  <label className="flex items-center justify-center gap-2 bg-[#1c2c46] hover:bg-[#1d9878] text-white font-bold uppercase tracking-[1.5px] text-[9.5px] px-4 py-2.5 rounded-lg cursor-pointer transition-all">
                                    <input 
                                      type="file" 
                                      onChange={handleFileChange} 
                                      className="sr-only" 
                                      accept=".pdf,.png,.jpg,.jpeg,.zip" 
                                    />
                                    Sélectionner un fichier
                                  </label>
                                  {formData.graphicCharterFile ? (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1d9878]">
                                      <span>📎 {formData.graphicCharterFile}</span>
                                      <button type="button" onClick={removeUploadedFile} className="text-red-400 hover:text-red-300 font-bold ml-1 text-xs">Supprimer</button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-white/40">Aucun fichier sélectionné</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quels sites appréciez-vous ? (2 à 3 références + ce que vous aimez) * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.likedSites || ''}
                              onChange={(e) => handleInputChange('likedSites', e.target.value)}
                              placeholder="Liens des sites inspirants et vos commentaires..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[70px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quel style recherchez-vous ? (Facultatif)</label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Sobre", "Premium", "Moderne", "Dynamique"].map(st => {
                                const isChecked = (formData.style || []).includes(st);
                                return (
                                  <label key={st} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('style', st, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-semibold">{st}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.styleOther || ''}
                              onChange={(e) => handleInputChange('styleOther', e.target.value)}
                              placeholder="Autre style, précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Souhaitez-vous des animations, ou une expérience plus statique ? (Facultatif)</label>
                            <div className="flex gap-4">
                              {["Oui, avec des animations", "Non, une expérience plus statique"].map(opt => {
                                const isSelected = formData.animations === opt;
                                return (
                                  <label key={opt} className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="radio"
                                      name="animations"
                                      checked={isSelected}
                                      onChange={() => handleInputChange('animations', opt)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                    </div>
                                    <span className="text-xs font-medium">{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Y a-t-il des éléments visuels à éviter absolument ? (Facultatif)</label>
                            <textarea 
                              value={formData.avoidVisuals || ''}
                              onChange={(e) => handleInputChange('avoidVisuals', e.target.value)}
                              placeholder="Couleurs, polices, styles ou concurrents à éviter..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y"
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 4: Hébergement & Maintenance */}
                      {currentStep === 3 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">04. Domaine, Hébergement & Maintenance</h4>
                          
                          <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quelle option choisissez-vous pour la gestion technique ? * (Réponse obligatoire)</label>
                            {[
                              { key: "SALI", text: "Je confie la maintenance à SALI DigiCom (la maintenance est offerte)" },
                              { key: "Self", text: "Je m'occupe moi-même de la maintenance, et je fournirai mon propre nom de domaine et mon hébergement, que j'achèterai de mon côté." }
                            ].map((opt) => {
                              const isSelected = formData.hostingMaintenance === opt.text;
                              return (
                                <label key={opt.key} className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                  <input 
                                    type="radio"
                                    name="hostingMaintenance"
                                    checked={isSelected}
                                    onChange={() => handleInputChange('hostingMaintenance', opt.text)}
                                    className="sr-only"
                                  />
                                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                  </div>
                                  <span className="text-xs font-semibold leading-normal">{opt.text}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Step 5: Validation & Contact */}
                      {currentStep === 4 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">05. Planning & Validation</h4>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Souhaitez-vous une mise en ligne à une échéance précise ? (Facultatif)</label>
                            <input 
                              type="text"
                              value={formData.deadline || ''}
                              onChange={(e) => handleInputChange('deadline', e.target.value)}
                              placeholder="Ex: d'ici 1 mois, avant le 31 décembre..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Nom Complet * (Réponse obligatoire)</label>
                              <input 
                                required
                                type="text"
                                value={formData.clientName || ''}
                                onChange={(e) => handleInputChange('clientName', e.target.value)}
                                placeholder="Votre nom"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Adresse E-mail * (Réponse obligatoire)</label>
                              <input 
                                required
                                type="email"
                                value={formData.clientEmail || ''}
                                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                                placeholder="Votre e-mail"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Numéro de Téléphone * (Réponse obligatoire)</label>
                              <input 
                                required
                                type="tel"
                                value={formData.clientPhone || ''}
                                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                                placeholder="Ex: +212 600-000000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Joignable sur WhatsApp * (Réponse obligatoire)</label>
                              <div className="flex gap-3">
                                {[
                                  { val: true, label: "Oui" },
                                  { val: false, label: "Non" }
                                ].map(opt => {
                                  const isSelected = formData.whatsapp === opt.val;
                                  return (
                                    <label key={opt.label} className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                      <input 
                                        type="radio"
                                        name="whatsapp"
                                        checked={isSelected}
                                        onChange={() => handleInputChange('whatsapp', opt.val)}
                                        className="sr-only"
                                      />
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#1d9878]" />}
                                      </div>
                                      <span className="text-xs font-semibold">{opt.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Remarques / Autres commentaires (Facultatif)</label>
                            <textarea 
                              value={formData.comments || ''}
                              onChange={(e) => handleInputChange('comments', e.target.value)}
                              placeholder="Ajoutez toute précision utile..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[50px] resize-y"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Questionnaire community management */}
                  {!isWebsite && (
                    <>
                      {/* Step 1: Votre Marque */}
                      {currentStep === 0 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">01. Votre Marque</h4>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Nom de la marque, activité, ville et pays d'exercice ? * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.companyInfo || ''}
                              onChange={(e) => handleInputChange('companyInfo', e.target.value)}
                              placeholder="Nom, domaine d'activité, clients cibles et zone géographique..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[70px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quelles sont vos valeurs ou vos éléments différenciants ? * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.values || ''}
                              onChange={(e) => handleInputChange('values', e.target.value)}
                              placeholder="Qu'est-ce qui vous rend unique ou caractérise vos services ?"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[70px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quels sont les 3 mots qui doivent définir votre marque sur les réseaux sociaux ? (Facultatif)</label>
                            <input 
                              type="text"
                              disabled={!!formData.brandWordsSuggestion}
                              value={formData.brandWords || ''}
                              onChange={(e) => handleInputChange('brandWords', e.target.value)}
                              placeholder="Ex: Dynamique, Professionnel, Innovant..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none disabled:opacity-30"
                            />
                            <label className={`flex items-center gap-2.5 p-2 rounded-lg border border-transparent transition-all cursor-pointer ${formData.brandWordsSuggestion ? 'text-[#1d9878]' : 'text-white/40 hover:text-white/60'}`}>
                              <input 
                                type="checkbox"
                                checked={!!formData.brandWordsSuggestion}
                                onChange={(e) => {
                                  handleInputChange('brandWordsSuggestion', e.target.checked);
                                  if (e.target.checked) handleInputChange('brandWords', '');
                                }}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${formData.brandWordsSuggestion ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                {formData.brandWordsSuggestion && <Check size={11} strokeWidth={3} className="text-white" />}
                              </div>
                              <span className="text-[11px] font-semibold">Je n'ai pas encore ces mots en tête — proposez-moi des suggestions (Facultatif)</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Objectifs & Audience */}
                      {currentStep === 1 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">02. Vos Objectifs & Votre Audience</h4>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quels sont vos objectifs principaux sur les réseaux sociaux ? (Facultatif)</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                "Développer la notoriété", 
                                "Augmenter la visibilité", 
                                "Développer la communauté", 
                                "Générer des prospects", 
                                "Augmenter les ventes", 
                                "Fidéliser les clients", 
                                "Renforcer l'image de marque"
                              ].map(obj => {
                                const isChecked = (formData.objectives || []).includes(obj);
                                return (
                                  <label key={obj} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('objectives', obj, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-semibold leading-tight">{obj}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.objectivesOther || ''}
                              onChange={(e) => handleInputChange('objectivesOther', e.target.value)}
                              placeholder="Autre objectif, précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quel serait pour vous le résultat idéal de notre accompagnement dans les prochains mois ? * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.idealResult || ''}
                              onChange={(e) => handleInputChange('idealResult', e.target.value)}
                              placeholder="Ex: atteindre 5000 abonnés qualifiés, doubler nos prises de contact mensuelles..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Pouvez-vous décrire votre client idéal (Persona / Cible) ? * (Réponse obligatoire)</label>
                            <textarea 
                              required
                              value={formData.targetAudience || ''}
                              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                              placeholder="Ex: Femmes de 25-45 ans résidant à Rabat, intéressées par le bien-être..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y"
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 3: Réseaux Sociaux & Contenu */}
                      {currentStep === 2 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">03. Réseaux Sociaux & Contenus</h4>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Sur quels réseaux sociaux souhaitez-vous vous développer ? (Facultatif)</label>
                            <div className="flex gap-3">
                              {["Instagram", "Facebook", "LinkedIn"].map(sm => {
                                const isChecked = (formData.socialMedia || []).includes(sm);
                                return (
                                  <label key={sm} className={`flex-1 flex items-center justify-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('socialMedia', sm, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-semibold">{sm}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.socialMediaOther || ''}
                              onChange={(e) => handleInputChange('socialMediaOther', e.target.value)}
                              placeholder="Autre réseau, précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Avez-vous déjà des comptes actifs ? (Liens, abonnés, priorités...) (Facultatif)</label>
                            <textarea 
                              value={formData.activeAccounts || ''}
                              onChange={(e) => handleInputChange('activeAccounts', e.target.value)}
                              placeholder="Indiquez les liens de vos pages actuelles si existantes..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Disposez-vous déjà de contenu (photos, vidéos, témoignages) ou faut-il tout produire ? (Facultatif)</label>
                            <textarea 
                              value={formData.existingContent || ''}
                              onChange={(e) => handleInputChange('existingContent', e.target.value)}
                              placeholder="Présentez les fichiers en votre possession ou vos besoins de captation..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quels types de formats préférez-vous ? (Facultatif)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Carrousel", "Publication statique", "Reel", "Story", 
                                "Vidéo", "Conseils / Éducation", "Témoignages", 
                                "Promotion", "Coulisses", "Actualité"
                              ].map(f => {
                                const isChecked = (formData.formats || []).includes(f);
                                return (
                                  <label key={f} className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('formats', f, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-[10.5px] font-semibold leading-tight">{f}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.formatsOther || ''}
                              onChange={(e) => handleInputChange('formatsOther', e.target.value)}
                              placeholder="Autre format, précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 4: Ligne Éditoriale & Identité */}
                      {currentStep === 3 && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">04. Ligne Éditoriale & Identité Visuelle</h4>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Quel style de ligne éditoriale recherchez-vous ? (Facultatif)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Professionnel", "Premium", "Accessible", "Éducatif", 
                                "Dynamique", "Humoristique", "Institutionnel", "Chaleureux"
                              ].map(style => {
                                const isChecked = (formData.editorialStyle || []).includes(style);
                                return (
                                  <label key={style} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => handleCheckboxChange('editorialStyle', style, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#1d9878] border-[#1d9878]' : 'border-white/20'}`}>
                                      {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-semibold leading-tight">{style}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input 
                              type="text"
                              value={formData.editorialStyleOther || ''}
                              onChange={(e) => handleInputChange('editorialStyleOther', e.target.value)}
                              placeholder="Autre style, précisez... (Facultatif)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Y a-t-il des sujets, mots, visuels ou pratiques à éviter absolument ? (Facultatif)</label>
                            <textarea 
                              value={formData.avoidTopics || ''}
                              onChange={(e) => handleInputChange('avoidTopics', e.target.value)}
                              placeholder="Concurrents, expressions particulières, visuels non désirés..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[60px] resize-y"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Identité visuelle : Avez-vous un logo / charte graphique ? Souhaitez-vous un devis ? * (Réponse obligatoire)</label>
                            <div className="flex flex-col gap-2">
                              {[
                                { val: 'oui', text: "Oui, j'ai déjà un logo et/ou une charte graphique (Fichier requis)" },
                                { val: 'devis', text: "Non, je souhaite un devis (Logo & Charte graphique)" },
                                { val: 'aucun', text: "Non, je ne souhaite pas de devis" }
                              ].map(option => {
                                const isSelected = formData.visualIdentity === option.val;
                                return (
                                  <label key={option.val} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                    <input 
                                      type="radio"
                                      name="visualIdentity"
                                      checked={isSelected}
                                      onChange={() => handleInputChange('visualIdentity', option.val)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1d9878]" />}
                                    </div>
                                    <span className="text-xs font-semibold leading-tight">{option.text}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {formData.visualIdentity === 'oui' && (
                              <div className="space-y-2 mt-2 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Chargez votre logo et/ou charte graphique * (Fichier requis)</label>
                                <div className="flex flex-wrap items-center gap-3">
                                  <label className="flex items-center justify-center gap-2 bg-[#1c2c46] hover:bg-[#1d9878] text-white font-bold uppercase tracking-[1.5px] text-[9.5px] px-4 py-2.5 rounded-lg cursor-pointer transition-all">
                                    <input 
                                      type="file" 
                                      onChange={handleFileChange} 
                                      className="sr-only" 
                                      accept=".pdf,.png,.jpg,.jpeg,.zip" 
                                    />
                                    Sélectionner un fichier
                                  </label>
                                  {formData.graphicCharterFile ? (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1d9878]">
                                      <span>📎 {formData.graphicCharterFile}</span>
                                      <button type="button" onClick={removeUploadedFile} className="text-red-400 hover:text-red-300 font-bold ml-1 text-xs">Supprimer</button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-white/40">Aucun fichier sélectionné</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 5: Organisation, Budget & Contact */}
                      {currentStep === 4 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1d9878]">05. Organisation & validation</h4>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Fréquence de publication souhaitée, jours/heures, événements clés (promotions, Ramadan...) ? (Facultatif)</label>
                            <textarea 
                              value={formData.scheduleNotes || ''}
                              onChange={(e) => handleInputChange('scheduleNotes', e.target.value)}
                              placeholder="Indiquez vos besoins de rythme ou de calendrier..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[50px] resize-y"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Souhaitez-vous utiliser la publicité (Meta / Google) ? * (Réponse obligatoire)</label>
                              <div className="flex gap-3">
                                {[
                                  { val: true, label: "Oui" },
                                  { val: false, label: "Non" }
                                ].map(opt => {
                                  const isSelected = formData.useAds === opt.val;
                                  return (
                                    <label key={opt.label} className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                      <input 
                                        type="radio"
                                        name="useAds"
                                        checked={isSelected}
                                        onChange={() => handleInputChange('useAds', opt.val)}
                                        className="sr-only"
                                      />
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#1d9878]" />}
                                      </div>
                                      <span className="text-xs font-semibold">{opt.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Avez-vous déjà un site web ? * (Réponse obligatoire)</label>
                              <div className="flex gap-3">
                                {[
                                  { val: true, label: "Oui" },
                                  { val: false, label: "Non" }
                                ].map(opt => {
                                  const isSelected = formData.hasSite === opt.val;
                                  return (
                                    <label key={opt.label} className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                      <input 
                                        type="radio"
                                        name="hasSite"
                                        checked={isSelected}
                                        onChange={() => handleInputChange('hasSite', opt.val)}
                                        className="sr-only"
                                      />
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#1d9878]" />}
                                      </div>
                                      <span className="text-xs font-semibold">{opt.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Conditional sub-questions based on ads / website */}
                          {(formData.useAds === true || formData.hasSite !== undefined) && (
                            <div className="space-y-3 p-3.5 bg-white/5 border border-white/5 rounded-xl">
                              {formData.useAds === true && (
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9.5px] font-bold tracking-[1px] uppercase text-white/60">Détails Publicité (Budget mensuel, campagnes passées, objectifs...) ? (Facultatif)</label>
                                  <input 
                                    type="text"
                                    value={formData.adsDetails || ''}
                                    onChange={(e) => handleInputChange('adsDetails', e.target.value)}
                                    placeholder="Ex: budget de 200€/mois, générer des prospects qualifiés..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-[11px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                                  />
                                </div>
                              )}
                              {formData.hasSite === true && (
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9.5px] font-bold tracking-[1px] uppercase text-white/60">Lien de votre site web ? (Facultatif)</label>
                                  <input 
                                    type="text"
                                    value={formData.siteUrl || ''}
                                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                                    placeholder="Ex: https://monsite.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-[11px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                                  />
                                </div>
                              )}
                              {formData.hasSite === false && (
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9.5px] font-bold tracking-[1px] uppercase text-white/60">Souhaitez-vous recevoir un devis pour la création d'un site web ? (Facultatif)</label>
                                  <div className="flex gap-3 mt-1">
                                    {[
                                      { val: true, label: "Oui, volontiers" },
                                      { val: false, label: "Non, pas nécessaire" }
                                    ].map(opt => {
                                      const isSelected = formData.wantSiteQuote === opt.val;
                                      return (
                                        <label key={opt.label} className={`flex-1 flex items-center justify-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/50 hover:border-white/10'}`}>
                                          <input 
                                            type="radio"
                                            name="wantSiteQuote"
                                            checked={isSelected}
                                            onChange={() => handleInputChange('wantSiteQuote', opt.val)}
                                            className="sr-only"
                                          />
                                          <span className="text-[10px] font-semibold">{opt.label}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Nom Complet * (Réponse obligatoire)</label>
                              <input 
                                required
                                type="text"
                                value={formData.clientName || ''}
                                onChange={(e) => handleInputChange('clientName', e.target.value)}
                                placeholder="Votre nom"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Adresse E-mail * (Réponse obligatoire)</label>
                              <input 
                                required
                                type="email"
                                value={formData.clientEmail || ''}
                                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                                placeholder="Votre e-mail"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Numéro de Téléphone * (Réponse obligatoire)</label>
                              <input 
                                required
                                type="tel"
                                value={formData.clientPhone || ''}
                                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                                placeholder="Ex: +212 600-000000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Joignable sur WhatsApp * (Réponse obligatoire)</label>
                              <div className="flex gap-3">
                                {[
                                  { val: true, label: "Oui" },
                                  { val: false, label: "Non" }
                                ].map(opt => {
                                  const isSelected = formData.whatsapp === opt.val;
                                  return (
                                    <label key={opt.label} className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#1d9878]/10 border-[#1d9878] text-white' : 'bg-white/208 border-white/5 text-white/60 hover:border-white/10'}`}>
                                      <input 
                                        type="radio"
                                        name="whatsapp"
                                        checked={isSelected}
                                        onChange={() => handleInputChange('whatsapp', opt.val)}
                                        className="sr-only"
                                      />
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1d9878]' : 'border-white/20'}`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#1d9878]" />}
                                      </div>
                                      <span className="text-xs font-semibold">{opt.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/70">Message initial / Remarques (Facultatif)</label>
                            <textarea 
                              value={formData.comments || ''}
                              onChange={(e) => handleInputChange('comments', e.target.value)}
                              placeholder="Ajoutez toute précision utile..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs max-md:text-[16px] placeholder-white/20 focus:border-[#1d9878] focus:outline-none min-h-[50px] resize-y"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="relative z-10 flex justify-between border-t border-white/5 pt-4 pb-2 lg:pb-0 mt-auto">
                  <button 
                    type="button"
                    disabled={currentStep === 0}
                    onClick={handlePrev}
                    className="flex items-center gap-2 border border-white/10 hover:bg-white/5 disabled:opacity-20 text-white font-bold uppercase tracking-[1.5px] text-[9.5px] px-5 py-2.5 rounded-full transition-all cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    Précédent
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-white text-[#1c2c46] hover:bg-[#1d9878] hover:text-white font-bold uppercase tracking-[1.5px] text-[9.5px] px-6 py-2.5 rounded-full transition-all cursor-pointer ml-auto"
                    >
                      Suivant
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[#1d9878] hover:bg-[#157159] disabled:opacity-50 text-white font-bold uppercase tracking-[1.5px] text-[9.5px] px-6 py-2.5 rounded-full transition-all cursor-pointer ml-auto"
                    >
                      {isSubmitting ? 'Transmission...' : 'Envoyer'}
                      <Send size={13} />
                    </button>
                  )}
                </div>

              </form>
            )}

          </div>

    </div>
  );
}