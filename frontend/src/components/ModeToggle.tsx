import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

interface ModeToggleProps {
  mode: string;
  onToggle: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <Button
      onClick={onToggle}
      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      <Image
        src={mode === 'text' ? '/file.svg' : '/window.svg'}
        alt={`Switch to ${mode === 'text' ? 'image' : 'text'} mode`}
        width={20}
        height={20}
      />
      {mode === 'text' ? 'Text Mode' : 'Image Mode'}
    </Button>
  );
}; 