import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { getContent } from '../data/content';
import { useSpeech } from '../hooks/useSpeech';
import CategoryCard from '../components/ui/CategoryCard';
import Mascot from '../components/Mascot';
import ScreenWrapper from '../components/layout/ScreenWrapper';
import ConfirmModal from '../components/ui/ConfirmModal';
import './CategoryMenuScreen.css';

export default function CategoryMenuScreen() {
  const { settings, dispatch } = useSettings();
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const isAr = settings.language === 'ar';

  const content = getContent(settings.level, settings.language);
  const mascotType = settings.level === 3 ? 'sunny' : settings.level === 4 ? 'heart' : 'star';

  // Welcome message no longer played automatically as per user request
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(content.welcomeMsg);
    }, 600);
    return () => clearTimeout(timer);
  }, []);
  */

  const isV3 = true; // Apply V3 premium design to all levels

  function handleCategoryTap(category) {
    speak(category.title);
    setTimeout(() => {
      navigate(`/activity/${category.id}`);
    }, 500);
  }

  function handleGoHome() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  const standardHeader = (
    <>
      <button className="home-btn-pill" onClick={() => setShowConfirm(true)}>
        <span className="home-label">{isAr ? 'الرئيسية' : 'Accueil'}</span>
      </button>

      <div className="level-badge-frosted">
        <div className="badge-mascot-wrap">
          <Mascot type={mascotType} state="idle" />
        </div>
        <span>
          {isAr ? `${settings.level} سنوات` : `${settings.level} ans`}
        </span>
      </div>


    </>
  );

  const v3Header = (
    <div className="v3-header-clean">
      <button className="home-btn-3d-premium" onClick={() => setShowConfirm(true)}>
        <span className="home-label-3d-bold">{isAr ? 'الرئيسية' : 'Accueil'}</span>
      </button>

      <div className="v3-mascot-focus">
        <div className="mascot-waving-container">
          <Mascot type={mascotType} state="waving" className="v3-premium-mascot-anim" />
        </div>
      </div>

      <div className="v3-header-right"></div>
    </div>
  );

  return (
    <ScreenWrapper 
      header={isV3 ? v3Header : standardHeader}
      dataLevel={settings.level}
      dir="ltr"
      className={isV3 ? 'category-screen-v3' : 'category-screen-v2'}
    >
      <div className={isV3 ? "category-menu-layout-v3" : "category-menu-layout"}>
        
        {/* Learning Phrase */}
        <motion.div 
          className="learning-phrase-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="learning-phrase-text">
            {isAr ? 'ماذا نريد أن نتعلم اليوم؟' : "Qu'est-ce qu'on veut apprendre aujourd'hui ?"}
          </span>
          <button className="speaker-btn-learning" onClick={() => speak(isAr ? 'ماذا نريد أن نتعلم اليوم؟' : "Qu'est-ce qu'on veut apprendre aujourd'hui ?")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </motion.div>

        <div className={isV3 ? "category-cards-container-v3" : "category-list-stretch"}>
          {content.categories.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <motion.div
                className={isV3 ? "v3-card-item-premium" : "stagger-child category-card-wrapper"}
                initial={isV3 ? { opacity: 0, scale: 0.8, y: 50, rotate: index === 0 ? -2 : 2 } : {}}
                animate={isV3 ? { opacity: 1, scale: 1, y: 0, rotate: index === 0 ? -2 : 2 } : {}}
                transition={{ 
                  delay: index * 0.2, 
                  type: 'spring', 
                  stiffness: 100, 
                  damping: 12 
                }}
              >
                <CategoryCard 
                  variant={isV3 ? 'v3' : 'v1'}
                  title={cat.title}
                  icon={cat.icon}
                  color={cat.color}
                  onClick={() => handleCategoryTap(cat)}
                />
              </motion.div>

            </React.Fragment>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        message={isAr ? 'العودة إلى الرئيسية؟' : "Retour à l'accueil ?"}
        onConfirm={handleGoHome}
        onCancel={() => setShowConfirm(false)}
      />
    </ScreenWrapper>
  );
}
