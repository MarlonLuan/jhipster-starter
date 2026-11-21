import { Directive, ElementRef, afterRenderEffect, inject, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

/**
 * Binds a field of a signal form to a native select whose options are any values, like entities, the multiple one
 * included: an option is written with its index in the options as value, the empty one with an empty value.
 *
 * ```html
 * <select [formField]="editForm.owner" [jhiSelectOptions]="owners()" [compareWith]="compareOwner">
 *   <option value=""></option>
 *   @for (owner of owners(); track $index) {
 *     <option [value]="$index">{{ owner.name }}</option>
 *   }
 * </select>
 * ```
 */
@Directive({
  selector: 'select[jhiSelectOptions]',
  host: {
    '(change)': 'onChange()',
    '(blur)': 'touch.emit()',
  },
})
export class SelectOptionsDirective<T> implements FormValueControl<T | T[] | null> {
  readonly value = model.required<T | T[] | null>();
  readonly jhiSelectOptions = input.required<readonly T[]>();
  readonly compareWith = input<(o1: T, o2: T) => boolean>((o1, o2) => o1 === o2);
  readonly touch = output();

  private readonly select: HTMLSelectElement = inject<ElementRef<HTMLSelectElement>>(ElementRef).nativeElement;

  constructor() {
    // The options are rendered by the template of the select: they are marked once rendered.
    afterRenderEffect(() => {
      const value = this.value();
      const compareWith = this.compareWith();
      const options = this.jhiSelectOptions();
      for (const option of Array.from(this.select.options)) {
        const item = option.value === '' ? undefined : options[Number(option.value)];
        if (Array.isArray(value)) {
          option.selected = item !== undefined && value.some(selected => compareWith(selected, item));
        } else {
          option.selected = item === undefined ? value === null : value !== null && compareWith(value, item);
        }
      }
    });
  }

  onChange(): void {
    const options = this.jhiSelectOptions();
    const selected = Array.from(this.select.selectedOptions)
      .filter(option => option.value !== '')
      .map(option => options[Number(option.value)]);
    this.value.set(this.select.multiple ? selected : (selected[0] ?? null));
  }
}
