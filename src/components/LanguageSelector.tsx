
import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Globe className="w-4 h-4 text-violet-300" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-violet-900/30 border border-violet-700/50 rounded-lg px-3 py-1 text-sm text-violet-200 focus:outline-none focus:border-violet-500 transition-colors"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-violet-900 text-violet-200">
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
