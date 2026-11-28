import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, map, tap } from 'rxjs';

import { IRegion } from 'app/entities/region/region.model';
import { RegionService } from 'app/entities/region/service/region.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective, ServerError, toSubmissionResult } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { ICountry } from '../country.model';
import { CountryService } from '../service/country.service';

import { CountryFormService } from './country-form.service';

@Component({
  selector: 'jhi-country-update',
  templateUrl: './country-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective, ServerError],
})
export class CountryUpdate implements OnInit {
  readonly isSaving = signal(false);
  country: ICountry | null = null;

  regionsSharedCollection = signal<IRegion[]>([]);

  private readonly countryService = inject(CountryService);
  private readonly countryFormService = inject(CountryFormService);
  private readonly regionService = inject(RegionService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly countryModel = signal(this.countryFormService.createCountryFormModel());
  // The properties showing the error of the server, which marks them invalid and leaves them out of the alert.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly serverErrorFields = ['countryName', 'region'] as const;

  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.countryFormService.createCountryForm(this.countryModel, {
    submission: { action: () => this.save() },
  });

  compareRegion = (o1: IRegion | null, o2: IRegion | null): boolean => this.regionService.compareRegion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.country = country;
      if (country) {
        this.updateForm(country);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): Promise<TreeValidationResult> {
    this.isSaving.set(true);
    const country = this.countryFormService.getCountry(this.countryModel(), this.country);
    if (country.id === null) {
      return this.subscribeToSaveResponse(this.countryService.create(country));
    }
    return this.subscribeToSaveResponse(this.countryService.update(country));
  }

  private subscribeToSaveResponse(result: Observable<ICountry | null>): Promise<TreeValidationResult> {
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

  private updateForm(country: ICountry): void {
    this.country = country;
    this.countryModel.set(this.countryFormService.createCountryFormModel(country));

    this.regionsSharedCollection.update(regions => this.regionService.addRegionToCollectionIfMissing<IRegion>(regions, country.region));
  }

  private loadRelationshipsOptions(): void {
    this.regionService
      .query()
      .pipe(map((res: HttpResponse<IRegion[]>) => res.body ?? []))
      .pipe(map((regions: IRegion[]) => this.regionService.addRegionToCollectionIfMissing<IRegion>(regions, this.country?.region)))
      .subscribe((regions: IRegion[]) => this.regionsSharedCollection.set(regions));
  }
}
