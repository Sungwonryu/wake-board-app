import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { HString } from '../../shared/lib/h-string';
import { ListUpdate } from '../../api-storage/api-storage.model';
import { TableActionData } from '../../shared/tables/table.model';

import { ShiftService } from './shift.service';
import { ShiftFormDialogComponent } from '../shift-form-dialog/shift-form-dialog.component';

@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss']
})
export class ShiftTableComponent implements OnInit, OnDestroy {

  HString = HString;

  tableData = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' },
    tableColumns: [
      { columnDef: 'shift', header: 'Shift', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
      { columnDef: 'route', header: 'Route', width: '180px', cellFn: (row: any) => `${this.HString.toDefaultString(row.route)}` },
      { columnDef: 'callTime', header: 'Call Time', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.callTime).slice(0, 5)}` },
      { columnDef: 'firstDeparture', header: 'First Departure', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.firstDeparture).slice(0, 5)}` },
      // { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete', 'delete-cancel', 'delete-confirm'] }
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete-open'] }
    ],
    tableTitle: 'SHIFT RELATIONSHIPS',
    dataType: 'shifts'
  };

  shiftList: any[] = [];
  $shiftListUpdateSub: Subscription;

  formDialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private mainService: ShiftService
  ) { }

  ngOnInit() {
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // shift
    this.$shiftListUpdateSub = this.mainService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.mainService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.shiftList = this.mainService.getList();
      }
    });
  }

  initList() {
    this.shiftList = this.mainService.getList();
  }

  initService() {
    this.mainService.api('read');
  }

  ngOnDestroy() {
    if (this.$shiftListUpdateSub) {
      this.$shiftListUpdateSub.unsubscribe();
    }
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
    console.log('tableActionData: ', tableActionData);

    switch(tableActionData.tableAction) {
      case 'add':
      case 'edit':
        panelClass = 'relationship-form-dialog-container';
        formDialogComponent = ShiftFormDialogComponent;
        if (tableActionData.tableAction === 'edit') {
          this.mainService.api('override', tableActionData.entries[0]);
        }
        break;
      case 'delete':
        console.log('delete', tableActionData);
        this.mainService.api('delete', tableActionData.entries[0]);
        break;
    }

    if (panelClass && formDialogComponent) {
      this.openFormDialog(tableActionData, formDialogComponent, panelClass);
    }
  }

}
