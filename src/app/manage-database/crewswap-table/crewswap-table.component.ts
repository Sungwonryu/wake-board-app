import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { HString } from '../../shared/lib/h-string';
import { ListUpdate } from '../../api-storage/api-storage.model';
import { TableActionData } from '../../shared/tables/table.model';

import { CrewshiftService } from './crewshift.service';
import { CrewFormDialogComponent } from '../crew-form-dialog/crew-form-dialog.component';

@Component({
  selector: 'app-crewswap-table',
  templateUrl: './crewswap-table.component.html',
  styleUrls: ['./crewswap-table.component.scss']
})
export class CrewswapTableComponent implements OnInit {

  HString = HString;

  tableData = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' },
    tableColumns: [
      { columnDef: 'shift', header: 'Shift', width: '330px', cellFn: (row: any) => `${this.HString.toDefaultString(row.shift)}` },
      { columnDef: 'location', header: 'Pick Up Location', width: '330px', cellFn: (row: any) => `${this.HString.toDefaultString(row.location)}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete'] }
    ],
    tableTitle: 'CREW SWAP RELATIONSHIPS',
    dataType: 'crewshifts'
  };

  list: any[] = [];
  $listUpdateSub: Subscription;

  formDialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private mainService: CrewshiftService
  ) { }

  ngOnInit() {
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // shift
    this.$listUpdateSub = this.mainService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.mainService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.list = this.mainService.getList();
      }
    });
  }

  initList() {
    this.list = this.mainService.getList();
  }

  initService() {
    this.mainService.api('read');
  }

  ngOnDestroy() {
    if (this.$listUpdateSub) {
      this.$listUpdateSub.unsubscribe();
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
        formDialogComponent = CrewFormDialogComponent;
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
