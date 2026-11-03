import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';
import './ColorMixer.css';

/**
 * Renders a "paint splat" style shape using SVG
 */
/**
 * Detects if a hex color is very light (close to white)
 */
function isLightColor(hex) {
  if (!hex) return false;
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Perceived luminance formula
  return (r * 0.299 + g * 0.587 + b * 0.114) > 210;
}

/**
 * Renders a "paint splat" style shape using SVG
 */
function SplatRenderer({ color, label, labelColor }) {
  const light = isLightColor(color);
  const resolvedLabelColor = light ? '#555' : (labelColor || color || '#555');
  const strokeColor = light ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.08)';
  const strokeWidth = light ? '2.5' : '1.5';

  return (
    <div className="splat-container">
      {label && (
        <span className="splat-label" style={{ color: resolvedLabelColor }}>
          {label}
        </span>
      )}
      <svg 
        viewBox="0 0 100 100" 
        className="splat-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M50 10C35 10 25 20 25 35C25 45 30 50 20 60C10 70 5 75 5 85C5 95 15 95 30 90C40 85 45 80 50 85C55 80 60 85 70 90C85 95 95 95 95 85C95 75 90 70 80 60C70 50 75 45 75 35C75 20 65 10 50 10Z" 
          fill={color} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth}
        />
        {/* Drips */}
        <circle cx="28" cy="75" r="4.5" fill={color} stroke={light ? 'rgba(0,0,0,0.15)' : 'none'} strokeWidth="1" />
        <circle cx="50" cy="92" r="5.5" fill={color} stroke={light ? 'rgba(0,0,0,0.15)' : 'none'} strokeWidth="1" />
        <circle cx="72" cy="78" r="3.5" fill={color} stroke={light ? 'rgba(0,0,0,0.15)' : 'none'} strokeWidth="1" />
        {/* Shine — skip for light colors since it blends in */}
        {!light && (
          <path 
            d="M40 25C35 25 32 30 32 35" 
            stroke="rgba(255,255,255,0.45)" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
          />
        )}
      </svg>
    </div>
  );
}

function DraggableSplat({ item, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ 
    id: item.id,
    data: item
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.15) rotate(5deg)`,
    zIndex: 1000,
  } : undefined;

  const light = isLightColor(item.color);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`splat-option-card ${isDragging ? 'dragging' : ''} ${light ? 'light-color-card' : ''}`}
      style={style}
    >
      <SplatRenderer color={item.color} label={item.label} labelColor={item.color} />
    </div>
  );
}

function MixingDropZone({ filled, filledItem, isOver }) {
  const { setNodeRef } = useDroppable({ id: 'drop-zone' });

  return (
    <div
      ref={setNodeRef}
      className={`mixer-drop-zone ${isOver ? 'over' : ''} ${filled ? 'filled' : ''}`}
    >
      {filled ? (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        >
          <SplatRenderer color={filledItem.color} label={filledItem.label} labelColor={filledItem.color} />
          <div className="success-check">✓</div>
        </motion.div>
      ) : (
        <div className="drop-hint-icon">?</div>
      )}
    </div>
  );
}

export default function ColorMixer({ activity, onComplete, onProgress }) {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const isAr = settings.language === 'ar';
  
  // Shuffle rounds and options once on component mount
  const shuffledData = React.useMemo(() => {
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    return {
      rounds: shuffle(activity.rounds),
      options: shuffle(activity.options)
    };
  }, [activity]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [isError, setIsError] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const round = shuffledData.rounds[currentIndex];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 10 } })
  );

  useEffect(() => {
    if (onProgress) onProgress(currentIndex);
  }, [currentIndex, onProgress]);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || over.id !== 'drop-zone' || answer) return;

    const droppedItem = active.data.current;
    
    if (droppedItem.id === round.resultId) {
      setAnswer(droppedItem);
      speak(isAr ? 'أحسنت!' : 'Bravo !');
      
      // Speak the name of the result color
      setTimeout(() => {
        speak(droppedItem.label);
      }, 800);
      
      setTimeout(() => {
        if (currentIndex < shuffledData.rounds.length - 1) {
          setCurrentIndex(i => i + 1);
          setAnswer(null);
        } else {
          onComplete();
        }
      }, 1800);
    } else {
      setIsError(true);
      speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
      setTimeout(() => setIsError(false), 600);
    }
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`color-mixer-container ${isError ? 'shake-it' : ''}`}>
        
        {/* The Equation */}
        <div className="mixing-equation-area">
          <SplatRenderer 
            color={round.color1.value} 
            label={round.color1.label} 
            labelColor={round.color1.value}
          />
          
          <div className="equation-symbol">+</div>
          
          <SplatRenderer 
            color={round.color2.value} 
            label={round.color2.label} 
            labelColor={round.color2.value}
          />
          
          <div className="equation-symbol">=</div>
          
          <MixingDropZone 
            filled={!!answer} 
            filledItem={answer} 
            isOver={activeId !== null}
          />
        </div>

        <div className="interaction-tip">
          {isAr ? 'اسحب اللون الصحيح لإكمال النتيجة' : 'Glisse la bonne couleur pour compléter le résultat'}
        </div>

        {/* Options */}
        <div className="mixer-options-row">
          {shuffledData.options.map(opt => (
            <DraggableSplat 
              key={opt.id} 
              item={opt} 
              isDragging={activeId === opt.id} 
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

