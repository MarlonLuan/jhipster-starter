import dayjs from 'dayjs/esm';
import { IJob } from 'app/entities/job/job.model';
import { IDepartment } from 'app/entities/department/department.model';
import { IJobHistory } from 'app/entities/job-history/job-history.model';

export interface IEmployee {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  jobs?: Pick<IJob, 'id'>[] | null;
  manager?: Pick<IEmployee, 'id'> | null;
  department?: Pick<IDepartment, 'id'> | null;
  jobHistory?: Pick<IJobHistory, 'id'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
