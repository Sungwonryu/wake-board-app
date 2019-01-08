import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HString } from '../../shared/lib/h-string';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { VesselnameService } from '../vesselname/vesselname.service';
import { VesselnumberService } from '../vesselnumber/vesselnumber.service';
import { VesseltypeService } from '../vesseltype/vesseltype.service';
import { VesselcapacityService } from '../vesselcapacity/vesselcapacity.service';
import { ShiftnameService } from '../shiftname/shiftname.service';
import { RouteService } from '../route/route.service';
import { LocationService } from '../location/location.service';;
import { CalltimeService } from '../calltime/calltime.service';
import { EmployeeService } from '../employee/employee.service';
import { JobService } from '../job/job.service';

@Component({
  selector: 'app-basic-tables',
  templateUrl: './basic-tables.component.html',
  styleUrls: ['./basic-tables.component.scss']
})
export class BasicTablesComponent implements OnInit, OnDestroy {

  HString = HString;

  headerMessage = 'The Master Database houses the information used to create Crewboard assignments. To modify or add data, select “Edit Table” underneath the corresponding item.';

  commonTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '404px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
  };

  vesselnameTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'vesselName', header: 'Vessel Name', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselName)}` }],
    tableTitle: 'Vessel Name',
    dataType: 'vessel_names'
  };
  vesselnumberTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'vesselNumber', header: 'Vessel ID', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselNumber)}` }],
    tableTitle: 'Vessel ID',
    dataType: 'vessel_numbers'
  };
  vesseltypeTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '152px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'vesselType', header: 'Vessel Type', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselType)}` }],
    tableTitle: 'Vessel Type',
    dataType: 'vessel_types'
  };
  vesselcapacityTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '116px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'vesselCapacity', header: 'Vessel Capacity', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselCapacity)}` }],
    tableTitle: 'Vessel Capacity',
    dataType: 'vessel_capacities'
  };
  shiftnameTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'shift', header: 'Shift', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` }],
    tableTitle: 'Shift',
    dataType: 'shifts'
  };
  routeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'route', header: 'Route', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.route)}` }],
    tableTitle: 'Route',
    dataType: 'routes'
  };
  calltimeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'callTime', header: 'Call Time', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0, 5)}` }],
    tableTitle: 'Call Time',
    dataType: 'call_times'
  };
  locationTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '152px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'location', header: 'Location', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.location)}` }],
    tableTitle: 'Pick Up Location',
    dataType: 'locations'
  }
  jobTableSettings = {
    tableView: { headerHeight: '58px', bodyHeight: '152px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
    tableColumns: [{ columnDef: 'job', header: 'Job Title', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.job)}` }],
    tableTitle: 'Job Title',
    dataType: 'jobs'
  };
  employeeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ columnDef: 'employee', header: 'Employee', width: '130px', cellFn: (row: any) => `${this.HString.toDefaultString(row.employee)}` }],
    tableTitle: 'Employee',
    dataType: 'employees'
  };

  filterValue = '';

  vesselnameList: any[] = [];
  $vesselnameListUpdateSub: Subscription;

  vesseltypeList: any[] = [];
  $vesseltypeListUpdateSub: Subscription;

  vesselnumberList: any[] = [];
  $vesselnumberListUpdateSub: Subscription;

  vesselcapacityList: any[] = [];
  $vesselcapacityListUpdateSub: Subscription;

  shiftnameList: any[] = [];
  $shiftnameListUpdateSub: Subscription;

  routeList: any[] = [];
  $routeListUpdateSub: Subscription;

  calltimeList: any[] = [];
  $calltimeListUpdateSub: Subscription;

  locationList: any[] = [];
  $locationListUpdateSub: Subscription;

  jobList: any[] = [];
  $jobListUpdateSub: Subscription;

  employeeList: any[] = [];
  $employeeListUpdateSub: Subscription;

  constructor(
    private vesselnameService: VesselnameService,
    private vesselnumberService: VesselnumberService,
    private vesseltypeService: VesseltypeService,
    private vesselcapacityService: VesselcapacityService,
    private shiftnameService: ShiftnameService,
    private routeService: RouteService,
    private calltimeService: CalltimeService,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private jobService: JobService,
  ) { }

  ngOnInit() {
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // vesselname
    this.$vesselnameListUpdateSub = this.vesselnameService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselnameService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselnameList = this.vesselnameService.getList();
      }
    });
    // vesselnumber
    this.$vesselnumberListUpdateSub = this.vesselnumberService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselnumberService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselnumberList = this.vesselnumberService.getList();
      }
    });
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
    this.$shiftnameListUpdateSub = this.shiftnameService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.shiftnameService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.shiftnameList = this.shiftnameService.getList();
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
    // employee
    this.$employeeListUpdateSub = this.employeeService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.employeeService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.employeeList = this.employeeService.getList();
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
    this.vesselnameList = this.vesselnameService.getList();
    this.vesselnumberList = this.vesselnumberService.getList();
    this.vesseltypeList = this.vesseltypeService.getList();
    this.vesselcapacityList = this.vesselcapacityService.getList();
    this.shiftnameList = this.shiftnameService.getList();
    this.routeList = this.routeService.getList();
    this.calltimeList = this.calltimeService.getList();
    this.locationList = this.locationService.getList();
    this.employeeList = this.employeeService.getList();
    this.jobList = this.jobService.getList();
  }

  initService() {
    this.vesselnameService.api('read');
    this.vesselnumberService.api('read');
    this.vesseltypeService.api('read');
    this.vesselcapacityService.api('read');
    this.shiftnameService.api('read');
    this.routeService.api('read');
    this.calltimeService.api('read');
    this.locationService.api('read');
    this.employeeService.api('read');
    this.jobService.api('read');
  }

  ngOnDestroy() {
    if (this.$vesselnameListUpdateSub) {
      this.$vesselnameListUpdateSub.unsubscribe();
    }
    if (this.$vesselnumberListUpdateSub) {
      this.$vesselnumberListUpdateSub.unsubscribe();
    }
    if (this.$vesseltypeListUpdateSub) {
      this.$vesseltypeListUpdateSub.unsubscribe();
    }
    if (this.$vesselcapacityListUpdateSub) {
      this.$vesselcapacityListUpdateSub.unsubscribe();
    }
    if (this.$shiftnameListUpdateSub) {
      this.$shiftnameListUpdateSub.unsubscribe();
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
