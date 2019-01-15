import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchOptions, SearchOptionsParams } from './search-options.model';
// import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.scss']
})
export class SearchOptionsComponent implements OnInit {

  @Input() fields: string[];
  @Input() options: SearchOptions;
  @Output() onSearchOptions = new EventEmitter<SearchOptions>();
  @ViewChild('f') form: NgForm;

  constructor(
    public route: ActivatedRoute,
    // public router: Router
    // public dateFormatService: DateFormatService
  ) { }

  ngOnInit() { }

  isVisible(field: string): boolean {
    let isVisible = true;
    if (this.fields.indexOf(field) === -1) {
      isVisible = false;
    }
    return isVisible;
  }

  // onSearch() {
  //   const searchOptions: SearchOptions = this.form.value;
  //   let queryParamsObj: SearchOptionsParams = {
  //     viewDetails: searchOptions.viewDetails ? '1' : '0',
  //     includeDeletedItems: searchOptions.includeDeletedItems ? '1' : '0',
  //   };
  //   if (searchOptions.date && searchOptions.date instanceof Date) {
  //     queryParamsObj.date = this.dateFormatService.formatToDbDate(searchOptions.date);
  //   }
  //
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: queryParamsObj,
  //     queryParamsHandling: 'merge'
  //   });
  // }
  onSearch() {
    const searchOptions: SearchOptions = this.form.value;
    this.onSearchOptions.emit(searchOptions);
    // let queryParamsObj: SearchOptionsParams = {
    //   viewDetails: searchOptions.viewDetails ? '1' : '0',
    //   includeDeletedItems: searchOptions.includeDeletedItems ? '1' : '0',
    // };
    // if (searchOptions.date && searchOptions.date instanceof Date) {
    //   queryParamsObj.date = this.dateFormatService.formatToDbDate(searchOptions.date);
    // }
    //
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: queryParamsObj,
    //   queryParamsHandling: 'merge'
    // });
  }
}
