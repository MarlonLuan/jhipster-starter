import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: '099b6577-e459-4ae6-8877-0fc9de254d22',
};

export const sampleWithPartialData: ITask = {
  id: '21bb33a1-76d1-49b8-b664-78c1444c1282',
};

export const sampleWithFullData: ITask = {
  id: '93779c99-4145-4ec8-b238-9ba23b40a7d9',
  title: 'quickly closely',
  description: 'clean potato',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
