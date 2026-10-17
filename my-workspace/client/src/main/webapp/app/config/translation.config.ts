import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { loadLocale } from 'i18n';
import { Observable, from } from 'rxjs';

export const translationNotFoundMessage = 'translation-not-found';

export class MissingTranslationHandlerImpl implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    const { key } = params;
    return `${translationNotFoundMessage}[${key}]`;
  }
}

export function translatePartialLoader(): TranslateLoader {
  return {
    getTranslation(lang: string): Observable<TranslationObject> {
      return from(loadLocale(lang as Parameters<typeof loadLocale>[0]));
    },
  };
}

export function missingTranslationHandler(): MissingTranslationHandler {
  return new MissingTranslationHandlerImpl();
}
