import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IJob, NewJob } from '../job.model';

export type PartialUpdateJob = Partial<IJob> & Pick<IJob, 'id'>;

@Injectable()
export class JobsService {
  readonly jobsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly jobsResource = httpResource<IJob[]>(() => {
    const params = this.jobsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of job that have been fetched. It is updated when the jobsResource emits a new value.
   * In case of error while fetching the jobs, the signal is set to an empty array.
   */
  readonly jobs = computed(() => (this.jobsResource.hasValue() ? this.jobsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/jobs');
}

@Injectable({ providedIn: 'root' })
export class JobService extends JobsService {
  protected readonly http = inject(HttpClient);

  create(job: NewJob): Observable<IJob> {
    return this.http.post<IJob>(this.resourceUrl, job);
  }

  update(job: IJob): Observable<IJob> {
    return this.http.put<IJob>(`${this.resourceUrl}/${encodeURIComponent(this.getJobIdentifier(job))}`, job);
  }

  partialUpdate(job: PartialUpdateJob): Observable<IJob> {
    return this.http.patch<IJob>(`${this.resourceUrl}/${encodeURIComponent(this.getJobIdentifier(job))}`, job);
  }

  find(id: string): Observable<IJob> {
    return this.http.get<IJob>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IJob[]>> {
    const options = createRequestOption(req);
    return this.http.get<IJob[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getJobIdentifier(job: Pick<IJob, 'id'>): string {
    return job.id;
  }

  compareJob(o1: Pick<IJob, 'id'> | null, o2: Pick<IJob, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobIdentifier(o1) === this.getJobIdentifier(o2) : o1 === o2;
  }

  addJobToCollectionIfMissing<Type extends Pick<IJob, 'id'>>(jobCollection: Type[], ...jobsToCheck: (Type | null | undefined)[]): Type[] {
    const jobs: Type[] = jobsToCheck.filter(isPresent);
    if (jobs.length > 0) {
      const jobCollectionIdentifiers = jobCollection.map(jobItem => this.getJobIdentifier(jobItem));
      const jobsToAdd = jobs.filter(jobItem => {
        const jobIdentifier = this.getJobIdentifier(jobItem);
        if (jobCollectionIdentifiers.includes(jobIdentifier)) {
          return false;
        }
        jobCollectionIdentifiers.push(jobIdentifier);
        return true;
      });
      return [...jobsToAdd, ...jobCollection];
    }
    return jobCollection;
  }
}
