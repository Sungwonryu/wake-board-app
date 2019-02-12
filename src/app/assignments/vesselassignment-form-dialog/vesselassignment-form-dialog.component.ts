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
import { RouteService } from '../../manage-database/route/route.service';
import { CalltimeService } from '../../manage-database/calltime/calltime.service';
import { LocationService } from '../../manage-database/location/location.service';
import { VesselService } from '../../manage-database/vessel-table/vessel.service';
import { ShiftService } from '../../manage-database/shift-table/shift.service';
import { CrewmemberService } from '../../manage-database/crewmember-table/crewmember.service';
import { MessageService } from '../message/message.service';
import { VesselassignmentService } from '../vesselassignment/vesselassignment.service';

@Component({
  selector: 'app-vesselassignment-form-dialog',
  templateUrl: './vesselassignment-form-dialog.component.html',
  styleUrls: ['./vesselassignment-form-dialog.component.scss']
})
export class VesselassignmentFormDialogComponent implements OnInit {

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

  messageList: any[] = [];

  shiftList: any[] = [];
  filteredShiftList: Observable<any[]>

  routeList: any[] = [];
  filteredRouteList: Observable<any[]>

  calltimeList: any[] = [];
  filteredCalltimeList: Observable<any[]>

  locationList: any[] = [];
  filteredLocationList: Observable<any[]>;

  vesselList: any[] = [];
  filteredVesselList: Observable<any[]>;

  crewmemberList: any[] = [];
  filteredCrewmemberList: Observable<any[]>;

  captainList: any[] = [];
  filteredCaptainList: Observable<any[]>;

  deckhandList: any[] = [];
  filteredDeckhandList: Observable<any[]>;

  gsaList: any[] = [];
  filteredGsaList: Observable<any[]>;

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  captain1: string = '';
  captain2: string = '';
  deckhand1: string = '';
  deckhand2: string = '';
  deckhand3: string = '';
  deckhand4: string = '';
  gsa1: string = '';
  gsa2: string = '';

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 200; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing NoteFormDialogComponent

