import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 72965,
  departmentName: 'Belarus bandwidth',
};

export const sampleWithPartialData: IDepartment = {
  id: 8262,
  departmentName: 'dinosaur auxiliary',
};

export const sampleWithFullData: IDepartment = {
  id: 9779,
  departmentName: 'Estonia Gasoline input',
};

export const sampleWithNewData: NewDepartment = {
  departmentName: 'voluptate leverage Hat',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
