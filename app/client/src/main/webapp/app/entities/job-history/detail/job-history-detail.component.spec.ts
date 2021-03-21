import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobHistoryDetailComponent } from './job-history-detail.component';

describe('Component Tests', () => {
  describe('JobHistory Management Detail Component', () => {
    let comp: JobHistoryDetailComponent;
    let fixture: ComponentFixture<JobHistoryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JobHistoryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ jobHistory: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(JobHistoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobHistoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jobHistory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jobHistory).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
