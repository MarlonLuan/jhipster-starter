import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: '684b861b-2c15-4402-a277-318933fd4b5b',
  departmentName: 'digital user-centric',
};

export const sampleWithPartialData: IDepartment = {
  id: 'e56701eb-35f7-402c-b477-4fe4f434215b',
  departmentName: 'Hill Dynamic RSS',
};

export const sampleWithFullData: IDepartment = {
  id: 'b33fb7e9-8a28-4196-af19-2444a0201fd6',
  departmentName: 'cross-media Mississippi',
};

export const sampleWithNewData: NewDepartment = {
  departmentName: 'Investor',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
