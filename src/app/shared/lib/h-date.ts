import { DatePipe } from '@angular/common';

/**
 *  _pad() returns 2 digits number string
 *  by prepending '0' if the given number is less than 10
*/
function _pad(num: number) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
}

export class HDate {
  /**
   *  toDate() returns a Date object if dateStr is a valid Date string.
   *  Otherwise, it will return undefined
  */
  static toDate(dateStr?: any) {
    let timestamp;
    if (dateStr && typeof dateStr === 'string') {
      // Replace '-' in dateStr to '/'
      // because Safari doesn't support 'yyyy-MM-dd' format
      // Safari supports 'yyyy/MM/dd'
      dateStr = dateStr.replace(/-/g, '/');
      // Date.parse() returns a timestamp,
      // an integer respresenting the number of milliseconds since 1970/01/01
      timestamp = Date.parse(dateStr);
    }

    // If timestamp is not NaN, dateStr is valid
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    } else {
      return null;
    }
  }

  /**
   *  toDatetimeString() converts a Date instance to
   *  a datetime in string format like '2018/05/19 16:00:00'
  */
  static toDatetimeString(date?: any) {
    if (date && date instanceof Date) {
      const str = date.getFullYear() +
        '/' + _pad(date.getMonth() + 1) +
        '/' + _pad(date.getDate()) +
        ' ' + _pad(date.getHours()) +
        ':' + _pad(date.getMinutes()) +
        ':' + _pad(date.getSeconds());
      return str;
    }
  }

  /**
   *  toDateString() converts a Date instance to
   *  a date in string format like '2018/05/19'
  */
  static toDateString(date?: any) {
    if (date && date instanceof Date) {
      const str = date.getFullYear() +
        '/' + _pad(date.getMonth() + 1) +
        '/' + _pad(date.getDate());
      return str;
    }
  }

  /**
   *  toTimeString() converts a Date instance to
   *  a time in string format like '16:00'
  */
  static toTimeString(date: any) {
    if (date && date instanceof Date) {
      const str = _pad(date.getHours()) +
        ':' + _pad(date.getMinutes());
      return str;
    }
  }

  /**
   *  toDBDatetimeString() converts a Date instance to
   *  a datetime in string format like '2018-05-19 16:00:00'
  */
  static toDBDatetimeString(date?: any) {
    if (date && date instanceof Date) {
      const str = date.getFullYear() +
        '-' + _pad(date.getMonth() + 1) +
        '-' + _pad(date.getDate()) +
        ' ' + _pad(date.getHours()) +
        ':' + _pad(date.getMinutes()) +
        ':' + _pad(date.getSeconds());
      return str;
    }
  }

  /**
   *  toDateDBString() converts a Date instance to
   *  a date in string format like '2018-05-19'
  */
  static toDBDateString(date?: any) {
    if (date && date instanceof Date) {
      const str = date.getFullYear() +
        '-' + _pad(date.getMonth() + 1) +
        '-' + _pad(date.getDate());
      return str;
    }
  }

  /**
   *  toTimeDBString() converts a Date instance to
   *  a time in string format like '16:00:00'
  */
  static toDBTimeString(date: any) {
    if (date && date instanceof Date) {
      const str = _pad(date.getHours()) +
        ':' + _pad(date.getMinutes()) +
        ':' + _pad(date.getSeconds());
      return str;
    }
  }

  static formatDate(date: any, format: string) {
    let str = '';
    if (date && date instanceof Date) {
      const datePipe = new DatePipe('en-US');
      str = datePipe.transform(date, format);
    }
    return str;
  }
}
