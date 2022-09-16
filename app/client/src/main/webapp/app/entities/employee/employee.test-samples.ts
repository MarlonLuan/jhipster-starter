import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '14dd2a5b-fa97-4f64-928f-64d64f5877f3',
};

export const sampleWithPartialData: IEmployee = {
  id: 'eee5af87-7ff5-45d2-ac35-b9e842aa6761',
  email: 'Dolly_Volkman43@yahoo.com',
  salary: 78746,
};

export const sampleWithFullData: IEmployee = {
  id: '8aa24601-072e-4e90-bbf2-a523e5c3ad43',
  firstName: 'Charles',
  lastName: 'Miller',
  email: 'Terrell.Pouros86@yahoo.com',
  phoneNumber: 'metrics Loan Brand',
  hireDate: dayjs('2022-09-16T03:31'),
  salary: 14616,
  commissionPct: 17603,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
