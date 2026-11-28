import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, map, tap } from 'rxjs';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective, ServerError, toSubmissionResult } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';

import { DepartmentFormService } from './department-form.service';

@Component({
  selector: 'jhi-department-update',
  templateUrl: './department-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective, ServerError],
})
export class DepartmentUpdate implements OnInit {
  readonly isSaving = signal(false);
  department: IDepartment | null = null;

  locationsSharedCollection = signal<ILocation[]>([]);

  private readonly departmentService = inject(DepartmentService);
  private readonly departmentFormService = inject(DepartmentFormService);
  private readonly locationService = inject(LocationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly departmentModel = signal(this.departmentFormService.createDepartmentFormModel());
  // The properties showing the error of the server, which marks them invalid and leaves them out of the alert.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly serverErrorFields = ['departmentName', 'location'] as const;

  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.departmentFormService.createDepartmentForm(this.departmentModel, {
    submission: { action: () => this.save() },
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

  save(): Promise<TreeValidationResult> {
    this.isSaving.set(true);
    const department = this.departmentFormService.getDepartment(this.departmentModel());
    if (department.id === null) {
      return this.subscribeToSaveResponse(this.departmentService.create(department));
    }
    return this.subscribeToSaveResponse(this.departmentService.update(department));
  }

  private subscribeToSaveResponse(result: Observable<IDepartment | null>): Promise<TreeValidationResult> {
    return toSubmissionResult(
      this.editForm,
      this.serverErrorFields,
      result.pipe(tap({ next: () => this.onSaveSuccess(), error: () => this.onSaveError(), finalize: () => this.onSaveFinalize() })),
    );
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

    this.locationsSharedCollection.update(locations =>
      this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, department.location),
    );
  }

  private loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.department?.location),
        ),
      )
      .subscribe((locations: ILocation[]) => this.locationsSharedCollection.set(locations));
  }
}
