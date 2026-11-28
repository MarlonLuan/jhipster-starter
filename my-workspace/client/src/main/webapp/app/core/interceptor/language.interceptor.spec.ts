import { beforeEach, describe, expect, it } from 'vitest';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';

import { StateStorageService } from 'app/core/auth';

import { languageInterceptor } from './language.interceptor';

describe('languageInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([languageInterceptor])), provideHttpClientTesting(), provideTranslateService()],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should send the language of the application', () => {
    http.get('api/foos').subscribe();
    expect(httpMock.expectOne('api/foos').request.headers.get('Accept-Language')).toBe('en');
  });

  it('should send the language stored by the application before it is in use', () => {
    TestBed.inject(StateStorageService).storeLocale('yy');
    http.get('api/foos').subscribe();
    expect(httpMock.expectOne('api/foos').request.headers.get('Accept-Language')).toBe('yy');
    TestBed.inject(StateStorageService).clearLocale();
  });

  it('should send the language chosen in the application', () => {
    TestBed.inject(TranslateService).use('xx');
    http.get('api/foos').subscribe();
    expect(httpMock.expectOne('api/foos').request.headers.get('Accept-Language')).toBe('xx');
  });
});
