import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navList = [
    { routerLink: '/main/current-assignments', caption: `Current\nAssignments` },
    { routerLink: '/main/past-assignments', caption: `Past\nAssignments` },
    { routerLink: '/crewboard', caption: `Crewboard\nPreview` },
    { routerLink: '/main/manage-database', caption: `Manage\nDatabase` }
  ];

  constructor() { }

  ngOnInit() {
  }

}
