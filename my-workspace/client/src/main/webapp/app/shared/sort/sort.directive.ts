import { Directive, model } from '@angular/core';

import { SortOrder, SortState } from './sort-state';

@Directive({
  selector: '[jhiSort]',
})
export class SortDirective {
  readonly sortState = model.required<SortState>();

  sort(field: string): void {
    const { predicate, order } = this.sortState();
    const toggle = (): SortOrder => (order === 'asc' ? 'desc' : 'asc');
    const newSortState = { predicate: field, order: field === predicate ? toggle() : 'asc' };
    this.sortState.set(newSortState);
  }
}
