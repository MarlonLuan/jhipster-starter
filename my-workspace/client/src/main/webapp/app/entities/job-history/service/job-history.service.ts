import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IJobHistory, NewJobHistory } from '../job-history.model';

export type PartialUpdateJobHistory = Partial<IJobHistory> & Pick<IJobHistory, 'id'>;

type RestOf<T extends IJobHistory | NewJobHistory> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestJobHistory = RestOf<IJobHistory>;

export type NewRestJobHistory = RestOf<NewJobHistory>;

export type PartialUpdateRestJobHistory = RestOf<PartialUpdateJobHistory>;

@Injectable()
export class JobHistoriesService {
  readonly jobHistoriesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly jobHistoriesResource = httpResource<RestJobHistory[]>(() => {
    const params = this.jobHistoriesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of jobHistory that have been fetched. It is updated when the jobHistoriesResource emits a new value.
   * In case of error while fetching the jobHistories, the signal is set to an empty array.
   */
  readonly jobHistories = computed(() =>
    (this.jobHistoriesResource.hasValue() ? this.jobHistoriesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/job-histories');

  protected convertValueFromServer(restJobHistory: RestJobHistory): IJobHistory {
    return {
      ...restJobHistory,
      startDate: restJobHistory.startDate ? dayjs(restJobHistory.startDate) : undefined,
      endDate: restJobHistory.endDate ? dayjs(restJobHistory.endDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class JobHistoryService extends JobHistoriesService {
  protected readonly http = inject(HttpClient);

  create(jobHistory: NewJobHistory): Observable<IJobHistory> {
    const copy = this.convertValueFromClient(jobHistory);
    return this.http.post<RestJobHistory>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(jobHistory: IJobHistory): Observable<IJobHistory> {
    const copy = this.convertValueFromClient(jobHistory);
    return this.http
      .put<RestJobHistory>(`${this.resourceUrl}/${encodeURIComponent(this.getJobHistoryIdentifier(jobHistory))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobHistory: PartialUpdateJobHistory): Observable<IJobHistory> {
    const copy = this.convertValueFromClient(jobHistory);
    return this.http
      .patch<RestJobHistory>(`${this.resourceUrl}/${encodeURIComponent(this.getJobHistoryIdentifier(jobHistory))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<IJobHistory> {
    return this.http
      .get<RestJobHistory>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IJobHistory[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJobHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getJobHistoryIdentifier(jobHistory: Pick<IJobHistory, 'id'>): string {
    return jobHistory.id;
  }

  compareJobHistory(o1: Pick<IJobHistory, 'id'> | null, o2: Pick<IJobHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobHistoryIdentifier(o1) === this.getJobHistoryIdentifier(o2) : o1 === o2;
  }

  addJobHistoryToCollectionIfMissing<Type extends Pick<IJobHistory, 'id'>>(
    jobHistoryCollection: Type[],
    ...jobHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobHistories: Type[] = jobHistoriesToCheck.filter(isPresent);
    if (jobHistories.length > 0) {
      const jobHistoryCollectionIdentifiers = jobHistoryCollection.map(jobHistoryItem => this.getJobHistoryIdentifier(jobHistoryItem));
      const jobHistoriesToAdd = jobHistories.filter(jobHistoryItem => {
        const jobHistoryIdentifier = this.getJobHistoryIdentifier(jobHistoryItem);
        if (jobHistoryCollectionIdentifiers.includes(jobHistoryIdentifier)) {
          return false;
        }
        jobHistoryCollectionIdentifiers.push(jobHistoryIdentifier);
        return true;
      });
      return [...jobHistoriesToAdd, ...jobHistoryCollection];
    }
    return jobHistoryCollection;
  }

  protected convertValueFromClient<T extends IJobHistory | NewJobHistory | PartialUpdateJobHistory>(jobHistory: T): RestOf<T> {
    return {
      ...jobHistory,
      startDate: jobHistory.startDate?.toJSON() ?? null,
      endDate: jobHistory.endDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestJobHistory): IJobHistory {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestJobHistory[]): IJobHistory[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
