import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

/**
 * The message of the error the server gave for a field, shown next to the field.
 */
@Component({
  selector: 'jhi-server-error',
  template: `
    @if (field()().getError('server'); as error) {
      <small class="form-text text-danger" data-cy="serverError">{{ error.message }}</small>
    }
  `,
})
export class ServerError {
  readonly field = input.required<FieldTree<unknown>>();
}
