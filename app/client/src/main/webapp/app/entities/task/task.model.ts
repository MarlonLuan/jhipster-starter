export interface ITask {
  id: string;
  title?: string | null;
  description?: string | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
