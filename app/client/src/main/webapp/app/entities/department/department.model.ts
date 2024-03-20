import { ILocation } from 'app/entities/location/location.model';

export interface IDepartment {
  id: string;
  departmentName?: string | null;
  location?: Pick<ILocation, 'id'> | null;
}

export type NewDepartment = Omit<IDepartment, 'id'> & { id: null };
