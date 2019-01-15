import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';

// import { HDate } from '../../lib/h-date';
import { SearchOptions, SearchOptionsParams } from '../search-options/search-options.model';
// import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.scss']
})
export class ManageTableComponent implements OnInit {
  // HDate = HDate;

  // @Input() itemType: string;
  @Input() visibleFields: string[] = [];
  @Input() options: SearchOptions;
  @Output() onSearchOptions = new EventEmitter<SearchOptions>();
  @Output() onAddItem = new EventEmitter();
  @Output() onFilterValue = new EventEmitter<string>();
  @ViewChild('f') form: NgForm;

  constructor() { }

  ngOnInit() {
  }

  isVisible(field: string): boolean {
    return this.visibleFields.includes(field);
  }

  // Open a form to add a new item
  onAdd() {
    this.onAddItem.emit();
  }

  // Invoke filter by passing a trimmed and lowercased string filterValue
  onFilter(filterValue: string) {
    this.onFilterValue.emit(filterValue.trim().toLowerCase());
  }

  onSearch() {
    let date = null;
    if (this.isVisible('date') && this.form.value.date) {
      date = this.form.value.date;
    }
    let searchOptions: SearchOptions = {
      date: date,
      viewDetails: false,
      includeDeletedItems: false
    };
    this.onSearchOptions.emit(searchOptions);
  }
}
