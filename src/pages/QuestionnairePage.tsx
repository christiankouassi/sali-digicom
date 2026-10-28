import React, { useEffect } from 'react';
import QuestionnaireFlow, { QuestionnaireType } from '../components/QuestionnaireFlow';
import Logo from '../components/Logo';
import { useRouter } from '../utils/router';
import { ArrowLeft, Sparkles, FolderKanban } from 'lucide-react';

export interface QuestionnairePageProps {
  type: QuestionnaireType;
}

export function QuestionnairePage({ type }: QuestionnairePageProps) {
  const { navigate } = useRouter();

  useEffect(() => {
    if (type === 'website') {
      document.title = 'Création de Site Web — Questionnaire Stratégique | SALI DigiCom';
    } else if (type === 'community') {
      document.title = 'Community Management & Réseaux — Questionnaire Stratégique | SALI DigiCom';
    } else {
      document.title = 'Identité Visuelle & Branding — Questionnaire Stratégique | SALI DigiCom';
    }
    window.scrollTo(0, 0);
  }, [type]);

  const handleTypeNavigate = (newType: QuestionnaireType) => {
    if (newType === 'website') {
      navigate('/creation-de-site-web');
    } else if (newType === 'community') {
      navigate('/community-management');
    } else if (newType === 'branding') {
      navigate('/identite-visuelle');
    }
  };

  return (
    <div className="min-h-screen bg-[#1C2C46] text-white font-['Montserrat',sans-serif] selection:bg-[#1D9878] selection:text-white flex flex-col justify-between">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#1C2C46]/90 border-b border-[#243757]/70">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group focus:outline-none"
              aria-label="Accueil SALI DigiCom"
            >
              <Logo
                variant="digicom"
                type="horizontal"
                className="h-8 md:h-9 w-auto opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </button>
            <span className="hidden sm:inline-block h-4 w-px bg-[#283D60]" />
            <span className="hidden sm:inline-block text-[13px] tracking-wider uppercase text-[#1D9878] font-semibold">
              Cadrage Projet &amp; Devis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/projets')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#1D9878]" />
              <span>Voir nos réalisations</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#243757] hover:border-[#1D9878] bg-[#131F33]/80 hover:bg-[#1D9878]/10 text-xs font-semibold text-[#B8C7DA] hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
        <QuestionnaireFlow
          type={type}
          isStandalonePage={true}
          onClose={() => navigate('/')}
          onSuccess={() => {}}
          onTypeNavigate={handleTypeNavigate}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#243757] py-6 text-center text-xs text-[#B8C7DA]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SALI DigiCom — Agence de Marketing &amp; Communication Digitale.</p>
          <p>Toutes les données sont protégées par le secret professionnel et traitées sous 24h.</p>
        </div>
      </footer>
    </div>
  );
}
