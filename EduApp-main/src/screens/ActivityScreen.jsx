import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { getCategory } from '../data/content';
import { useSpeech } from '../hooks/useSpeech';
import DragTextToImage from '../components/activities/DragTextToImage';
import DragImageToZone from '../components/activities/DragImageToZone';
import LetterSequencer from '../components/activities/LetterSequencer';
import NumberMatcher from '../components/activities/NumberMatcher';
import ColorMixer from '../components/activities/ColorMixer';
import ScreenWrapper from '../components/layout/ScreenWrapper';
import ConfirmModal from '../components/ui/ConfirmModal';
import Mascot from '../components/Mascot';
import ProgressStars from '../components/ui/ProgressStars';
import BigButton from '../components/ui/BigButton';
import './ActivityScreen.css';

export default function ActivityScreen() {
  const { categoryId } = useParams();
  const { settings, dispatch } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { speak } = useSpeech();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activityKey, setActivityKey] = useState(0);
  const listIndex = parseInt(searchParams.get('list') || '0', 10);

  const isAr = settings.language === 'ar';
  const category = getCategory(settings.level, settings.language, categoryId);
  const activity = category?.activity;
  const mascotType = settings.level === 3 ? 'sunny' : settings.level === 4 ? 'heart' : 'star';
  

  // Instructions are no longer played automatically as per user request
  /*
  useEffect(() => {
    if (activity?.instruction) {
      const timer = setTimeout(() => {
        if (!activity.noAudio) speak(activity.instruction);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activity]);
  */

  if (!category || !activity) {
    navigate('/categories');
    return null;
  }

  const currentWordList = activity.wordLists ? (activity.wordLists[listIndex] || activity.wordLists[0]) : activity.words;
  const totalSteps = activity.trials || activity.items?.length || currentWordList?.length || activity.rounds?.length || activity.questions?.length || 5;

  function handleComplete() {
    setCompleted(true);
    setProgress(totalSteps);
    spawnConfetti();
    playClapSound();
  }

  function playClapSound() {
    const clapSound = new Audio('/assets/sounds/clapping.mp3');
    clapSound.volume = 0.6;
    clapSound.play().catch(() => {});
  }

  function spawnConfetti() {
    const shapes = ['⭐','💛','✨','🌟','💫','🎉','🌸','💜'];
    for (let i = 0; i < 30; i++) {
        const el = document.createElement('span');
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.cssText = `
          position: fixed;
          left: ${10 + Math.random() * 80}%;
          top: -40px;
          font-size: ${16 + Math.random() * 20}px;
          z-index: 9999;
          pointer-events: none;
          animation: confettiFall ${1.5 + Math.random() * 1.5}s ease-in ${Math.random() * 0.8}s forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }
  }

  function handleNext() {
    setCompleted(false);
    if (hasMultipleLists) {
      setSelectedList(null);
      navigate(`/activity/${categoryId}`);
    } else {
      navigate('/categories');
    }
  }

  function handleGoHome() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  const [selectedList, setSelectedList] = useState(searchParams.get('list'));
  const hasMultipleLists = activity.wordLists && activity.wordLists.length > 1;

  useEffect(() => {
    setSelectedList(searchParams.get('list'));
  }, [searchParams]);

  function renderActivity() {
    // If activity has multiple lists and none selected, show selector
    if (hasMultipleLists && selectedList === null) {
      return (
        <div className="list-selection-container">
          <div className="list-options-grid">
            {activity.listDetails?.map((list, idx) => (
              <motion.button
                key={idx}
                className="list-option-card"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                   speak(list.title);
                   setTimeout(() => {
                     setSelectedList(idx.toString());
                     navigate(`/activity/${categoryId}?list=${idx}`);
                   }, 400);
                }}
              >
                <span className="list-icon-large">{list.icon}</span>
                <span className="list-title-label">{list.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    const props = { 
      activity, 
      onComplete: handleComplete,
      onProgress: setProgress,
      listIndex: parseInt(selectedList || '0', 10)
    };

    switch (activity.type) {
      case 'drag-text-to-image':
        return <DragTextToImage key={activityKey} {...props} />;
      case 'drag-image-to-zone':
        return <DragImageToZone key={activityKey} {...props} />;
      case 'letter-sequencer':
        return <LetterSequencer key={activityKey} {...props} />;
      case 'number-matcher':
        return <NumberMatcher key={activityKey} {...props} />;
      case 'color-mixer':
        return <ColorMixer key={activityKey} {...props} />;
      default:
        return <div>Activité inconnue</div>;
    }
  }

  const isV3 = true; // Apply V3 premium design to all levels

  const v3Header = (
    <div className="v3-activity-header-simple">
      <button className="home-btn-3d-premium" onClick={() => setShowConfirm(true)}>
        <span className="home-label-3d-bold">{isAr ? 'الرئيسية' : 'Accueil'}</span>
      </button>
      
      <div className="v3-instruction-text-group">
        <div className="v3-instruction-text">
          {hasMultipleLists && selectedList === null 
            ? (isAr ? "أي فئة تريد استكشافها؟" : "Quelle catégorie veux-tu explorer ?")
            : activity.instruction
          }
        </div>
        {!activity.noAudio && (
          <button 
            className="v3-instruction-speaker-btn" 
            onClick={() => {
              const text = hasMultipleLists && selectedList === null 
                ? (isAr ? "أي فئة تريد استكشافها؟" : "Quelle catégorie veux-tu explorer ?")
                : activity.instruction;
              speak(text);
            }}
            title="Écouter"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );

  const standardHeader = (
    <>
      <button className="home-btn-pill" onClick={() => setShowConfirm(true)}>
        <span className="home-label">{isAr ? 'الرئيسية' : 'Accueil'}</span>
      </button>

      <div className="breadcrumb-pill">
        {isAr ? `المستوى ${settings.level} › ${category.title}` : `Niveau ${settings.level} › ${category.title}`}
      </div>


    </>
  );

  const v3Footer = (
    <div className="playful-control-panel">
      <button className="playful-btn menu" onClick={() => navigate('/categories')}>
        <div className="playful-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" className="playful-svg">
            <path d="M10.1985 2.68481C11.2384 1.84918 12.7616 1.84918 13.8015 2.68481L20.488 8.05607C21.4379 8.81938 22 9.97014 22 11.1895V19C22 20.6569 20.6569 22 19 22H16C15.4477 22 15 21.5523 15 21V16C15 14.8954 14.1046 14 13 14H11C9.89543 14 9 14.8954 9 16V21C9 21.5523 8.55228 22 8 22H5C3.34315 22 2 20.6569 2 19V11.1895C2 9.97014 2.56209 8.81938 3.512 8.05607L10.1985 2.68481Z" fill="#FFA726"/>
            <path d="M10.1985 2.68481C11.2384 1.84918 12.7616 1.84918 13.8015 2.68481L20.488 8.05607C21.4379 8.81938 22 9.97014 22 11.1895V19" stroke="#EF6C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="playful-btn-label">{isAr ? 'القائمة' : 'Menu'}</span>
      </button>
      
      <div className="playful-divider" />
      
      <button className="playful-btn reset" onClick={() => {
        if (hasMultipleLists) {
          setSelectedList(null);
          navigate(`/activity/${categoryId}`);
        } else {
          setActivityKey(prev => prev + 1);
          setProgress(0);
          setCompleted(false);
        }
      }}>
        <div className="playful-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" className="playful-svg redo-svg">
            <path d="M19 10C19 13.866 15.866 17 12 17C8.13401 17 5 13.866 5 10M5 10H10M5 10V5" stroke="#FFA726" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="playful-btn-label">{hasMultipleLists && selectedList !== null ? (isAr ? 'القوائم' : 'Listes') : (isAr ? 'إعادة' : 'Refaire')}</span>
      </button>
    </div>
  );

  const standardFooter = (
    <>
      <button className="btn-back-pill" onClick={() => navigate('/categories')}>
        {isAr ? '⬅ القائمة' : '⬅ Menu'}
      </button>
      
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="footer-primary-wrap"
          >
            <BigButton 
              variant="primary"
              onClick={handleNext}
            >
              {isAr ? 'التالي →' : 'SUIVANT →'}
            </BigButton>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="btn-back-pill" onClick={() => speak(activity.instruction)}>
        {isAr ? '🔄 إرسال' : '🔄 Relire'}
      </button>
    </>
  );

  return (
    <ScreenWrapper 
      header={isV3 ? v3Header : standardHeader}
      footer={isV3 ? v3Footer : standardFooter}
      dataLevel={settings.level}
      dir="ltr"
      className={isV3 ? 'activity-screen-v3' : 'activity-screen-v2'}
    >
      <div className="activity-layout-grid">
        {/* Progress */}
        <section className="progress-row">
          <div className="prominent-progress-bar">
            <ProgressStars 
              total={totalSteps} 
              current={progress} 
            />
          </div>
        </section>

        {/* Activity Zone */}
        <section className="activity-zone-stretch">
          {renderActivity()}
        </section>

        {/* Mascot Fixed (Overlay) */}
        <div className="activity-mascot-fixed">
          <div className="mascot-platform">
            <Mascot type={mascotType} state={completed ? 'success' : 'idle'} />
          </div>
        </div>
      </div>

      {/* Success Success Pop (Optional overlay if needed, but we have confetti) */}
      <AnimatePresence>
        {completed && (
          <motion.div 
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-card-rich"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <span className="success-trophy-pop">🏆</span>
              <h2 className="success-title">
                {isAr ? 'أحسنت! لقد نجحت!' : 'Bravo ! Tu as réussi !'}
              </h2>
              
              <div className="success-stars-pop">
                <ProgressStars total={3} current={3} />
              </div>

              <BigButton onClick={handleNext}>
                {isAr ? 'استمر 🌟' : 'CONTINUER 🌟'}
              </BigButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showConfirm}
        message={isAr ? 'العودة إلى الرئيسية؟' : "Retour à l'accueil ?"}
        onConfirm={handleGoHome}
        onCancel={() => setShowConfirm(false)}
      />
    </ScreenWrapper>
  );
}
