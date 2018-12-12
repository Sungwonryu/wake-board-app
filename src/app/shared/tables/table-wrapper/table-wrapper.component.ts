import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HArray } from '../../lib/h-array';

import { TableActionData, TableColumn, TableView, TitlebarView } from '../table.model';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit {

  HArray = HArray;

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

  filterValue: string = '';

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
