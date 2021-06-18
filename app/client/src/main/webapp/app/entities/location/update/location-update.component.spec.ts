jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LocationService } from '../service/location.service';
import { ILocation, Location } from '../location.model';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';

import { LocationUpdateComponent } from './location-update.component';

describe('Component Tests', () => {
  describe('Location Management Update Component', () => {
    let comp: LocationUpdateComponent;
    let fixture: ComponentFixture<LocationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let locationService: LocationService;
    let countryService: CountryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LocationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      locationService = TestBed.inject(LocationService);
      countryService = TestBed.inject(CountryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call country query and add missing value', () => {
        const location: ILocation = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const country: ICountry = { id: '1dc3931a-f7f3-4e64-a0fc-036e2b1b4be0' };
        location.country = country;

        const countryCollection: ICountry[] = [{ id: '0623b3cc-a3d9-4adb-9023-2538b6114a5d' }];
        jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
        const expectedCollection: ICountry[] = [country, ...countryCollection];
        jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(countryService.query).toHaveBeenCalled();
        expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, country);
        expect(comp.countriesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const location: ILocation = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const country: ICountry = { id: '3bfd7634-d887-49f0-87c0-6ab42e8f4414' };
        location.country = country;

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(location));
        expect(comp.countriesCollection).toContain(country);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Location>>();
        const location = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Location>>();
        const location = new Location();
        jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(locationService.create).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Location>>();
        const location = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCountryById', () => {
        it('Should return tracked Country primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackCountryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
