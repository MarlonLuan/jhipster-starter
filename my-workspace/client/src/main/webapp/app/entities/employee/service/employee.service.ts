import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IEmployee, NewEmployee } from '../employee.model';

export type PartialUpdateEmployee = Partial<IEmployee> & Pick<IEmployee, 'id'>;

type RestOf<T extends IEmployee | NewEmployee> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

export type RestEmployee = RestOf<IEmployee>;

export type NewRestEmployee = RestOf<NewEmployee>;

export type PartialUpdateRestEmployee = RestOf<PartialUpdateEmployee>;

@Injectable()
export class EmployeesService {
  readonly employeesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly employeesResource = httpResource<RestEmployee[]>(() => {
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
  readonly employees = computed(() =>
    (this.employeesResource.hasValue() ? this.employeesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/employees');

  protected convertValueFromServer(restEmployee: RestEmployee): IEmployee {
    return {
      ...restEmployee,
      hireDate: restEmployee.hireDate ? dayjs(restEmployee.hireDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class EmployeeService extends EmployeesService {
  protected readonly http = inject(HttpClient);

  create(employee: NewEmployee): Observable<IEmployee> {
    const copy = this.convertValueFromClient(employee);
    return this.http.post<RestEmployee>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(employee: IEmployee): Observable<IEmployee> {
    const copy = this.convertValueFromClient(employee);
    return this.http
      .put<RestEmployee>(`${this.resourceUrl}/${encodeURIComponent(this.getEmployeeIdentifier(employee))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(employee: PartialUpdateEmployee): Observable<IEmployee> {
    const copy = this.convertValueFromClient(employee);
    return this.http
      .patch<RestEmployee>(`${this.resourceUrl}/${encodeURIComponent(this.getEmployeeIdentifier(employee))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<IEmployee> {
    return this.http
      .get<RestEmployee>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IEmployee[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEmployee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
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
    const employees: Type[] = employeesToCheck.filter(isPresent);
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

  protected convertValueFromClient<T extends IEmployee | NewEmployee | PartialUpdateEmployee>(employee: T): RestOf<T> {
    return {
      ...employee,
      hireDate: employee.hireDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestEmployee): IEmployee {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestEmployee[]): IEmployee[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
