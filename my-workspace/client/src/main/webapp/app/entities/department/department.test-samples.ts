import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 'b051f710-c8f7-4238-9476-a8d32832ca08',
  departmentName: 'where whereas while',
};

export const sampleWithPartialData: IDepartment = {
  id: '6e7fc8ed-32c8-4653-bf4a-2d2e92fe511b',
  departmentName: 'dally',
};

export const sampleWithFullData: IDepartment = {
  id: 'cab4ad23-c17e-47b7-b32a-2a916d4025ab',
  departmentName: 'when suspiciously',
};

export const sampleWithNewData: NewDepartment = {
  departmentName: 'that',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
