 import { Subject } from 'rxjs';

 import { HDate } from '../lib/h-date';

export class ParamsService {
  HDate = HDate;

  date: Date = null;

  $dateUpdate = new Subject<Date>();

  constructor() {
    // Set this.date as today Date instance
    this.setDate();
  }

  setDate(dateStr?: string) {
    let newDate = this.HDate.toDate(dateStr);
    if (newDate) {
      newDate = newDate;
    } else {
      // Remove hours, minutes and secondes in newDate
      newDate = this.HDate.toDate(this.HDate.toDateString(new Date()));
    }
    if (!this.date || this.date.getTime() !== newDate.getTime()) {
      this.date = newDate;
      this.$dateUpdate.next(newDate);
    }
  }

  getDate() {
    return this.date;
  }
}
