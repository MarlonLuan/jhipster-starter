import { ILocation } from 'app/entities/location/location.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IJobHistory } from 'app/entities/job-history/job-history.model';

export interface IDepartment {
  id: string;
  departmentName?: string | null;
  location?: Pick<ILocation, 'id'> | null;
  employees?: Pick<IEmployee, 'id'>[] | null;
  jobHistory?: Pick<IJobHistory, 'id'> | null;
}

export type NewDepartment = Omit<IDepartment, 'id'> & { id: null };
