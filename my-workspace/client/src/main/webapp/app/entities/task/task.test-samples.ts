import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: '0967e5a6-70cd-4242-82c1-b3161b64814c',
};

export const sampleWithPartialData: ITask = {
  id: '79944e83-9a34-4ade-b41e-a631525e7c8a',
  title: 'cook bashfully',
};

export const sampleWithFullData: ITask = {
  id: 'edc12e7f-dd40-4346-a2af-7aff3f20fa98',
  title: 'wherever consistency eyebrow',
  description: 'deeply',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
