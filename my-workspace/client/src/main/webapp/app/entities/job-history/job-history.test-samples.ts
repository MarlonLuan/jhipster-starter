import dayjs from 'dayjs/esm';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: '54dfa482-2aab-47e3-bad5-4ae7b26cd61a',
};

export const sampleWithPartialData: IJobHistory = {
  id: '55a2d309-a9ef-4587-91d0-82e129e33024',
  endDate: dayjs('1970-01-01T01:34'),
};

export const sampleWithFullData: IJobHistory = {
  id: 'a48c2125-f339-4984-a2dc-f93e9b159a43',
  startDate: dayjs('1969-12-31T21:18'),
  endDate: dayjs('1969-12-31T13:08'),
  language: 'SPANISH',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
