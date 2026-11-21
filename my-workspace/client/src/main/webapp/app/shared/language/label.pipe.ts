import { Pipe, PipeTransform } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import { translationNotFoundMessage } from 'app/config';

/**
 * Gives the text of a label in the language of the user, or its text when the key has no translation.
 */
@Pipe({ name: 'label', pure: false })
export default class LabelPipe implements PipeTransform {
  private readonly translatePipe = new TranslatePipe();

  transform({ text, translationKey }: { text: string; translationKey?: string }): string {
    if (!translationKey) {
      return text;
    }
    const translated: string = this.translatePipe.transform(translationKey);
    return translated === translationKey || translated.startsWith(translationNotFoundMessage) ? text : translated;
  }
}
