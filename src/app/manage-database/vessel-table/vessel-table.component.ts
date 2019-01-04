import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HString } from '../../shared/lib/h-string';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { VesselService } from './vessel.service';

@Component({
  selector: 'app-vessel-table',
  templateUrl: './vessel-table.component.html',
  styleUrls: ['./vessel-table.component.scss']
})
export class VesselTableComponent implements OnInit, OnDestroy {

  HString = HString;

  tableData = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' },
    tableColumns: [
      { columnDef: 'vesselNo', header: 'Vessel ID', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselNo)}` },
      { columnDef: 'vesselName', header: 'Vessel Name', width: '180px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselName)}` },
      { columnDef: 'vesselCapacity', header: 'Vessel Capacity', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselCapacity)}` },
      { columnDef: 'vesselType', header: 'Vessel Type', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselType)}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete'] }
    ],
    tableTitle: 'VESSEL RELATIONSHIPS',
    dataType: 'vessels'
  };

  vesselList: any[] = [];
  $vesselListUpdateSub: Subscription;

  constructor(
    private vesselService: VesselService
  ) { }

  ngOnInit() {
    console.log('VesselTableComponent is init - this: ', this);
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // vessel
    this.$vesselListUpdateSub = this.vesselService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselList = this.vesselService.getList();
      }
    });
  }

  initList() {
    this.vesselList = this.vesselService.getList();
  }

  initService() {
    this.vesselService.api('read');
  }

  ngOnDestroy() {
    if (this.$vesselListUpdateSub) {
      this.$vesselListUpdateSub.unsubscribe();
    }
  }

}
