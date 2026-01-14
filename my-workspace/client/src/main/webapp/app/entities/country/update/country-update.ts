import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRegion } from 'app/entities/region/region.model';
import { RegionService } from 'app/entities/region/service/region.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ICountry } from '../country.model';
import { CountryService } from '../service/country.service';

import { CountryFormGroup, CountryFormService } from './country-form.service';

@Component({
  selector: 'jhi-country-update',
  templateUrl: './country-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CountryUpdate implements OnInit {
  isSaving = signal(false);
  country: ICountry | null = null;

  regionsCollection = signal<IRegion[]>([]);

  protected countryService = inject(CountryService);
  protected countryFormService = inject(CountryFormService);
  protected regionService = inject(RegionService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CountryFormGroup = this.countryFormService.createCountryFormGroup();

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
    const country = this.countryFormService.getCountry(this.editForm);
    if (country.id === null) {
      this.subscribeToSaveResponse(this.countryService.create(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.update(country));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountry>>): void {
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

  protected updateForm(country: ICountry): void {
    this.country = country;
    this.countryFormService.resetForm(this.editForm, country);

    this.regionsCollection.set(this.regionService.addRegionToCollectionIfMissing<IRegion>(this.regionsCollection(), country.region));
  }

  protected loadRelationshipsOptions(): void {
    this.regionService
      .query({ filter: 'country-is-null' })
      .pipe(map((res: HttpResponse<IRegion[]>) => res.body ?? []))
      .pipe(map((regions: IRegion[]) => this.regionService.addRegionToCollectionIfMissing<IRegion>(regions, this.country?.region)))
      .subscribe((regions: IRegion[]) => this.regionsCollection.set(regions));
  }
}
