import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IRegion, NewRegion } from '../region.model';

export type PartialUpdateRegion = Partial<IRegion> & Pick<IRegion, 'id'>;

@Injectable()
export class RegionsService {
  readonly regionsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly regionsResource = httpResource<IRegion[]>(() => {
    const params = this.regionsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of region that have been fetched. It is updated when the regionsResource emits a new value.
   * In case of error while fetching the regions, the signal is set to an empty array.
   */
  readonly regions = computed(() => (this.regionsResource.hasValue() ? this.regionsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/regions');
}

@Injectable({ providedIn: 'root' })
export class RegionService extends RegionsService {
  protected readonly http = inject(HttpClient);

  create(region: NewRegion): Observable<IRegion> {
    return this.http.post<IRegion>(this.resourceUrl, region);
  }

  update(region: IRegion): Observable<IRegion> {
    return this.http.put<IRegion>(`${this.resourceUrl}/${encodeURIComponent(this.getRegionIdentifier(region))}`, region);
  }

  partialUpdate(region: PartialUpdateRegion): Observable<IRegion> {
    return this.http.patch<IRegion>(`${this.resourceUrl}/${encodeURIComponent(this.getRegionIdentifier(region))}`, region);
  }

  find(id: string): Observable<IRegion> {
    return this.http.get<IRegion>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IRegion[]>> {
    const options = createRequestOption(req);
    return this.http.get<IRegion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getRegionIdentifier(region: Pick<IRegion, 'id'>): string {
    return region.id;
  }

  compareRegion(o1: Pick<IRegion, 'id'> | null, o2: Pick<IRegion, 'id'> | null): boolean {
    return o1 && o2 ? this.getRegionIdentifier(o1) === this.getRegionIdentifier(o2) : o1 === o2;
  }

  addRegionToCollectionIfMissing<Type extends Pick<IRegion, 'id'>>(
    regionCollection: Type[],
    ...regionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const regions: Type[] = regionsToCheck.filter(isPresent);
    if (regions.length > 0) {
      const regionCollectionIdentifiers = regionCollection.map(regionItem => this.getRegionIdentifier(regionItem));
      const regionsToAdd = regions.filter(regionItem => {
        const regionIdentifier = this.getRegionIdentifier(regionItem);
        if (regionCollectionIdentifiers.includes(regionIdentifier)) {
          return false;
        }
        regionCollectionIdentifiers.push(regionIdentifier);
        return true;
      });
      return [...regionsToAdd, ...regionCollection];
    }
    return regionCollection;
  }
}
