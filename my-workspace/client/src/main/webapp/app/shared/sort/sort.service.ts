import { Service } from '@angular/core';

import { type SortState, buildSortParam, parseSortParam } from 'app/shared/jhipster/pagination';

@Service()
export class SortService {
  private readonly collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  startSort({ predicate, order }: Required<SortState>, fallback?: Required<SortState>): (a: any, b: any) => number {
    const multiply = order === 'desc' ? -1 : 1;
    return (a: any, b: any) => {
      const compare = this.collator.compare(a[predicate], b[predicate]);
      if (compare === 0 && fallback) {
        return this.startSort(fallback)(a, b);
      }
      return compare * multiply;
    };
  }

  parseSortParam(sortParam: string | undefined): SortState {
    return parseSortParam(sortParam);
  }

  buildSortParam(sortState: SortState, fallback?: string): string[] {
    return buildSortParam(sortState, fallback);
  }
}
