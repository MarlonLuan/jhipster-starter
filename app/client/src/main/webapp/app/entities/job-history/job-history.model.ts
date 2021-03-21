import * as dayjs from 'dayjs';
import { IJob } from 'app/entities/job/job.model';
import { IDepartment } from 'app/entities/department/department.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IJobHistory {
  id?: string;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  language?: Language | null;
  job?: IJob | null;
  department?: IDepartment | null;
  employee?: IEmployee | null;
}

export class JobHistory implements IJobHistory {
  constructor(
    public id?: string,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public language?: Language | null,
    public job?: IJob | null,
    public department?: IDepartment | null,
    public employee?: IEmployee | null
  ) {}
}

export function getJobHistoryIdentifier(jobHistory: IJobHistory): string | undefined {
  return jobHistory.id;
}
