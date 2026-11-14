import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { metricsResponses } from 'app/shared/jhipster/admin.samples';
import { metricsEndpoints, toMetrics } from 'app/shared/jhipster/metrics';

import { MetricsService } from './metrics.service';

describe('Metrics Service', () => {
  let service: MetricsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(MetricsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return the sections of the responses of the endpoints', () => {
    let expectedResult;

    service.getMetrics().subscribe(received => {
      expectedResult = received;
    });

    metricsEndpoints.forEach((endpoint, index) => {
      httpMock.expectOne(req => req.url.endsWith(endpoint)).flush(metricsResponses[index] as object);
    });
    expect(expectedResult).toEqual(toMetrics(metricsResponses));
  });
});
