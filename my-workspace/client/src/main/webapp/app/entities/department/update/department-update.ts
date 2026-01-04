import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';

import { DepartmentFormGroup, DepartmentFormService } from './department-form.service';

@Component({
  selector: 'jhi-department-update',
  templateUrl: './department-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class DepartmentUpdate implements OnInit {
  isSaving = signal(false);
  department: IDepartment | null = null;

  locationsCollection = signal<ILocation[]>([]);

  protected departmentService = inject(DepartmentService);
  protected departmentFormService = inject(DepartmentFormService);
  protected locationService = inject(LocationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DepartmentFormGroup = this.departmentFormService.createDepartmentFormGroup();

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ department }) => {
      this.department = department;
      if (department) {
        this.updateForm(department);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const department = this.departmentFormService.getDepartment(this.editForm);
    if (department.id === null) {
      this.subscribeToSaveResponse(this.departmentService.create(department));
    } else {
      this.subscribeToSaveResponse(this.departmentService.update(department));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(department: IDepartment): void {
    this.department = department;
    this.departmentFormService.resetForm(this.editForm, department);

    this.locationsCollection.set(
      this.locationService.addLocationToCollectionIfMissing<ILocation>(this.locationsCollection(), department.location),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'department-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.department?.location),
        ),
      )
      .subscribe((locations: ILocation[]) => this.locationsCollection.set(locations));
  }
}
