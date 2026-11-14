import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, forkJoin, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { configurationEndpoints, toConfiguration } from 'app/shared/jhipster/configuration';
import { ConfigurationSection } from 'app/shared/jhipster/configuration.model';

@Service()
export class ConfigurationService {
  private readonly http = inject(HttpClient);

  getConfiguration(): Observable<ConfigurationSection[]> {
    return forkJoin(configurationEndpoints.map(endpoint => this.http.get(`${serverApiUrl}${endpoint}`))).pipe(map(toConfiguration));
  }
}
