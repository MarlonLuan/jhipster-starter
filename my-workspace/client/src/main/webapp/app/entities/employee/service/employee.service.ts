import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IEmployee, NewEmployee } from '../employee.model';

export type PartialUpdateEmployee = Partial<IEmployee> & Pick<IEmployee, 'id'>;

@Service()
export class EmployeesService {
  readonly employeesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly employeesResource = httpResource<IEmployee[]>(() => {
    const params = this.employeesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of employee that have been fetched. It is updated when the employeesResource emits a new value.
   * In case of error while fetching the employees, the signal is set to an empty array.
   */
  readonly employees = computed(() => (this.employeesResource.hasValue() ? this.employeesResource.value() : []));
  protected readonly resourceUrl = `${serverApiUrl}api/employees`;
}

@Service()
export class EmployeeService extends EmployeesService {
  protected readonly http = inject(HttpClient);

  create(employee: NewEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.resourceUrl, employee);
  }

  update(employee: IEmployee): Observable<IEmployee> {
    return this.http.put<IEmployee>(`${this.resourceUrl}/${encodeURIComponent(this.getEmployeeIdentifier(employee))}`, employee);
  }

  partialUpdate(employee: PartialUpdateEmployee): Observable<IEmployee> {
    return this.http.patch<IEmployee>(`${this.resourceUrl}/${encodeURIComponent(this.getEmployeeIdentifier(employee))}`, employee);
  }

  find(id: string): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IEmployee[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEmployee[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getEmployeeIdentifier(employee: Pick<IEmployee, 'id'>): string {
    return employee.id;
  }

  compareEmployee(o1: Pick<IEmployee, 'id'> | null, o2: Pick<IEmployee, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmployeeIdentifier(o1) === this.getEmployeeIdentifier(o2) : o1 === o2;
  }

  addEmployeeToCollectionIfMissing<Type extends Pick<IEmployee, 'id'>>(
    employeeCollection: Type[],
    ...employeesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const employees: Type[] = employeesToCheck.filter(employeeItem => employeeItem !== null && employeeItem !== undefined);
    if (employees.length > 0) {
      const employeeCollectionIdentifiers = employeeCollection.map(employeeItem => this.getEmployeeIdentifier(employeeItem));
      const employeesToAdd = employees.filter(employeeItem => {
        const employeeIdentifier = this.getEmployeeIdentifier(employeeItem);
        if (employeeCollectionIdentifiers.includes(employeeIdentifier)) {
          return false;
        }
        employeeCollectionIdentifiers.push(employeeIdentifier);
        return true;
      });
      return [...employeesToAdd, ...employeeCollection];
    }
    return employeeCollection;
  }
}
