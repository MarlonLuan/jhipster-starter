import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize, map } from 'rxjs';

import { IRegion } from 'app/entities/region/region.model';
import { RegionService } from 'app/entities/region/service/region.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { ICountry } from '../country.model';
import { CountryService } from '../service/country.service';

import { CountryFormService } from './country-form.service';

@Component({
  selector: 'jhi-country-update',
  templateUrl: './country-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective],
})
export class CountryUpdate implements OnInit {
  readonly isSaving = signal(false);
  country: ICountry | null = null;

  regionsCollection = signal<IRegion[]>([]);

  private readonly countryService = inject(CountryService);
  private readonly countryFormService = inject(CountryFormService);
  private readonly regionService = inject(RegionService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly countryModel = signal(this.countryFormService.createCountryFormModel());
  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.countryFormService.createCountryForm(this.countryModel, {
    submission: { action: () => Promise.resolve(this.save()) },
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

  save(): void {
    this.isSaving.set(true);
    const country = this.countryFormService.getCountry(this.countryModel());
    if (country.id === null) {
      this.subscribeToSaveResponse(this.countryService.create(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.update(country));
    }
  }

  private subscribeToSaveResponse(result: Observable<ICountry | null>): void {
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

  private updateForm(country: ICountry): void {
    this.country = country;
    this.countryModel.set(this.countryFormService.createCountryFormModel(country));

    this.regionsCollection.set(this.regionService.addRegionToCollectionIfMissing<IRegion>(this.regionsCollection(), country.region));
  }

  private loadRelationshipsOptions(): void {
    this.regionService
      .query({ filter: 'country-is-null' })
      .pipe(map((res: HttpResponse<IRegion[]>) => res.body ?? []))
      .pipe(map((regions: IRegion[]) => this.regionService.addRegionToCollectionIfMissing<IRegion>(regions, this.country?.region)))
      .subscribe((regions: IRegion[]) => this.regionsCollection.set(regions));
  }
}
