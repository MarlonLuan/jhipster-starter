import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AlertModel, AlertService } from 'app/core/util/alert.service';
import Home from 'app/home/home';
import { LoginService } from 'app/login/login.service';
import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';

import Navbar from './navbar/navbar';
import PageRibbon from './profiles/page-ribbon';
import { ProfileService } from './profiles/profile.service';

const account: Account = {
  activated: true,
  authorities: ['ROLE_ADMIN'],
  email: 'admin@localhost',
  firstName: 'first',
  langKey: 'en',
  lastName: 'last',
  login: 'admin',
  imageUrl: null,
};

const clickAll = async (fixture: ComponentFixture<unknown>, selector: string): Promise<void> => {
  const elements: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(selector);
  for (const element of elements) {
    element.click();
    await fixture.whenStable();
  }
};

describe('Layout screens', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), provideHttpClientTesting(), provideRouter([{ path: '**', children: [] }])],
    });
    TestBed.inject(FaIconLibrary).addIconPacks(fas);
  });

  describe('navbar', () => {
    const render = async (identity: Account | null): Promise<ComponentFixture<Navbar>> => {
      TestBed.inject(AccountService).authenticate(identity);
      vi.spyOn(TestBed.inject(ProfileService), 'getProfileInfo').mockReturnValue(of({ inProduction: false, openAPIEnabled: true }));
      vi.spyOn(TestBed.inject(LoginService), 'logout').mockImplementation(() => undefined);
      const fixture = TestBed.createComponent(Navbar);
      await fixture.whenStable();
      return fixture;
    };

    it('should show the menus of an administrator and accept their links', async () => {
      const fixture = await render(account);

      await clickAll(fixture, 'a, button');

      expect(TestBed.inject(LoginService).logout).toHaveBeenCalled();
    });

    it('should change the language', async () => {
      TestBed.inject(AccountService).authenticate(null);
      vi.spyOn(TestBed.inject(ProfileService), 'getProfileInfo').mockReturnValue(of({}));
      const translateService = TestBed.inject(TranslateService);
      const use = vi.spyOn(translateService, 'use');
      const fixture = TestBed.createComponent(Navbar);
      Object.assign(fixture.componentInstance, { languages: ['en', 'en'] });
      await fixture.whenStable();

      await clickAll(fixture, '[data-cy="navbar"] a, a.dropdown-item');
      translateService.use('en');
      await fixture.whenStable();

      expect(use).toHaveBeenCalledWith('en');
    });

    it('should show the picture of the account', async () => {
      const fixture = await render({ ...account, imageUrl: 'http://localhost/image.png' });

      expect(fixture.nativeElement.querySelector('img')).not.toBeNull();
    });

    it('should show the login to an anonymous user', async () => {
      const fixture = await render(null);

      await clickAll(fixture, '#login');

      expect(fixture.nativeElement.querySelector('#login')).not.toBeNull();
    });
  });

  describe('home', () => {
    it('should show the account', async () => {
      TestBed.inject(AccountService).authenticate(account);
      const fixture = TestBed.createComponent(Home);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('.alert-success')).not.toBeNull();
    });

    it('should invite to log in', async () => {
      TestBed.inject(AccountService).authenticate(null);
      const fixture = TestBed.createComponent(Home);
      await fixture.whenStable();

      await clickAll(fixture, 'a.alert-link');

      expect(fixture.nativeElement.querySelector('.alert-success')).toBeNull();
    });
  });

  describe('alerts', () => {
    const alert: AlertModel = { id: 0, type: 'danger', message: 'failed', position: 'top right', toast: true, close: vi.fn() };

    it('should show and close the alerts', async () => {
      const fixture = TestBed.createComponent(AlertError);
      fixture.componentInstance.alerts.set([alert, { ...alert, message: undefined, position: undefined }]);
      await fixture.whenStable();

      fixture.debugElement.query(By.css('ngb-alert')).triggerEventHandler('closed');

      expect(alert.close).toHaveBeenCalled();
    });

    it('should show and close the alerts of the service', async () => {
      TestBed.inject(AlertService).addAlert({ ...alert, timeout: 0 });
      const fixture = TestBed.createComponent(Alert);
      await fixture.whenStable();

      fixture.debugElement.query(By.css('ngb-alert')).triggerEventHandler('closed');

      expect(fixture.nativeElement.querySelector('.alerts')).not.toBeNull();
    });
  });

  describe('ribbon', () => {
    it('should show the environment', async () => {
      vi.spyOn(TestBed.inject(ProfileService), 'getProfileInfo').mockReturnValue(of({ ribbonEnv: 'dev' }));
      const fixture = TestBed.createComponent(PageRibbon);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('.ribbon')).not.toBeNull();
    });

    it('should show nothing when the profile is unknown', async () => {
      vi.spyOn(TestBed.inject(ProfileService), 'getProfileInfo').mockReturnValue(throwError(() => new Error('failed')));
      const fixture = TestBed.createComponent(PageRibbon);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('.ribbon')).toBeNull();
    });
  });
});
