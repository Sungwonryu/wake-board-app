import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { VesselService } from '../../manage-database/vessel-table/vessel.service';

@Component({
  selector: 'app-crewboard-slipassignments',
  templateUrl: './crewboard-slipassignments.component.html',
  styleUrls: ['./crewboard-slipassignments.component.scss']
})
export class CrewboardSlipassignmentsComponent implements OnDestroy, OnInit {

  @Input() data: any[] = [];

  slipList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  visibleTableId: 0 | 1 = 0;
  changeTableDelay = 20000; // 20000 ms = 20 sec
  intervalId: any = null;

  constructor(
    public vesselService: VesselService
  ) { }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.changeVisibleTable();
    }, this.changeTableDelay);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getPropFromData(slip: string, prop: string) {
    let matchedProp;
    let matchedItem = this.data.find((item: any) => item.slip === slip);
    if (matchedItem) {
      matchedProp = matchedItem[prop];
    }
    return matchedProp;
  }

  changeVisibleTable() {
    this.visibleTableId = (this.visibleTableId === 0) ? 1 : 0;
  }
}
