import { ITask } from 'app/entities/task/task.model';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IJob {
  id?: string;
  jobTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  tasks?: ITask[] | null;
  employee?: IEmployee | null;
}

export class Job implements IJob {
  constructor(
    public id?: string,
    public jobTitle?: string | null,
    public minSalary?: number | null,
    public maxSalary?: number | null,
    public tasks?: ITask[] | null,
    public employee?: IEmployee | null
  ) {}
}

export function getJobIdentifier(job: IJob): string | undefined {
  return job.id;
}
