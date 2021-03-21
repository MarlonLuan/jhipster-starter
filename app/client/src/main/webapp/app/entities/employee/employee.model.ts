import * as dayjs from 'dayjs';
import { IJob } from 'app/entities/job/job.model';
import { IDepartment } from 'app/entities/department/department.model';

export interface IEmployee {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  jobs?: IJob[] | null;
  manager?: IEmployee | null;
  department?: IDepartment | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public hireDate?: dayjs.Dayjs | null,
    public salary?: number | null,
    public commissionPct?: number | null,
    public jobs?: IJob[] | null,
    public manager?: IEmployee | null,
    public department?: IDepartment | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): string | undefined {
  return employee.id;
}
