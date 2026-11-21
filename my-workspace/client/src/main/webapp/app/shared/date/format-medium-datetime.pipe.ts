import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';

@Pipe({
  name: 'formatMediumDatetime',
})
export default class FormatMediumDatetimePipe implements PipeTransform {
  /** Formats a date and time, the string the REST API sends or a Dayjs. */
  transform(day: dayjs.Dayjs | string | null | undefined): string {
    return day ? dayjs(day).format('D MMM YYYY HH:mm:ss') : '';
  }
}
