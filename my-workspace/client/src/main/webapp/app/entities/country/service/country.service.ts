import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ICountry, NewCountry } from '../country.model';

export type PartialUpdateCountry = Partial<ICountry> & Pick<ICountry, 'id'>;

@Injectable()
export class CountriesService {
  readonly countriesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly countriesResource = httpResource<ICountry[]>(() => {
    const params = this.countriesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of country that have been fetched. It is updated when the countriesResource emits a new value.
   * In case of error while fetching the countries, the signal is set to an empty array.
   */
  readonly countries = computed(() => (this.countriesResource.hasValue() ? this.countriesResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/countries');
}

@Injectable({ providedIn: 'root' })
export class CountryService extends CountriesService {
  protected readonly http = inject(HttpClient);

  create(country: NewCountry): Observable<ICountry> {
    return this.http.post<ICountry>(this.resourceUrl, country);
  }

  update(country: ICountry): Observable<ICountry> {
    return this.http.put<ICountry>(`${this.resourceUrl}/${encodeURIComponent(this.getCountryIdentifier(country))}`, country);
  }

  partialUpdate(country: PartialUpdateCountry): Observable<ICountry> {
    return this.http.patch<ICountry>(`${this.resourceUrl}/${encodeURIComponent(this.getCountryIdentifier(country))}`, country);
  }

  find(id: string): Observable<ICountry> {
    return this.http.get<ICountry>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ICountry[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICountry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getCountryIdentifier(country: Pick<ICountry, 'id'>): string {
    return country.id;
  }

  compareCountry(o1: Pick<ICountry, 'id'> | null, o2: Pick<ICountry, 'id'> | null): boolean {
    return o1 && o2 ? this.getCountryIdentifier(o1) === this.getCountryIdentifier(o2) : o1 === o2;
  }

  addCountryToCollectionIfMissing<Type extends Pick<ICountry, 'id'>>(
    countryCollection: Type[],
    ...countriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const countries: Type[] = countriesToCheck.filter(isPresent);
    if (countries.length > 0) {
      const countryCollectionIdentifiers = countryCollection.map(countryItem => this.getCountryIdentifier(countryItem));
      const countriesToAdd = countries.filter(countryItem => {
        const countryIdentifier = this.getCountryIdentifier(countryItem);
        if (countryCollectionIdentifiers.includes(countryIdentifier)) {
          return false;
        }
        countryCollectionIdentifiers.push(countryIdentifier);
        return true;
      });
      return [...countriesToAdd, ...countryCollection];
    }
    return countryCollection;
  }
}
