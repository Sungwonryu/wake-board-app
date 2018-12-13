import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnDestroy, OnInit {

  @Input() format: string = '';
  @Input() ordinalSuffix: boolean = false;

  clock: Date = null;
  intervalId: any = null;
  intervalDelay = 500; // 500 ms

  constructor() { }

  ngOnInit() {
    this.clock = new Date();
    this.intervalId = setInterval(() => {
      this.clock = new Date();
    }, this.intervalDelay);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
