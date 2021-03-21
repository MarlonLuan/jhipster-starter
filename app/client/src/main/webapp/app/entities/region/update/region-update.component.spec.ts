jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RegionService } from '../service/region.service';
import { IRegion, Region } from '../region.model';

import { RegionUpdateComponent } from './region-update.component';

describe('Component Tests', () => {
  describe('Region Management Update Component', () => {
    let comp: RegionUpdateComponent;
    let fixture: ComponentFixture<RegionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let regionService: RegionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RegionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RegionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RegionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      regionService = TestBed.inject(RegionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const region: IRegion = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        activatedRoute.data = of({ region });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(region));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const region = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(regionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ region });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: region }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(regionService.update).toHaveBeenCalledWith(region);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const region = new Region();
        spyOn(regionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ region });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: region }));
        saveSubject.complete();

        // THEN
        expect(regionService.create).toHaveBeenCalledWith(region);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const region = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(regionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ region });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(regionService.update).toHaveBeenCalledWith(region);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
