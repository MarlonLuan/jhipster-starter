import { beforeEach, describe, expect, it } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, submit } from '@angular/forms/signals';

import { ServerError } from './server-error';

@Component({
  imports: [ServerError],
  template: `<jhi-server-error [field]="nameForm.name" />`,
})
class NameForm {
  readonly nameModel = signal({ name: '' });
  readonly nameForm = form(this.nameModel, {
    submission: { action: field => Promise.resolve([{ kind: 'server', message: 'is refused', fieldTree: field.name }]) },
  });
}

describe('ServerError', () => {
  let fixture: ComponentFixture<NameForm>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(NameForm);
    await fixture.whenStable();
  });

  it('should show nothing without an error of the server', () => {
    expect(fixture.nativeElement.querySelector('[data-cy="serverError"]')).toBeNull();
  });

  it('should show the message of the error of the server', async () => {
    await submit(fixture.componentInstance.nameForm);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[data-cy="serverError"]')?.textContent).toBe('is refused');
  });
});
