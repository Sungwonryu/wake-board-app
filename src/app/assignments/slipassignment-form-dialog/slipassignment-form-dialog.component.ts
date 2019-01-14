import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';

import { HDate } from '../../shared/lib/h-date';
import { HList } from '../../shared/lib/h-list';
import { BaseData } from '../../api-storage/base-data';
import { ApiResponse } from '../../api-storage/api-storage.model';
import { ParamsService } from '../../shared/services/params.service';
import { VesselService } from '../../manage-database/vessel-table/vessel.service';
import { SlipassignmentService } from '../slipassignment/slipassignment.service';

@Component({
  selector: 'app-slipassignment-form-dialog',
  templateUrl: './slipassignment-form-dialog.component.html',
  styleUrls: ['./slipassignment-form-dialog.component.scss']
})
export class SlipassignmentFormDialogComponent implements OnInit {

  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;
  tableAction: string = '';

  slipList: any[] = [];
  filteredSlipList: Observable<any[]>

  availabilityList: any[] = [];
  filteredAvailabilityList: Observable<any[]>

  vesselList: any[] = [];
  filteredVesselList: Observable<any[]>;

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 0; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing NoteFormDialogComponent

  title = 'Assign Slip';
  instruction = 'Create or edit an assignment using the fields below. If a field doesn’t apply to your assignment, leave it blank.';
  subtitle1 = 'Assign Slip Info';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public paramsService: ParamsService,
    public vesselService: VesselService,
    public mainService: SlipassignmentService,
    public dialogRef: MatDialogRef<SlipassignmentFormDialogComponent>
  ) { }

  ngOnInit() {
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    this.date = this.paramsService.getDate();
    this.slipList = this.mainService.slipList;
    this.availabilityList = this.mainService.availabilityList;
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.vesselList = this.vesselService.getAutocompleteList();
    this.filteredVesselList = of(this.vesselService.getAutocompleteList());
    this.filteredSlipList = of(this.slipList);
    this.filteredAvailabilityList = of(this.availabilityList);
  }

  initApiResponse() {
    // Initialize Subscription $apiResponseSub
    // this.$apiResponseSub = this.slipassignmentService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
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
    let slip = '';
    let vessel1 = '';
    let vessel2 = '';
    let vessel3 = '';
    let vessel1Availability: '0' | '1' | '' = '';
    let vessel2Availability: '0' | '1' | '' = '';
    let vessel3Availability: '0' | '1' | '' = '';

    if (item && typeof item === 'object') {
      slip = item.slip || '';
      vessel1 = this.HList.findProperty(this.vesselList, { property: 'id', value: item.vessel1Id }, ['vessel']) || '';
      vessel2 = this.HList.findProperty(this.vesselList, { property: 'id', value: item.vessel2Id }, ['vessel']) || '';
      vessel3 = this.HList.findProperty(this.vesselList, { property: 'id', value: item.vessel3Id }, ['vessel']) || '';
      vessel1Availability = this.HList.findProperty(this.availabilityList, { property: 'value', value: item.vessel1Availability }, ['text']) || '';
      vessel2Availability = this.HList.findProperty(this.availabilityList, { property: 'value', value: item.vessel2Availability }, ['text']) || '';
      vessel3Availability = this.HList.findProperty(this.availabilityList, { property: 'value', value: item.vessel3Availability }, ['text']) || '';
    }

    this.form.setValue({
      slip: slip,
      vessel1Id: vessel1,
      vessel2Id: vessel2,
      vessel3Id: vessel3,
      vessel1Availability: vessel1Availability,
      vessel2Availability: vessel2Availability,
      vessel3Availability: vessel3Availability
    });
  }

  onFilterAutocomplete(type: string, filterVal: string) {
    filterVal = filterVal.trim().toLowerCase();
    let list = [];
    let filteredList = [];
    switch (type) {
      case 'slip':
        list = this.slipList;
        filteredList = this.HList.filterAutocompletList(list, 'slip', filterVal);
        this.filteredSlipList = of(filteredList);
        break;
      case 'vessel':
        list = this.vesselService.getAutocompleteList();
        filteredList = this.HList.filterAutocompletList(list, 'vessel', filterVal);
        this.filteredVesselList = of(filteredList);
        break;
      case 'availability':
        list = this.availabilityList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredAvailabilityList = of(filteredList);
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

    newItem['date'] = this.date;
    if (this.data.tableActionData.tableAction === 'edit') {
      newItem['id'] = this.item['id'];
    }
    const vesselList = this.vesselService.getAutocompleteList();
    for (let prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] != null && value[prop] !== '') {
          value[prop] = value[prop].trim();
          switch(prop) {
            case 'vessel1Id':
            case 'vessel2Id':
            case 'vessel3Id':
              newItem[prop] = this.HList.findProperty(vesselList, { property: 'vessel', value: value[prop] }, ['id']) || '';
              break;
            case 'vessel1Availability':
            case 'vessel2Availability':
            case 'vessel3Availability':
              newItem[prop] = this.HList.findProperty(this.availabilityList, { property: 'text', value: value[prop] }, ['value']) || '';
              break;
            default:
              newItem[prop] = value[prop];
              break;
          }
        }
      }
    }

    // const newApiObj = this.BaseData.dataObjToApiObj(newItem);
    console.log('newItem', newItem);
    // console.log('newApiObj', newApiObj);
    this.submitItem(newItem);

  }

  submitItem(newApiObj: any) {
    switch(this.data.tableActionData.tableAction) {
      case 'add':
        this.mainService.api('insert', newApiObj);
        break;
      case 'edit':
        this.mainService.api('update', newApiObj);
    }
  }

}
