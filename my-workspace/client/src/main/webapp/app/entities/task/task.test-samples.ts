import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: '48d52277-8822-451c-b2af-8ac2d6db7e44',
};

export const sampleWithPartialData: ITask = {
  id: 'b751c019-b7ab-4c2a-bcf3-93813e232715',
  title: 'sheathe hm',
};

export const sampleWithFullData: ITask = {
  id: '680ee62d-cbd3-4f39-ad5a-8e3732304692',
  title: 'condense familiar barring',
  description: 'hm zowie',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
