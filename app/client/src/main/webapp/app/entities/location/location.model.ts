import { ICountry } from 'app/entities/country/country.model';
import { IDepartment } from 'app/entities/department/department.model';

export interface ILocation {
  id: string;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  country?: Pick<ICountry, 'id'> | null;
  department?: Pick<IDepartment, 'id'> | null;
}

export type NewLocation = Omit<ILocation, 'id'> & { id: null };
