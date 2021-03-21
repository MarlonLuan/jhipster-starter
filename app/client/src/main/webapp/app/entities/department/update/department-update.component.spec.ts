jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DepartmentService } from '../service/department.service';
import { IDepartment, Department } from '../department.model';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { DepartmentUpdateComponent } from './department-update.component';

describe('Component Tests', () => {
  describe('Department Management Update Component', () => {
    let comp: DepartmentUpdateComponent;
    let fixture: ComponentFixture<DepartmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let departmentService: DepartmentService;
    let locationService: LocationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DepartmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DepartmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DepartmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      departmentService = TestBed.inject(DepartmentService);
      locationService = TestBed.inject(LocationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call location query and add missing value', () => {
        const department: IDepartment = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const location: ILocation = { id: 'fed60286-9319-4fc8-8df5-881693835508' };
        department.location = location;

        const locationCollection: ILocation[] = [{ id: 'c40b62d1-9777-413f-8e09-0459a3ef19c3' }];
        spyOn(locationService, 'query').and.returnValue(of(new HttpResponse({ body: locationCollection })));
        const expectedCollection: ILocation[] = [location, ...locationCollection];
        spyOn(locationService, 'addLocationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ department });
        comp.ngOnInit();

        expect(locationService.query).toHaveBeenCalled();
        expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
        expect(comp.locationsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const department: IDepartment = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const location: ILocation = { id: '9d161a6c-5219-4b1f-976c-b310613eae1c' };
        department.location = location;

        activatedRoute.data = of({ department });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(department));
        expect(comp.locationsCollection).toContain(location);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const department = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(departmentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ department });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: department }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(departmentService.update).toHaveBeenCalledWith(department);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const department = new Department();
        spyOn(departmentService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ department });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: department }));
        saveSubject.complete();

        // THEN
        expect(departmentService.create).toHaveBeenCalledWith(department);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const department = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(departmentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ department });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(departmentService.update).toHaveBeenCalledWith(department);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLocationById', () => {
        it('Should return tracked Location primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackLocationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
