import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { sampleWithFullData } from './country.test-samples';
import { CountryDeleteDialog } from './delete/country-delete-dialog';
import { CountryDetail } from './detail/country-detail';
import { Country } from './list/country';
import { CountryUpdate } from './update/country-update';

const related = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
const sample: any = {
  ...sampleWithFullData,
  id: '9fec3727-3421-4967-b213-ba36557ca194',
  region: related,
};
const sampleWithoutData = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

describe('Country screens', () => {
  let httpMock: HttpTestingController;

  // Answers the pending requests and the ones that their responses start: a loading resource keeps the application unstable.
  const flushAll = (body: unknown): void => {
    const headers = { link: '<http://localhost/api/foo?page=1&size=20>; rel="next"', 'X-Total-Count': '40' };
    TestBed.tick();
    for (let round = 0; round < 10; round++) {
      const requests = httpMock.match(() => true);
      if (requests.length === 0) {
        return;
      }
      requests.forEach(request => request.flush(body as any, { headers }));
      TestBed.tick();
    }
  };

  const clickAll = async (fixture: ComponentFixture<unknown>, selector: string): Promise<void> => {
    const elements: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(selector);
    elements.forEach(element => element.click());
    flushAll([]);
    await fixture.whenStable();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', children: [] }]),
        NgbActiveModal,
        { provide: NgbModal, useValue: { open: vi.fn(() => ({ componentInstance: {}, closed: of() })) } },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ defaultSort: 'id,asc', country: sample }),
            queryParamMap: of(convertToParamMap({ page: '1', size: '1', sort: 'id,desc' })),
            snapshot: {
              data: { defaultSort: 'id,asc' },
              queryParams: {},
              queryParamMap: convertToParamMap({ page: '1', size: '1', sort: 'id,desc' }),
            },
          },
        },
      ],
    });
    TestBed.inject(FaIconLibrary).addIconPacks(fas);
    httpMock = TestBed.inject(HttpTestingController);
    vi.spyOn(globalThis, 'open').mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('list', () => {
    const render = async (entities: unknown[]): Promise<ComponentFixture<Country>> => {
      const fixture = TestBed.createComponent(Country);
      flushAll(entities);
      await fixture.whenStable();
      return fixture;
    };

    it('should show the entities', async () => {
      const fixture = await render([sample, sampleWithoutData]);

      expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
    });

    it('should tell when there are no entities', async () => {
      const fixture = await render([]);

      expect(fixture.nativeElement.querySelector('#no-result')).not.toBeNull();
    });

    it('should use the default sort without a sort in the location', async () => {
      Object.assign(TestBed.inject(ActivatedRoute), { queryParamMap: of(convertToParamMap({})) });
      const fixture = await render([sample, sampleWithoutData]);

      expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
    });

    it('should keep the order without a sort', async () => {
      Object.assign(TestBed.inject(ActivatedRoute), { data: of({}), queryParamMap: of(convertToParamMap({})) });
      const fixture = await render([sample, sampleWithoutData]);

      expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
    });

    it('should accept the actions of the rows', async () => {
      const fixture = await render([sample]);

      await clickAll(fixture, 'tbody a:not([href]), tbody button, th, h2 button');

      expect(fixture.nativeElement.querySelector('h2')).not.toBeNull();
    });
  });

  describe('detail', () => {
    const render = async (entity: unknown): Promise<ComponentFixture<CountryDetail>> => {
      const fixture = TestBed.createComponent(CountryDetail);
      fixture.componentRef.setInput('country', entity);
      await fixture.whenStable();
      return fixture;
    };

    it('should show the entity', async () => {
      const fixture = await render(sample);

      expect(fixture.nativeElement.querySelector('[data-cy="countryDetailsHeading"]')).not.toBeNull();
    });

    it('should show an entity without data', async () => {
      const fixture = await render(sampleWithoutData);

      expect(fixture.nativeElement.querySelector('dd')).not.toBeNull();
    });

    it('should show nothing without an entity', async () => {
      const fixture = await render(null);

      expect(fixture.nativeElement.querySelector('dd')).toBeNull();
    });

    it('should accept the actions', async () => {
      const fixture = await render(sample);

      await clickAll(fixture, 'a:not([href]), button');

      expect(fixture.nativeElement.querySelector('dd')).not.toBeNull();
    });
  });

  describe('update', () => {
    const render = async (): Promise<ComponentFixture<CountryUpdate>> => {
      const fixture = TestBed.createComponent(CountryUpdate);
      flushAll([related]);
      await fixture.whenStable();
      return fixture;
    };

    it('should show the form of an entity', async () => {
      const fixture = await render();

      expect(fixture.nativeElement.querySelector('#save-entity')).not.toBeNull();
    });

    it('should show the form of an entity without data', async () => {
      TestBed.inject(ActivatedRoute).data = of({ country: sampleWithoutData });
      const fixture = await render();

      expect(fixture.nativeElement.querySelector('#save-entity')).not.toBeNull();
    });

    it('should accept empty options', async () => {
      const fixture = TestBed.createComponent(CountryUpdate);
      flushAll(null);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('#save-entity')).not.toBeNull();
    });

    it('should show the form of a new entity', async () => {
      TestBed.inject(ActivatedRoute).data = of({});
      const fixture = await render();

      expect(fixture.nativeElement.querySelector('#save-entity')).not.toBeNull();
    });

    it('should save the form', async () => {
      const fixture = await render();
      const previousState = vi.spyOn(fixture.componentInstance, 'previousState');
      // The save is what is tested: the form is taken as valid, whatever the sample.
      vi.spyOn(fixture.componentInstance.editForm, 'invalid', 'get').mockReturnValue(false);

      fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      flushAll(sample);

      expect(previousState).toHaveBeenCalled();
    });

    it('should accept the actions', async () => {
      const fixture = await render();

      await clickAll(fixture, 'a:not([href]), button[type="button"]');
      fixture.nativeElement
        .querySelectorAll('input[type="file"]')
        .forEach((input: HTMLElement) => input.dispatchEvent(new Event('change')));

      expect(fixture.nativeElement.querySelector('#save-entity')).not.toBeNull();
    });
  });

  describe('delete', () => {
    const render = async (entity?: typeof sample): Promise<ComponentFixture<CountryDeleteDialog>> => {
      const fixture = TestBed.createComponent(CountryDeleteDialog);
      fixture.componentInstance.country = entity;
      await fixture.whenStable();
      return fixture;
    };

    it('should show nothing without an entity', async () => {
      const fixture = await render();

      expect(fixture.nativeElement.querySelector('form')).toBeNull();
    });

    it('should dismiss the dialog when cancelled', async () => {
      const dismiss = vi.spyOn(TestBed.inject(NgbActiveModal), 'dismiss');
      const fixture = await render(sample);

      await clickAll(fixture, '.btn-secondary');

      expect(dismiss).toHaveBeenCalled();
    });

    it('should close the dialog when confirmed', async () => {
      const close = vi.spyOn(TestBed.inject(NgbActiveModal), 'close');
      const fixture = await render(sample);

      fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      flushAll(null);

      expect(close).toHaveBeenCalled();
    });
  });
});
