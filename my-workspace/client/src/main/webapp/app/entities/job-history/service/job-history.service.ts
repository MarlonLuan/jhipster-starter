import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IJobHistory, NewJobHistory } from '../job-history.model';

export type PartialUpdateJobHistory = Partial<IJobHistory> & Pick<IJobHistory, 'id'>;

@Service()
export class JobHistoriesService {
  readonly jobHistoriesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly jobHistoriesResource = httpResource<IJobHistory[]>(() => {
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
  readonly jobHistories = computed(() => (this.jobHistoriesResource.hasValue() ? this.jobHistoriesResource.value() : []));
  protected readonly resourceUrl = `${serverApiUrl}api/job-histories`;
}

@Service()
export class JobHistoryService extends JobHistoriesService {
  protected readonly http = inject(HttpClient);

  create(jobHistory: NewJobHistory): Observable<IJobHistory> {
    return this.http.post<IJobHistory>(this.resourceUrl, jobHistory);
  }

  update(jobHistory: IJobHistory): Observable<IJobHistory> {
    return this.http.put<IJobHistory>(`${this.resourceUrl}/${encodeURIComponent(this.getJobHistoryIdentifier(jobHistory))}`, jobHistory);
  }

  partialUpdate(jobHistory: PartialUpdateJobHistory): Observable<IJobHistory> {
    return this.http.patch<IJobHistory>(`${this.resourceUrl}/${encodeURIComponent(this.getJobHistoryIdentifier(jobHistory))}`, jobHistory);
  }

  find(id: string): Observable<IJobHistory> {
    return this.http.get<IJobHistory>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IJobHistory[]>> {
    const options = createRequestOption(req);
    return this.http.get<IJobHistory[]>(this.resourceUrl, { params: options, observe: 'response' });
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
    const jobHistories: Type[] = jobHistoriesToCheck.filter(jobHistoryItem => jobHistoryItem !== null && jobHistoryItem !== undefined);
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
}
