import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface LanguageOption {
  code: string;
  label: string;
}

export interface LanguageSwitcherProps {
  value: string;
  onChange: (code: string) => void;
  languages?: LanguageOption[];
  className?: string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

export function LanguageSwitcher({
  value,
  onChange,
  languages = DEFAULT_LANGUAGES,
  className,
}: LanguageSwitcherProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("h-8 w-auto gap-1.5 text-xs", className)}>
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
