import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EventManager } from 'app/core/util';

import { errorHandlerInterceptor } from './error-handler.interceptor';

describe('errorHandlerInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let broadcast: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([errorHandlerInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    broadcast = vi.spyOn(TestBed.inject(EventManager), 'broadcast');
  });

  it('should broadcast an error of the server', () => {
    http.get('api/foos').subscribe({ error: () => undefined });
    httpMock.expectOne('api/foos').flush(null, { status: 500, statusText: 'Server Error' });

    expect(broadcast).toHaveBeenCalledTimes(1);
  });

  it('should not broadcast a 401, which leaves for the login', () => {
    http.get('api/foos').subscribe({ error: () => undefined });
    httpMock.expectOne('api/foos').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(broadcast).not.toHaveBeenCalled();
  });
});
