import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { submit } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IRegion } from 'app/entities/region/region.model';
import { RegionService } from 'app/entities/region/service/region.service';
import { ICountry } from '../country.model';
import { sampleWithRequiredData } from '../country.test-samples';
import { CountryService } from '../service/country.service';

import { CountryFormService } from './country-form.service';
import { CountryUpdate } from './country-update';

describe('Country Management Update Component', () => {
  let comp: CountryUpdate;
  let fixture: ComponentFixture<CountryUpdate>;
  let activatedRoute: ActivatedRoute;
  let countryFormService: CountryFormService;
  let countryService: CountryService;
  let regionService: RegionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(CountryUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    countryFormService = TestBed.inject(CountryFormService);
    countryService = TestBed.inject(CountryService);
    regionService = TestBed.inject(RegionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Region query and add missing value', () => {
      const country: ICountry = { id: 'd8127cae-0381-4e62-bed7-eae338eaa9ae' };
      const region: IRegion = { id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' };
      country.region = region;

      const regionCollection: IRegion[] = [{ id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' }];
      vi.spyOn(regionService, 'query').mockReturnValue(of(new HttpResponse({ body: regionCollection })));
      const additionalRegions = [region];
      const expectedCollection: IRegion[] = [...additionalRegions, ...regionCollection];
      vi.spyOn(regionService, 'addRegionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(regionService.query).toHaveBeenCalled();
      expect(regionService.addRegionToCollectionIfMissing).toHaveBeenCalledWith(
        regionCollection,
        ...additionalRegions.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.regionsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const country: ICountry = { id: 'd8127cae-0381-4e62-bed7-eae338eaa9ae' };
      const region: IRegion = { id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' };
      country.region = region;

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(comp.regionsSharedCollection()).toContainEqual(region);
      expect(comp.country).toEqual(country);
    });
  });

  describe('save', () => {
    it('should save a valid submitted form', async () => {
      // GIVEN
      vi.spyOn(comp, 'save').mockResolvedValue(undefined);
      activatedRoute.data = of({ country: sampleWithRequiredData });
      comp.ngOnInit();

      // WHEN
      await submit(comp.editForm);

      // THEN
      expect(comp.save).toHaveBeenCalled();
    });

    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICountry>();
      const country = { id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' };
      vi.spyOn(countryFormService, 'getCountry').mockReturnValue(country);
      vi.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(country);
      saveSubject.complete();

      // THEN
      expect(countryFormService.getCountry).toHaveBeenCalledWith(comp.countryModel(), country);
      expect(comp.previousState).toHaveBeenCalled();
      expect(countryService.update).toHaveBeenCalledWith(expect.objectContaining(country));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICountry>();
      const country = { id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' };
      vi.spyOn(countryFormService, 'getCountry').mockReturnValue({ id: null });
      vi.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(country);
      saveSubject.complete();

      // THEN
      expect(countryFormService.getCountry).toHaveBeenCalled();
      expect(countryService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should resolve the submission when the service completes without a value', async () => {
      // GIVEN
      const saveSubject = new Subject<ICountry>();
      vi.spyOn(countryFormService, 'getCountry').mockReturnValue({ id: null });
      vi.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ country: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.complete();

      // THEN
      expect(await result).toBeUndefined();
      expect(comp.isSaving()).toEqual(false);
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ICountry>();
      const country = { id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' };
      vi.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(countryService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });

    it('should mark the fields the server refused', async () => {
      // GIVEN
      const saveSubject = new Subject<ICountry>();
      vi.spyOn(countryFormService, 'getCountry').mockReturnValue({ id: null });
      vi.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ country: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(
        new HttpErrorResponse({
          status: 400,
          error: {
            type: 'https://www.jhipster.tech/problem/constraint-violation',
            message: 'error.validation',
            fieldErrors: [
              { objectName: 'country', field: 'countryName', message: 'is refused', code: 'Refused' },
              { objectName: 'country', field: 'id', message: 'is refused', code: 'Refused' },
              { objectName: 'country', field: 'notAField', message: 'is refused', code: 'Refused' },
            ],
          },
        }),
      );

      // THEN
      expect(await result).toEqual([
        expect.objectContaining({ kind: 'server', message: 'is refused', fieldTree: comp.editForm.countryName }),
      ]);
    });

    it('should mark no field for an error without field errors', async () => {
      // GIVEN
      const saveSubject = new Subject<ICountry>();
      vi.spyOn(countryFormService, 'getCountry').mockReturnValue({ id: null });
      vi.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ country: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(new HttpErrorResponse({ status: 500, error: null }));

      // THEN
      expect(await result).toBeUndefined();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRegion', () => {
      it('should forward to regionService', () => {
        const entity = { id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' };
        const entity2 = { id: '08490cb2-dd41-43f2-95f0-554d7eff5216' };
        vi.spyOn(regionService, 'compareRegion');
        comp.compareRegion(entity, entity2);
        expect(regionService.compareRegion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
