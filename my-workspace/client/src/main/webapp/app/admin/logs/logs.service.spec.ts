import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { loggersResponse } from 'app/shared/jhipster/admin.samples';
import { toLevelChange, toLogs } from 'app/shared/jhipster/logs';

import { LogsService } from './logs.service';

describe('Logs Service', () => {
  let service: LogsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(LogsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should change log level', () => {
      service.changeLevel('main', 'ERROR').subscribe();

      const req = httpMock.expectOne({ method: 'POST' });
      expect(req.request.body).toEqual(toLevelChange('main', 'ERROR').body);
    });

    it('should find all the loggers', () => {
      let loggers: unknown;
      service.findAll().subscribe(result => (loggers = result));

      httpMock.expectOne({ method: 'GET' }).flush(loggersResponse);
      expect(loggers).toEqual(toLogs(loggersResponse));
    });
  });
});