  title = 'Assign Vessel';
  instruction = 'Create or edit crew swap info using the fields below. If a field doesn’t apply to your assignment, leave it blank.';
  subtitle1 = 'Shift Info';
  subtitle2 = 'Employees';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paramsService: ParamsService,
    private locationService: LocationService,
    private routeService: RouteService,
    private calltimeService: CalltimeService,
    private shiftService: ShiftService,
    private vesselService: VesselService,
    private crewmemberService: CrewmemberService,
    private messageService: MessageService,
    private mainService: VesselassignmentService,
    private dialogRef: MatDialogRef<VesselassignmentFormDialogComponent>
  ) { }

  ngOnInit() {
    this.locationService.api('read');
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    console.log('initData() in vesselassigmentForm');
    this.date = this.paramsService.getDate();
    this.messageList = this.messageService.list;
    this.vesselList = this.vesselService.getAutocompleteList();
    this.routeList = this.routeService.getList();
    this.shiftList = this.shiftService.getList();
    this.calltimeList = this.calltimeService.getList();
    this.locationList = this.locationService.getList();
    this.crewmemberList = this.crewmemberService.getList();
    this.captainList = this.filterList(this.crewmemberList, 'job', 'Captain');
    this.deckhandList = this.filterList(this.crewmemberList, 'job', 'Deckhand');
    this.gsaList = this.filterList(this.crewmemberList, 'job', 'GSA');
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.filteredVesselList = of(this.vesselService.getAutocompleteList());
    this.filteredShiftList = of(this.shiftService.getList());
    this.filteredRouteList = of(this.routeService.getList());
    this.filteredCalltimeList = of(this.calltimeService.getList());
    this.filteredLocationList = of(this.locationService.getList());
    this.filteredCrewmemberList = of(this.crewmemberService.getList());
    this.filteredCaptainList = of(this.filterList(this.crewmemberService.getList(), 'job', 'Captain'));
    this.filteredDeckhandList = of(this.filterList(this.crewmemberService.getList(), 'job', 'Deckhand'));
    this.filteredGsaList = of(this.filterList(this.crewmemberService.getList(), 'job', 'GSA'));
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

  filterList(list: any[], filterProp: string, filterVal: string) {
    let filteredList = [];
    if (list && typeof list === 'object' && list.constructor === Array && list.length !== 0) {
      filteredList = list.filter((obj: any) => {
        if (obj && typeof obj === 'object' && obj[filterProp] === filterVal) {
          return true;
        }
      });
    }
    return filteredList;
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
    console.log('setFromValue()', item);
    let shift = '';
    let route = '';
    let callTime = '';
    let firstDeparture = '';
    let vesselId = '';
    let captain1 = '';
    let captain2 = '';
    let deckhand1 = '';
    let deckhand2 = '';
    let deckhand3 = '';
    let deckhand4 = '';
    let gsa1 = '';
    let gsa2 = '';
    let captain1MessageId = '';
    let captain2MessageId = '';
    let deckhand1MessageId = '';
    let deckhand2MessageId = '';
    let deckhand3MessageId = '';
    let deckhand4MessageId = '';
    let gsa1MessageId = '';
    let gsa2MessageId = '';

    if (item && typeof item === 'object') {
      shift = item.shift || '';
      route = item.route || '';
      callTime = item.callTime || '';
      firstDeparture = item.firstDeparture || '';
      vesselId = this.HList.findProperty(this.vesselList, { property: 'id', value: item.vesselId }, ['vessel']) || '';
      captain1 = item.captain1 || '';
      captain2 = item.captain2 || '';
      deckhand1 = item.deckhand1 || '';
      deckhand2 = item.deckhand2 || '';
      deckhand3 = item.deckhand3 || '';
      deckhand4 = item.deckhand4 || '';
      gsa1 = item.gsa1 || '';
      gsa2 = item.gsa2 || '';
      captain1MessageId = item.captain1MessageId || '';
      captain2MessageId = item.captain2MessageId || '';
      deckhand1MessageId = item.deckhand1MessageId || '';
      deckhand2MessageId = item.deckhand2MessageId || '';
      deckhand3MessageId = item.deckhand3MessageId || '';
      deckhand4MessageId = item.deckhand4MessageId || '';
      gsa1MessageId = item.gsa1MessageId || '';
      gsa2MessageId = item.gsa2MessageId || '';
    }

    this.form.setValue({
      shift: shift,
      route: route,
      callTime: callTime,
      firstDeparture: firstDeparture,
      vesselId: vesselId,
      captain1: captain1,
      captain2: captain2,
      deckhand1: deckhand1,
      deckhand2: deckhand2,
      deckhand3: deckhand3,
      deckhand4: deckhand4,
      gsa1: gsa1,
      gsa2: gsa2,
      captain1MessageId: captain1MessageId,
      captain2MessageId: captain2MessageId,
      deckhand1MessageId: deckhand1MessageId,
      deckhand2MessageId: deckhand2MessageId,
      deckhand3MessageId: deckhand3MessageId,
      deckhand4MessageId: deckhand4MessageId,
      gsa1MessageId: gsa1MessageId,
      gsa2MessageId: gsa2MessageId
    });
  }

  onFilterAutocomplete(type: string, filterVal: string, nonDuplicateProps: string[] = []) {
    filterVal = filterVal.trim().toLowerCase();
    let list = [];
    let filteredList = [];
    switch (type) {
      case 'shift':
        list = this.shiftList;
        filteredList = this.HList.filterAutocompletList(list, 'shift', filterVal);
        this.filteredShiftList = of(filteredList);
        break;
      case 'route':
        list = this.routeList;
        filteredList = this.HList.filterAutocompletList(list, 'route', filterVal);
        this.filteredRouteList = of(filteredList);
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
      case 'employee':
        list = this.crewmemberList;
        filteredList = this.HList.filterAutocompletList(list, 'employee', filterVal);
        this.filteredCrewmemberList = of(filteredList);
        break;
      case 'captain':
        list = this.captainList;
        filteredList = this.HList.filterAutocompletList(list, 'employee', filterVal);
        this.filteredCaptainList = of(filteredList);
        break;
      case 'deckhand':
        list = this.deckhandList;
        filteredList = this.HList.filterAutocompletList(list, 'employee', filterVal);
        this.filteredDeckhandList = of(filteredList);
        break;
      case 'gsa':
        list = this.gsaList;
        filteredList = this.HList.filterAutocompletList(list, 'employee', filterVal);
        this.filteredGsaList = of(filteredList);
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

  isActiveMessage(formId: string, messageId: string) {
    let isActive = false;
    const values = this.form.value;
    const crewId = formId.slice(0, (formId.length - 9));
    if (values[crewId] && values[formId] && values[formId] === messageId ) {
      isActive = true;
    }
    return isActive;
  }

  setActiveMessage(formId: string, messageId: string) {
    let values = { ...this.form.value };
    const crewId = formId.slice(0, (formId.length - 9));
    if (values[crewId]) {
      const prevVal = values[formId];
      if (prevVal === messageId) {
        values[formId] = '';
      } else {
        values[formId] = messageId;
      }
      this.form.setValue(values);
    }
  }

  setShift(item: any) {
    let values = { ...this.form.value };
    if (item && typeof item === 'object' && item.callTime) {
      values['callTime'] = this.HString.toDefaultString(item.callTime);
    }
    if (item && typeof item === 'object' && item.firstDeparture) {
      values['firstDeparture'] = this.HString.toDefaultString(item.firstDeparture);
    }
    if (item && typeof item === 'object' && item.route) {
      values['route'] = this.HString.toDefaultString(item.route);
    }
    this.form.setValue(values);
  }

}
