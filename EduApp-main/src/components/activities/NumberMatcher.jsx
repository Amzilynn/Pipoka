import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSettings } from '../../context/SettingsContext';
import QuantityIllustration from '../illustrations/QuantityIllustration';
import { useSpeech } from '../../hooks/useSpeech';
import './NumberMatcher.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const NUMBER_COLORS = [
  '#FF6B6B', // 0
  '#FF8C00', // 1
  '#FFD93D', // 2
  '#6BCB77', // 3
  '#4D96FF', // 4
  '#C77DFF', // 5
  '#FF69B4', // 6
  '#4CAF50', // 7
  '#8B00FF', // 8
  '#00D2D3', // 9
  '#FF4D4D'  // 10
];

function NumberCard({ num, isPlaced }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `num-${num}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.1) rotate(4deg)`,
    zIndex: 100
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`number-drag-card ${isPlaced ? 'placed' : ''} ${isDragging ? 'dragging' : ''}`}
      style={style}
    >
      {num}
    </div>
  );
}

function QuantityZone({ pair, placedNumber, feedbackState }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${pair.number}`,
  });

  const groupColor = NUMBER_COLORS[pair.number % NUMBER_COLORS.length];

  return (
    <div
      ref={setNodeRef}
      className={`quantity-drop-zone ${isOver ? 'over' : ''} ${feedbackState || ''}`}
      style={feedbackState === 'correct' ? { borderColor: groupColor, background: `${groupColor}11` } : {}}
    >
      <div className="illustration-wrap">
        {Array.from({ length: pair.number }).map((_, i) => (
          <QuantityIllustration 
            key={i} 
            type={pair.object} 
            size={pair.number > 5 ? 24 : 32} 
            color={groupColor}
          />
        ))}
      </div>

      <div 
        className={`drop-slot-indicator ${placedNumber ? 'filled' : ''}`}
        style={placedNumber ? { background: groupColor, boxShadow: `0 6px 0 ${groupColor}99` } : { borderColor: `${groupColor}66` }}
      >
        {placedNumber || '?'}
      </div>
    </div>
  );
}

export default function NumberMatcher({ activity, onComplete, onProgress }) {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const isAr = settings.language === 'ar';
  
  const [placements, setPlacements] = useState({}); 
  const [feedback, setFeedback] = useState({}); 
  const [shuffledBank, setShuffledBank] = useState([]);
  const [shuffledZones, setShuffledZones] = useState([]);
  const [currentPairs, setCurrentPairs] = useState([]);

  useEffect(() => {
    if (activity && activity.items) {
      const limit = activity.trials || activity.items.length;
      const pairs = shuffle(activity.items).slice(0, limit);
      setCurrentPairs(pairs);
      setShuffledBank(shuffle([...pairs]));
      setShuffledZones(shuffle([...pairs]));
      setPlacements({});
      setFeedback({});
      if (onProgress) onProgress(0);
    }
  }, [activity]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  function handleDragEnd({ active, over }) {
    if (!over) return;

    const num = parseInt(active.id.replace('num-', ''));
    const zoneId = over.id;
    const zoneNum = parseInt(zoneId.replace('zone-', ''));

    if (feedback[zoneId] === 'correct') return;

    if (num === zoneNum) {
      const newPlacements = { ...placements, [zoneId]: num };
      setPlacements(newPlacements);
      setFeedback(prev => ({ ...prev, [zoneId]: 'correct' }));
      
      // Speak the number!
      // speak(num.toString());

      const newPlacedCount = Object.keys(newPlacements).length;
      if (onProgress) onProgress(newPlacedCount);

      const allPlaced = currentPairs.every(p => newPlacements[`zone-${p.number}`] !== undefined);
      if (allPlaced) {
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    } else {
      setFeedback(prev => ({ ...prev, [zoneId]: 'error' }));
      speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
      setTimeout(() => setFeedback(prev => ({ ...prev, [zoneId]: null })), 600);
    }
  }

  const placedValues = Object.values(placements);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="number-matcher-container">
        
        {/* Row 1: The Number Bank */}
        <div className="number-bank-row">
          {shuffledBank.map(pair => (
            <NumberCard
              key={pair.number}
              num={pair.number}
              isPlaced={placedValues.includes(pair.number)}
            />
          ))}
        </div>

        {/* Row 2: The Quantity Zones */}
        <div className="quantity-zones-grid">
          {shuffledZones.map(pair => (
            <QuantityZone
              key={pair.number}
              pair={pair}
              placedNumber={placements[`zone-${pair.number}`] ?? null}
              feedbackState={feedback[`zone-${pair.number}`] || null}
            />
          ))}
        </div>

        <p className="interaction-tip">
          {isAr ? 'اسحب الرقم للمجموعة الصحيحة' : 'Glisse le chiffre vers le bon groupe'}
        </p>
      </div>
    </DndContext>
  );
}
