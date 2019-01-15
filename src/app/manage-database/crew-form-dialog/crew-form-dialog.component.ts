import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';

import { HDate } from '../../shared/lib/h-date';
import { HList } from '../../shared/lib/h-list';
import { BaseData } from '../../api-storage/base-data';
import { ApiResponse } from '../../api-storage/api-storage.model';
import { ShiftService } from '../shift-table/shift.service';
import { LocationService } from '../location/location.service';
import { CrewshiftService } from '../crewswap-table/crewshift.service';

@Component({
  selector: 'app-crew-form-dialog',
  templateUrl: './crew-form-dialog.component.html',
  styleUrls: ['./crew-form-dialog.component.scss']
})
export class CrewFormDialogComponent implements OnInit {

  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;

  tableAction: string = '';

  shiftList: any[] = [];
  filteredShiftList: Observable<any[]>

  locationList: any[] = [];
  filteredLocationList: Observable<any[]>

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
    public dialogRef: MatDialogRef<CrewFormDialogComponent>,
    private shiftService: ShiftService,
    private locationService: LocationService,
    private mainService: CrewshiftService
  ) { }

  ngOnInit() {
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    this.shiftList = this.shiftService.getList();
    this.locationList = this.locationService.getList();
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.filteredShiftList = of(this.shiftList);
    this.filteredLocationList = of(this.locationList);
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
    let location = '';

    if (item && typeof item === 'object') {
      shift = item.shift || '';
      location = item.location || '';
    }

    this.form.setValue({
      shift: shift,
      location: location
    });
  }

  onFilterAutocomplete(type: string, filterVal: string) {
    filterVal = filterVal.trim().toLowerCase();
    let list = [];
    let filteredList = [];
    switch (type) {
      case 'shift':
        list = this.shiftList;
        filteredList = this.HList.filterAutocompletList(list, 'shift', filterVal);
        this.filteredShiftList = of(filteredList);
        break;
      case 'location':
        list = this.locationList;
        filteredList = this.HList.filterAutocompletList(list, 'location', filterVal);
        this.filteredLocationList = of(filteredList);
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
