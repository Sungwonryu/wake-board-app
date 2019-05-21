// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-table-wrapper-multi',
//   templateUrl: './table-wrapper-multi.component.html',
//   styleUrls: ['./table-wrapper-multi.component.scss']
// })
// export class TableWrapperMultiComponent implements OnInit {
//
//   constructor() { }
//
//   ngOnInit() {
//   }
//
// }


import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HList } from '../../lib/h-list';

import { TableActionData, TableColumn, TableView, TitlebarView } from '../table.model';

@Component({
  selector: 'app-table-wrapper-multi',
  templateUrl: './table-wrapper-multi.component.html',
  styleUrls: ['./table-wrapper-multi.component.scss']
})
export class TableWrapperMultiComponent implements OnInit {

  defaults = {
    headerColor: '#222222',
    headerBgColor: '#ECECEC',
    headerFontFamily: 'Lato',
    headerFontSize: '14px'
  };

  HList = HList;

  @Input() mainService: any = null;

  // table titlebar view settings
  @Input() titlebarView: TitlebarView = {};
  @Input() tableTitle: string = '';

  // table column and view settings
  @Input() tableView: TableView = {};
  @Input() tableColumns: TableColumn[] = [];

  // table data and filter settings
  @Input() dataType: string = '';
  @Input() data: any[] = [];
  // @Input() filterValue: string = '';

  @Input() mode: 'edit' | 'delete' = null;
  @Input() editProp: string = '';
  @Input() editPattern: string = '';
  filterValue: string = '';

  @Input() data2: any[] = [];

  @Output() onModifyTable = new EventEmitter<TableActionData>();

  constructor() { }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  modify(tableActionData: TableActionData) {
    this.onModifyTable.emit(tableActionData);
  }

  addEntry() {
    const tableActionData: TableActionData = { tableAction: 'add', dataType: this.dataType };
    this.onModifyTable.emit(tableActionData);
  }

  duplicateAllEntries() {
    const tableActionData: TableActionData = { tableAction: 'duplicateAll', dataType: this.dataType, entries: this.data };
    this.onModifyTable.emit(tableActionData);
  }

}
