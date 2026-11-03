import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';
import FamilyIllustration from '../illustrations/FamilyIllustration';
import ColorSwatch from '../illustrations/ColorSwatch';
import ShapeIllustration from '../illustrations/ShapeIllustration';
import './DragTextToImage.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function DraggableChip({ item, isPlaced, variant = 'standard' }) {
  const { speak } = useSpeech();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: isPlaced,
  });

  const isV3 = variant === 'v3';
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isV3 ? 1.2 : 1.1}) rotate(${isV3 ? 10 : 3}deg)`, zIndex: 100 }
    : {};

  function handleSpeakerClick(e) {
    e.stopPropagation();
    if (item.audio) {
      speak(item.audio);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      {...(isPlaced ? {} : listeners)}
      {...(isPlaced ? {} : attributes)}
      className={`${isV3 ? 'v3-word-sticker' : 'label-chip-drag'} ${isPlaced ? 'placed' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <span className="chip-label-text">{item.label}</span>
      <button 
        className="element-speaker-btn"
        onClick={handleSpeakerClick}
        onPointerDown={(e) => e.stopPropagation()}
        title="Écouter"
      >
        🔊
      </button>
      {isV3 && <div className="sticker-glow" />}
    </div>
  );
}

function DropZoneCard({ zone, placedItem, feedbackState, variant = 'standard' }) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id });
  const isCorrect = feedbackState === 'correct';
  const isError = feedbackState === 'error';
  const isV3 = variant === 'v3';

  return (
    <div
      ref={setNodeRef}
      className={`${isV3 ? 'v3-sticker-slot' : 'image-drop-card'} ${isOver ? 'over' : ''} ${isCorrect ? 'correct' : ''} ${isError ? 'error-shake' : ''} ${zone.id === 'blanc' ? 'white-target' : ''}`}
    >
      <div className="illustration-box">
        {zone.type === 'family' && (
          <FamilyIllustration memberId={zone.shapeId} size={isV3 ? 90 : 70} />
        )}
        {zone.type === 'color' && <ColorSwatch color={zone.color} size={70} />}
        {zone.type === 'shape' && <ShapeIllustration shapeId={zone.shapeId} size={70} />}
      </div>

      <div className={isV3 ? "v3-answer-space" : "standard-answer-space"}>
        {placedItem ? (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className={isV3 ? 'v3-placed-label' : 'placed-label-tag'}
          >
            {placedItem.label} {isV3 ? '✓' : '✓'}
          </motion.div>
        ) : (
          <div className={isV3 ? 'v3-empty-slot' : 'empty-slot-dash'}>
            {isV3 && <div className="slot-inner-shadow" />}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DragTextToImage({ activity, onComplete, onProgress }) {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const isAr = settings.language === 'ar';

  const [placements, setPlacements] = useState({}); 
  const [feedback, setFeedback] = useState({}); 
  const [shuffledItems, setShuffledItems] = useState(() => shuffle([...activity.items]));
  const [shuffledZones, setShuffledZones] = useState(() => {
    const items = shuffle([...activity.items]);
    return items.map(item => ({
      id: item.id,
      acceptsId: item.id,
      type: item.imageKey?.startsWith('family') ? 'family'
           : item.imageKey?.startsWith('color') ? 'color'
           : 'shape',
      color: item.color,
      shapeId: item.imageKey,
      label: item.label,
    }));
  });

  useEffect(() => {
    setShuffledItems(shuffle([...activity.items]));
    const zonesItems = shuffle([...activity.items]);
    setShuffledZones(zonesItems.map(item => ({
      id: item.id,
      acceptsId: item.id,
      type: item.imageKey?.startsWith('family') ? 'family'
           : item.imageKey?.startsWith('color') ? 'color'
           : 'shape',
      color: item.color,
      shapeId: item.imageKey,
      label: item.label,
    })));
    setPlacements({});
    setFeedback({});
    if (onProgress) onProgress(0);
  }, [activity]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  function handleDragEnd({ active, over }) {
    if (!over) return;
    const itemId = active.id;
    const zoneId = over.id;
    const zone = shuffledZones.find(z => z.id === zoneId);
    const item = activity.items.find(i => i.id === itemId);

    if (!zone || !item || feedback[zoneId] === 'correct') return;

    if (zone.acceptsId === itemId) {
      const newPlacements = { ...placements, [zoneId]: item };
      setPlacements(newPlacements);
      setFeedback(prev => ({ ...prev, [zoneId]: 'correct' }));
      speak(item.audio);

      const placedCount = Object.keys(newPlacements).length;
      if (onProgress) onProgress(placedCount);

      if (placedCount === activity.items.length) {
        setTimeout(() => onComplete(), 1200);
      }
    } else {
      setFeedback(prev => ({ ...prev, [zoneId]: 'error' }));
      speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
      setTimeout(() => setFeedback(prev => ({ ...prev, [zoneId]: null })), 600);
    }
  }

  const placedIds = Object.values(placements).map(i => i.id);

  const isV3 = settings.level === 3;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={isV3 ? "v3-drag-activity-container" : "drag-text-image-container"}>
        
        {/* Row 1: Draggable Labels */}
        <div className={isV3 ? "v3-stickers-row" : "chips-row"}>
          {shuffledItems.map(item => (
            <DraggableChip
              key={item.id}
              item={item}
              variant={isV3 ? 'v3' : 'standard'}
              isPlaced={placedIds.includes(item.id)}
            />
          ))}
        </div>

        {/* Row 2: Image Drop Zones */}
        <div 
          className={isV3 ? "v3-sticker-grid" : `drop-zones-grid ${activity.items.length <= 4 ? 'fewer-items' : ''}`}
        >
          {shuffledZones.map(zone => (
            <DropZoneCard
              key={zone.id}
              zone={zone}
              variant={isV3 ? 'v3' : 'standard'}
              placedItem={placements[zone.id] || null}
              feedbackState={feedback[zone.id] || null}
            />
          ))}
        </div>

        {!isV3 && (
          <p className="interaction-tip">
            {isAr ? 'اسحب الكلمة للصورة المناسبة' : 'Glisse le mot vers la bonne image'}
          </p>
        )}
      </div>
    </DndContext>
  );
}
