import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Play, RotateCcw, Home } from 'lucide-react';
import { soundSystem } from '../../services/soundSystem';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onHome,
}) => {
  const handleRestart = () => {
    soundSystem.playClick();
    onRestart();
  };

  const handleHome = () => {
    soundSystem.playClick();
    onHome();
  };

  return (
    <Modal isOpen={isOpen} onClose={onResume} title="Game Paused" maxWidth="max-w-xs">
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onResume}
          icon={<Play className="w-5 h-5 fill-white stroke-none" />}
        >
          Resume
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleRestart}
          icon={<RotateCcw className="w-5 h-5" />}
        >
          Restart
        </Button>
        <Button
          variant="ghost"
          size="md"
          fullWidth
          onClick={handleHome}
          icon={<Home className="w-5 h-5" />}
        >
          Quit to Home
        </Button>
      </div>
    </Modal>
  );
};
