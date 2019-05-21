import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { HString } from '../../shared/lib/h-string';

import { ApiResponse, ListUpdate } from '../../api-storage/api-storage.model';
import { TableActionData } from '../../shared/tables/table.model';
import { VesselnameService } from '../vesselname/vesselname.service';
import { VesselnumberService } from '../vesselnumber/vesselnumber.service';
import { VesseltypeService } from '../vesseltype/vesseltype.service';
import { VesselcapacityService } from '../vesselcapacity/vesselcapacity.service';
import { ShiftnameService } from '../shiftname/shiftname.service';
import { RouteService } from '../route/route.service';
import { CalltimeService } from '../calltime/calltime.service';
import { LocationService } from '../location/location.service';
import { EmployeeService } from '../employee/employee.service';
import { JobService } from '../job/job.service';

@Component({
  selector: 'app-basic-table-form-dialog',
  templateUrl: './basic-table-form-dialog.component.html',
  styleUrls: ['./basic-table-form-dialog.component.scss']
})
export class BasicTableFormDialogComponent implements OnInit {

  HString = HString;

  dataType: string = '';
  tableSettings: any = {};

  item: any = {};
  list: any[] = [];
  prop: string = '';
  pattern: string = '';
  mode: 'edit' | 'delete' = null;

  mainService: any;

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 200; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200;

  title = 'Modify Table';
  instruction = 'Modify or add Entries to the table using the fields below.';

