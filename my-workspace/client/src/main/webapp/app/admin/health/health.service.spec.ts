import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverApiUrl } from 'app/config';
import { healthResponse } from 'app/shared/jhipster/admin.samples';
import { healthEndpoint, toHealthChecks } from 'app/shared/jhipster/health';

import { HealthService } from './health.service';

describe('HealthService Service', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call the health endpoint', () => {
      // GIVEN
      let expectedResult;

      // WHEN
      service.checkHealth().subscribe(received => {
        expectedResult = received;
      });
      const testRequest = httpMock.expectOne({
        method: 'GET',
        url: `${serverApiUrl}${healthEndpoint}`,
      });
      testRequest.flush(healthResponse);

      // THEN
      expect(expectedResult).toEqual(toHealthChecks(healthResponse));
    });

    it('should give the health of a 503', () => {
      // GIVEN
      let expectedResult;
      const health = healthResponse;

      // WHEN
      service.checkHealth().subscribe(received => {
        expectedResult = received;
      });
      httpMock.expectOne({ method: 'GET' }).flush(health, { status: 503, statusText: 'Service Unavailable' });

      // THEN
      expect(expectedResult).toEqual(toHealthChecks(health));
    });

    it('should propagate another error', () => {
      // GIVEN
      let status;

      // WHEN
      service.checkHealth().subscribe({
        error(error: HttpErrorResponse) {
          status = error.status;
        },
      });
      httpMock.expectOne({ method: 'GET' }).flush({}, { status: 500, statusText: 'Server Error' });

      // THEN
      expect(status).toBe(500);
    });
  });
});
