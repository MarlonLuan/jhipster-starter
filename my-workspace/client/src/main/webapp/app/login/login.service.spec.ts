import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Location } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    window.location.hash = '';
  });

  it('should go to the authorization of the provider on login', () => {
    vi.spyOn(TestBed.inject(Location), 'prepareExternalUrl').mockReturnValue('#oidc');

    service.login();

    expect(window.location.hash).toBe('#oidc');
  });

  it('should go to the logout url the server gives', () => {
    service.logout();

    httpMock.expectOne({ method: 'POST' }).flush({ logoutUrl: '#logout' });
    expect(window.location.hash).toBe('#logout');
  });
});