  commonTableSettings = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['search'] },
    tableView: { headerHeight: '0', bodyHeight: '350px' }
  };

  // modifyEntryColumn =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '204px', isModifyEntry: true, modifyEntryButtons: ['edit-open', 'edit-cancel', 'save', 'delete', 'delete-cancel', 'delete-confirm'] };
  modifyEntryColumn =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '204px', isModifyEntry: true, modifyEntryButtons: ['edit-open', 'edit-cancel', 'save', 'delete-open'] };

  columnDefault = {
    fontColorFn: (row: any) => `${this.HString.toDefaultString(row.fontColor)}`,
    fontWeightFn: (row: any) => `${this.HString.toDefaultString(row.fontWeight)}`
  };

  vesselnameTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [
      { ...this.columnDefault, columnDef: 'vesselName', header: 'Vessel Name', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselName)}` },
      this.modifyEntryColumn
    ],
    tableTitle: 'Vessel Name',
    dataType: 'vessel_names',
    editProp: 'vesselName'
  };
  vesselnumberTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [
      { ...this.columnDefault, columnDef: 'vesselNumber', header: 'Vessel ID', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselNumber)}` },
      this.modifyEntryColumn
    ],
    tableTitle: 'Vessel ID',
    dataType: 'vessel_numbers',
    editProp: 'vesselNumber'
  };
  vesseltypeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'vesselType', header: 'Vessel Type', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselType)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Vessel Type',
    dataType: 'vessel_types',
    editProp: 'vesselType'
  };
  vesselcapacityTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'vesselCapacity', header: 'Vessel Capacity', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselCapacity)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Vessel Capacity',
    dataType: 'vessel_capacities',
    editProp: 'vesselCapacity'
  };
  shiftnameTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'shift', header: 'Shift', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Shift',
    dataType: 'shifts',
    editProp: 'shift'
  };
  routeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'route', header: 'Route', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.route)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Route',
    dataType: 'routes',
    editProp: 'route'
  };
  calltimeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'callTime', header: 'Call Time', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0, 5)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Call Time',
    dataType: 'call_times',
    editProp: 'callTime'
  };
  locationTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'location', header: 'Location', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.location)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Pick Up Location',
    dataType: 'locations',
    editProp: 'location'
  }
  jobTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'job', header: 'Job Title', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.job)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Job Title',
    dataType: 'jobs',
    editProp: 'job'
  };
  employeeTableSettings = {
    ...this.commonTableSettings,
    tableColumns: [{ ...this.columnDefault, columnDef: 'employee', header: 'Employee', width: '340px', cellFn: (row: any) => `${this.HString.toDefaultString(row.employee)}` },
    this.modifyEntryColumn
    ],
    tableTitle: 'Employee',
    dataType: 'employees',
    editProp: 'employee'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public vesselnameService: VesselnameService,
    public vesselnumberService: VesselnumberService,
    public vesseltypeService: VesseltypeService,
    public vesselcapacityService: VesselcapacityService,
    public shiftnameService: ShiftnameService,
    public routeService: RouteService,
    public calltimeService: CalltimeService,
    public locationService: LocationService,
    public employeeService: EmployeeService,
    public jobService: JobService,
    private dialogRef: MatDialogRef<BasicTableFormDialogComponent>
  ) { }

  ngOnInit() {
    this.initData();
    this.initListUpdate();
    this.initList();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    this.dataType = this.data.dataType;
    switch (this.dataType) {
      case 'vesselname':
        this.mainService = this.vesselnameService;
        this.tableSettings = this.vesselnameTableSettings;
        this.prop = 'vesselName';
        break;
      case 'vesselnumber':
        this.mainService = this.vesselnumberService;
        this.tableSettings = this.vesselnumberTableSettings;
        this.prop = 'vesselNumber';
        break;
      case 'vesseltype':
        this.mainService = this.vesseltypeService;
        this.tableSettings = this.vesseltypeTableSettings;
        this.prop = 'vesselType';
        break;
      case 'vesselcapacity':
        this.mainService = this.vesselcapacityService;
        this.tableSettings = this.vesselcapacityTableSettings;
        this.prop = 'vesselCapacity';
        break;
      case 'shiftname':
        this.mainService = this.shiftnameService;
        this.tableSettings = this.shiftnameTableSettings;
        this.prop = 'shift';
        break;
      case 'route':
        this.mainService = this.routeService;
        this.tableSettings = this.routeTableSettings;
        this.prop = 'route';
        break;
      case 'calltime':
        this.mainService = this.calltimeService;
        this.tableSettings = this.calltimeTableSettings;
        this.prop = 'callTime';
        this.pattern = '^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$';
        break;
      case 'location':
        this.mainService = this.locationService;
        this.tableSettings = this.locationTableSettings;
        this.prop = 'location';
        break;
      case 'employee':
        this.mainService = this.employeeService;
        this.tableSettings = this.employeeTableSettings;
        this.prop = 'employee';
        break;
      case 'job':
        this.mainService = this.jobService;
        this.tableSettings = this.jobTableSettings;
        this.prop = 'job';
        break;
    }
  }

  initListUpdate() {
    this.$listUpdateSub = this.mainService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      if (listUpdate && listUpdate.isUpdated === true) {
        this.list = this.mainService.getList();
      }
    });
  }

  initList() {
    this.list = this.mainService.getList();
  }

  initApiResponse() {
    // Initialize Subscription $apiResponseSub
    this.$apiResponseSub = this.mainService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      if (apiResponse.success) {
        // When apiResponse is successful
        console.log('apiResponse: ', apiResponse);
        switch (apiResponse.apiOpts.baseParamsObj.action) {
          case 'insert':
            this.mode = null;
            this.mainService.api('read');
            this.form.setValue({ newVal: '' });
            break;
          case 'update':
            this.mode = null;
            this.mainService.api('read');
            break;
          case 'delete':
            this.mode = null;
            this.mainService.api('read');
            break;
        }
      }
    });
  }

  initForm() {
    // If this.timeoutId id present, clear the previously invoked setTimeout()
    if (this.formInitTimeoutId !== null) {
      clearTimeout(this.formInitTimeoutId);
    }
    this.formInitTimeoutId = setTimeout(() => {
      this.form.setValue({ newVal: '' });
    }, this.formInitInterval);
  }

  onCloseForm() {
    this.dialogRef.close();
  }

  modifyTable(tableActionData: TableActionData) {
    console.log('modifyTable(), tableActionData: ', tableActionData);
    switch(tableActionData.tableAction) {
      case 'override':
        this.mainService.api('override', tableActionData.entries[0]);
        break;
      case 'delete':
        this.mainService.api('delete', tableActionData.entries[0]);
        break;
    }
  }

  addToTable() {
    console.log('addToTable()');
    let newItem: any = {};
    newItem[this.prop] = this.form.value.newVal;
    this.mainService.api('insert', newItem);
  }

  matchPattern() {
    console.log('matchPattern');
    let isMatched  = true;
    const newVal = this.form.value.newVal;
    if (this.pattern && typeof this.pattern === 'string' && newVal) {
      isMatched = this.HString.regexTest(this.pattern, newVal);
    }
    return isMatched;
  }
}
