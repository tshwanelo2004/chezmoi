import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "fr" | "nl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "welcome": "Bienvenue chez ChezMoi",
    "find_chef": "Trouvez votre chef",
    "become_chef": "Devenir chef",
    "how_it_works": "Comment ça marche",
    "about": "À propos",
    "login": "Se connecter",
    "register": "S'inscrire",
    "featured_chefs": "Chefs vedettes",
    "search_placeholder": "Cherchez par ville, spécialité...",
    "loading": "Chargement...",
    "error": "Erreur",
  },
  nl: {
    "welcome": "Welkom bij ChezMoi",
    "find_chef": "Vind je chef",
    "become_chef": "Word chef",
    "how_it_works": "Hoe het werkt",
    "about": "Over ons",
    "login": "Inloggen",
    "register": "Registreren",
    "featured_chefs": "Uitgelichte chefs",
    "search_placeholder": "Zoek op stad, specialiteit...",
    "loading": "Laden...",
    "error": "Fout",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "nl")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
