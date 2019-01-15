import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-table-message',
  templateUrl: './data-table-message.component.html',
  styleUrls: ['./data-table-message.component.scss']
})
export class DataTableMessageComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
