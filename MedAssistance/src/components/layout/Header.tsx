import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Language } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const { currentLanguage, setLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-1.5 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l.5-1 2 4 .5-1h6.7" />
              </svg>
            </div>
            <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500 text-transparent bg-clip-text">
              MedAssist
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/new-chat" className="flex items-center gap-1">
              <MessageSquarePlus className="h-4 w-4" />
              <span>{t.newChatButton}</span>
            </Link>
          </Button>

          <Select onValueChange={handleLanguageChange} defaultValue={currentLanguage}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.languageSelector} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="french">Français</SelectItem>
              <SelectItem value="fufulde">Fulfulde</SelectItem>
              <SelectItem value="ewondo">Ewondo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}