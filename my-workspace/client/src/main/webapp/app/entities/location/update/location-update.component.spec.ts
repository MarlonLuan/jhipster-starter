import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { LocationService } from '../service/location.service';
import { ILocation } from '../location.model';
import { LocationFormService } from './location-form.service';

import { LocationUpdateComponent } from './location-update.component';

describe('Location Management Update Component', () => {
  let comp: LocationUpdateComponent;
  let fixture: ComponentFixture<LocationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let locationFormService: LocationFormService;
  let locationService: LocationService;
  let countryService: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LocationUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LocationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    locationFormService = TestBed.inject(LocationFormService);
    locationService = TestBed.inject(LocationService);
    countryService = TestBed.inject(CountryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call country query and add missing value', () => {
      const location: ILocation = { id: 'a63537fe-865d-41e2-bc62-b6de781e4f03' };
      const country: ICountry = { id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' };
      location.country = country;

      const countryCollection: ICountry[] = [{ id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' }];
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
      const location: ILocation = { id: 'a63537fe-865d-41e2-bc62-b6de781e4f03' };
      const country: ICountry = { id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' };
      location.country = country;

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(comp.countriesCollection).toContainEqual(country);
      expect(comp.location).toEqual(location);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue(location);
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
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(expect.objectContaining(location));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      jest.spyOn(locationFormService, 'getLocation').mockReturnValue({ id: null });
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocation).toHaveBeenCalled();
      expect(locationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocation>>();
      const location = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCountry', () => {
      it('Should forward to countryService', () => {
        const entity = { id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' };
        const entity2 = { id: 'd8127cae-0381-4e62-bed7-eae338eaa9ae' };
        jest.spyOn(countryService, 'compareCountry');
        comp.compareCountry(entity, entity2);
        expect(countryService.compareCountry).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
