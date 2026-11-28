import { beforeEach, describe, expect, it } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';

import { SelectOptionsDirective } from './select-options.directive';

interface Item {
  id: number;
  name: string;
}

@Component({
  imports: [FormField, SelectOptionsDirective],
  template: `
    <select id="one" [formField]="itemForm.one" [jhiSelectOptions]="items" [compareWith]="compareItem">
      <option value=""></option>
      @for (item of items; track $index) {
        <option [value]="$index">{{ item.name }}</option>
      }
    </select>
    <select id="many" multiple [formField]="itemForm.many" [jhiSelectOptions]="items" [compareWith]="compareItem">
      @for (item of items; track $index) {
        <option [value]="$index">{{ item.name }}</option>
      }
    </select>
  `,
})
class ItemsForm {
  readonly items: Item[] = [
    { id: 1, name: 'first' },
    { id: 2, name: 'second' },
  ];
  readonly itemModel = signal<{ one: Item | null; many: Item[] }>({ one: { id: 2, name: 'second' }, many: [{ id: 1, name: 'first' }] });
  readonly itemForm = form(this.itemModel);

  compareItem = (o1: Item, o2: Item): boolean => o1.id === o2.id;
}

describe('SelectOptionsDirective', () => {
  let fixture: ComponentFixture<ItemsForm>;
  let one: HTMLSelectElement;
  let many: HTMLSelectElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ItemsForm);
    await fixture.whenStable();
    one = fixture.nativeElement.querySelector('#one');
    many = fixture.nativeElement.querySelector('#many');
  });

  it('should select the options of the value, compared by compareWith', () => {
    expect(one.value).toBe('1');
    expect(Array.from(many.selectedOptions).map(option => option.value)).toEqual(['0']);
  });

  it('should set the value to the selected options', () => {
    one.value = '';
    one.dispatchEvent(new Event('change'));
    many.options[1].selected = true;
    many.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.itemModel()).toEqual({
      one: null,
      many: [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
      ],
    });
  });

  it('should mark the field as touched on blur', () => {
    one.dispatchEvent(new Event('blur'));

    expect(fixture.componentInstance.itemForm.one().touched()).toBe(true);
  });
});
