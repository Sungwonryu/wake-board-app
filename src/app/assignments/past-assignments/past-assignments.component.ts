import { Component, OnDestroy, OnInit } from '@angular/core';

import { TableActionData } from '../../shared/tables/table.model';

import { DummyData } from '../dummy-data';

@Component({
  selector: 'app-past-assignments',
  templateUrl: './past-assignments.component.html',
  styleUrls: ['./past-assignments.component.scss']
})
export class PastAssignmentsComponent implements OnInit, OnDestroy {

  DummyData = DummyData;

  commonTableData = {
    titlebarView: { height: '50px', bgColor: '#3CA2E2', titlebarComponents: ['duplicateAll', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '270px' },
  }

  vesselassignmentTableData = {
    ...this.commonTableData,
    tableColumns: [
      { columnDef: 'id', header: 'ID', width: '200px', cellFn: (row: any) => `${row.id}` },
      { columnDef: 'name', header: 'Name', width: '200px', cellFn: (row: any) => `${row.name}` },
      { columnDef: 'progress', header: 'Progress', width: '200px', cellFn: (row: any) => `${row.progress}` },
      { columnDef: 'color', header: 'Color', width: '200px', cellFn: (row: any) => `${row.color}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '400px', isModifyEntry: true, modifyEntryButtons: ['duplicate'] }
    ],
    tableTitle: 'ASSIGN VESSELS',
    dataType: 'vesselassignment'
  };

  slipassignmentTableData = {
    ...this.commonTableData,
    tableColumns: [
      { columnDef: 'id', header: 'ID', width: '200px', cellFn: (row: any) => `${row.id}` },
      { columnDef: 'name', header: 'Name', width: '200px', cellFn: (row: any) => `${row.name}` },
      { columnDef: 'progress', header: 'Progress', width: '200px', cellFn: (row: any) => `${row.progress}` },
      { columnDef: 'color', header: 'Color', width: '200px', cellFn: (row: any) => `${row.color}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '400px', isModifyEntry: true, modifyEntryButtons: ['duplicate'] }
    ],
    tableTitle: 'ASSIGN SLIPS',
    dataType: 'slipassignment'
  };

  noteTableData = {
    ...this.commonTableData,
    tableColumns: [
      { columnDef: 'id', header: 'ID', width: '200px', cellFn: (row: any) => `${row.id}` },
      { columnDef: 'name', header: 'Name', width: '200px', cellFn: (row: any) => `${row.name}` },
      { columnDef: 'progress', header: 'Progress', width: '200px', cellFn: (row: any) => `${row.progress}` },
      { columnDef: 'color', header: 'Color', width: '200px', cellFn: (row: any) => `${row.color}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '400px', isModifyEntry: true, modifyEntryButtons: ['duplicate'] }
    ],
    tableTitle: 'NOTES',
    dataType: 'note'
  };

  crewswapTableData = {
    ...this.commonTableData,
    tableColumns: [
      { columnDef: 'id', header: 'ID', width: '200px', cellFn: (row: any) => `${row.id}` },
      { columnDef: 'name', header: 'Name', width: '200px', cellFn: (row: any) => `${row.name}` },
      { columnDef: 'progress', header: 'Progress', width: '200px', cellFn: (row: any) => `${row.progress}` },
      { columnDef: 'color', header: 'Color', width: '200px', cellFn: (row: any) => `${row.color}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '400px', isModifyEntry: true, modifyEntryButtons: ['duplicate'] }
    ],
    tableTitle: 'CREW SWAPS',
    dataType: 'crewswap'
  };

  intervalId: any = null;
  data: any[] = [];

  constructor() { }

  ngOnInit() {
    this.data = this.DummyData.getData();

    // this.intervalId = setInterval(() => {
    //   this.data = this.DummyData.getData();
    //   console.log('Data is updated!');
    // }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  modifyTable(tableActionData: TableActionData) {
    console.log('modifyTable() - talbeActionData: ', tableActionData);
  }

  updateData() {
    this.data = this.DummyData.getData();
    console.log('Data is updated!');
  }

}
