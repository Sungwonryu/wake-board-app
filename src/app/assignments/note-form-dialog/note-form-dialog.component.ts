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
import { NoteService } from '../note/note.service';

@Component({
  selector: 'app-note-form-dialog',
  templateUrl: './note-form-dialog.component.html',
  styleUrls: ['./note-form-dialog.component.scss']
})
export class NoteFormDialogComponent implements OnInit {

  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;
  expirationDate: Date = null;
  minExpirationDate: Date = null;
  tableAction: string = '';

  priorityList: any[] = [];
  filteredPriorityList: Observable<any[]>

  durationList: any[] = [];
  filteredDurationList: Observable<any[]>

  colorList: any[] = [];
  filteredColorList: Observable<any[]>;

  $listUpdateSub: Subscription;
  $apiResponseSub: Subscription;

  @ViewChild('f') form: NgForm;

  formInitTimeoutId: any;
  formInitInterval = 0; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing NoteFormDialogComponent

  title = 'Note';
  instruction = 'Create or edit an note using the fields below. If a field doesn’t apply to your note, leave it blank.';
  subtitle1 = 'Note Info';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public paramsService: ParamsService,
    public vesselService: VesselService,
    public mainService: NoteService,
    public dialogRef: MatDialogRef<NoteFormDialogComponent>
  ) { }

  ngOnInit() {
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    const dayTime = 86400000;
    this.date = this.paramsService.getDate();
    this.minExpirationDate = new Date(this.date.getTime() + dayTime);
    this.priorityList = this.mainService.priorityList;
    this.durationList = this.mainService.durationList;
    this.colorList = this.mainService.colorList;
    this.list = this.mainService.getList();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
  }

  initAutocompleteLists() {
    this.filteredPriorityList = of(this.priorityList);
    this.filteredDurationList = of(this.durationList);
    this.filteredColorList = of(this.colorList);
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
    let note = '';
    let priorityId = '';
    let durationId = '';
    let colorId = '';
    let expirationDate = null;

    if (item && typeof item === 'object') {
      note = item.note || '';
      priorityId = this.HList.findProperty(this.priorityList, { property: 'id', value: item.priorityId }, ['text']) || '';
      durationId = this.HList.findProperty(this.durationList, { property: 'id', value: item.durationId }, ['text']) || '';
      colorId = this.HList.findProperty(this.colorList, { property: 'id', value: item.colorId }, ['text']) || '';
      expirationDate = item.expirationDate || null;
    }

    this.form.setValue({
      note: note,
      priorityId: priorityId,
      durationId: durationId,
      colorId: colorId,
      expirationDate: expirationDate
    });
  }

  onFilterAutocomplete(type: string, filterVal: string) {
    filterVal = filterVal.trim().toLowerCase();
    let list = [];
    let filteredList = [];
    switch (type) {
      case 'priority':
        list = this.priorityList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredPriorityList = of(filteredList);
        break;
      case 'duration':
        list = this.durationList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredDurationList = of(filteredList);
        break;
      case 'color':
        list = this.colorList;
        filteredList = this.HList.filterAutocompletList(list, 'text', filterVal);
        this.filteredColorList = of(filteredList);
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
    console.log('note-form-dialog.comoponent');
    // Create an instance, newItem from this.form.value
    // The properties that are undefined, null or '' are not set to newItem
    // So, those properties won't be in queryParams
    const value = this.form.value;
    let newItem: any = {};

    newItem['date'] = this.date;
    if (this.data.tableActionData.tableAction === 'edit') {
      newItem['id'] = this.item['id'];
    }

    for (let prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] != null && value[prop] !== '') {
          if (typeof value[prop] === 'string') {
            value[prop] = value[prop].trim();
          }
          switch(prop) {
            case 'priorityId':
              newItem[prop] = this.HList.findProperty(this.priorityList, { property: 'text', value: value[prop] }, ['id']) || '';
              break;
            case 'durationId':
              newItem[prop] = this.HList.findProperty(this.durationList, { property: 'text', value: value[prop] }, ['id']) || '';
              break;
            case 'colorId':
              newItem[prop] = this.HList.findProperty(this.colorList, { property: 'text', value: value[prop] }, ['id']) || '';
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

  getDurationDays() {
    let durationDays = null;;
    const duration = this.form.value['durationId'];
    if (duration) {
      const durationList = this.durationList;
      const matchedItem = durationList.find((item: any) => {
        return item.text === duration;
      });
      if (matchedItem) {
        durationDays = matchedItem.days;
      }
    }
    return durationDays;
  }

  calculateDuration(startDate: any, expirationDate: any): number {
    let durationDays = 0;
    if (startDate && startDate instanceof Date &&
        expirationDate && expirationDate instanceof Date) {

      const startDT = startDate.getTime();
      const expirationDT = expirationDate.getTime();
      durationDays = Math.floor((expirationDT - startDT) / 86400000);
    }
    return durationDays;
  }

  onChangeExpirationDate(event: any) {
    const newExpirationDate = event.value;
    if (!this.expirationDate || !(this.expirationDate instanceof Date) ||
        newExpirationDate.getTime() !== this.expirationDate.getTime()) {

      let isValidDuration = false;

      this.expirationDate = newExpirationDate;
      const durationDays = this.getDurationDays();
      if (durationDays !== null && typeof durationDays === 'number' &&
          durationDays === this.calculateDuration(this.date, newExpirationDate)) {

        isValidDuration = true;
      }

      if (!isValidDuration) {
        this.setFormInputValue('durationId', '');
      }
    }
  }

  setDuration(item: any) {
    const values = { ...this.form.value };
    const durationDays = item.days;
    if (durationDays === 0) {
      values['expirationDate'] = null;
    } else if (durationDays === 1 || durationDays === 7) {
      const expirationDateDT = this.date.getTime() + 86400000 * durationDays;
      values['expirationDate'] = new Date(expirationDateDT);
    }
    this.form.setValue(values);
  }

}
