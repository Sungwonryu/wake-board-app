import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { HArray } from '../../common/h-array';

import { TableActionData, TableActionType, TableColumn, TableView } from '../table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges, OnInit {

  HArray = HArray;

  // table column and view settings
  @Input() tableView: TableView = {};
  @Input() tableColumns: TableColumn[] = [];

  // table data and filter settings
  @Input() dataType: string = '';
  @Input() data: any[] = [];
  @Input() filterValue: string = '';

  @Output() onModifyEntry = new EventEmitter<TableActionData>();

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns(this.tableColumns);
    this.refreshData(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    // When the changes on this.data happens
    if (changes.data) {
      this.refreshData(this.data);
    }

    // When the changes on this.filterValue happens
    if (changes.filterValue) {
      this.applyFilter(this.filterValue);
    }
  }

  getDisplayedColumns(tableColumns: TableColumn[]) {
    const displayedColumns: string[] = tableColumns.map((column: TableColumn) => column.columnDef);
    return displayedColumns;
  }

  refreshData(data: any[]) {
    this.dataSource.data = data;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modifyEntry(tableAction: TableActionType, entry: any) {
    const tableActionData: TableActionData = {
      tableAction: tableAction,
      dataType: this.dataType,
      entries: [entry]
    };
    this.onModifyEntry.emit(tableActionData);
  }

}
