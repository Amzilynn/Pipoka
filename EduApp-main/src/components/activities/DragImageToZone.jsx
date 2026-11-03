import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';
import './DragImageToZone.css';

function ShapeRenderer({ shape, color, size = 60 }) {
  const s = size;
  switch (shape) {
    case 'circle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill={color} stroke="#2D2D2D" strokeWidth="6" />
          <circle cx="35" cy="35" r="10" fill="rgba(255,255,255,0.35)" />
        </svg>
      );
    case 'square':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="8" y="8" width="84" height="84" rx="14" fill={color} stroke="#2D2D2D" strokeWidth="6" />
          <rect x="20" y="20" width="28" height="18" rx="6" fill="rgba(255,255,255,0.35)" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,8 94,92 6,92" fill={color} stroke="#2D2D2D" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="50,18 70,60 38,60" fill="rgba(255,255,255,0.20)" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width={s} height={70} viewBox="0 0 140 100">
          <rect x="6" y="10" width="128" height="80" rx="14" fill={color} stroke="#2D2D2D" strokeWidth="6" />
          <rect x="20" y="20" width="44" height="20" rx="6" fill="rgba(255,255,255,0.35)" />
        </svg>
      );
    default:
      return null;
  }
}

function DraggableOption({ item, isDragging }) {
  const { speak } = useSpeech();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.1) rotate(3deg)`,
    zIndex: 100
  } : undefined;

  function handleSpeakerClick(e) {
    e.stopPropagation();
    if (item.shapeName && item.colorName) {
      speak(`${item.shapeName} ${item.colorName}`);
    } else if (item.audio) {
      speak(item.audio);
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`image-option-card ${isDragging ? 'dragging' : ''}`}
      style={style}
    >
      <ShapeRenderer shape={item.shape} color={item.color} size={50} />
    </div>
  );
}

function AnswerDropZone({ filled, filledItem }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'answer-zone' });

  return (
    <div
      ref={setNodeRef}
      className={`answer-target-zone ${isOver ? 'over' : ''} ${filled ? 'filled' : ''}`}
    >
      {filled ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <ShapeRenderer shape={filledItem.shape} color={filledItem.color} size={80} />
          <span className="text-2xl">✅</span>
        </motion.div>
      ) : (
        <div className="drop-here-hint">
          <div className="drop-here-label text-center">Dépose ici / ضع هنا</div>
        </div>
      )}
    </div>
  );
}

export default function DragImageToZone({ activity, onComplete, onProgress }) {
  const { settings } = useSettings();
  const { speak, speakOpposite } = useSpeech();
  const isAr = settings.language === 'ar';
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const [activeId, setActiveId] = useState(null);

  const question = activity.questions[currentQ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // Questions are no longer played automatically as per user request
  /*
  useEffect(() => {
    const t = setTimeout(() => {
      const isSame = currentQ % 2 === 0;
      const speakFn = isSame ? speak : speakOpposite;
      speakFn(question.question);
    }, 400);
    if (onProgress) onProgress(currentQ);
    return () => clearTimeout(t);
  }, [currentQ]);
  */

  useEffect(() => {
    if (onProgress) onProgress(currentQ);
  }, [currentQ, onProgress]);

  function handleDragEnd({ active, over }) {
    if (!over || over.id !== 'answer-zone' || answer) return;

    const droppedItem = question.options.find(o => o.id === active.id);
    if (!droppedItem) return;

    if (active.id === question.correctId) {
      setAnswer(droppedItem);
      setFeedback('correct');
      speak(isAr ? 'أحسنت!' : 'Bravo !');
      
      const nextProgress = currentQ + 1;
      if (onProgress) onProgress(nextProgress);

      setTimeout(() => {
        if (currentQ < activity.questions.length - 1) {
          setCurrentQ(q => q + 1);
          setAnswer(null);
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback('error');
      speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
      setTimeout(() => setFeedback(null), 600);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="drag-image-zone-container">
        {/* Row 1: The Question Bubble */}
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="question-bubble-card"
        >
          <p className="question-text-big">{question.question}</p>
          <button
            onClick={() => {
              speak(question.question);
            }}
            className="speaker-btn-frosted"
          >🔊</button>
        </motion.div>

        {/* Row 2: Options */}
        <div className="options-flex-row">
          {question.options.map(item => (
            <DraggableOption key={item.id} item={item} isDragging={activeId === item.id} />
          ))}
        </div>

        {/* Row 3: Drop Zone */}
        <AnswerDropZone filled={!!answer} filledItem={answer} />

        <p className="interaction-tip">
          {isAr ? 'اسحب الشكل الصحيح للمربع' : 'Glisse la bonne forme vers la zone'}
        </p>
      </div>
    </DndContext>
  );
}
