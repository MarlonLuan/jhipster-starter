import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  const profileInfoOf = (response: object): unknown => {
    let profileInfo: unknown;
    service.getProfileInfo().subscribe(value => (profileInfo = value));
    httpMock.expectOne({ method: 'GET' }).flush(response);
    return profileInfo;
  };

  it('should tell the profiles and the environment of the ribbon', () => {
    const profileInfo = profileInfoOf({ activeProfiles: ['dev', 'api-docs'], 'display-ribbon-on-profiles': 'dev' });

    expect(profileInfo).toEqual({ activeProfiles: ['dev', 'api-docs'], inProduction: false, openAPIEnabled: true, ribbonEnv: 'dev' });
  });

  it('should not tell an environment that is not active', () => {
    const profileInfo = profileInfoOf({ activeProfiles: ['prod'], 'display-ribbon-on-profiles': 'dev' });

    expect(profileInfo).toEqual({ activeProfiles: ['prod'], inProduction: true, openAPIEnabled: false });
  });

  it('should accept a response without profiles', () => {
    expect(profileInfoOf({})).toEqual({ activeProfiles: undefined, inProduction: undefined, openAPIEnabled: undefined });
  });

  it('should request the profiles once', () => {
    profileInfoOf({});

    service.getProfileInfo().subscribe();

    expect(httpMock.match({ method: 'GET' })).toHaveLength(0);
  });
});
