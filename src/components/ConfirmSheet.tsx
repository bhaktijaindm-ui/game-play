import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

export interface ConfirmSheetProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
  loading?: boolean;
}

export function ConfirmSheet({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
}: ConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-6 text-center">
        <p className="text-[var(--text-muted)] text-base leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            variant={variant === 'danger' ? 'primary' : 'primary'}
            size="lg"
            fullWidth
            loading={loading}
            onClick={onConfirm}
            className={variant === 'danger' ? '!bg-gradient-to-r !from-rose-600 !to-red-500' : ''}
          >
            {confirmText}
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
