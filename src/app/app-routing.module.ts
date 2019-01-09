import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { CrewboardComponent } from './crewboard/crewboard.component';
import { MainComponent } from './main/main.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';

import { BasicTablesComponent } from './manage-database/basic-tables/basic-tables.component';
import { RelationshipTablesComponent } from './manage-database/relationship-tables/relationship-tables.component';

import { VesselTableComponent } from './manage-database/vessel-table/vessel-table.component';
import { ShiftTableComponent } from './manage-database/shift-table/shift-table.component';
import { CrewmemberTableComponent } from './manage-database/crewmember-table/crewmember-table.component';
import { CrewswapTableComponent } from './manage-database/crewswap-table/crewswap-table.component';

const routes: Routes = [
  { path: '', component: MainComponent, children: [
    { path: '', component: AssignmentsComponent, pathMatch: 'full' },
    { path: 'manage-database', component: ManageDatabaseComponent, children: [
      { path: '', component: BasicTablesComponent, pathMatch: 'full',  },
      { path: 'relationship-tables', component: RelationshipTablesComponent, children: [
        { path: '', component: VesselTableComponent, pathMatch: 'full' },
        { path: 'shift', component: ShiftTableComponent },
        { path: 'crew-member', component: CrewmemberTableComponent },
        { path: 'crew-swap', component: CrewswapTableComponent }
      ] }
    ] }
  ] },
  { path: 'crewboard', component: CrewboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
