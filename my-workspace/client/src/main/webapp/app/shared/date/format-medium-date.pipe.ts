import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';

@Pipe({
  name: 'formatMediumDate',
})
export default class FormatMediumDatePipe implements PipeTransform {
  /** Formats a date, the string the REST API sends or a Dayjs. */
  transform(day: dayjs.Dayjs | string | null | undefined): string {
    return day ? dayjs(day).format('D MMM YYYY') : '';
  }
}
