import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 'c701fccc-d2c2-400d-ad00-e49eb3f6a2be',
};

export const sampleWithPartialData: ILocation = {
  id: 'bb0388f2-cc7e-436c-9a5d-a919bc476fed',
  streetAddress: 'familiarize conservative',
  postalCode: 'upon per',
  city: 'El Dorado Hills',
  stateProvince: 'lawful',
};

export const sampleWithFullData: ILocation = {
  id: 'fbebbbef-63a9-4e90-9e14-f4dd5b41315c',
  streetAddress: 'boohoo and',
  postalCode: 'beyond',
  city: 'East Kendrickfurt',
  stateProvince: 'micromanage',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
