import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeDetailComponent } from './employee-detail.component';

describe('Component Tests', () => {
  describe('Employee Management Detail Component', () => {
    let comp: EmployeeDetailComponent;
    let fixture: ComponentFixture<EmployeeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EmployeeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ employee: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(EmployeeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmployeeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load employee on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.employee).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
