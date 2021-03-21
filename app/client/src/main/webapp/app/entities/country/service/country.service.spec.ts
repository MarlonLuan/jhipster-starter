import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICountry, Country } from '../country.model';

import { CountryService } from './country.service';

describe('Service Tests', () => {
  describe('Country Service', () => {
    let service: CountryService;
    let httpMock: HttpTestingController;
    let elemDefault: ICountry;
    let expectedResult: ICountry | ICountry[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CountryService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        countryName: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Country', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Country()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Country', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            countryName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Country', () => {
        const patchObject = Object.assign(
          {
            countryName: 'BBBBBB',
          },
          new Country()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Country', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            countryName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Country', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCountryToCollectionIfMissing', () => {
        it('should add a Country to an empty array', () => {
          const country: ICountry = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addCountryToCollectionIfMissing([], country);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(country);
        });

        it('should not add a Country to an array that contains it', () => {
          const country: ICountry = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const countryCollection: ICountry[] = [
            {
              ...country,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addCountryToCollectionIfMissing(countryCollection, country);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Country to an array that doesn't contain it", () => {
          const country: ICountry = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const countryCollection: ICountry[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addCountryToCollectionIfMissing(countryCollection, country);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(country);
        });

        it('should add only unique Country to an array', () => {
          const countryArray: ICountry[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '67d0ef1e-7576-4c4c-bbb6-04008619f448' },
          ];
          const countryCollection: ICountry[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addCountryToCollectionIfMissing(countryCollection, ...countryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const country: ICountry = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const country2: ICountry = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addCountryToCollectionIfMissing([], country, country2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(country);
          expect(expectedResult).toContain(country2);
        });

        it('should accept null and undefined values', () => {
          const country: ICountry = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addCountryToCollectionIfMissing([], null, country, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(country);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
