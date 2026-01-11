import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';

import { DepartmentFormService } from './department-form.service';
import { DepartmentUpdate } from './department-update';

describe('Department Management Update Component', () => {
  let comp: DepartmentUpdate;
  let fixture: ComponentFixture<DepartmentUpdate>;
  let activatedRoute: ActivatedRoute;
  let departmentFormService: DepartmentFormService;
  let departmentService: DepartmentService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(DepartmentUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departmentFormService = TestBed.inject(DepartmentFormService);
    departmentService = TestBed.inject(DepartmentService);
    locationService = TestBed.inject(LocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call location query and add missing value', () => {
      const department: IDepartment = { id: 'c54b4791-0036-4b84-8040-f2c2b23e0727' };
      const location: ILocation = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      department.location = location;

      const locationCollection: ILocation[] = [{ id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocation[] = [location, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const department: IDepartment = { id: 'c54b4791-0036-4b84-8040-f2c2b23e0727' };
      const location: ILocation = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      department.location = location;

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(comp.locationsCollection()).toContainEqual(location);
      expect(comp.department).toEqual(department);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartment>>();
      const department = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      jest.spyOn(departmentFormService, 'getDepartment').mockReturnValue(department);
      jest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: department }));
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departmentService.update).toHaveBeenCalledWith(expect.objectContaining(department));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartment>>();
      const department = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      jest.spyOn(departmentFormService, 'getDepartment').mockReturnValue({ id: null });
      jest.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: department }));
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartment).toHaveBeenCalled();
      expect(departmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartment>>();
      const department = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      jest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocation', () => {
      it('should forward to locationService', () => {
        const entity = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
        const entity2 = { id: 'a63537fe-865d-41e2-bc62-b6de781e4f03' };
        jest.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
