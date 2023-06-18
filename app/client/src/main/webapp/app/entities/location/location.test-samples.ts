import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 79338,
};

export const sampleWithPartialData: ILocation = {
  id: 784,
};

export const sampleWithFullData: ILocation = {
  id: 12399,
  streetAddress: 'glucose',
  postalCode: 'and Diesel Crew',
  city: 'Novellaland',
  stateProvince: 'green',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
