import React, { useState, useRef, useEffect } from 'react';

interface UpiPinModalProps {
  mode: 'set' | 'enter';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export default function UpiPinModal({ mode, isOpen, onClose, onSubmit, isLoading, error }: UpiPinModalProps) {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const title = mode === 'set' ? 'Set Your Security PIN' : 'Enter Your Security PIN';
  const buttonText = mode === 'set' ? 'Set PIN' : 'Confirm & Pay';

  useEffect(() => {
    if (isOpen) {
      inputsRef.current[0]?.focus();
    } else {
      setPin(['', '', '', '']);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value !== '' && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length === 4 && !isLoading) {
      onSubmit(fullPin);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold bg-[#1C1C1E] text-white border-2 border-gray-600 rounded-md focus:border-purple-500 focus:ring-purple-500 transition"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus={index === 0}
                disabled={isLoading}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-center gap-4 mt-6">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || pin.join('').length !== 4} className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              {/* --- THIS TEXT IS UPDATED --- */}
              {isLoading ? 'Verifying...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}