import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '57427bc4-b977-459e-a6b8-3582f8a0c27a',
};

export const sampleWithPartialData: IEmployee = {
  id: '1d9467fc-a3d4-4467-a310-ea58b74cf92b',
  email: 'Corine83@hotmail.com',
  phoneNumber: 'initiatives Passenger',
  hireDate: dayjs('2023-06-17T23:47'),
  salary: 13147,
  commissionPct: 30875,
};

export const sampleWithFullData: IEmployee = {
  id: '74073ee2-8994-40d4-a0ba-ee2487f526a6',
  firstName: 'Roderick',
  lastName: 'Witting',
  email: 'Kyra.Bradtke@gmail.com',
  phoneNumber: 'programming',
  hireDate: dayjs('2023-06-18T05:28'),
  salary: 5408,
  commissionPct: 20114,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
