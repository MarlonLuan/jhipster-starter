import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { submit } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IDepartment } from '../department.model';
import { sampleWithRequiredData } from '../department.test-samples';
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

    fixture = TestBed.createComponent(DepartmentUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departmentFormService = TestBed.inject(DepartmentFormService);
    departmentService = TestBed.inject(DepartmentService);
    locationService = TestBed.inject(LocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Location query and add missing value', () => {
      const department: IDepartment = { id: 'c54b4791-0036-4b84-8040-f2c2b23e0727' };
      const location: ILocation = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      department.location = location;

      const locationCollection: ILocation[] = [{ id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' }];
      vi.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const additionalLocations = [location];
      const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
      vi.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(
        locationCollection,
        ...additionalLocations.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.locationsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const department: IDepartment = { id: 'c54b4791-0036-4b84-8040-f2c2b23e0727' };
      const location: ILocation = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
      department.location = location;

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(comp.locationsSharedCollection()).toContainEqual(location);
      expect(comp.department).toEqual(department);
    });
  });

  describe('save', () => {
    it('should mark the fields of an invalid form instead of saving it', async () => {
      // GIVEN
      vi.spyOn(comp, 'save');
      activatedRoute.data = of({ department: null });
      comp.ngOnInit();

      // WHEN
      await submit(comp.editForm);

      // THEN
      expect(comp.editForm().touched()).toBe(true);
      expect(comp.save).not.toHaveBeenCalled();
    });

    it('should save a valid submitted form', async () => {
      // GIVEN
      vi.spyOn(comp, 'save').mockResolvedValue(undefined);
      activatedRoute.data = of({ department: sampleWithRequiredData });
      comp.ngOnInit();

      // WHEN
      await submit(comp.editForm);

      // THEN
      expect(comp.save).toHaveBeenCalled();
    });

    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDepartment>();
      const department = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      vi.spyOn(departmentFormService, 'getDepartment').mockReturnValue(department);
      vi.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(department);
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departmentService.update).toHaveBeenCalledWith(expect.objectContaining(department));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDepartment>();
      const department = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      vi.spyOn(departmentFormService, 'getDepartment').mockReturnValue({ id: null });
      vi.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(department);
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartment).toHaveBeenCalled();
      expect(departmentService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should resolve the submission when the service completes without a value', async () => {
      // GIVEN
      const saveSubject = new Subject<IDepartment>();
      vi.spyOn(departmentFormService, 'getDepartment').mockReturnValue({ id: null });
      vi.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ department: null });
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
      const saveSubject = new Subject<IDepartment>();
      const department = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      vi.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departmentService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });

    it('should mark the fields the server refused', async () => {
      // GIVEN
      const saveSubject = new Subject<IDepartment>();
      vi.spyOn(departmentFormService, 'getDepartment').mockReturnValue({ id: null });
      vi.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ department: null });
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
              { objectName: 'department', field: 'departmentName', message: 'is refused', code: 'Refused' },
              { objectName: 'department', field: 'id', message: 'is refused', code: 'Refused' },
              { objectName: 'department', field: 'notAField', message: 'is refused', code: 'Refused' },
            ],
          },
        }),
      );

      // THEN
      expect(await result).toEqual([
        expect.objectContaining({ kind: 'server', message: 'is refused', fieldTree: comp.editForm.departmentName }),
      ]);
    });

    it('should mark no field for an error without field errors', async () => {
      // GIVEN
      const saveSubject = new Subject<IDepartment>();
      vi.spyOn(departmentFormService, 'getDepartment').mockReturnValue({ id: null });
      vi.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ department: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(new HttpErrorResponse({ status: 500, error: null }));

      // THEN
      expect(await result).toBeUndefined();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocation', () => {
      it('should forward to locationService', () => {
        const entity = { id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' };
        const entity2 = { id: 'a63537fe-865d-41e2-bc62-b6de781e4f03' };
        vi.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
