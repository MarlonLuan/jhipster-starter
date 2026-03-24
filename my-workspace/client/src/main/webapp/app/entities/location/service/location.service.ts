import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ILocation, NewLocation } from '../location.model';

export type PartialUpdateLocation = Partial<ILocation> & Pick<ILocation, 'id'>;

@Injectable()
export class LocationsService {
  readonly locationsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly locationsResource = httpResource<ILocation[]>(() => {
    const params = this.locationsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of location that have been fetched. It is updated when the locationsResource emits a new value.
   * In case of error while fetching the locations, the signal is set to an empty array.
   */
  readonly locations = computed(() => (this.locationsResource.hasValue() ? this.locationsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/locations');
}

@Injectable({ providedIn: 'root' })
export class LocationService extends LocationsService {
  protected readonly http = inject(HttpClient);

  create(location: NewLocation): Observable<ILocation> {
    return this.http.post<ILocation>(this.resourceUrl, location);
  }

  update(location: ILocation): Observable<ILocation> {
    return this.http.put<ILocation>(`${this.resourceUrl}/${encodeURIComponent(this.getLocationIdentifier(location))}`, location);
  }

  partialUpdate(location: PartialUpdateLocation): Observable<ILocation> {
    return this.http.patch<ILocation>(`${this.resourceUrl}/${encodeURIComponent(this.getLocationIdentifier(location))}`, location);
  }

  find(id: string): Observable<ILocation> {
    return this.http.get<ILocation>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ILocation[]>> {
    const options = createRequestOption(req);
    return this.http.get<ILocation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getLocationIdentifier(location: Pick<ILocation, 'id'>): string {
    return location.id;
  }

  compareLocation(o1: Pick<ILocation, 'id'> | null, o2: Pick<ILocation, 'id'> | null): boolean {
    return o1 && o2 ? this.getLocationIdentifier(o1) === this.getLocationIdentifier(o2) : o1 === o2;
  }

  addLocationToCollectionIfMissing<Type extends Pick<ILocation, 'id'>>(
    locationCollection: Type[],
    ...locationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const locations: Type[] = locationsToCheck.filter(isPresent);
    if (locations.length > 0) {
      const locationCollectionIdentifiers = locationCollection.map(locationItem => this.getLocationIdentifier(locationItem));
      const locationsToAdd = locations.filter(locationItem => {
        const locationIdentifier = this.getLocationIdentifier(locationItem);
        if (locationCollectionIdentifiers.includes(locationIdentifier)) {
          return false;
        }
        locationCollectionIdentifiers.push(locationIdentifier);
        return true;
      });
      return [...locationsToAdd, ...locationCollection];
    }
    return locationCollection;
  }
}
