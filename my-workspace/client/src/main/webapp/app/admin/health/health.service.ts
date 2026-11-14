import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, catchError, map, of, throwError } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { healthEndpoint, toHealthChecks } from 'app/shared/jhipster/health';
import { HealthCheck } from 'app/shared/jhipster/health.model';

@Service()
export class HealthService {
  private readonly http = inject(HttpClient);

  checkHealth(): Observable<HealthCheck[]> {
    return this.http.get<unknown>(`${serverApiUrl}${healthEndpoint}`).pipe(
      // An unhealthy application answers with 503 and its health.
      catchError((error: HttpErrorResponse) => (error.status === 503 ? of<unknown>(error.error) : throwError(() => error))),
      map(toHealthChecks),
    );
  }
}
