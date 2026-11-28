import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { loggersEndpoint, toLevelChange, toLogs } from 'app/shared/jhipster/logs';
import { Level, Log } from 'app/shared/jhipster/logs.model';

@Service()
export class LogsService {
  private readonly http = inject(HttpClient);

  changeLevel(name: string, level: Level): Observable<{}> {
    const { url, body } = toLevelChange(name, level);
    return this.http.post(`${serverApiUrl}${url}`, body);
  }

  findAll(): Observable<Log[]> {
    return this.http.get(`${serverApiUrl}${loggersEndpoint}`).pipe(map(toLogs));
  }
}
