import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IRegion } from '../region.model';
import { RegionService } from '../service/region.service';

import { RegionFormService } from './region-form.service';
import { RegionUpdate } from './region-update';

describe('Region Management Update Component', () => {
  let comp: RegionUpdate;
  let fixture: ComponentFixture<RegionUpdate>;
  let activatedRoute: ActivatedRoute;
  let regionFormService: RegionFormService;
  let regionService: RegionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(RegionUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    regionFormService = TestBed.inject(RegionFormService);
    regionService = TestBed.inject(RegionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const region: IRegion = { id: '08490cb2-dd41-43f2-95f0-554d7eff5216' };

      activatedRoute.data = of({ region });
      comp.ngOnInit();

      expect(comp.region).toEqual(region);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegion>>();
      const region = { id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' };
      vitest.spyOn(regionFormService, 'getRegion').mockReturnValue(region);
      vitest.spyOn(regionService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ region });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: region }));
      saveSubject.complete();

      // THEN
      expect(regionFormService.getRegion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(regionService.update).toHaveBeenCalledWith(expect.objectContaining(region));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegion>>();
      const region = { id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' };
      vitest.spyOn(regionFormService, 'getRegion').mockReturnValue({ id: null });
      vitest.spyOn(regionService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ region: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: region }));
      saveSubject.complete();

      // THEN
      expect(regionFormService.getRegion).toHaveBeenCalled();
      expect(regionService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegion>>();
      const region = { id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' };
      vitest.spyOn(regionService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ region });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(regionService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
