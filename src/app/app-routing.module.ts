import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { CrewboardComponent } from './crewboard/crewboard.component';
import { MainComponent } from './main/main.component';
import { CurrentAssignmentsComponent } from './assignments/current-assignments/current-assignments.component';
import { PastAssignmentsComponent } from './assignments/past-assignments/past-assignments.component';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';

import { BasicTablesComponent } from './manage-database/basic-tables/basic-tables.component';
import { RelationshipTablesComponent } from './manage-database/relationship-tables/relationship-tables.component';

import { VesselTableComponent } from './manage-database/vessel-table/vessel-table.component';
import { ShiftTableComponent } from './manage-database/shift-table/shift-table.component';
import { CrewmemberTableComponent } from './manage-database/crewmember-table/crewmember-table.component';
import { CrewswapTableComponent } from './manage-database/crewswap-table/crewswap-table.component';

const defaultPath = 'main/current-assignments';

const routes: Routes = [
  { path: '', redirectTo: defaultPath, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'crewboard', component: CrewboardComponent },
  { path: 'main', component: MainComponent, children: [
    { path: '', redirectTo: defaultPath, pathMatch: 'full' },
    { path: 'current-assignments', component: CurrentAssignmentsComponent },
    { path: 'past-assignments', component: PastAssignmentsComponent },
    { path: 'manage-database', component: ManageDatabaseComponent, children: [
      { path: '', redirectTo: '/main/manage-database/basic-tables', pathMatch: 'full' },
      { path: 'basic-tables', component: BasicTablesComponent },
      { path: 'relationship-tables', component: RelationshipTablesComponent, children: [
        { path: '', redirectTo: '/main/manage-database/relationship-tables/vessel', pathMatch: 'full' },
        { path: 'vessel', component: VesselTableComponent },
        { path: 'shift', component: ShiftTableComponent },
        { path: 'crew-member', component: CrewmemberTableComponent },
        { path: 'crew-swap', component: CrewswapTableComponent }
      ] }
    ] }
  ] },
  { path: '**', redirectTo: defaultPath }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
