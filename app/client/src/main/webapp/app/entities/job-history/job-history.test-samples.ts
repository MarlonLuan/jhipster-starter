import dayjs from 'dayjs/esm';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: '5140dff9-ab49-4882-a42b-a3a3b175e037',
};

export const sampleWithPartialData: IJobHistory = {
  id: '5c4fa0e6-76b5-42d6-9bcc-df6511a9cba4',
};

export const sampleWithFullData: IJobHistory = {
  id: '4b2595da-028d-4a3f-a049-9a694e3f35e8',
  startDate: dayjs('2024-04-10T01:44'),
  endDate: dayjs('2024-04-09T14:08'),
  language: 'FRENCH',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
