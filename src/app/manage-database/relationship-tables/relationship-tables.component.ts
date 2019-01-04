import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-relationship-tables',
  templateUrl: './relationship-tables.component.html',
  styleUrls: ['./relationship-tables.component.scss']
})
export class RelationshipTablesComponent implements OnInit, OnDestroy {

  headerMessage = 'Relationships define how existing data points connect to each other. Create and manage relationships to enable the auto-fill capabilities of Wake.Board.';

  tableLinkList = [
    { routerLink: ['/main/manage-database/relationship-tables/vessel'], linkText: 'Vessels' },
    { routerLink: ['/main/manage-database/relationship-tables/shift'], linkText: 'Shifts' },
    { routerLink: ['/main/manage-database/relationship-tables/crew-member'], linkText: 'Crew Members' },
    { routerLink: ['/main/manage-database/relationship-tables/crew-swap'], linkText: 'Crew Swaps' }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
