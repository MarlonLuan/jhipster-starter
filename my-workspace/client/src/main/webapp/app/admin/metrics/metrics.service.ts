import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, forkJoin, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { metricsEndpoints, toMetrics } from 'app/shared/jhipster/metrics';
import { MetricsSection } from 'app/shared/jhipster/metrics.model';

@Service()
export class MetricsService {
  private readonly http = inject(HttpClient);

  getMetrics(): Observable<MetricsSection[]> {
    return forkJoin(metricsEndpoints.map(endpoint => this.http.get(`${serverApiUrl}${endpoint}`))).pipe(map(toMetrics));
  }
}
