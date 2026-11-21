import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configurationResponses } from 'app/shared/jhipster/admin.samples';
import { configurationEndpoints, toConfiguration } from 'app/shared/jhipster/configuration';
import { ConfigurationSection } from 'app/shared/jhipster/configuration.model';

import { ConfigurationService } from './configuration.service';

describe('Configuration Service', () => {
  let service: ConfigurationService;
  let httpMock: HttpTestingController;
  let expectedResult: ConfigurationSection[] | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    expectedResult = null;
    service = TestBed.inject(ConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should get the configuration', () => {
      service.getConfiguration().subscribe(received => (expectedResult = received));

      configurationEndpoints.forEach((endpoint, index) => {
        httpMock.expectOne(req => req.url.endsWith(endpoint)).flush(configurationResponses[index] as object);
      });
      expect(expectedResult).toEqual(toConfiguration(configurationResponses));
    });
  });
});
