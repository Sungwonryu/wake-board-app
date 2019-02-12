import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatSort } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { HString } from '../../lib/h-string';
import { HList } from '../../lib/h-list';
import { ApiResponse } from '../../../api-storage/api-storage.model';
import { TableActionData, TableActionType, TableColumn, TableView } from '../table.model';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges, OnInit {

  HString = HString;
  HList = HList;

  defaults = {
    headerColor: '#222222',
    headerBgColor: '#ECECEC',
    headerFontFamily: 'Lato',
    headerFontSize: '14px'
  };

  columnDefault = {
    crewMessageIdFn: (row: any, messagePropFn) => {
      let messageId = '';
      let messageProp;
      if (messagePropFn && typeof messagePropFn === 'function') {
        messageProp = messagePropFn();
      }
      if (messageProp && row[messageProp]) {
        messageId = row[messageProp];
      }
      return messageId;
    },
    fontColorFn: (row: any) => `${this.HString.toDefaultString(row.fontColor)}`,
    fontWeightFn: (row: any) => `${this.HString.toDefaultString(row.fontWeight)}`
  };

  item: any = {};
  isValid$: Observable<boolean>;
  editInputValue: string = '';
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  deleteConfirmDialogRef: MatDialogRef<any>;

  $apiResponseSub: Subscription;

  @Input() mainService: any = null;

  @Input() mode: 'edit' | 'delete' = null;
  @Input() editProp: string = '';
  @Input() editPattern: string = '';

  // table column and view settings
  @Input() tableView: TableView = {};
  @Input() tableColumns: TableColumn[] = [];

  // table data and filter settings
  @Input() dataType: string = '';
  @Input() data: any[] = [];
  @Input() filterValue: string = '';

  @Output() onModifyEntry = new EventEmitter<TableActionData>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('editInput') editInput: ElementRef;

  constructor(
    private dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit() {
    this.tableColumns = this.addColumnDefulat(this.tableColumns);
    this.displayedColumns = this.getDisplayedColumns(this.tableColumns);
    this.refreshData(this.data);
    this.setTableMode(this.mode);
    this.initApiResponse();
  }

  initApiResponse() {
    // Initialize Subscription $apiResponseSub
    if (this.mainService) {
      this.$apiResponseSub = this.mainService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
        if (apiResponse.success) {
          // When apiResponse is successful
          console.log('apiResponse: ', apiResponse);
          switch (apiResponse.apiOpts.baseParamsObj.action) {
            case 'insert':
            this.mode = null;
            this.mainService.api('read');
            break;
            case 'update':
            console.log('update');
            this.mode = null;
            this.mainService.api('read');
            break;
          }
        }
      });
    }
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

    // When the changes on this.filterValue happens
    if (changes.mode) {
      console.log('changes.mode: ', changes.mode);
      this.setTableMode(this.mode);
    }
  }

  setTableMode(mode: 'edit' | 'delete') {
    this.mode = mode;
  }

  addColumnDefulat(tableColumns: any[]) {
    const updatedTableColumns = tableColumns.map((column) => {
      const newColumn = {
        ...this.columnDefault,
        ...column
      };
      return newColumn;
    });
    return updatedTableColumns;
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

  getFontColor(fontColor: any): string {
    if (!fontColor || typeof fontColor !== 'string') {
      fontColor = '#222222';
    } else {
      console.log('fontColor', fontColor);
    }
    return fontColor;
  }

  getFontWeight(fontWeight: any): string {
    if (!fontWeight || typeof fontWeight !== 'string') {
      fontWeight = 'medium';
    }
    return fontWeight;
  }

  delete(item: any) {
    if (item && typeof item === 'object') {
      this.item = item;
      this.setTableMode('delete');
    }
  }

  cancelDelete(item: any) {
    if (item && typeof item === 'object') {
      this.item = {};
      this.setTableMode(null);
    }
  }

  enableEditForm(item: any) {
    console.log('item: ', item);
    console.log('this.editProp: ', this.editProp);
    if (item && typeof item === 'object') {
      this.setTableMode('edit');
      this.item = item

      if (this.editProp && typeof this.editProp === 'string') {
        this.editInputValue = item[this.editProp];
        this.modifyEntry('override', item);
      }
    }
  }

  cancelEdit(item: any) {
    if (item && typeof item === 'object') {
      this.setTableMode(null);
      this.item = {};
    }
  }

  save(item: any) {
    if (item && typeof item === 'object' &&
        this.editProp && typeof this.editProp === 'string') {

      item[this.editProp] = this.editInputValue;
      if (this.mainService) {
        this.mainService.api('update', item);
      }
    }
  }

  isValidInput() {
    let isValid = false;
    let inputVal;
    if (this.editInput && typeof this.editInput === 'object') {
      inputVal = this.editInput.nativeElement.value;
    }
    if (inputVal) {
      if (this.editPattern && typeof this.editPattern) {
        if (this.HString.regexTest(this.editPattern, inputVal)) {
          isValid = true;
        }
      } else {
        isValid = true;
      }
    }
    return isValid;
  }

  enableDeleteForm(item: any, event) {
    const position = {
      left: event.clientX - event.offsetX - 124 + 'px',
      top: event.clientY - event.offsetY - 70 + 'px'
    };
    const panelClass = 'delete-confirm-dialog-container';
    const tableActionData = {
      tableAction: 'delete',
      dataType: this.dataType,
      entries: [item]
    };
    console.log('enableDeleteForm(), tableActionData: ', tableActionData);
    this.deleteConfirmDialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      position: position,
      panelClass: panelClass,
      disableClose: true,
      data: {
        tableActionData: tableActionData
      }
    });

    this.deleteConfirmDialogRef.afterClosed().subscribe(deleteConfirm => {
      if (deleteConfirm) {
        this.modifyEntry('delete', item);
      } else {
        console.log('delete canceled');
      }
    });
  }

}
