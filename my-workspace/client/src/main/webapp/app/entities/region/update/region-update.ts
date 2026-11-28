import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, tap } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { ServerError, toSubmissionResult } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { IRegion } from '../region.model';
import { RegionService } from '../service/region.service';

import { RegionFormService } from './region-form.service';

@Component({
  selector: 'jhi-region-update',
  templateUrl: './region-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, ServerError],
})
export class RegionUpdate implements OnInit {
  readonly isSaving = signal(false);
  region: IRegion | null = null;

  private readonly regionService = inject(RegionService);
  private readonly regionFormService = inject(RegionFormService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly regionModel = signal(this.regionFormService.createRegionFormModel());
  // The properties showing the error of the server, which marks them invalid and leaves them out of the alert.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly serverErrorFields = ['regionName'] as const;

  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.regionFormService.createRegionForm(this.regionModel, {
    submission: { action: () => this.save() },
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ region }) => {
      this.region = region;
      if (region) {
        this.updateForm(region);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): Promise<TreeValidationResult> {
    this.isSaving.set(true);
    const region = this.regionFormService.getRegion(this.regionModel(), this.region);
    if (region.id === null) {
      return this.subscribeToSaveResponse(this.regionService.create(region));
    }
    return this.subscribeToSaveResponse(this.regionService.update(region));
  }

  private subscribeToSaveResponse(result: Observable<IRegion | null>): Promise<TreeValidationResult> {
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

  private updateForm(region: IRegion): void {
    this.region = region;
    this.regionModel.set(this.regionFormService.createRegionFormModel(region));
  }
}
