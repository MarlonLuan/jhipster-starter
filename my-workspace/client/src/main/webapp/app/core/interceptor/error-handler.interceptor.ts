import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { tap } from 'rxjs';

import { EventManager, EventWithContent } from 'app/core/util';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const eventManager = inject(EventManager);

  return next(req).pipe(
    tap({
      error(err: HttpErrorResponse) {
        // A 401 leaves for the login, which tells why.
        if (err.status !== 401) {
          eventManager.broadcast(new EventWithContent('jhipsterApp.httpError', err));
        }
      },
    }),
  );
};
