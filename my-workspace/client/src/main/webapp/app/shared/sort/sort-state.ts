import { WritableSignal, signal } from '@angular/core';

import { type SortState } from 'app/shared/jhipster/pagination';

export type { SortOrder, SortState } from 'app/shared/jhipster/pagination';

export const sortStateSignal = (state: SortState): WritableSignal<SortState> =>
  signal(state, {
    equal: (a, b) => a.predicate === b.predicate && a.order === b.order,
  });
