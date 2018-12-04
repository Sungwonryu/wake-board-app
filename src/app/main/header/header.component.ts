import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navList = [
    { text: `Current\nAssignments` },
    { text: `Past\nAssignments` },
    { text: `Crewboard\nPreview` },
    { text: `Manage\nDatabase` }
  ];

  constructor() { }

  ngOnInit() {
  }

}
