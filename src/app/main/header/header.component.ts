import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { HDate } from '../../shared/lib/h-date';
import { ParamsService } from '../../shared/services/params.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges, OnInit {

  HDate = HDate;

  navList = [
    { routerLink: '/', caption: `Assignments`, routerLinkActiveOptions: { exact: true } },
    { routerLink: '/crewboard', caption: `Crewboard`, routerLinkActiveOptions: { exact: false } },
    { routerLink: '/manage-database', caption: `Manage\nDatabase`, routerLinkActiveOptions: { exact: false } }
  ];

  @Input() hasDatePicker: boolean = false;
  @Input() date: Date = null;
  @Output() onChangeDate = new EventEmitter<Date>();

  constructor(
    private paramsService: ParamsService
  ) { }

  ngOnInit() {
    this.date = this.paramsService.getDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    // When the changes on this.date happens
    if (changes.date) {
      console.log('changes on date, date: ', this.date);
    }
  }

  changeDate(newDate: Date) {
    this.onChangeDate.emit(newDate);
  }

  changeDateByOneDay(sign: string) {
    const dayTime = 86400000;
    let newDate;
    switch(sign) {
      case '+':
        newDate = new Date(this.date.getTime() + dayTime);
        break;
      case '-':
        newDate = new Date(this.date.getTime() - dayTime);
        break;
    }
    if (newDate) {
      this.changeDate(newDate);
    }
  }

  openCalendarForm() {
    alert('hi');
  }

}
