import { IJob } from 'app/entities/job/job.model';

export interface ITask {
  id: string;
  title?: string | null;
  description?: string | null;
  jobs?: Pick<IJob, 'id'>[] | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
