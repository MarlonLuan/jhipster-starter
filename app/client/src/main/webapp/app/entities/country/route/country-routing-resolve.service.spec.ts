jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICountry, Country } from '../country.model';
import { CountryService } from '../service/country.service';

import { CountryRoutingResolveService } from './country-routing-resolve.service';

describe('Service Tests', () => {
  describe('Country routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CountryRoutingResolveService;
    let service: CountryService;
    let resultCountry: ICountry | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CountryRoutingResolveService);
      service = TestBed.inject(CountryService);
      resultCountry = undefined;
    });

    describe('resolve', () => {
      it('should return ICountry returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCountry = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultCountry).toEqual({ id: '9fec3727-3421-4967-b213-ba36557ca194' });
      });

      it('should return new ICountry if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCountry = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCountry).toEqual(new Country());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCountry = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultCountry).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
