import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IDepartment, NewDepartment } from '../department.model';

export type PartialUpdateDepartment = Partial<IDepartment> & Pick<IDepartment, 'id'>;

@Injectable()
export class DepartmentsService {
  readonly departmentsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly departmentsResource = httpResource<IDepartment[]>(() => {
    const params = this.departmentsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of department that have been fetched. It is updated when the departmentsResource emits a new value.
   * In case of error while fetching the departments, the signal is set to an empty array.
   */
  readonly departments = computed(() => (this.departmentsResource.hasValue() ? this.departmentsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/departments');
}

@Injectable({ providedIn: 'root' })
export class DepartmentService extends DepartmentsService {
  protected readonly http = inject(HttpClient);

  create(department: NewDepartment): Observable<IDepartment> {
    return this.http.post<IDepartment>(this.resourceUrl, department);
  }

  update(department: IDepartment): Observable<IDepartment> {
    return this.http.put<IDepartment>(`${this.resourceUrl}/${encodeURIComponent(this.getDepartmentIdentifier(department))}`, department);
  }

  partialUpdate(department: PartialUpdateDepartment): Observable<IDepartment> {
    return this.http.patch<IDepartment>(`${this.resourceUrl}/${encodeURIComponent(this.getDepartmentIdentifier(department))}`, department);
  }

  find(id: string): Observable<IDepartment> {
    return this.http.get<IDepartment>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IDepartment[]>> {
    const options = createRequestOption(req);
    return this.http.get<IDepartment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getDepartmentIdentifier(department: Pick<IDepartment, 'id'>): string {
    return department.id;
  }

  compareDepartment(o1: Pick<IDepartment, 'id'> | null, o2: Pick<IDepartment, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepartmentIdentifier(o1) === this.getDepartmentIdentifier(o2) : o1 === o2;
  }

  addDepartmentToCollectionIfMissing<Type extends Pick<IDepartment, 'id'>>(
    departmentCollection: Type[],
    ...departmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const departments: Type[] = departmentsToCheck.filter(isPresent);
    if (departments.length > 0) {
      const departmentCollectionIdentifiers = departmentCollection.map(departmentItem => this.getDepartmentIdentifier(departmentItem));
      const departmentsToAdd = departments.filter(departmentItem => {
        const departmentIdentifier = this.getDepartmentIdentifier(departmentItem);
        if (departmentCollectionIdentifiers.includes(departmentIdentifier)) {
          return false;
        }
        departmentCollectionIdentifiers.push(departmentIdentifier);
        return true;
      });
      return [...departmentsToAdd, ...departmentCollection];
    }
    return departmentCollection;
  }
}
