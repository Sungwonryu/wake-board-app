import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent implements OnInit {

  @Input() itemType: string;
  @Output() onAddItem = new EventEmitter();
  @Output() onFilterValue = new EventEmitter<string>();

  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() { }

  // Open the new form
  onAdd() {
    this.onAddItem.emit();
  }

  // Invoke filter by passing a trimmed and lowercased string filterValue
  onFilter(filterValue: string) {
    this.onFilterValue.emit(filterValue.trim().toLowerCase());
  }

}
