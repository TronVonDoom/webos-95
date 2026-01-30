// ============================================================================
// Windows 95-style Message Box Component
// ============================================================================

import React from 'react';
import { RetroButton } from './RetroButton';

export type MessageBoxType = 'error' | 'warning' | 'info' | 'question';

interface MessageBoxProps {
  title: string;
  message: string;
  type?: MessageBoxType;
  onClose: () => void;
  buttons?: Array<{
    label: string;
    onClick?: () => void;
    primary?: boolean;
  }>;
}

const ICON_BASE = 'https://win98icons.alexmeub.com/icons/png';

const TYPE_ICONS: Record<MessageBoxType, string> = {
  error: `${ICON_BASE}/msg_error-0.png`,
  warning: `${ICON_BASE}/msg_warning-0.png`,
  info: `${ICON_BASE}/msg_information-0.png`,
  question: `${ICON_BASE}/msg_question-0.png`,
};

export const MessageBox: React.FC<MessageBoxProps> = ({
  title,
  message,
  type = 'error',
  onClose,
  buttons = [{ label: 'OK', onClick: onClose, primary: true }],
}) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      {/* Dialog */}
      <div className="relative bg-[#c0c0c0] bevel-out shadow-2xl min-w-[300px] max-w-[450px]">
        {/* Title Bar */}
        <div className="title-bar-active px-2 py-1 flex items-center justify-between">
          <span className="text-white text-sm font-bold">{title}</span>
          <button 
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] bevel-out flex items-center justify-center text-xs font-bold hover:bg-[#d4d4d4] active:bevel-in"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 flex gap-4">
          {/* Icon */}
          <img 
            src={TYPE_ICONS[type]} 
            alt={type} 
            className="w-8 h-8 flex-shrink-0"
          />
          
          {/* Message */}
          <p className="text-sm whitespace-pre-line flex-1 pt-1">
            {message}
          </p>
        </div>
        
        {/* Buttons */}
        <div className="px-4 pb-4 flex justify-center gap-2">
          {buttons.map((button, index) => (
            <RetroButton
              key={index}
              onClick={() => {
                button.onClick?.();
                onClose();
              }}
              className="min-w-[75px]"
              autoFocus={button.primary}
            >
              {button.label}
            </RetroButton>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hook for easy message box usage
interface MessageBoxState {
  isOpen: boolean;
  title: string;
  message: string;
  type: MessageBoxType;
  buttons?: MessageBoxProps['buttons'];
}

interface ShowMessageOptions {
  title: string;
  message: string;
  type?: MessageBoxType;
  buttons?: MessageBoxProps['buttons'];
}

export const useMessageBox = () => {
  const [state, setState] = React.useState<MessageBoxState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showMessage = React.useCallback((options: ShowMessageOptions) => {
    setState({ 
      isOpen: true, 
      title: options.title, 
      message: options.message, 
      type: options.type || 'error', 
      buttons: options.buttons 
    });
  }, []);

  const closeMessage = React.useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const MessageBoxComponent = state.isOpen ? (
    <MessageBox
      title={state.title}
      message={state.message}
      type={state.type}
      buttons={state.buttons}
      onClose={closeMessage}
    />
  ) : null;

  return { showMessage, closeMessage, MessageBoxComponent };
};
