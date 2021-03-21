jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILocation, Location } from '../location.model';
import { LocationService } from '../service/location.service';

import { LocationRoutingResolveService } from './location-routing-resolve.service';

describe('Service Tests', () => {
  describe('Location routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LocationRoutingResolveService;
    let service: LocationService;
    let resultLocation: ILocation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LocationRoutingResolveService);
      service = TestBed.inject(LocationService);
      resultLocation = undefined;
    });

    describe('resolve', () => {
      it('should return ILocation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLocation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultLocation).toEqual({ id: '9fec3727-3421-4967-b213-ba36557ca194' });
      });

      it('should return new ILocation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLocation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLocation).toEqual(new Location());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Location })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLocation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultLocation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
