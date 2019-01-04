import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HString } from '../../shared/lib/h-string';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { ShiftService } from './shift.service';

@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss']
})
export class ShiftTableComponent implements OnInit {

  HString = HString;

  tableData = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' },
    tableColumns: [
      { columnDef: 'shift', header: 'Shift', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
      { columnDef: 'route', header: 'Route', width: '180px', cellFn: (row: any) => `${this.HString.toDefaultString(row.route)}` },
      { columnDef: 'callTime', header: 'Call Time', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0, 5)}` },
      { columnDef: 'firstDeparture', header: 'First Departure', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.firstDeparture).slice(0, 5)}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete'] }
    ],
    tableTitle: 'SHIFT RELATIONSHIPS',
    dataType: 'shifts'
  };

  shiftList: any[] = [];
  $shiftListUpdateSub: Subscription;

  constructor(
    private shiftService: ShiftService
  ) { }

  ngOnInit() {
    console.log('VesselTableComponent is init - this: ', this);
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // shift
    this.$shiftListUpdateSub = this.shiftService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.shiftService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.shiftList = this.shiftService.getList();
      }
    });
  }

  initList() {
    this.shiftList = this.shiftService.getList();
  }

  initService() {
    this.shiftService.api('read');
  }

  ngOnDestroy() {
    if (this.$shiftListUpdateSub) {
      this.$shiftListUpdateSub.unsubscribe();
    }
  }

}
