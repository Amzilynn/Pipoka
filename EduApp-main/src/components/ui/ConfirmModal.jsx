import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Button from './Button';

export default function ConfirmModal({ message, onConfirm, onCancel, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-10 shadow-[var(--shadow-lg)] max-w-sm w-full text-center border-4 border-white"
          >

            <p className="text-2xl font-black text-[var(--color-text)] mb-8 leading-tight">{message}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={onCancel} size="sm">✕</Button>
              <Button variant="primary" onClick={onConfirm} size="sm">✓</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
