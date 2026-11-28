import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import ErrorPage from './error';
import { errorRoute } from './error.route';

describe('Error routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), provideRouter(errorRoute, withComponentInputBinding())],
    });
  });

  // The message is the key, or the text a build without translation writes: compared between routes.
  const notFoundMessage = async (harness: RouterTestingHarness): Promise<string | undefined> =>
    (await harness.navigateByUrl('/404', ErrorPage)).errorMessage();

  const alertText = (harness: RouterTestingHarness): string | undefined =>
    harness.routeNativeElement?.querySelector('.alert-danger')?.textContent.trim();

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

  it('should not show a message given in the query params', async () => {
    const harness = await RouterTestingHarness.create();

    const errorPage = await harness.navigateByUrl('/error?errorMessage=error.http.403', ErrorPage);

    expect(errorPage.errorMessage()).toBeFalsy();
    expect(harness.routeNativeElement?.querySelector('.alert-danger')).toBeNull();
  });

  it('should translate the message again when the language changes', async () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', { error: { http: { 403: 'Access denied' } } });
    translateService.setTranslation('en-test', { error: { http: { 403: 'Forbidden' } } });
    await firstValueFrom(translateService.use('en'));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/accessdenied', ErrorPage);
    expect(alertText(harness)).toBe('Access denied');

    await firstValueFrom(translateService.use('en-test'));
    await harness.fixture.whenStable();

    expect(alertText(harness)).toBe('Forbidden');
  });
});
