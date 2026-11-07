/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { TranslationObject } from '@ngx-translate/core';

const angularLanguages = {
  en: async (): Promise<void> => import('@angular/common/locales/en'),
  'pt-br': async (): Promise<void> => import('@angular/common/locales/pt'),
  // jhipster-needle-i18n-language-angular-loader - JHipster will add languages in this object
};

const languagesData = {
  en: async (): Promise<any> => import('i18n/en.json'),
  'pt-br': async (): Promise<any> => import('i18n/pt-br.json'),
  // jhipster-needle-i18n-language-loader - JHipster will add languages in this object
};

export const loadLocale = (locale: keyof typeof angularLanguages): Promise<TranslationObject> => {
  angularLanguages[locale]();
  return languagesData[locale]();
};
