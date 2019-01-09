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
    { routerLink: ['/manage-database/relationship-tables'], linkText: 'Vessels', routerLinkActiveOptions: { exact: true } },
    { routerLink: ['/manage-database/relationship-tables/shift'], linkText: 'Shifts', routerLinkActiveOptions: { exact: false } },
    { routerLink: ['/manage-database/relationship-tables/crew-member'], linkText: 'Crew Members', routerLinkActiveOptions: { exact: false } },
    { routerLink: ['/manage-database/relationship-tables/crew-swap'], linkText: 'Crew Swaps', routerLinkActiveOptions: { exact: false } }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
