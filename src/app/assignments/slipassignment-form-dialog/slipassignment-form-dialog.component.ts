import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';

import { HDate } from '../../shared/lib/h-date';
import { HList } from '../../shared/lib/h-list';
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

  list: any[] = [];
  item: any = {};
  date: Date = null;
  tableAction: string = '';


  slipList = [{ slip: '1' }, { slip: '2' }, { slip: '3' }, { slip: '4' }, { slip: '5' }, { slip: '6' }, { slip: '7' }, { slip: '8' }, { slip: '9' }, { slip: '10' }];
  filteredSlipList: Observable<any[]>;

  vesselList: any[] = [];
  filteredVesselList: Observable<any[]>;

  // availabilityList = [{ value: '', text: '' }, { value: '1', text: 'Available' }, { value: '0', text: 'Unavailable' }];
  availabilityList = [{ value: '1', text: 'Available' }, { value: '0', text: 'Unavailable' }];
  filteredAvailablilityList: Observable<any[]>

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
    public slipassignmentService: SlipassignmentService,
    public dialogRef: MatDialogRef<SlipassignmentFormDialogComponent>
  ) { }

  ngOnInit() {
    this.date = this.paramsService.getDate();
    this.list = this.slipassignmentService.getList();
    this.initAutocompleteLists();
    this.initApiResponse();
    // this.initAutocompleteLists();
    this.initForm();
  }

  initAutocompleteLists() {
    this.vesselList = this.vesselService.getAutocompleteList();
    this.filteredVesselList = of(this.vesselService.getAutocompleteList());
    this.filteredSlipList = of(this.slipList);
    this.filteredAvailablilityList = of(this.availabilityList);
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
      vessel1Availability = this.HList.findProperty(this.availabilityList, { property: 'value', value: vessel1Availability }, ['text']) || '';
      vessel2Availability = this.HList.findProperty(this.availabilityList, { property: 'value', value: vessel2Availability }, ['text']) || '';
      vessel3Availability = this.HList.findProperty(this.availabilityList, { property: 'value', value: vessel3Availability }, ['text']) || '';
    }

    // if (item && item.slip) {
    //   slip = item.slip || '';
    // }
    // if (item && item.vessel1Id) {
    //   const autocompleteItem = this.vesselService.findAutocompleteItem(item.vessel1Id);
    //   if (autocompleteItem) {
    //     vessel1 = autocompleteItem.vessel;
    //   }
    // }
    // if (item && item.vessel2Id) {
    //   const autocompleteItem = this.vesselService.findAutocompleteItem(item.vessel2Id);
    //   if (autocompleteItem) {
    //     vessel2 = autocompleteItem.vessel;
    //   }
    // }
    // if (item && item.vessel3Id) {
    //   const autocompleteItem = this.vesselService.findAutocompleteItem(item.vessel3Id);
    //   if (autocompleteItem) {
    //     vessel3 = autocompleteItem.vessel;
    //   }
    // }
    // if (item && item.vessel1Availability) {
    //   vessel1Availability = item.vessel1Availability || ''
    // }
    // if (item && item.vessel2Availability) {
    //   vessel2Availability = item.vessel2Availability || ''
    // }
    // if (item && item.vessel3Availability) {
    //   vessel3Availability = item.vessel3Availability || ''
    // }

    this.form.setValue({
      slip: slip,
      vessel1Id: vessel1,
      vessel2Id: vessel2,
      vessel3Id: vessel3,
      vessel1Availability: vessel1Availability,
      vessel2Availability: vessel2Availability,
      vessel3Availability: vessel3Availability
    })
  }

  initApiResponse() {
    // Initialize Subscription $apiResponseSub
    this.$apiResponseSub = this.slipassignmentService.$apiResponse.subscribe((apiResponse: ApiResponse) => {
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
    this.item = this.data.item;

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
        this.filteredAvailablilityList = of(filteredList);
        break;
    }
  }

  onClearInput(inputId: string, newVal) {
    if (newVal.trim() === '') {
      this.setFromInputValue(inputId, '');
    }
  }

  setFromInputValue(inputId: string, newVal: string) {
    let newValues = { ...this.form.value };
    newValues[inputId] = newVal;
    this.form.setValue(newValues);
  }

  onSave() {
    console.log('onSave');
  }

}
