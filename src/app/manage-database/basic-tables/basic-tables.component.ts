import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { VesseltypeService } from '../vesseltype/vesseltype.service';
import { VesselcapacityService } from '../vesselcapacity/vesselcapacity.service';
import { ShiftService } from '../shift/shift.service';
import { RouteService } from '../route/route.service';
import { LocationService } from '../location/location.service';;
import { CalltimeService } from '../calltime/calltime.service';
import { JobService } from '../job/job.service';

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
  shiftTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'shift', header: 'Shift', width: '130px', cellFn: (row: any) => `${row.shift.slice(0, 5)}` }],
    tableTitle: 'Shift',
    dataType: 'shifts'
  }
  routeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'route', header: 'Route', width: '130px', cellFn: (row: any) => `${row.route.slice(0, 5)}` }],
    tableTitle: 'Route',
    dataType: 'routes'
  }
  calltimeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'callTime', header: 'Call Time', width: '130px', cellFn: (row: any) => `${row.callTime.slice(0, 5)}` }],
    tableTitle: 'Calltime',
    dataType: 'calltimes'
  }
  locationTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '152px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'location', header: 'Location', width: '130px', cellFn: (row: any) => `${row.location}` }],
    tableTitle: 'Pick Up Location',
    dataType: 'location'
  }
  jobTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '152px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'job', header: 'Job Title', width: '130px', cellFn: (row: any) => `${row.job}` }],
    tableTitle: 'Job Title',
    dataType: 'job'
  }


  filterValue = '';

  vesseltypeList: any[] = [];
  $vesseltypeListUpdateSub: Subscription;

  vesselcapacityList: any[] = [];
  $vesselcapacityListUpdateSub: Subscription;

  shiftList: any[] = [];
  $shiftListUpdateSub: Subscription;

  routeList: any[] = [];
  $routeListUpdateSub: Subscription;

  calltimeList: any[] = [];
  $calltimeListUpdateSub: Subscription;

  locationList: any[] = [];
  $locationListUpdateSub: Subscription;

  jobList: any[] = [];
  $jobListUpdateSub: Subscription;

  constructor(
    private vesseltypeService: VesseltypeService,
    private vesselcapacityService: VesselcapacityService,
    private shiftService: ShiftService,
    private routeService: RouteService,
    private calltimeService: CalltimeService,
    private locationService: LocationService,
    private jobService: JobService,
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
    // shift
    this.$shiftListUpdateSub = this.shiftService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.shiftService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.shiftList = this.shiftService.getList();
      }
    });
    // route
    this.$routeListUpdateSub = this.routeService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.routeService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.routeList = this.routeService.getList();
      }
    });
    // calltime
    this.$calltimeListUpdateSub = this.calltimeService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.calltimeService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.calltimeList = this.calltimeService.getList();
      }
    });
    // location
    this.$locationListUpdateSub = this.locationService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.locationService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.locationList = this.locationService.getList();
      }
    });
    // job
    this.$jobListUpdateSub = this.jobService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.jobService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.jobList = this.jobService.getList();
      }
    });
  }

  initList() {
    this.vesseltypeList = this.vesseltypeService.getList();
    this.vesselcapacityList = this.vesselcapacityService.getList();
    this.shiftList = this.shiftService.getList();
    this.routeList = this.routeService.getList();
    this.calltimeList = this.calltimeService.getList();
    this.locationList = this.locationService.getList();
    this.jobList = this.jobService.getList();
  }

  initService() {
    this.vesseltypeService.api('read');
    this.vesselcapacityService.api('read');
    this.shiftService.api('read');
    this.routeService.api('read');
    this.calltimeService.api('read');
    this.locationService.api('read');
    this.jobService.api('read');
  }

  ngOnDestroy() {
    if (this.$vesseltypeListUpdateSub) {
      this.$vesseltypeListUpdateSub.unsubscribe();
    }
    if (this.$vesselcapacityListUpdateSub) {
      this.$vesselcapacityListUpdateSub.unsubscribe();
    }
    if (this.$shiftListUpdateSub) {
      this.$shiftListUpdateSub.unsubscribe();
    }
    if (this.$routeListUpdateSub) {
      this.$routeListUpdateSub.unsubscribe();
    }
    if (this.$calltimeListUpdateSub) {
      this.$calltimeListUpdateSub.unsubscribe();
    }
    if (this.$locationListUpdateSub) {
      this.$locationListUpdateSub.unsubscribe();
    }
    if (this.$jobListUpdateSub) {
      this.$jobListUpdateSub.unsubscribe();
    }
  }

}
