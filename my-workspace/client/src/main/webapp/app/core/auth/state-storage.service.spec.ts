import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { StateStorageService } from './state-storage.service';

describe('StateStorageService', () => {
  let service: StateStorageService;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    service = TestBed.inject(StateStorageService);
  });

  it('should store and clear the url', () => {
    expect(service.getUrl()).toBeNull();

    service.storeUrl('/foo');
    expect(service.getUrl()).toBe('/foo');

    service.clearUrl();
    expect(service.getUrl()).toBeNull();
  });

  it('should store and clear the locale', () => {
    service.storeLocale('fr');
    expect(service.getLocale()).toBe('fr');

    service.clearLocale();
    expect(service.getLocale()).toBeNull();
  });
});
