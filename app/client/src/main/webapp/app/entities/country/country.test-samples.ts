import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: '3c3f3185-997c-4a38-a73b-9744928a9db8',
};

export const sampleWithPartialData: ICountry = {
  id: '7117efa0-fc18-4796-9d9b-5be88a6ec40a',
};

export const sampleWithFullData: ICountry = {
  id: '29a21f6d-4ba0-4145-879c-46f836a8e4c1',
  countryName: 'quaintly underneath',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
