import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';

import { HDate } from '../../shared/lib/h-date';
import { HList } from '../../shared/lib/h-list';
import { BaseData } from '../../api-storage/base-data';
import { ApiResponse } from '../../api-storage/api-storage.model';
import { VesselnameService } from '../vesselname/vesselname.service';
import { VesselnumberService } from '../vesselnumber/vesselnumber.service';
import { VesseltypeService } from '../vesseltype/vesseltype.service';
import { VesselcapacityService } from '../vesselcapacity/vesselcapacity.service';
import { VesselService } from '../vessel-table/vessel.service';

@Component({
  selector: 'app-vessel-form-dialog',
  templateUrl: './vessel-form-dialog.component.html',
  styleUrls: ['./vessel-form-dialog.component.scss']
})
export class VesselFormDialogComponent implements OnInit {

  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;
  expirationDate: Date = null;
  minExpirationDate: Date = null;
  tableAction: string = '';

  vesselnumberList: any[] = [];
  filteredVesselnumberList: Observable<any[]>

  vesselnameList: any[] = [];
  filteredVesselnameList: Observable<any[]>

  vesseltypeList: any[] = [];
  filteredVesseltypeList: Observable<any[]>;

  vesselcapacityList: any[] = [];
  filteredVesselcapacityList: Observable<any[]>;

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 0; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing VesselFormDialogComponent

  title = 'Vessel Relationships';
  instruction = 'Create or edit a Vessel Relationship using the fields below.';
  subtitle1 = 'Vessel Relationship';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VesselFormDialogComponent>,
    private vesselnumberService: VesselnumberService,
    private vesselnameService: VesselnameService,
    private vesseltypeService: VesseltypeService,
    private vesselcapacityService: VesselcapacityService,
    private mainService: VesselService
  ) { }

  ngOnInit() {
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    this.vesselnumberList = this.vesselnumberService.getList();
    this.vesselnameList = this.vesselnameService.getList();
    this.vesseltypeList = this.vesseltypeService.getList();
    this.vesselcapacityList = this.vesselcapacityService.getList();
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.filteredVesselnumberList = of(this.vesselnumberList);
    this.filteredVesselnameList = of(this.vesselnameList);
    this.filteredVesseltypeList = of(this.vesseltypeList);
    this.filteredVesselcapacityList = of(this.vesselcapacityList);
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
    let vesselNumber = '';
    let vesselName = '';
    let vesselCapacity = '';
    let vesselType = '';

    if (item && typeof item === 'object') {
      vesselNumber = item.vesselNumber || '';
      vesselName = item.vesselName || '';
      vesselType = item.vesselType || '';
      vesselCapacity = item.vesselCapacity || '';
    }

    this.form.setValue({
      vesselNumber: vesselNumber,
      vesselName: vesselName,
      vesselType: vesselType,
      vesselCapacity: vesselCapacity
    });
  }

  onFilterAutocomplete(type: string, filterVal: string) {
    filterVal = filterVal.trim().toLowerCase();
    let list = [];
    let filteredList = [];
    switch (type) {
      case 'vesselNumber':
        list = this.vesselnumberList;
        filteredList = this.HList.filterAutocompletList(list, 'vesselNumber', filterVal);
        this.filteredVesselnumberList = of(filteredList);
        break;
      case 'vesselName':
        list = this.vesselnameList;
        filteredList = this.HList.filterAutocompletList(list, 'vesselName', filterVal);
        this.filteredVesselnameList = of(filteredList);
        break;
      case 'vesselType':
        list = this.vesseltypeList;
        filteredList = this.HList.filterAutocompletList(list, 'vesselType', filterVal);
        this.filteredVesseltypeList = of(filteredList);
        break;
      case 'vesselCapacity':
        list = this.vesselcapacityList;
        filteredList = this.HList.filterAutocompletList(list, 'vesselCapacity', filterVal);
        this.filteredVesselcapacityList = of(filteredList);
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
