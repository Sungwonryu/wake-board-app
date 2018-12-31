import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { VesseltypeService } from '../vesseltype/vesseltype.service'
import { VesselcapacityService } from '../vesselcapacity/vesselcapacity.service'
import { CalltimeService } from '../calltime/calltime.service'

// import { HDate } from '../../shared/lib/h-date';
// import { TableActionData } from '../../shared/tables/table.model';

@Component({
  selector: 'app-basic-tables',
  templateUrl: './basic-tables.component.html',
  styleUrls: ['./basic-tables.component.scss']
})
export class BasicTablesComponent implements OnInit, OnDestroy {

  headerMessage = 'The Master Database houses the information used to create Crewboard assignments. To modify or add data, select “Edit Table” underneath the corresponding item.';

  commonTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '404px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
  }

  vesseltypeTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '152px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'vesselType', header: 'Vessel Type', width: '130px', cellFn: (row: any) => `${row.vesselType}` }],
    tableTitle: 'Vessel Type',
    dataType: 'vesseltype'
  }
  vesselcapacityTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '116px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'vesselCapacity', header: 'Vessel Capacity', width: '130px', cellFn: (row: any) => `${row.vesselCapacity}` }],
    tableTitle: 'Vessel Capacity',
    dataType: 'vesselcapacities'
  }
  calltimeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'callTime', header: 'Call time', width: '130px', cellFn: (row: any) => `${row.callTime.slice(0, 5)}` }],
    tableTitle: 'Calltime',
    dataType: 'calltimes'
  }

  filterValue = '';

  vesseltypeList: any[] = [];
  vesselcapacityList: any[] = [];
  calltimeList: any[] = [];

  $vesseltypeListUpdateSub: Subscription;
  $vesselcapacityListUpdateSub: Subscription;
  $calltimeListUpdateSub: Subscription;

  constructor(
    private vesseltypeService: VesseltypeService,
    private vesselcapacityService: VesselcapacityService,
    private calltimeService: CalltimeService
  ) { }

  ngOnInit() {
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // vesseltype
    this.$vesseltypeListUpdateSub = this.vesseltypeService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesseltypeService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesseltypeList = this.vesseltypeService.getList();
      }
    });
    // vesselcapacity
    this.$vesselcapacityListUpdateSub = this.vesselcapacityService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselcapacityService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselcapacityList = this.vesselcapacityService.getList();
      }
    });
    // calltimes
    this.$calltimeListUpdateSub = this.calltimeService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.calltimeService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.calltimeList = this.calltimeService.getList();
      }
    });
  }

  initList() {
    this.vesseltypeList = this.vesseltypeService.getList();
    this.vesselcapacityList = this.vesselcapacityService.getList();
    this.calltimeList = this.calltimeService.getList();
  }

  initService() {
    this.vesseltypeService.api('read');
    this.vesselcapacityService.api('read');
    this.calltimeService.api('read');
  }

  ngOnDestroy() {
    if (this.$vesseltypeListUpdateSub) {
      this.$vesseltypeListUpdateSub.unsubscribe();
    }
    if (this.$vesselcapacityListUpdateSub) {
      this.$vesselcapacityListUpdateSub.unsubscribe();
    }
    if (this.$calltimeListUpdateSub) {
      this.$calltimeListUpdateSub.unsubscribe();
    }
  }

}
