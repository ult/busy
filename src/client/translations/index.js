import _ from 'lodash';

const data = [
  {
    id: 'en-US',
    name: 'English',
    nativeName: 'English',
    variants: ['en', 'en-US'],
    rtl: false,
    localeData: 'en',
    translations: 'en-US.json',
  },
  {
    id: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    variants: ['ar', 'ar-SA'],
    rtl: true,
    localeData: 'ar',
    translations: 'ar-SA.json',
  },
  {
    id: 'pl-PL',
    name: 'Polish',
    nativeName: 'Polski',
    variants: ['pl', 'pl-PL'],
    rtl: false,
    localeData: 'pl',
    translations: 'pl-PL.json',
  },
  {
    id: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    variants: ['fr', 'fr-FR'],
    rtl: false,
    localeData: 'fr',
    translations: 'fr-FR.json',
  },
];

// export const availableLocalesToReactIntl = {
//   'af-ZA': '',
//   'ar-SA': 'ar',
//   'as-IN': 'as',
//   'bg-BG': 'bg',
//   'bn-BD': '',
//   'bn-IN': 'bn',
//   'bs-BA': '',
//   'ca-ES': 'ca',
//   'cs-CZ': 'cs',
//   'da-DK': 'da',
//   'de-DE': 'de',
//   'el-GR': 'el',
//   'en-US': 'en',
//   'eo-UY': '',
//   'es-ES': 'es',
//   'et-EE': 'et',
//   'fi-FI': '',
//   'fil-PH': 'fil',
//   'fr-FR': 'fr',
//   'ha-HG': '',
//   'he-IL': 'he',
//   'hi-IN': 'hi',
//   'hr-HR': 'hr',
//   'hu-HU': 'hu',
//   'id-ID': 'id',
//   'ig-NG': '',
//   'it-IT': 'it',
//   'ja-JP': 'ja',
//   'ko-KR': 'ko',
//   'lo-LA': 'lo',
//   'ms-MY': 'ms',
//   'ne-NP': 'np',
//   'nl-NL': 'nl',
//   'no-NO': 'no',
//   'or-IN': '',
//   'pcm-NG': '',
//   'pl-PL': 'pl',
//   'pt-BR': 'pt',
//   'pt-PT': '',
//   'ro-RO': 'ro',
//   'ru-RU': 'ru',
//   'sk-SK': '',
//   'sl-SI': 'sl',
//   'sr-SP': '',
//   'sv-SE': 'sv',
//   'ta-IN': 'ta',
//   'th-TH': 'th',
//   'tr-TR': 'tr',
//   'tt-RU': '',
//   'uk-UA': 'uk',
//   'vi-VN': 'vi',
//   'vls-BE': '',
//   'yo-NG': 'yo',
//   'zh-CN': 'zh',
//   'zh-TW': 'zh',
// };

// export const defaultLocales = {
//   af: 'af-ZA',
//   ar: 'ar-SA',
//   as: 'as-IN',
//   bg: 'bg-BG',
//   bn: 'bn-IN',
//   bs: 'bs-BA',
//   ca: 'ca-ES',
//   cs: 'cs-CZ',
//   da: 'da-DK',
//   de: 'de-DE',
//   el: 'el-GR',
//   en: 'en-US',
//   eo: 'eo-UY',
//   es: 'es-ES',
//   et: 'et-EE',
//   fi: 'fi-FI',
//   fil: 'fil-PH',
//   fr: 'fr-FR',
//   ha: 'ha-HG',
//   he: 'he-IL',
//   hi: 'hi-IN',
//   hr: 'hr-HR',
//   hu: 'hu-HU',
//   id: 'id-ID',
//   ig: 'ig-NG',
//   it: 'it-IT',
//   ja: 'ja-JP',
//   ko: 'ko-KR',
//   lo: 'lo-LA',
//   ms: 'ms-MY',
//   ne: 'ne-NP',
//   nl: 'nl-NL',
//   no: 'no-NO',
//   or: 'or-IN',
//   pcm: 'pcm-NG',
//   pl: 'pl-PL',
//   pt: 'pt-PT',
//   ro: 'ro-RO',
//   ru: 'ru-RU',
//   sk: 'sk-SK',
//   sl: 'sl-SL',
//   sr: 'sr-SP',
//   sv: 'sv-SE',
//   ta: 'ta-IN',
//   th: 'th-TH',
//   tr: 'tr-TR',
//   tt: 'tt-RU',
//   uk: 'uk-UA',
//   vi: 'vi-VN',
//   vls: 'vls-BE',
//   yo: 'yo-NG',
//   zh: 'zh-CN',
// };

export const rtlLocales = ['he', 'ar', 'far', 'yi', 'ku', 'ur', 'dv', 'ha', 'ps'];

export function findLanguage(locale) {
  return data.find(language => language.variants.indexOf(locale) !== -1);
}

export const getBrowserLocale = () => {
  let detectedLocale;
  if (typeof navigator !== 'undefined') {
    detectedLocale =
      navigator.userLanguage ||
      navigator.language ||
      (navigator.languages && navigator.languages[0] ? navigator.languages[0] : undefined);
  }
  if (detectedLocale) {
    return detectedLocale.slice(0, 2);
  }
  return undefined;
};

export const getLocaleDirection = locale => (rtlLocales.includes(locale) ? 'rtl' : 'ltr');

// export const getAvailableLocale = appLocale => {
//   const locale = appLocale || 'auto';

//   if (appLocale === 'auto') {
//     return getBrowserLocale() || 'en';
//   }

//   return _.get(availableLocalesToReactIntl, locale, 'en');
// };

// export const getTranslationsByLocale = appLocale => {
//   const allTranslations = _.keys(availableLocalesToReactIntl);

//   if (appLocale === 'auto') {
//     const browserLocale = getBrowserLocale();
//     return _.findKey(availableLocalesToReactIntl, locale => locale === browserLocale) || 'default';
//   }

//   return _.get(allTranslations, _.indexOf(allTranslations, appLocale), 'default');
// };
