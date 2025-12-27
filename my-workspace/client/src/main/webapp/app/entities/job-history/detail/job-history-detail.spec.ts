import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { JobHistoryDetail } from './job-history-detail';

describe('JobHistory Management Detail Component', () => {
  let comp: JobHistoryDetail;
  let fixture: ComponentFixture<JobHistoryDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-history-detail').then(m => m.JobHistoryDetail),
              resolve: { jobHistory: () => of({ id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
    library.addIcons(faPencilAlt);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobHistoryDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobHistory on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobHistoryDetail);

      // THEN
      expect(instance.jobHistory()).toEqual(expect.objectContaining({ id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(globalThis.history.back).toHaveBeenCalled();
    });
  });
});
