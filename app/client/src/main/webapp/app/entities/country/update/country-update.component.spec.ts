jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CountryService } from '../service/country.service';
import { ICountry, Country } from '../country.model';
import { IRegion } from 'app/entities/region/region.model';
import { RegionService } from 'app/entities/region/service/region.service';

import { CountryUpdateComponent } from './country-update.component';

describe('Component Tests', () => {
  describe('Country Management Update Component', () => {
    let comp: CountryUpdateComponent;
    let fixture: ComponentFixture<CountryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let countryService: CountryService;
    let regionService: RegionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CountryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CountryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CountryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      countryService = TestBed.inject(CountryService);
      regionService = TestBed.inject(RegionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call region query and add missing value', () => {
        const country: ICountry = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const region: IRegion = { id: 'e451f8a9-ca1d-4392-8c45-5242a02e2dc0' };
        country.region = region;

        const regionCollection: IRegion[] = [{ id: '5d26045f-eba0-4140-9a10-dab343dff294' }];
        spyOn(regionService, 'query').and.returnValue(of(new HttpResponse({ body: regionCollection })));
        const expectedCollection: IRegion[] = [region, ...regionCollection];
        spyOn(regionService, 'addRegionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ country });
        comp.ngOnInit();

        expect(regionService.query).toHaveBeenCalled();
        expect(regionService.addRegionToCollectionIfMissing).toHaveBeenCalledWith(regionCollection, region);
        expect(comp.regionsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const country: ICountry = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const region: IRegion = { id: '9bd70019-15c5-410a-ad45-8e28c32aceb3' };
        country.region = region;

        activatedRoute.data = of({ country });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(country));
        expect(comp.regionsCollection).toContain(region);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const country = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(countryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ country });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: country }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(countryService.update).toHaveBeenCalledWith(country);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const country = new Country();
        spyOn(countryService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ country });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: country }));
        saveSubject.complete();

        // THEN
        expect(countryService.create).toHaveBeenCalledWith(country);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const country = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(countryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ country });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(countryService.update).toHaveBeenCalledWith(country);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRegionById', () => {
        it('Should return tracked Region primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackRegionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
