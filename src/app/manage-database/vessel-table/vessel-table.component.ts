import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { HString } from '../../shared/lib/h-string';
import { ListUpdate } from '../../api-storage/api-storage.model';
import { TableActionData } from '../../shared/tables/table.model';

import { VesselService } from './vessel.service';
import { VesselFormDialogComponent } from '../vessel-form-dialog/vessel-form-dialog.component';
import { DuplicateFormDialogComponent } from '../../assignments/duplicate-form-dialog/duplicate-form-dialog.component';

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
      { columnDef: 'vesselNumber', header: 'Vessel ID', width: '160px', cellFn: (row: any) => `${this.HString.toDefaultString(row.vesselNumber)}` },
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

  formDialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private mainService: VesselService
  ) { }

  ngOnInit() {
    console.log('VesselTableComponent is init - this: ', this);
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // vessel
    this.$vesselListUpdateSub = this.mainService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.mainService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesselList = this.mainService.getList();
      }
    });
  }

  initList() {
    this.vesselList = this.mainService.getList();
  }

  initService() {
    this.mainService.api('read');
  }

  ngOnDestroy() {
    if (this.$vesselListUpdateSub) {
      this.$vesselListUpdateSub.unsubscribe();
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
      case 'duplicate':
      case 'duplicateAll':
        panelClass = 'duplicate-form-dialog-container';
        formDialogComponent = DuplicateFormDialogComponent;
        break;
      case 'add':
      case 'edit':
        panelClass = 'relationship-form-dialog-container';
        formDialogComponent = VesselFormDialogComponent;
        if (tableActionData.tableAction === 'edit') {
          this.mainService.api('override', tableActionData.entries[0]);
        }
        break;
    }

    if (panelClass && formDialogComponent) {
      this.openFormDialog(tableActionData, formDialogComponent, panelClass);
    }
  }

}
