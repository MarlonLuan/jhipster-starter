import { HttpHeaders } from '@angular/common/http';
import { Component, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';
import { combineLatest, filter, map, tap } from 'rxjs';

import { DEFAULT_SORT_DATA, ITEMS_PER_PAGE, ITEM_DELETED_EVENT, PAGE_HEADER, SORT, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ItemCount } from 'app/shared/pagination';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { JobDeleteDialog } from '../delete/job-delete-dialog';
import { IJob } from '../job.model';
import { JobService } from '../service/job.service';

@Component({
  selector: 'jhi-job',
  templateUrl: './job.html',
  imports: [RouterLink, FontAwesomeModule, AlertError, Alert, SortDirective, SortByDirective, TranslateDirective, NgbPagination, ItemCount],
})
export class Job {
  readonly jobs = linkedSignal(() => this.fillComponentAttributesFromResponseBody([...this.jobService.jobs()]));

  sortState = sortStateSignal({});

  readonly itemsPerPage = signal(ITEMS_PER_PAGE);
  readonly totalItems = signal(0);
  readonly page = signal(1);

  readonly router = inject(Router);
  private readonly jobService = inject(JobService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly isLoading = this.jobService.jobsResource.isLoading;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly activatedRouteState = toSignal(
    combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      map(([queryParamMap, data]) => ({ queryParamMap, data })),
    ),
    { initialValue: { queryParamMap: this.activatedRoute.snapshot.queryParamMap, data: this.activatedRoute.snapshot.data } },
  );
  private readonly sortService = inject(SortService);
  private readonly modalService = inject(NgbModal);

  constructor() {
    effect(() => {
      const headers = this.jobService.jobsResource.headers();
      if (headers) {
        this.fillComponentAttributesFromResponseHeader(headers);
      }
    });
    effect(() => {
      const activatedRouteState = this.activatedRouteState();
      untracked(() => {
        // Only watch for route changes. Other signals should be ignored.
        this.fillComponentAttributeFromRoute(activatedRouteState.queryParamMap, activatedRouteState.data);
        this.load();
      });
    });
  }

  trackId = (item: IJob): string => this.jobService.getJobIdentifier(item);

  delete(job: IJob): void {
    const modalRef = this.modalService.open(JobDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.job = job;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend();
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page(), event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  private fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page.set(+(page ?? 1));
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  private fillComponentAttributesFromResponseBody(data: IJob[]): IJob[] {
    return data;
  }

  private fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems.set(Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER)));
  }

  private queryBackend(): void {
    const pageToLoad: number = this.page();
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage(),
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    this.jobService.jobsParams.set(queryObject);
  }

  private handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage(),
      sort: this.sortService.buildSortParam(sortState),
    };

    void this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }
}
