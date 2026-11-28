import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { StateStorageService } from 'app/core/auth';

/**
 * Sends the language of the application, the one the server answers in.
 */
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const language = inject(TranslateService).getCurrentLang() ?? inject(StateStorageService).getLocale() ?? 'en';
  return next(req.clone({ setHeaders: { 'Accept-Language': language } }));
};
