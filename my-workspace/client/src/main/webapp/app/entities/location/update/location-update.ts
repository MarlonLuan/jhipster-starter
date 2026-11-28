import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, map, tap } from 'rxjs';

import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective, ServerError, toSubmissionResult } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

import { LocationFormService } from './location-form.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective, ServerError],
})
export class LocationUpdate implements OnInit {
  readonly isSaving = signal(false);
  location: ILocation | null = null;

  countriesSharedCollection = signal<ICountry[]>([]);

  private readonly locationService = inject(LocationService);
  private readonly locationFormService = inject(LocationFormService);
  private readonly countryService = inject(CountryService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly locationModel = signal(this.locationFormService.createLocationFormModel());
  // The properties showing the error of the server, which marks them invalid and leaves them out of the alert.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly serverErrorFields = ['streetAddress', 'postalCode', 'city', 'stateProvince', 'country'] as const;

  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.locationFormService.createLocationForm(this.locationModel, {
    submission: { action: () => this.save() },
  });

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean => this.countryService.compareCountry(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
      if (location) {
        this.updateForm(location);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): Promise<TreeValidationResult> {
    this.isSaving.set(true);
    const location = this.locationFormService.getLocation(this.locationModel(), this.location);
    if (location.id === null) {
      return this.subscribeToSaveResponse(this.locationService.create(location));
    }
    return this.subscribeToSaveResponse(this.locationService.update(location));
  }

  private subscribeToSaveResponse(result: Observable<ILocation | null>): Promise<TreeValidationResult> {
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

  private updateForm(location: ILocation): void {
    this.location = location;
    this.locationModel.set(this.locationFormService.createLocationFormModel(location));

    this.countriesSharedCollection.update(countries =>
      this.countryService.addCountryToCollectionIfMissing<ICountry>(countries, location.country),
    );
  }

  private loadRelationshipsOptions(): void {
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing<ICountry>(countries, this.location?.country)),
      )
      .subscribe((countries: ICountry[]) => this.countriesSharedCollection.set(countries));
  }
}
