import { ITask } from 'app/entities/task/task.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IJobHistory } from 'app/entities/job-history/job-history.model';

export interface IJob {
  id: string;
  jobTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  tasks?: Pick<ITask, 'id' | 'title'>[] | null;
  employee?: Pick<IEmployee, 'id'> | null;
  jobHistory?: Pick<IJobHistory, 'id'> | null;
}

export type NewJob = Omit<IJob, 'id'> & { id: null };
