import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { HDate } from '../shared/lib/h-date';
import { HString } from '../shared/lib/h-string';
import { ListUpdate } from '../api-storage/api-storage.model';
import { TableActionData } from '../shared/tables/table.model';

import { ParamsService } from '../shared/services/params.service';
import { VesselService } from '../manage-database/vessel-table/vessel.service';
import { VesselassignmentService } from './vesselassignment/vesselassignment.service';
import { SlipassignmentService } from './slipassignment/slipassignment.service';
import { NoteService } from './note/note.service';
import { CrewswapService } from './crewswap/crewswap.service';

import { SlipassignmentFormDialogComponent } from './slipassignment-form-dialog/slipassignment-form-dialog.component';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit, OnDestroy {

  HDate = HDate;
  HString = HString;

  isPast: boolean = false;
  date: Date = null;
  dateChangeSub: Subscription;

  vesselList: any[] = [];
  $vesselListUpdateSub: Subscription;

  vesselassignmentList: any[] = [];
  $vesselassignmentListUpdateSub: Subscription;

  slipassignmentList: any[] = [];
  $slipassignmentListUpdateSub: Subscription;

  noteList: any[] = [];
  $noteListUpdateSub: Subscription;

  crewswapList: any[] = [];
  $crewswapListUpdateSub: Subscription;

  formDialogRef: MatDialogRef<any>;

  commonTableData = {
    titlebarView: { height: '50px', bgColor: '#3CA2E2', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' }
  };

  commonTableDataPast = {
    ...this.commonTableData,
    titlebarView: { height: '50px', bgColor: '#3CA2E2', titlebarComponents: ['duplicateAll', 'search'] },
  };

  modifyEntryColumn =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete'] };
  modifyEntryColumnPast =   { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['duplicate'] };

  vesselassignmentTableColumns = [
    { columnDef: 'shift', header: 'Shift', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
    { columnDef: 'route', header: 'Route', width: '60px', cellFn: (row: any) => `${this.HString.toDefaultString(row.route)}` },
    { columnDef: 'callTime', header: 'Call Time', width: '80px', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0, 5)}` },
    { columnDef: 'firstDeparture', header: 'First Departure', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.firstDeparture).slice(0, 5)}` },
    { columnDef: 'vesselNumber', header: 'Vessel ID', width: '90px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselNumber)}` },
    { columnDef: 'vesselName', header: 'Vessel Name', width: '140px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselName)}` },
    { columnDef: 'captain1', header: 'Captain 1', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.captain1)}` },
    { columnDef: 'captain2', header: 'Captain 2', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.captain2)}` },
    { columnDef: 'deckhand1', header: 'Deckhand 1', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.deckhand1)}` },
    { columnDef: 'deckhand2', header: 'Deckhand 2', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.deckhand2)}` },
    { columnDef: 'deckhand3', header: 'Deckhand 3', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.deckhand3)}` },
    { columnDef: 'deckhand4', header: 'Deckhand 4', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.deckhand4)}` },
    { columnDef: 'gsa1', header: 'GSA 1', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.gsa1)}` },
    { columnDef: 'gsa2', header: 'GSA 2', width: '120px', cellFn: (row: any) => `${this.HString.toDefaultString(row.gsa2)}` }
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
    { columnDef: 'slip', header: 'Slip', width: '100px', cellFn: (row: any) => `${row.slip}` },
    { columnDef: 'vessel1Name', header: 'Vessel 1', width: '100px', cellFn: (row: any) => `${row.vessel1Name}` },
    { columnDef: 'vessel2Name', header: 'Vessel 2', width: '100px', cellFn: (row: any) => `${row.vessel2Name}` },
    { columnDef: 'vessel3Name', header: 'Vessel 3', width: '100px', cellFn: (row: any) => `${row.vessel3Name}` }
  ];

  slipassignmentTableData = {
    ...this.commonTableData,
    tableTitle: 'ASSIGN SLIPS',
    dataType: 'slipassignment',
    tableColumns: [
      ...this.slipassignmentTableColumns,
      this.modifyEntryColumn
    ]
  };

  slipassignmentTableDataPast = {
    ...this.commonTableDataPast,
    tableTitle: 'ASSIGN SLIPS',
    dataType: 'slipassignment',
    tableColumns: [
      ...this.slipassignmentTableColumns,
      this.modifyEntryColumnPast
    ]
  };

  noteTableColumns = [
    { columnDef: 'note', header: 'Note', width: '100px', cellFn: (row: any) => `${row.note}` },
    { columnDef: 'priorityId', header: 'Priority', width: '100px', cellFn: (row: any) => `${row.priorityId}` },
    { columnDef: 'durationId', header: 'Duration', width: '100px', cellFn: (row: any) => `${HDate.toTimeString(row.durationId)}` },
    { columnDef: 'colorId', header: 'Color', width: '100px', cellFn: (row: any) => `${row.colorId}` }
  ];

  noteTableData = {
    ...this.commonTableData,
    tableTitle: 'NOTES',
    dataType: 'note',
    tableColumns: [
      ...this.noteTableColumns,
      this.modifyEntryColumn
    ]
  };

  noteTableDataPast = {
    ...this.commonTableDataPast,
    tableTitle: 'NOTES',
    dataType: 'note',
    tableColumns: [
      ...this.noteTableColumns,
      this.modifyEntryColumnPast
    ]
  };

  crewswapTableColumns = [
    { columnDef: 'callTime', header: 'Call Time', width: '100px', cellFn: (row: any) => `${row.callTime}` },
    { columnDef: 'firstDeparture', header: 'First Departure', width: '100px', cellFn: (row: any) => `${row.firstDeparture}` },
    { columnDef: 'vasselNumber', header: 'Vessel ID', width: '100px', cellFn: (row: any) => `${HDate.toDBDatetimeString(row.vasselNumber)}` },
    { columnDef: 'shift', header: 'Shift', width: '100px', cellFn: (row: any) => `${row.shift}` },
    { columnDef: 'location', header: 'Pick Up Location', width: '100px', cellFn: (row: any) => `${row.location}` }
  ];

  crewswapTableData = {
    ...this.commonTableData,
    tableTitle: 'CREW SWAPS',
    dataType: 'crewswap',
    tableColumns: [
      ...this.crewswapTableColumns,
      this.modifyEntryColumn
    ]
  };

  crewswapTableDataPast = {
    ...this.commonTableDataPast,
    tableTitle: 'CREW SWAPS',
    dataType: 'crewswap',
    tableColumns: [
      ...this.crewswapTableColumns,
      this.modifyEntryColumnPast
    ]
  };

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

  initListUpdate() {
    // vessel
    this.$vesselListUpdateSub = this.vesselService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesselService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselList = this.vesselService.getList();
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
    this.vesselList = this.vesselService.getList();
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

  openFormDialog(formDialogComponent: any, tableActionData: TableActionData) {

    // Open SlipassignmentFormDialogComponent
    this.formDialogRef = this.dialog.open(formDialogComponent, {
      panelClass: 'form-dialog-container',
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
    let formDialogComponent;
    switch(tableActionData.dataType) {
      case 'slipassignment':
        formDialogComponent = SlipassignmentFormDialogComponent;
        break;
    }

    if (formDialogComponent) {
      this.openFormDialog(formDialogComponent, tableActionData);
    }
  }
}
