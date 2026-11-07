import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IRegion } from '../region.model';
import { RegionService } from '../service/region.service';

import { RegionFormGroup, RegionFormService } from './region-form.service';

@Component({
  selector: 'jhi-region-update',
  templateUrl: './region-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class RegionUpdate implements OnInit {
  readonly isSaving = signal(false);
  region: IRegion | null = null;

  private readonly regionService = inject(RegionService);
  private readonly regionFormService = inject(RegionFormService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RegionFormGroup = this.regionFormService.createRegionFormGroup();

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

  save(): void {
    this.isSaving.set(true);
    const region = this.regionFormService.getRegion(this.editForm);
    if (region.id === null) {
      this.subscribeToSaveResponse(this.regionService.create(region));
    } else {
      this.subscribeToSaveResponse(this.regionService.update(region));
    }
  }

  private subscribeToSaveResponse(result: Observable<IRegion | null>): void {
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

  private updateForm(region: IRegion): void {
    this.region = region;
    this.regionFormService.resetForm(this.editForm, region);
  }
}
