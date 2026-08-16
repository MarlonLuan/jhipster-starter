import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Logout } from 'app/login/logout.model';
import { ApplicationConfigService } from '../config/application-config.service';

@Service()
export class AuthServerProvider {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  logout(): Observable<Logout> {
    return this.http.post<Logout>(this.applicationConfigService.getEndpointFor('api/logout'), {});
  }
}
