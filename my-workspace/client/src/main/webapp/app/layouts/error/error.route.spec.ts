import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { provideTranslateService } from '@ngx-translate/core';

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
});
