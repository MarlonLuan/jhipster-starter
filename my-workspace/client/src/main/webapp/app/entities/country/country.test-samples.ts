import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: '333897a8-3949-489b-8971-eaf17695e86c',
};

export const sampleWithPartialData: ICountry = {
  id: '92fdb047-c686-4841-890a-3e36e348f9a2',
  countryName: 'till what',
};

export const sampleWithFullData: ICountry = {
  id: 'ad9cf214-0289-48cd-988e-02ada1cd5623',
  countryName: 'gah boohoo intensely',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
