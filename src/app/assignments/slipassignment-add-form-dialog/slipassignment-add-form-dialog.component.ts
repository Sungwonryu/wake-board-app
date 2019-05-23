// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-slipassignment-add-from-dialog',
//   templateUrl: './slipassignment-add-from-dialog.component.html',
//   styleUrls: ['./slipassignment-add-from-dialog.component.scss']
// })
// export class SlipassignmentAddFromDialogComponent implements OnInit {
//
//   constructor() { }
//
//   ngOnInit() {
//   }
//
// }

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
  selector: 'app-slipassignment-add-form-dialog',
  templateUrl: './slipassignment-add-form-dialog.component.html',
  styleUrls: ['./slipassignment-add-form-dialog.component.scss']
})
export class SlipassignmentAddFormDialogComponent implements OnInit {

  formIsValid: boolean = false;

  slipSettings = [
    { name: 'slip1', value: '' },
    { name: 'slip2', value: '' },
    { name: 'slip3', value: '' }
  ];

  vesselSettings = [
    { name: 'vessel1Id', value: '' },
    { name: 'vessel2Id', value: '' },
    { name: 'vessel3Id', value: '' }
  ];

  isSet = {
    slip1: false,
    slip2: false,
    slip3: false,
    vessel1Id: false,
    vessel2Id: false,
    vessel3Id: false
  };

  isDuplicate = {
    slip1: false,
    slip2: false,
    slip3: false
  };

  isOnlyOneSet = {
    vessel1: false,
    vessel2: false,
    vessel3: false
  };

  HDate = HDate;
  HList = HList;
  BaseData = BaseData;

  item: any = {};
  list: any[] = [];
  date: Date = null;
  tableAction: string = '';

  slipList: any[] = [];
  unusedSlipList: any[] = [];
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
  instruction = 'Create an assignment using the fields below. If a field doesn’t apply to your assignment, leave it blank.';
  subtitle1 = 'Assign Slip Info';
  subtitle2 = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public paramsService: ParamsService,
    public vesselService: VesselService,
    public mainService: SlipassignmentService,
    public dialogRef: MatDialogRef<SlipassignmentAddFormDialogComponent>
  ) { }

  ngOnInit() {
    this.initData();
    this.initAutocompleteLists();
    this.initApiResponse();
    this.initForm();
  }

  initData() {
    this.date = this.paramsService.getDate();
    if (this.data.tableActionData.tableAction === 'edit') {
      this.item = this.data.tableActionData.entries[0];
    }
    this.list = this.mainService.getList();
    this.availabilityList = this.mainService.availabilityList;
    this.slipList = this.mainService.slipList;
    this.unusedSlipList = this.getUnusedSlipList();
  }

  initAutocompleteLists() {
    this.vesselList = this.vesselService.getAutocompleteList();
    this.filteredVesselList = of(this.vesselService.getAutocompleteList());
    // this.filteredSlipList = of(this.slipList);
    this.filteredSlipList = of(this.getUnusedSlipList());
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

  getUnusedSlipList() {
    // In the edit form,
    // unusedSlipList includes unused slips and the edited item's slip
    const unusedSlipList = this.slipList.filter((slipObj: any) => {
      const matchedObj = this.list.find((obj) => {
        if (obj && typeof obj === 'object') {
          if (slipObj.slip === obj.slip) {
            return true;
          }
        }
      });
      if (!matchedObj) {
        return true;
      }
    });

    return unusedSlipList;
  }

  initForm() {
    // If this.timeoutId id present, clear the previously invoked setTimeout()
    if (this.formInitTimeoutId !== null) {
      clearTimeout(this.formInitTimeoutId);
    }
    this.formInitTimeoutId = setTimeout(() => {
      // this.setFormValue(this.item);
      this.setFormValue();
    }, this.formInitInterval);
  }

  onCloseForm() {
    this.dialogRef.close();
  }

  setFormValue() {
    let slip1 = '';
    let slip2 = '';
    let slip3 = '';
    let vessel1 = '';
    let vessel2 = '';
    let vessel3 = '';
    let vessel1Availability: '0' | '1' | '' = '';
    let vessel2Availability: '0' | '1' | '' = '';
    let vessel3Availability: '0' | '1' | '' = '';

    this.form.setValue({
      slip1: slip1,
      slip2: slip2,
      slip3: slip3,
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
        // list = this.slipList;
        list = this.getUnusedSlipList();
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
      this.setFormInputValue({ inputId: inputId, value: '' });
    }
  }

  setFormInputValue({ inputId, value }) {
    console.log('setFormInputValue');
    let newValues = { ...this.form.value };
    newValues[inputId] = value;
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
            case 'vesselId':
              newItem[prop] = this.HList.findProperty(vesselList, { property: 'vessel', value: value[prop] }, ['id']) || '';
              break;
            case 'vesselAvailability':
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

  updateFormSettings({ name, value }) {
    switch(name) {
      case 'slip1':
      case 'slip2':
      case 'slip3':
        this.slipSettings.forEach((obj) => {
          if (obj.name === name) {
            obj.value = value;
          }
        });

        if (value) {
          this.isSet[name] = true;
        } else {
          this.isSet[name] = false;
        }
        break;

      case 'vessel1Id':
      case 'vessel2Id':
      case 'vessel3Id':
        this.vesselSettings.forEach((obj) => {
          if (obj.name === name) {
            obj.value = value;
          }
        });

        if (value) {
          this.isSet[name] = true;
        } else {
          this.isSet[name] = false;
        }
        break;

      default:
    }

    this.slipSettings.forEach((slipObj) => {
      const duplicateInput = this.slipSettings.find((obj) => {
        return (slipObj.name !== obj.name) && (slipObj.value === obj.value) && (slipObj.value !== '');
      });
      if (duplicateInput) {
        this.isDuplicate[slipObj.name] = true;
      } else {
        this.isDuplicate[slipObj.name] = false;
      }
    });



    console.log('this.vesselSettings = ', this.vesselSettings);
    console.log('this.isSet = ', this.isSet);
    this.updateFormValidity();
  }

  updateFormValidity() {
    if (this.isSet.slip1 === this.isSet.vessel1Id) {
      this.isOnlyOneSet.vessel1 = false;
    } else {
      this.isOnlyOneSet.vessel1 = true;
    }

    if (this.isSet.slip2 === this.isSet.vessel2Id) {
      this.isOnlyOneSet.vessel2 = false;
    } else {
      this.isOnlyOneSet.vessel2 = true;
    }

    if (this.isSet.slip3 === this.isSet.vessel3Id) {
      this.isOnlyOneSet.vessel3 = false;
    } else {
      this.isOnlyOneSet.vessel3 = true;
    }

    if (!this.isOnlyOneSet.vessel1 &&
        !this.isOnlyOneSet.vessel2 &&
        !this.isOnlyOneSet.vessel3 &&
        !this.isDuplicate.slip1 &&
        !this.isDuplicate.slip2 &&
        !this.isDuplicate.slip3) {
      this.formIsValid = true;
    } else {
      this.formIsValid = false;
    }
  }

  updateForm({ setFormInputValueData, updateFormSettingsData }) {
    console.log('updateForm()');
    this.setFormInputValue(setFormInputValueData);
    this.updateFormSettings(updateFormSettingsData);
  }
}
