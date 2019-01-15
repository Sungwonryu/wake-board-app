import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { HDate } from '../../shared/lib/h-date';
import { ApiResponse } from '../../api-storage/api-storage.model';
import { BaseDataService } from '../../api-storage/base-data.service';
import { VesselassignmentService } from '../vesselassignment/vesselassignment.service';
import { SlipassignmentService } from '../slipassignment/slipassignment.service';
import { NoteService } from '../note/note.service';
import { CrewswapService } from '../crewswap/crewswap.service';

@Component({
  selector: 'app-duplicate-form-dialog',
  templateUrl: './duplicate-form-dialog.component.html',
  styleUrls: ['./duplicate-form-dialog.component.scss']
})
export class DuplicateFormDialogComponent implements OnInit {
  HDate = HDate;

  date: Date = null;

  $apiResponseSub: Subscription;
  mainService: BaseDataService;

  @ViewChild('f') form: NgForm;
  @ViewChild('datePicker') datePicker: any;

  formInitTimeoutId: any;
  formInitInterval = 400; // Delay for this.form.setValue() after form init
  unlockTimeoutId: any;
  unlockInterval = 200; // Delay for this.noteService.api('unlock', this.item) after closing NoteFormDialogComponent

  titleDuplicate = 'Duplicate Entry';
  titleDuplicateAll = 'Duplicate All Entries';
  instructionDuplicate = 'Duplicating this entry will automatically add the selected section\'s information to the specified date assignments.';
  instructionDuplicateAll = 'Duplicating these entries will automatically add the selected section\'s information to the specified date assignments.';
  subtitle1 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vesselassignmentService: VesselassignmentService,
    private slipassignmentService: SlipassignmentService,
    private noteService: NoteService,
    private crewswapService: CrewswapService,
    private dialogRef: MatDialogRef<DuplicateFormDialogComponent>
  ) { }

  ngOnInit() {
    switch(this.data.tableActionData.dataType) {
      case 'vesselassignment':
        this.mainService = this.vesselassignmentService;
        break;
      case 'slipassignment':
        this.mainService = this.slipassignmentService;
        break;
      case 'note':
        this.mainService = this.noteService;
        break;
      case 'crewswap':
        this.mainService = this.crewswapService;
        break;
    }

    // Initialize Subscription $apiResponseSub
    this.$apiResponseSub = this.mainService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
      if (apiResponse.success) {
        console.log('apiResonse from duplicateForm', apiResponse);
        // When apiResponse is successful
        switch (apiResponse.apiOpts.baseParamsObj.action) {
          case 'insert':
          case 'duplicate':
            this.dialogRef.close();
            break;
        }
      }
    });

    // Remove hours, minutes and secondes in today
    this.date = this.HDate.toDate(this.HDate.toDateString(new Date()));
    this.initApiResponse();
    this.initForm();
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
      this.setFormValue();
      this.datePicker.opened = true;
    }, this.formInitInterval);
  }

  setFormValue() {
    this.form.setValue({
      date: this.date
    });
  }

  onCloseForm() {
    this.dialogRef.close();
  }

  createNewItem(item: any) {
    let newItem: any = {};
    for (let prop in item) {
      if (item.hasOwnProperty(prop)) {
        if (item[prop] != null && item[prop] !== '') {
          switch(prop) {
            case 'id':
            case 'updatedAt':
            case 'editTime':
            case 'editUserId':
            case 'deletedAt':
            case 'updateUserId':
              break;
            default:
              newItem[prop] = item[prop];
          }
        }
      }
    }
    return newItem;
  }

  onSave() {
    const newDate = this.form.value['date'];
    const item = this.data.tableActionData.entries[0];
    let newItem: any = {};

    switch(this.data.tableActionData.tableAction) {
      case 'duplicate':
        item['date'] = newDate;
        newItem = this.createNewItem(item);
        this.mainService.api('insert', newItem);
        break;
      case 'duplicateAll':
        newItem = {
          date: item['date'],
          insertDate: newDate
        };
        this.mainService.api('duplicate', newItem);
        break;
    }
  }

}
