import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: '6414de64-0d53-4042-9e42-0c5e8e37b63a',
};

export const sampleWithPartialData: ILocation = {
  id: 'e2220cbb-f906-4139-a68c-186411dc05cb',
  postalCode: 'deserted',
  city: 'Altenwerthport',
};

export const sampleWithFullData: ILocation = {
  id: 'a5652600-0907-448a-97c0-6de60e5bf02c',
  streetAddress: 'hastily fatal er',
  postalCode: 'against because peninsula',
  city: 'Vonton',
  stateProvince: 'from sophisticated even',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
