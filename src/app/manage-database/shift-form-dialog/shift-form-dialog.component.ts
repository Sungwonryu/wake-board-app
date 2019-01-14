import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';

import { HDate } from '../../shared/lib/h-date';
import { HList } from '../../shared/lib/h-list';
import { BaseData } from '../../api-storage/base-data';
import { ApiResponse } from '../../api-storage/api-storage.model';
import { ShiftnameService } from '../shiftname/shiftname.service';
import { RouteService } from '../route/route.service';
import { CalltimeService } from '../calltime/calltime.service';
import { ShiftService } from '../shift-table/shift.service';

@Component({
  selector: 'app-shift-form-dialog',
  templateUrl: './shift-form-dialog.component.html',
  styleUrls: ['./shift-form-dialog.component.scss']
})
export class ShiftFormDialogComponent implements OnInit {

  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;

  expirationDate: Date = null;
  minExpirationDate: Date = null;
  tableAction: string = '';

  shiftnameList: any[] = [];
  filteredShiftnameList: Observable<any[]>;

  routeList: any[] = [];
  filteredRouteList: Observable<any[]>

  calltimeList: any[] = [];
  filteredCalltimeList: Observable<any[]>

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 0; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing ShiftFormDialogComponent

  title = 'Shift Relationships';
  instruction = 'Create or edit an Shift Relationship using the fields below.';
  subtitle1 = 'Shift Relationship';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShiftFormDialogComponent>,
    private shiftnameService: ShiftnameService,
    private routeService: RouteService,
    private calltimeService: CalltimeService,
    private mainService: ShiftService
  ) { }

  ngOnInit() {
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    this.shiftnameList = this.shiftnameService.getList();
    this.routeList = this.routeService.getList();
    this.calltimeList = this.calltimeService.getList();
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.filteredShiftnameList = of(this.shiftnameList);
    this.filteredRouteList = of(this.routeList);
    this.filteredCalltimeList = of(this.calltimeList);
  }

  initApiResponse() {
    // Initialize Subscription $apiResponseSub
    this.$apiResponseSub = this.mainService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      if (apiResponse.success) {
        // When apiResponse is successful
        switch (apiResponse.apiOpts.baseParamsObj.action) {
          case 'insert':
          case 'update':
            this.dialogRef.close();
            break;
        }
      }
    });
  }

  initForm() {
    // If this.timeoutId id present, clear the previously invoked setTimeout()
    if (this.formInitTimeoutId !== null) {
      clearTimeout(this.formInitTimeoutId);
    }
    this.formInitTimeoutId = setTimeout(() => {
      this.setFormValue(this.item);
    }, this.formInitInterval);
  }

  onCloseForm() {
    this.dialogRef.close();
  }

  setFormValue(item: any) {
    let shift = '';
    let route = '';
    let callTime = '';
    let firstDeparture = '';

    if (item && typeof item === 'object') {
      shift = item.shift || '';
      route = item.route || '';
      callTime = item.callTime || '';
      firstDeparture = item.firstDeparture || '';
    }

    this.form.setValue({
      shift: shift,
      route: route,
      callTime: callTime,
      firstDeparture: firstDeparture
    });
  }

  onFilterAutocomplete(type: string, filterVal: string) {
    filterVal = filterVal.trim().toLowerCase();
    let list = [];
    let filteredList = [];
    switch (type) {
      case 'shift':
        list = this.shiftnameList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredShiftnameList = of(filteredList);
        break;
      case 'route':
        list = this.routeList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredRouteList = of(filteredList);
        break;
      case 'calltime':
        list = this.calltimeList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredCalltimeList = of(filteredList);
        break;
    }
  }

  onClearInput(inputId: string, newVal) {
    if (newVal.trim() === '') {
      this.setFormInputValue(inputId, '');
    }
  }

  setFormInputValue(inputId: string, newVal: string) {
    let newValues = { ...this.form.value };
    newValues[inputId] = newVal;
    this.form.setValue(newValues);
  }

  onSave() {
    // Create an instance, newItem from this.form.value
    // The properties that are undefined, null or '' are not set to newItem
    // So, those properties won't be in queryParams
    const value = this.form.value;
    let newItem: any = {};

    if (this.data.tableActionData.tableAction === 'edit') {
      newItem['id'] = this.item['id'];
    }

    for (let prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] != null && value[prop] !== '') {
          if (typeof value[prop] === 'string') {
            value[prop] = value[prop].trim();
          }
          newItem[prop] = value[prop];
        }
      }
    }

    console.log('newItem', newItem);
    this.submitItem(newItem);

  }

  submitItem(newItem: any) {
    switch(this.data.tableActionData.tableAction) {
      case 'add':
        this.mainService.api('insert', newItem);
        break;
      case 'edit':
        this.mainService.api('update', newItem);
    }
  }

}
