import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { HealthModel } from './health.model';

@Service()
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  checkHealth(): Observable<HealthModel> {
    return this.http.get<HealthModel>(this.applicationConfigService.getEndpointFor('management/health'));
  }
}
