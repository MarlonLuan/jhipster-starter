import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../location.test-samples';

import { LocationFormService } from './location-form.service';

describe('Location Form Service', () => {
  let service: LocationFormService;

  beforeEach(() => {
    service = TestBed.inject(LocationFormService);
  });

  describe('Service methods', () => {
    describe('createLocationFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createLocationFormModel();

        expect(Object.keys(model)).toEqual(
          expect.arrayContaining(['id', 'streetAddress', 'postalCode', 'city', 'stateProvince', 'country']),
        );
      });
    });

    describe('createLocationForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createLocationFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createLocationForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createLocationForm(signal(service.createLocationFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createLocationForm(signal(service.createLocationFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getLocation', () => {
      it('should return NewLocation for default Location initial value', () => {
        const location = service.getLocation(service.createLocationFormModel(sampleWithNewData));

        expect(location).toMatchObject(sampleWithNewData);
      });

      it('should return NewLocation for empty Location initial value', () => {
        const location = service.getLocation(service.createLocationFormModel());

        expect(location).toMatchObject({});
      });

      it('should return ILocation', () => {
        const location = service.getLocation(service.createLocationFormModel(sampleWithRequiredData));

        expect(location).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
