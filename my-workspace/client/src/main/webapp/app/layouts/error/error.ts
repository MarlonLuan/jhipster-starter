import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-error',
  imports: [TranslateDirective, TranslatePipe],
  templateUrl: './error.html',
})
export default class Error {
  readonly errorMessage = toSignal(inject(ActivatedRoute).data.pipe(map(data => data.errorMessage as string | undefined)));
}
