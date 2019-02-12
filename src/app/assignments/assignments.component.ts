import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { HDate } from '../shared/lib/h-date';
import { HString } from '../shared/lib/h-string';
import { HList } from '../shared/lib/h-list';
import { ApiResponse, ListUpdate } from '../api-storage/api-storage.model';
import { TableActionData } from '../shared/tables/table.model';

import { ParamsService } from '../shared/services/params.service';
import { VesselService } from '../manage-database/vessel-table/vessel.service';
import { VesselassignmentService } from './vesselassignment/vesselassignment.service';
import { SlipassignmentService } from './slipassignment/slipassignment.service';
import { NoteService } from './note/note.service';
import { CrewswapService } from './crewswap/crewswap.service';

import { DateFormDialogComponent } from './date-form-dialog/date-form-dialog.component';
import { DuplicateFormDialogComponent } from './duplicate-form-dialog/duplicate-form-dialog.component';
import { NoteFormDialogComponent } from './note-form-dialog/note-form-dialog.component';
import { CrewswapFormDialogComponent } from './crewswap-form-dialog/crewswap-form-dialog.component';
import { SlipassignmentFormDialogComponent } from './slipassignment-form-dialog/slipassignment-form-dialog.component';
import { VesselassignmentFormDialogComponent } from './vesselassignment-form-dialog/vesselassignment-form-dialog.component';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit, OnDestroy {

  HDate = HDate;
  HString = HString;
  HList = HList;

  isPast: boolean = false;
  date: Date = null;
  dateChangeSub: Subscription;

  vesselList: any[] = [];
  $vesselListUpdateSub: Subscription;

  vesselassignmentList: any[] = [];
  $vesselassignmentListUpdateSub: Subscription;
  $vesselassignmentApiResponseSub: Subscription;

  slipassignmentList: any[] = [];
  $slipassignmentListUpdateSub: Subscription;
  $slipassignmentApiResponseSub: Subscription;

  noteList: any[] = [];
  $noteListUpdateSub: Subscription;
  $noteApiResponseSub: Subscription;

  crewswapList: any[] = [];
  $crewswapListUpdateSub: Subscription;
  $crewswapApiResponseSub: Subscription;

  dateFormDialogRef: MatDialogRef<any>;
  formDialogRef: MatDialogRef<any>;

  commonTableData = {
    titlebarView: { height: '50px', bgColor: '#3CA2E2', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' }
  };

  commonTableDataPast = {
    ...this.commonTableData,
    titlebarView: { height: '50px', bgColor: '#3CA2E2', titlebarComponents: ['duplicateAll', 'search'] },
  };

  // modifyEntryColumn =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '204px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete', 'delete-confirm', 'delete-cancel'] };
  modifyEntryColumn =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '204px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete-open'] };
  modifyEntryColumnPast =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '204px', isModifyEntry: true, modifyEntryButtons: ['duplicate'] };

  columnDefault = {
    fontColorFn: (row: any) => `${this.HString.toDefaultString(row.fontColor)}`,
    fontWeightFn: (row: any) => `${this.HString.toDefaultString(row.fontWeight)}`
  };

  vesselassignmentTableColumns = [
    { ...this.columnDefault, columnDef: 'shift', header: 'Shift', width: '124px', textAlign: 'center', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
    { ...this.columnDefault, columnDef: 'route', header: 'Route', width: '96px', textAlign: 'center', cellFn: (row: any) => `${this.HString.toDefaultString(row.route)}` },
    { ...this.columnDefault, columnDef: 'callTime', header: 'Call Time', width: '80px', textAlign: 'center', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0, 5)}` },
    { ...this.columnDefault, columnDef: 'firstDeparture', header: 'First Departure', textAlign: 'center', width: '110px', cellFn: (row: any) => `${this.HString.toDefaultString(row.firstDeparture).slice(0, 5)}` },
    // { ...this.columnDefault, columnDef: 'vesselId', header: 'Vessel', width: '200px', cellFn: (row: any) => `${this.HString.toDefaultString(this.vesselService.getVesselName(row.vesselId))}` },
    { ...this.columnDefault, columnDef: 'vesselId', header: 'Vessel', width: '200px', textAlign: 'center', cellFn: (row: any) => `${this.HString.toDefaultString(row.vessel)}` },
    { ...this.columnDefault, columnDef: 'captain1', header: 'Captain 1', width: '126px', textAlign: 'center', messagePropFn: () => 'captain1MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.captain1)}` },
    { ...this.columnDefault, columnDef: 'captain2', header: 'Captain 2', width: '126px', textAlign: 'center', messagePropFn: () => 'captain2MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.captain2)}` },
    { ...this.columnDefault, columnDef: 'deckhand1', header: 'Deckhand 1', width: '126px', textAlign: 'center', messagePropFn: () => 'deckhand1MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.deckhand1)}` },
    { ...this.columnDefault, columnDef: 'deckhand2', header: 'Deckhand 2', width: '126px', textAlign: 'center', messagePropFn: () => 'deckhand2MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.deckhand2)}` },
    { ...this.columnDefault, columnDef: 'deckhand3', header: 'Deckhand 3', width: '126px', textAlign: 'center', messagePropFn: () => 'deckhand3MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.deckhand3)}` },
    { ...this.columnDefault, columnDef: 'deckhand4', header: 'Deckhand 4', width: '126px', textAlign: 'center', messagePropFn: () => 'deckhand4MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.deckhand4)}` },
    { ...this.columnDefault, columnDef: 'gsa1', header: 'GSA 1', width: '126px', textAlign: 'center', messagePropFn: () => 'gsa1MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.gsa1)}` },
    { ...this.columnDefault, columnDef: 'gsa2', header: 'GSA 2', width: '126px', textAlign: 'center', messagePropFn: () => 'gsa2MessageId', cellFn: (row: any) => `${this.HString.shortenFullName(row.gsa2)}` },
  ];

  vesselassignmentTableData = {
    ...this.commonTableData,
    dataType: 'vesselassignment',
    tableTitle: 'ASSIGN VESSELS',
    tableColumns: [
      ...this.vesselassignmentTableColumns,
      this.modifyEntryColumn
    ]
  };

  vesselassignmentTableDataPast = {
    ...this.commonTableDataPast,
    tableTitle: 'ASSIGN VESSELS',
    dataType: 'vesselassignment',
    tableColumns: [
      ...this.vesselassignmentTableColumns,
      this.modifyEntryColumnPast
    ]
  };

  slipassignmentTableColumns = [
    { ...this.columnDefault, columnDef: 'slip', header: 'Slip', width: '70px', cellFn: (row: any) => `${this.HString.toDefaultString(row.slip)}` },
    // { ...this.columnDefault, columnDef: 'vessel1Id', header: 'Vessel 1', width: '185px', cellFn: (row: any) => `${this.HString.toDefaultString(this.vesselService.getVesselName(row.vessel1Id))}`, fontColorFn: (row: any) => `${(row.vessel1Availability === '0' ? '#FF5757' : '')}`, fontWeightFn: (row: any) => `${(row.vessel1Availability === '0' ? 'bold' : 'medium')}` },
    // { ...this.columnDefault, columnDef: 'vessel2Id', header: 'Vessel 2', width: '185px', cellFn: (row: any) => `${this.HString.toDefaultString(this.vesselService.getVesselName(row.vessel2Id))}`, fontColorFn: (row: any) => `${(row.vessel2Availability === '0' ? '#FF5757' : '')}`, fontWeightFn: (row: any) => `${(row.vessel2Availability === '0' ? 'bold' : 'medium')}` },
    // { ...this.columnDefault, columnDef: 'vessel3Id', header: 'Vessel 3', width: '185px', cellFn: (row: any) => `${this.HString.toDefaultString(this.vesselService.getVesselName(row.vessel3Id))}`, fontColorFn: (row: any) => `${(row.vessel3Availability === '0' ? '#FF5757' : '')}`, fontWeightFn: (row: any) => `${(row.vessel3Availability === '0' ? 'bold' : 'medium')}` },
    { ...this.columnDefault, columnDef: 'vessel1Id', header: 'Vessel 1', width: '185px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vessel1)}`, fontColorFn: (row: any) => `${(row.vessel1Availability === '0' ? '#FF5757' : '')}`, fontWeightFn: (row: any) => `${(row.vessel1Availability === '0' ? 'bold' : 'medium')}` },
    { ...this.columnDefault, columnDef: 'vessel2Id', header: 'Vessel 2', width: '185px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vessel2)}`, fontColorFn: (row: any) => `${(row.vessel2Availability === '0' ? '#FF5757' : '')}`, fontWeightFn: (row: any) => `${(row.vessel2Availability === '0' ? 'bold' : 'medium')}` },
    { ...this.columnDefault, columnDef: 'vessel3Id', header: 'Vessel 3', width: '185px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vessel3)}`, fontColorFn: (row: any) => `${(row.vessel3Availability === '0' ? '#FF5757' : '')}`, fontWeightFn: (row: any) => `${(row.vessel3Availability === '0' ? 'bold' : 'medium')}` },
  ];

  slipassignmentTableData = {
    ...this.commonTableData,
    tableView: { headerHeight: '40px', bodyHeight: '108px' },
    tableTitle: 'ASSIGN SLIPS',
    dataType: 'slipassignment',
    tableColumns: [
      ...this.slipassignmentTableColumns,
      this.modifyEntryColumn
    ]
  };

  slipassignmentTableDataPast = {
    ...this.commonTableDataPast,
    tableView: { headerHeight: '40px', bodyHeight: '108px' },
    tableTitle: 'ASSIGN SLIPS',
    dataType: 'slipassignment',
    tableColumns: [
      ...this.slipassignmentTableColumns,
      this.modifyEntryColumnPast
    ]
  };

  noteTableColumns = [
    { ...this.columnDefault, columnDef: 'note', header: 'Note', width: '335px', cellFn: (row: any) => `${this.HString.toDefaultString(row.note)}` },
    // { ...this.columnDefault, columnDef: 'priorityId', header: 'Priority', width: '80px', cellFn: (row: any) => `${this.HString.toDefaultString(this.noteService.getItemProperty('priorityList', { property: 'id', value: row.priorityId }, ['text']))}` },
    // { ...this.columnDefault, columnDef: 'durationId', header: 'Duration', width: '80px', cellFn: (row: any) => `${this.HString.toDefaultString(this.noteService.getItemProperty('durationList', { property: 'id', value: row.durationId }, ['text']))}` },
    // { ...this.columnDefault, columnDef: 'colorId', header: 'Color', width: '126px', cellFn: (row: any) => `${this.HString.toDefaultString(this.noteService.getItemProperty('colorList', { property: 'id', value: row.colorId }, ['text']))}` }
    { ...this.columnDefault, columnDef: 'priorityId', header: 'Priority', width: '80px', cellFn: (row: any) => `${this.HString.toDefaultString(row.priority)}` },
    { ...this.columnDefault, columnDef: 'durationId', header: 'Duration', width: '80px', cellFn: (row: any) => `${this.HString.toDefaultString(row.duration)}` },
    { ...this.columnDefault, columnDef: 'colorId', header: 'Color', width: '126px', cellFn: (row: any) => `${this.HString.toDefaultString(row.color)}` }
  ];

  noteTableData = {
    ...this.commonTableData,
    tableView: { headerHeight: '40px', bodyHeight: '108px' },
    tableTitle: 'NOTES',
    dataType: 'note',
    tableColumns: [
      ...this.noteTableColumns,
      this.modifyEntryColumn
    ]
  };

  noteTableDataPast = {
    ...this.commonTableDataPast,
    tableView: { headerHeight: '40px', bodyHeight: '108px' },
    tableTitle: 'NOTES',
    dataType: 'note',
    tableColumns: [
      ...this.noteTableColumns,
      this.modifyEntryColumnPast
    ]
  };

  crewswapTableColumns = [
    { ...this.columnDefault, columnDef: 'callTime', header: 'Call Time', width: '80px', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0,5)}` },
    { ...this.columnDefault, columnDef: 'firstDeparture', header: 'First Departure', width: '110px', cellFn: (row: any) => `${this.HString.toDefaultString(row.firstDeparture).slice(0,5)}` },
    // { ...this.columnDefault, columnDef: 'vesselId', header: 'Vessel', width: '230px', cellFn: (row: any) => `${this.HString.toDefaultString(this.vesselService.getVesselName(row.vesselId))}` },
    { ...this.columnDefault, columnDef: 'vesselId', header: 'Vessel', width: '230px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vessel)}` },
    { ...this.columnDefault, columnDef: 'shift', header: 'Shift', width: '126px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
    { ...this.columnDefault, columnDef: 'location', header: 'Pick Up Location', width: '148px', cellFn: (row: any) => `${this.HString.toDefaultString(row.location)}` }
  ];

  crewswapTableData = {
    ...this.commonTableData,
    tableView: { headerHeight: '40px', bodyHeight: '344px' },
    tableTitle: 'CREW SWAPS',
    dataType: 'crewswap',
    tableColumns: [
      ...this.crewswapTableColumns,
      this.modifyEntryColumn
    ]
  };

  crewswapTableDataPast = {
    ...this.commonTableDataPast,
    tableView: { headerHeight: '40px', bodyHeight: '344px' },
    tableTitle: 'CREW SWAPS',
    dataType: 'crewswap',
    tableColumns: [
      ...this.crewswapTableColumns,
      this.modifyEntryColumnPast
    ]
  };

  modeVesselassignment: 'edit' | 'delete' = null;
  modeSlipassignment: 'edit' | 'delete' = null;
  modeNote: 'edit' | 'delete' = null;
  modeCrewswap: 'edit' | 'delete' = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private paramsService: ParamsService,
    private vesselService: VesselService,
    private vesselassignmentService: VesselassignmentService,
    private slipassignmentService: SlipassignmentService,
    private noteService: NoteService,
    private crewswapService: CrewswapService
  ) { }

  ngOnInit() {
    console.log('date is init');
    this.initDateChange();
    this.initParamsHandle();
    this.initDate();
    this.initListUpdate();
    this.initList();
    this.initApiResponse();
    this.initService();
  }

  setDateParam(newDate: Date) {
    const newDateStr = this.HDate.toDBDateString(newDate);
    this.router.navigate([], {
      relativeTo: this.route,
      skipLocationChange: true, // don't trigger navigation
      queryParams: { date: newDateStr },
      queryParamsHandling: 'merge' // preserve the existing query params in the route
    });
  }

  setIsPast(newDate: Date) {
    // set todayDT by removing hours, minutes and secondes from new Date() instance
    const todayDT = this.HDate.toDate(this.HDate.toDateString(new Date()));
    if (newDate.getTime() < todayDT.getTime()) {
      this.isPast = true;
    } else {
      this.isPast = false;
    }
  }

  initDateChange() {
    this.dateChangeSub = this.paramsService.$dateChange.subscribe((newDate: Date) => {
      this.date = newDate;
      this.setDateParam(newDate);
      this.setIsPast(newDate);
      this.initService();
    });
  }

  initParamsHandle() {
    this.route.queryParams.subscribe(params => {
      let newDate = this.HDate.toDate(params.date);
      if (newDate) {
        this.paramsService.setDate(newDate);
      }
    });
  }

  initDate() {
    if (!this.date) {
      const newDate = this.paramsService.getDate();
      this.date = newDate;
      this.setDateParam(newDate);
    }
  }

  initApiResponse() {
    // vesselassignment
    this.$vesselassignmentApiResponseSub = this.vesselassignmentService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      switch (apiResponse.apiOpts.baseParamsObj.action) {
        case 'delete':
          this.modeVesselassignment = null;
          break;
      }
    });
    // slipassignment
    this.$slipassignmentApiResponseSub = this.slipassignmentService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      switch (apiResponse.apiOpts.baseParamsObj.action) {
        case 'delete':
          this.modeSlipassignment = null;
          break;
      }
    });
    // note
    this.$noteApiResponseSub = this.noteService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      switch (apiResponse.apiOpts.baseParamsObj.action) {
        case 'delete':
          this.modeNote = null;
          break;
      }
    });
    // crewswap
    this.$crewswapApiResponseSub = this.crewswapService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      switch (apiResponse.apiOpts.baseParamsObj.action) {
        case 'delete':
          this.modeCrewswap = null;
          break;
      }
    });
  }

  initListUpdate() {
    // vessel
    this.$vesselListUpdateSub = this.vesselService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        // this.vesselList = this.vesselService.getList();
        this.vesselList = this.vesselService.getAutocompleteList();
      }
    });
    // vesselassignment
    this.$vesselassignmentListUpdateSub = this.vesselassignmentService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselassignmentService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselassignmentList = this.vesselassignmentService.getList();
      }
    });
    // slipassignment
    this.$slipassignmentListUpdateSub = this.slipassignmentService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.slipassignmentService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.slipassignmentList = this.slipassignmentService.getList();
      }
    });
    // note
    this.$noteListUpdateSub = this.noteService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.noteService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.noteList = this.noteService.getList();
      }
    });
    // crewswap
    this.$crewswapListUpdateSub = this.crewswapService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.crewswapService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.crewswapList = this.crewswapService.getList();
      }
    });
  }

  initList() {
    // this.vesselList = this.vesselService.getList();
    this.vesselList = this.vesselService.getAutocompleteList();
    console.log('vesselList', this.vesselList);
    this.vesselassignmentList = this.vesselassignmentService.getList();
    this.slipassignmentList = this.slipassignmentService.getList();
    this.noteList = this.noteService.getList();
    this.crewswapList = this.crewswapService.getList();
  }

  initService() {
    this.vesselService.api('read');
    this.vesselassignmentService.api('read');
    this.slipassignmentService.api('read');
    this.noteService.api('read');
    this.crewswapService.api('read');
  }

  ngOnDestroy() {
    if (this.dateChangeSub) {
      this.dateChangeSub.unsubscribe();
    }
    if (this.$vesselListUpdateSub) {
      this.$vesselListUpdateSub.unsubscribe();
    }
    if (this.$vesselassignmentListUpdateSub) {
      this.$vesselassignmentListUpdateSub.unsubscribe();
    }
    if (this.$slipassignmentListUpdateSub) {
      this.$slipassignmentListUpdateSub.unsubscribe();
    }
    if (this.$noteListUpdateSub) {
      this.$noteListUpdateSub.unsubscribe();
    }
    if (this.$crewswapListUpdateSub) {
      this.$crewswapListUpdateSub.unsubscribe();
    }
  }

  changeDate(newDate: Date) {
    console.log('changeDate(), newDate : ', newDate);
    this.setDateParam(newDate);
  }

  openFormDialog(tableActionData: TableActionData, formDialogComponent: any, panelClass: string) {
    this.formDialogRef = this.dialog.open(formDialogComponent, {
      panelClass: panelClass,
      // Disable the feature that the user can use escape or clicking outside to close a modal.
      disableClose: true,
      data: {
        tableActionData: tableActionData
      }
    });

    // After the formDialog is closed, refresh the lists
    if (this.formDialogRef) {
      this.formDialogRef.afterClosed().subscribe(() => {
        this.initService();
      });
    }
  }

  modifyTable(tableActionData: TableActionData) {
    let panelClass;
    let formDialogComponent;
    let mainService;
    let openForm: boolean = false;
    console.log('tableActionData: ', tableActionData);

    switch(tableActionData.dataType) {
      case 'vesselassignment':
        formDialogComponent = VesselassignmentFormDialogComponent;
        mainService = this.vesselassignmentService;
        break;
      case 'slipassignment':
        formDialogComponent = SlipassignmentFormDialogComponent;
        mainService = this.slipassignmentService;
        break;
      case 'note':
        formDialogComponent = NoteFormDialogComponent;
        mainService = this.noteService;
        break;
      case 'crewswap':
        formDialogComponent = CrewswapFormDialogComponent;
        mainService = this.crewswapService;
        break;
    }

    switch(tableActionData.tableAction) {
      case 'duplicate':
      case 'duplicateAll':
        panelClass = 'duplicate-form-dialog-container';
        formDialogComponent = DuplicateFormDialogComponent;
        openForm = true;
        break;
      case 'add':
      case 'edit':
        panelClass = 'form-dialog-container';
        if (tableActionData.dataType === 'vesselassignment') {
          panelClass = 'vesselassignment-form-dialog-container';
        }
        if (tableActionData.tableAction === 'edit') {
          mainService.api('override', tableActionData.entries[0]);
        }
        openForm = true;
        break;
      case 'delete':
        console.log('delete', tableActionData);
        mainService.api('delete', tableActionData.entries[0]);
        break;
    }

    if (panelClass && formDialogComponent && openForm) {
      this.openFormDialog(tableActionData, formDialogComponent, panelClass);
    }
  }

  openDateForm() {
    const panelClass = 'date-form-dialog-container';
    const formDialogComponent = DateFormDialogComponent;

    // Open DateFormDialogComponent
    this.dateFormDialogRef = this.dialog.open(formDialogComponent, {
      panelClass: panelClass,
      // Disable the feature that the user can use escape or clicking outside to close a modal.
      disableClose: true,
      data: {
        date: this.date
      }
    });

    // After the formDialog is closed, refresh the lists
    if (this.dateFormDialogRef) {
      this.dateFormDialogRef.afterClosed().subscribe((data) => {
        if (data && typeof data === 'object' && data.date instanceof Date) {
          this.changeDate(data.date);
        }
      });
    }
  }

  displayCrewName(item: any, prop: string) {
    let displayName = '';
    if (item && item[prop]) {
      const fullName = this.HString.toDefaultString(item[prop]).split(',');
      const lastName = this.HString.toDefaultString(fullName[0]).trim();
      const firstMiddleName = this.HString.toDefaultString(fullName[1]).trim();
      let firstName = firstMiddleName;
      const index = firstMiddleName.lastIndexOf(' ');
      if (index !== -1) {
        firstName = firstMiddleName.substring(0, index);
      }
      // displayName = firstName + ' ' + lastName[0].toUpperCase() + lastName.slice(1, 3);
      displayName = firstName + ' ' + lastName[0].toUpperCase() + '.';
    }
    return displayName;
  }

}
