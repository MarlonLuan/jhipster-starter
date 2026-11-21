import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize, map } from 'rxjs';

import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { AlertError } from 'app/shared/alert';
import { SelectOptionsDirective } from 'app/shared/form';
import { TranslateDirective } from 'app/shared/language';
import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

import { LocationFormService } from './location-form.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, FormField, FormRoot, SelectOptionsDirective],
})
export class LocationUpdate implements OnInit {
  readonly isSaving = signal(false);
  location: ILocation | null = null;

  countriesCollection = signal<ICountry[]>([]);

  private readonly locationService = inject(LocationService);
  private readonly locationFormService = inject(LocationFormService);
  private readonly countryService = inject(CountryService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly locationModel = signal(this.locationFormService.createLocationFormModel());
  // A submit marks the fields as touched and sends nothing while the form is invalid.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly editForm = this.locationFormService.createLocationForm(this.locationModel, {
    submission: { action: () => Promise.resolve(this.save()) },
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

  save(): void {
    this.isSaving.set(true);
    const location = this.locationFormService.getLocation(this.locationModel());
    if (location.id === null) {
      this.subscribeToSaveResponse(this.locationService.create(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.update(location));
    }
  }

  private subscribeToSaveResponse(result: Observable<ILocation | null>): void {
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

  private updateForm(location: ILocation): void {
    this.location = location;
    this.locationModel.set(this.locationFormService.createLocationFormModel(location));

    this.countriesCollection.set(
      this.countryService.addCountryToCollectionIfMissing<ICountry>(this.countriesCollection(), location.country),
    );
  }

  private loadRelationshipsOptions(): void {
    this.countryService
      .query({ filter: 'location-is-null' })
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing<ICountry>(countries, this.location?.country)),
      )
      .subscribe((countries: ICountry[]) => this.countriesCollection.set(countries));
  }
}
