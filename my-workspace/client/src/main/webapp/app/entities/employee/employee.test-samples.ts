import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '45d65e9e-1c5f-4bf0-87f0-94bd4c787463',
};

export const sampleWithPartialData: IEmployee = {
  id: 'e7bb318e-817b-4234-a44c-3feb57a7d003',
  firstName: 'Verla',
  lastName: 'Graham',
  email: 'Tressie.Christiansen@hotmail.com',
  phoneNumber: 'draft',
  salary: 5661,
};

export const sampleWithFullData: IEmployee = {
  id: '9cc8c9f0-b708-4c46-b961-1f02c7e2a3bc',
  firstName: 'Trudie',
  lastName: 'Rippin',
  email: 'Marcia.Littel73@yahoo.com',
  phoneNumber: 'pick brr glum',
  hireDate: dayjs('1969-12-31T13:23'),
  salary: 32028,
  commissionPct: 17425,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
