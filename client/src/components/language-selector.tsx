import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Languages, ChevronDownIcon } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "ka", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current language
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Handle language change
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Languages className="h-4 w-4 text-yellow-300" />
        <span>{currentLanguage.label.split(' ')[0]}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-10 w-40 border border-indigo-100 dark:border-indigo-900">
          <ul className="py-1">
            {languages.map((language) => (
              <li
                key={language.code}
                className="flex items-center px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer transition-colors duration-150"
                onClick={() => changeLanguage(language.code)}
              >
                <span className="mr-2 text-lg">{language.flag}</span>
                <span className="text-sm">{language.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
