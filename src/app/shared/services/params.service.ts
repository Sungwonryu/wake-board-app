 import { Subject } from 'rxjs';

 import { HDate } from '../lib/h-date';

export class ParamsService {
  HDate = HDate;

  date: Date = null;

  $dateChange = new Subject<Date>();

  constructor() {
    // Set this.date as today's Date instance
    this.initDate();
  }

  initDate() {
    // Remove hours, minutes and secondes in newDate
    this.date = this.HDate.toDate(this.HDate.toDateString(new Date()));
  }

  setDate(newDate?: any) {
    if (newDate && typeof newDate === 'object' && newDate instanceof Date) {
      // When newDate is not the same time as this.date,
      // emit this.$dateChange with newDate
      if (this.date.getTime() !== newDate.getTime()) {
        this.date = newDate;
        this.$dateChange.next(newDate);
      }
    }
  }

  getDate() {
    return this.date;
  }
}
