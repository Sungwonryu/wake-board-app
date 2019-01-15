import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-element-card',
  templateUrl: './element-card.component.html',
  styleUrls: ['./element-card.component.scss']
})
export class ElementCardComponent implements OnInit {

  @Input() element: any;
  @Input() viewDetails: boolean;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() contents: string[];
  @Output() onEditItem = new EventEmitter<any>();
  @Output() onDeleteItem = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onEdit() {
    this.onEditItem.emit(this.element);
  }

  onDelete() {
    this.onDeleteItem.emit(this.element);
  }
}
