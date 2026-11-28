import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../region.test-samples';

import { RegionFormService } from './region-form.service';

describe('Region Form Service', () => {
  let service: RegionFormService;

  beforeEach(() => {
    service = TestBed.inject(RegionFormService);
  });

  describe('Service methods', () => {
    describe('createRegionFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createRegionFormModel();

        expect(Object.keys(model)).toEqual(expect.arrayContaining(['id', 'regionName']));
      });
    });

    describe('createRegionForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createRegionFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createRegionForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createRegionForm(signal(service.createRegionFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createRegionForm(signal(service.createRegionFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getRegion', () => {
      it('should return NewRegion for default Region initial value', () => {
        const region = service.getRegion(service.createRegionFormModel(sampleWithNewData));

        expect(region).toMatchObject(sampleWithNewData);
      });

      it('should return NewRegion for empty Region initial value', () => {
        const region = service.getRegion(service.createRegionFormModel());

        expect(region).toMatchObject({});
      });

      it('should return IRegion', () => {
        const region = service.getRegion(service.createRegionFormModel(sampleWithRequiredData));

        expect(region).toMatchObject(sampleWithRequiredData);
      });

      it('should keep the empty values of the edited entity', () => {
        const entity = {
          ...sampleWithRequiredData,
          regionName: '',
        };

        const region = service.getRegion(service.createRegionFormModel(entity), entity);

        expect(region.regionName).toBe('');
      });

      it('should return the empty values of an entity without them', () => {
        const entity = {
          ...sampleWithRequiredData,
          regionName: null,
        };

        const region = service.getRegion(service.createRegionFormModel(entity), entity);

        expect(region.regionName).toBeNull();
      });
    });
  });
});
