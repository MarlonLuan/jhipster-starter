import dayjs from 'dayjs/esm';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: '880fc29d-0c6a-41d9-aaa8-7dd15ebbb791',
};

export const sampleWithPartialData: IJobHistory = {
  id: 'fe24647c-5475-4214-accc-f677b4ec5ce5',
  language: 'ENGLISH',
};

export const sampleWithFullData: IJobHistory = {
  id: 'dbe9e736-a37d-4270-9102-6e7506f8aa24',
  startDate: dayjs('1969-12-31T16:19'),
  endDate: dayjs('1970-01-01T03:30'),
  language: 'FRENCH',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
