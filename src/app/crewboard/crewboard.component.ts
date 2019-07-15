// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { SearchOptions, SearchOptionsParams } from '../shared/data-table/search-options/search-options.model';
// import { Subscription } from 'rxjs';

// import { ApiResponse, ListUpdate } from '../api-storage/api-data.model';
// import { DateFormatService } from '../shared/services/date-format.service';
// import { Note, NoteApiObj, NoteOpts } from '../notes/note.model';
// import { Note, NoteApiObj } from '../assignments/note/note.model';
// import { NoteService } from '../notes/note.service';
// import { Crewswap, CrewswapApiObj, CrewswapOpts } from '../crewswaps/crewswap.model';
// import { CrewswapService } from '../crewswaps/crewswap.service';
// import { Slipassignment, SlipassignmentApiObj, SlipassignmentOpts } from '../slipassignments/slipassignment.model';
// import { SlipassignmentService } from '../slipassignments/slipassignment.service';
// import { Vesselassignment, VesselassignmentApiObj, VesselassignmentOpts } from '../vesselassignments/vesselassignment.model';
// import { VesselassignmentService } from '../vesselassignments/vesselassignment.service';


import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HDate } from '../shared/lib/h-date';

import { ListUpdate } from '../api-storage/api-storage.model';
import { VesselassignmentService } from '../assignments/vesselassignment/vesselassignment.service';
import { NoteService } from '../assignments/note/note.service';
import { CrewswapService } from '../assignments/crewswap/crewswap.service';
import { SlipassignmentService } from '../assignments/slipassignment/slipassignment.service';

@Component({
  selector: 'app-crewboard',
  templateUrl: './crewboard.component.html',
  styleUrls: ['./crewboard.component.scss']
})
export class CrewboardComponent implements OnDestroy, OnInit {
  HDate = HDate;

  date: Date = null;
  notesData: any[] = [];
  crewswapsData: any[] = [];
  slipassignmentsData: any[] = [];
  vesselassignmentsData: any[] = [];

  // updateInterval = 1000; // 1 sec
  updateInterval = 30000; // 30 sec
  updateIntervalId: any = null;

  $notesListUpdateSub: Subscription;
  $notesApiResponseSub: Subscription;
  $crewswapsListUpdateSub: Subscription;
  $crewswapsApiResponseSub: Subscription;
  $slipassignmentsListUpdateSub: Subscription;
  $slipassignmentsApiResponseSub: Subscription;
  $vesselassignmentsListUpdateSub: Subscription;
  $vesselassignmentsApiResponseSub: Subscription;

  constructor(
    public noteService: NoteService,
    public crewswapService: CrewswapService,
    public slipassignmentService: SlipassignmentService,
    public vesselassignmentService: VesselassignmentService
  ) { }

  ngOnInit() {
    this.initDataUpdate();

    this.requestDataFromApi();
    this.updateIntervalId = setInterval(() => {
      this.requestDataFromApi();
    }, this.updateInterval);
    setTimeout(() => {
      this.initData();
    }, 400);
  }

  ngOnDestroy() {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
    if (this.$notesListUpdateSub) {
      this.$notesListUpdateSub.unsubscribe();
    }
    if (this.$notesApiResponseSub) {
      this.$notesApiResponseSub.unsubscribe();
    }
    if (this.$crewswapsListUpdateSub) {
      this.$crewswapsListUpdateSub.unsubscribe();
    }
    if (this.$crewswapsApiResponseSub) {
      this.$crewswapsApiResponseSub.unsubscribe();
    }
    if (this.$slipassignmentsListUpdateSub) {
      this.$slipassignmentsListUpdateSub.unsubscribe();
    }
    if (this.$slipassignmentsApiResponseSub) {
      this.$slipassignmentsApiResponseSub.unsubscribe();
    }
    if (this.$vesselassignmentsListUpdateSub) {
      this.$vesselassignmentsListUpdateSub.unsubscribe();
    }
    if (this.$vesselassignmentsApiResponseSub) {
      this.$vesselassignmentsApiResponseSub.unsubscribe();
    }
  }

  initDataUpdate() {
    // console.log('initDateUpdate() in crewboard.component.ts');
    this.$notesListUpdateSub = this.noteService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      this.setData('notes', listUpdate);
    });
    this.$crewswapsListUpdateSub = this.crewswapService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      this.setData('crewswaps', listUpdate);
    });
    this.$slipassignmentsListUpdateSub = this.slipassignmentService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      this.setData('slipassignments', listUpdate);
    });
    this.$vesselassignmentsListUpdateSub = this.vesselassignmentService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      this.setData('vesselassignments', listUpdate);
    });
  }

  setData(dataType?: string, listUpdate?: ListUpdate) {
    // console.log('setData() in crewboard.component.ts, listUpdate: ', listUpdate);
    // if (listUpdate && listUpdate.isUpdated === true) {
    if(listUpdate && listUpdate.filteredList && Array.isArray(listUpdate.filteredList)) {
      console.log('setData() in CrewboardComponent - dataType: ' + dataType + ', listUpdate.filteredList: ', listUpdate.filteredList);
      switch(dataType) {
        case 'notes':
          // this.notesData = this.noteService.getFilteredList();
          this.notesData = listUpdate.filteredList;
          break;
        case 'crewswaps':
          // this.crewswapsData = this.crewswapService.getFilteredList();
          this.crewswapsData = listUpdate.filteredList;
          break;
        case 'slipassignments':
          // this.slipassignmentsData = this.slipassignmentService.getFilteredList();
          this.slipassignmentsData = listUpdate.filteredList;
          break;
        case 'vesselassignments':
          // this.vesselassignmentsData = this.vesselassignmentService.getFilteredList();
          this.vesselassignmentsData = listUpdate.filteredList;
          break;
      }
    }

    // let targetList;
    // switch(dataType) {
    //   case 'notes':
    //     targetList = this.notesData;
    //     break;
    //   case 'crewswaps':
    //     targetList = this.crewswapsData;
    //     break;
    //   case 'slipassignments':
    //     targetList = this.slipassignmentsData;
    //     break;
    //   case 'vesselassignments':
    //     targetList = this.vesselassignmentsData;
    //     break;
    // }
    //
    // if (!targetList.length || (listUpdate && listUpdate.isUpdated === true)) {
    //   targetList = listUpdate.list;
    // }
  }

  requestDataFromApi() {
    // // set date by removing hours, minutes and secondes from new Date() instance
    // const date = this.HDate.toDate(this.HDate.toDateString(new Date()));
    //
    // this.noteService.setDate(date);
    // this.noteService.api('read');
    // this.crewswapService.setDate(date);
    // this.crewswapService.api('read');
    // this.slipassignmentService.setDate(date);
    // this.slipassignmentService.api('read');
    // this.vesselassignmentService.setDate(date);
    // this.vesselassignmentService.api('read');

    this.noteService.apiToday('read');
    this.crewswapService.apiToday('read');
    this.slipassignmentService.apiToday('read');
    this.vesselassignmentService.apiToday('read');
  }

  initData() {
    this.notesData = this.noteService.getList();
    this.crewswapsData = this.crewswapService.getList();
    this.vesselassignmentsData = this.vesselassignmentService.getList();
    this.slipassignmentsData = this.slipassignmentService.getList();
  }



}
