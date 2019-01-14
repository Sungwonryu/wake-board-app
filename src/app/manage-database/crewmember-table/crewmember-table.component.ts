import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { HString } from '../../shared/lib/h-string';
import { ListUpdate } from '../../api-storage/api-storage.model';
import { TableActionData } from '../../shared/tables/table.model';

import { CrewmemberService } from './crewmember.service';
import { CrewmemberFormDialogComponent } from '../crewmember-form-dialog/crewmember-form-dialog.component';

@Component({
  selector: 'app-crewmember-table',
  templateUrl: './crewmember-table.component.html',
  styleUrls: ['./crewmember-table.component.scss']
})
export class CrewmemberTableComponent implements OnInit {

  HString = HString;

  tableData = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' },
    tableColumns: [
      { columnDef: 'employee', header: 'Employee Name', width: '330px', cellFn: (row: any) => `${this.HString.toDefaultString(row.employee)}` },
      { columnDef: 'job', header: 'Job Title', width: '330px', cellFn: (row: any) => `${this.HString.toDefaultString(row.job)}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete'] }
    ],
    tableTitle: 'CREW MEMBER RELATIONSHIPS',
    dataType: 'employees'
    // dataType: 'crew_members'
  };

  crewmemberList: any[] = [];
  $crewmemberListUpdateSub: Subscription;

  formDialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private mainService: CrewmemberService
  ) { }

  ngOnInit() {
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // crewmember
    this.$crewmemberListUpdateSub = this.mainService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.mainService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.crewmemberList = this.mainService.getList();
      }
    });
  }

  initList() {
    this.crewmemberList = this.mainService.getList();
  }

  initService() {
    this.mainService.api('read');
  }

  ngOnDestroy() {
    if (this.$crewmemberListUpdateSub) {
      this.$crewmemberListUpdateSub.unsubscribe();
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
        formDialogComponent = CrewmemberFormDialogComponent;
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
