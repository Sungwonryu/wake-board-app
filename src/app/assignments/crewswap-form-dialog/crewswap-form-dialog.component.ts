import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';

import { HString } from '../../shared/lib/h-string';
import { HDate } from '../../shared/lib/h-date';
import { HList } from '../../shared/lib/h-list';
import { BaseData } from '../../api-storage/base-data';
import { ApiResponse } from '../../api-storage/api-storage.model';
import { ParamsService } from '../../shared/services/params.service';
import { VesselService } from '../../manage-database/vessel-table/vessel.service';
import { ShiftService } from '../../manage-database/shift-table/shift.service';
import { CalltimeService } from '../../manage-database/calltime/calltime.service';
import { LocationService } from '../../manage-database/location/location.service';
import { CrewshiftService } from '../../manage-database/crewswap-table/crewshift.service';
import { CrewswapService } from '../crewswap/crewswap.service';

@Component({
  selector: 'app-crewswap-form-dialog',
  templateUrl: './crewswap-form-dialog.component.html',
  styleUrls: ['./crewswap-form-dialog.component.scss']
})
export class CrewswapFormDialogComponent implements OnInit {
  HString = HString;
  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;
  expirationDate: Date = null;
  minExpirationDate: Date = null;
  tableAction: string = '';

  vesselList: any[] = [];
  filteredVesselList: Observable<any[]>;

  shiftList: any[] = [];
  filteredShiftList: Observable<any[]>

  calltimeList: any[] = [];
  filteredCalltimeList: Observable<any[]>

  locationList: any[] = [];
  filteredLocationList: Observable<any[]>;

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 200; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing NoteFormDialogComponent

  title = 'Crew Swap';
  instruction = 'Create or edit crew swap info using the fields below. If a field doesn’t apply to your assignment, leave it blank.';
  subtitle1 = 'Crew Swap Info';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public paramsService: ParamsService,
    public locationService: LocationService,
    public calltimeService: CalltimeService,
    public shiftService: ShiftService,
    public crewshiftService: CrewshiftService,
    public vesselService: VesselService,
    public mainService: CrewswapService,
    public dialogRef: MatDialogRef<CrewswapFormDialogComponent>
  ) { }

  ngOnInit() {
    this.locationService.api('read');
    console.log('crewswap init');
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {

    this.date = this.paramsService.getDate();
    this.vesselList = this.vesselService.getAutocompleteList();
    this.shiftList = this.shiftService.getList();
    this.calltimeList = this.calltimeService.getList();
    this.locationList = this.locationService.getList();
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.filteredVesselList = of(this.vesselService.getAutocompleteList());
    this.filteredShiftList = of(this.shiftService.getList());
    this.filteredCalltimeList = of(this.calltimeService.getList());
    this.filteredLocationList = of(this.locationService.getList());
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
    let callTime = '';
    let firstDeparture = '';
    let location = '';
    let vesselId = '';

    if (item && typeof item === 'object') {
      shift = item.shift || '';
      callTime = item.callTime || '';
      firstDeparture = item.firstDeparture || '';
      location = item.location || '';
      vesselId = this.HList.findProperty(this.vesselList, { property: 'id', value: item.vesselId }, ['vessel']) || '';
    }

    this.form.setValue({
      shift: shift,
      callTime: callTime,
      firstDeparture: firstDeparture,
      location: location,
      vesselId: vesselId
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
      case 'callTime':
        list = this.calltimeList;
        filteredList = this.HList.filterAutocompletList(list, 'callTime', filterVal);
        this.filteredCalltimeList = of(filteredList);
        break;
      case 'location':
        list = this.locationList;
        filteredList = this.HList.filterAutocompletList(list, 'location', filterVal);
        this.filteredLocationList = of(filteredList);
        break;
      case 'vessel':
        list = this.vesselService.getAutocompleteList();
        filteredList = this.HList.filterAutocompletList(list, 'vessel', filterVal);
        this.filteredVesselList = of(filteredList);
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
          if (typeof value[prop] === 'string') {
            value[prop] = value[prop].trim();
          }
          switch(prop) {
            case 'vesselId':
              newItem[prop] = this.HList.findProperty(vesselList, { property: 'vessel', value: value[prop] }, ['id']) || '';
              break;
            default:
              newItem[prop] = value[prop];
              break;
          }
        }
      }
    }

    console.log('newItem', newItem);
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

  setShift(item: any) {
    let values = { ...this.form.value };
    const crewshiftList = this.crewshiftService.getList();
    let matchedObj;
    if (crewshiftList && typeof crewshiftList === 'object' && crewshiftList.constructor === Array) {
      matchedObj = crewshiftList.find((obj: any) => {
        if (typeof obj === 'object') {
          return obj.shift === item.shift
        }
      });
    }
    if (matchedObj && matchedObj.location) {
      values['location'] = matchedObj.location;
    }

    if (item && typeof item === 'object' && item.callTime) {
      values['callTime'] = this.HString.toDefaultString(item.callTime);
    }
    if (item && typeof item === 'object' && item.firstDeparture) {
      values['firstDeparture'] = this.HString.toDefaultString(item.firstDeparture);
    }

    this.form.setValue(values);
  }
}
