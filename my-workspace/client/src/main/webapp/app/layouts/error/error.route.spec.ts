import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import ErrorPage from './error';
import { errorRoute } from './error.route';

describe('Error routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), provideRouter(errorRoute)],
    });
  });

  // The message is the key, its translation, or the text a build without translation writes: compared between routes.
  const notFoundMessage = async (harness: RouterTestingHarness): Promise<string | undefined> =>
    (await harness.navigateByUrl('/404', ErrorPage)).errorMessage();

  it('should show at an unknown url the not found error of /404', async () => {
    const harness = await RouterTestingHarness.create();
    const notFound = await notFoundMessage(harness);

    const errorPage = await harness.navigateByUrl('/unknown/page', ErrorPage);

    expect(TestBed.inject(Router).url).toBe('/unknown/page');
    expect(notFound).toBeTruthy();
    expect(errorPage.errorMessage()).toBe(notFound);
  });

  it('should show the access denied error', async () => {
    const harness = await RouterTestingHarness.create();
    const notFound = await notFoundMessage(harness);

    const errorPage = await harness.navigateByUrl('/accessdenied', ErrorPage);

    expect(errorPage.errorMessage()).toBeTruthy();
    expect(errorPage.errorMessage()).not.toBe(notFound);
  });

  it('should show no message on the error page', async () => {
    const harness = await RouterTestingHarness.create();

    const errorPage = await harness.navigateByUrl('/error', ErrorPage);

    expect(errorPage.errorMessage()).toBeFalsy();
    expect(harness.routeNativeElement?.querySelector('.alert-danger')).toBeNull();
  });

  it('should translate the message again when the language changes, until the page is left', async () => {
    const harness = await RouterTestingHarness.create();
    const errorPage = await harness.navigateByUrl('/accessdenied', ErrorPage);
    const translateService = TestBed.inject(TranslateService);
    const get = vi.spyOn(translateService, 'get');
    const { errorKey } = errorPage;
    const translationsOfTheError = (): number => get.mock.calls.filter(([key]) => key === errorKey).length;

    await firstValueFrom(translateService.use('en-test'));
    expect(translationsOfTheError()).toBe(1);

    await harness.navigateByUrl('/error', ErrorPage);
    await firstValueFrom(translateService.use('en'));
    expect(translationsOfTheError()).toBe(1);
  });
});
