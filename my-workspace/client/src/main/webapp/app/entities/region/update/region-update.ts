import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { IRegion } from '../region.model';
import { RegionService } from '../service/region.service';

import { RegionFormGroup, RegionFormService } from './region-form.service';

@Component({
  selector: 'jhi-region-update',
  templateUrl: './region-update.html',
  imports: [SharedModule, ReactiveFormsModule],
})
export class RegionUpdate implements OnInit {
  isSaving = false;
  region: IRegion | null = null;

  protected regionService = inject(RegionService);
  protected regionFormService = inject(RegionFormService);
  protected activatedRoute = inject(ActivatedRoute);

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
    this.isSaving = true;
    const region = this.regionFormService.getRegion(this.editForm);
    if (region.id === null) {
      this.subscribeToSaveResponse(this.regionService.create(region));
    } else {
      this.subscribeToSaveResponse(this.regionService.update(region));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegion>>): void {
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
    this.isSaving = false;
  }

  protected updateForm(region: IRegion): void {
    this.region = region;
    this.regionFormService.resetForm(this.editForm, region);
  }
}
