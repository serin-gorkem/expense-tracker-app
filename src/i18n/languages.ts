// src/i18n/languages.ts

import { LanguageCode } from "./index";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];