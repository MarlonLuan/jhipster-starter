import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize, map } from 'rxjs';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';

import { DepartmentFormService } from './department-form.service';

@Component({
  selector: 'jhi-department-update',
  templateUrl: './department-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective],
})
export class DepartmentUpdate implements OnInit {
  readonly isSaving = signal(false);
  department: IDepartment | null = null;

  locationsCollection = signal<ILocation[]>([]);

  private readonly departmentService = inject(DepartmentService);
  private readonly departmentFormService = inject(DepartmentFormService);
  private readonly locationService = inject(LocationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly departmentModel = signal(this.departmentFormService.createDepartmentFormModel());
  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.departmentFormService.createDepartmentForm(this.departmentModel, {
    submission: { action: () => Promise.resolve(this.save()) },
  });

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
    const department = this.departmentFormService.getDepartment(this.departmentModel());
    if (department.id === null) {
      this.subscribeToSaveResponse(this.departmentService.create(department));
    } else {
      this.subscribeToSaveResponse(this.departmentService.update(department));
    }
  }

  private subscribeToSaveResponse(result: Observable<IDepartment | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  private onSaveSuccess(): void {
    this.previousState();
  }

  private onSaveError(): void {
    // API for inheritance.
  }

  private onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  private updateForm(department: IDepartment): void {
    this.department = department;
    this.departmentModel.set(this.departmentFormService.createDepartmentFormModel(department));

    this.locationsCollection.set(
      this.locationService.addLocationToCollectionIfMissing<ILocation>(this.locationsCollection(), department.location),
    );
  }

  private loadRelationshipsOptions(): void {
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
