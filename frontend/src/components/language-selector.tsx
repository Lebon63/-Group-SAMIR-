import * as React from 'react';
import { Check, ChevronsUpDown, Globe, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, Language } from '@/types';
import { Badge } from '@/components/ui/badge';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = React.useState(false);

  const currentLanguage = languages.find(l => l.id === language) || languages[0];
  
  // Group languages by region (international vs local)
  const internationalLanguages = languages.filter(lang => 
    ['english', 'french'].includes(lang.id));
  const localLanguages = languages.filter(lang => 
    !['english', 'french'].includes(lang.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto min-w-[140px] justify-between bg-white/90 text-blue-800 border border-blue-200 hover:bg-blue-50 hover:text-blue-900 shadow-sm rounded-lg transition-all"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{currentLanguage.nativeName}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-1 shadow-lg border-blue-100 rounded-lg" align="end">
        <Command className="rounded-md border-none">
          <CommandInput 
            placeholder="Search languages..." 
            className="text-sm" 
          />
          <CommandEmpty className="py-2 text-sm text-center text-gray-500">
            No language found
          </CommandEmpty>
          
          <CommandGroup heading="International" className="pb-1">
            {internationalLanguages.map((lang) => (
              <CommandItem
                key={lang.id}
                onSelect={() => {
                  setLanguage(lang.id as Language);
                  setOpen(false);
                }}
                className="text-sm cursor-pointer aria-selected:bg-blue-50 aria-selected:text-blue-900"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        language === lang.id 
                          ? "text-orange-500 opacity-100" 
                          : "opacity-0"
                      )}
                    />
                    <span>{lang.nativeName}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-2 text-[10px] py-0 h-5 font-normal border",
                      language === lang.id
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    )}
                  >
                    {lang.name}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Local" className="pb-1 border-t pt-1">
            {localLanguages.map((lang) => (
              <CommandItem
                key={lang.id}
                onSelect={() => {
                  setLanguage(lang.id as Language);
                  setOpen(false);
                }}
                className="text-sm cursor-pointer aria-selected:bg-blue-50 aria-selected:text-blue-900"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        language === lang.id 
                          ? "text-orange-500 opacity-100" 
                          : "opacity-0"
                      )}
                    />
                    <span>{lang.nativeName}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-2 text-[10px] py-0 h-5 font-normal border",
                      language === lang.id
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {lang.name}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}