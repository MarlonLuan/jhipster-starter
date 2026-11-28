import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../country.test-samples';

import { CountryFormService } from './country-form.service';

describe('Country Form Service', () => {
  let service: CountryFormService;

  beforeEach(() => {
    service = TestBed.inject(CountryFormService);
  });

  describe('Service methods', () => {
    describe('createCountryFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createCountryFormModel();

        expect(Object.keys(model)).toEqual(expect.arrayContaining(['id', 'countryName', 'region']));
      });
    });

    describe('createCountryForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createCountryFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createCountryForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createCountryForm(signal(service.createCountryFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createCountryForm(signal(service.createCountryFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getCountry', () => {
      it('should return NewCountry for default Country initial value', () => {
        const country = service.getCountry(service.createCountryFormModel(sampleWithNewData));

        expect(country).toMatchObject(sampleWithNewData);
      });

      it('should return NewCountry for empty Country initial value', () => {
        const country = service.getCountry(service.createCountryFormModel());

        expect(country).toMatchObject({});
      });

      it('should return ICountry', () => {
        const country = service.getCountry(service.createCountryFormModel(sampleWithRequiredData));

        expect(country).toMatchObject(sampleWithRequiredData);
      });

      it('should keep the empty values of the edited entity', () => {
        const entity = {
          ...sampleWithRequiredData,
          countryName: '',
        };

        const country = service.getCountry(service.createCountryFormModel(entity), entity);

        expect(country.countryName).toBe('');
      });

      it('should return the empty values of an entity without them', () => {
        const entity = {
          ...sampleWithRequiredData,
          countryName: null,
        };

        const country = service.getCountry(service.createCountryFormModel(entity), entity);

        expect(country.countryName).toBeNull();
      });
    });
  });
});
