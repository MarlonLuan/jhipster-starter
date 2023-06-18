import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 32504,
};

export const sampleWithPartialData: IEmployee = {
  id: 69709,
  hireDate: dayjs('2023-06-18T03:30'),
  salary: 48404,
};

export const sampleWithFullData: IEmployee = {
  id: 49531,
  firstName: 'Garfield',
  lastName: 'Mayert',
  email: 'Thad_Jones20@hotmail.com',
  phoneNumber: 'override',
  hireDate: dayjs('2023-06-17T18:08'),
  salary: 56129,
  commissionPct: 63628,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
