import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { CrewboardComponent } from './crewboard/crewboard.component';
import { MainComponent } from './main/main.component';
import { CurrentAssignmentsComponent } from './current-assignments/current-assignments.component';
import { PastAssignmentsComponent } from './past-assignments/past-assignments.component';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';

const defaultPath = 'main/current-assignments';

const routes: Routes = [
  { path: '', redirectTo: defaultPath, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'crewboard', component: CrewboardComponent },
  { path: 'main', component: MainComponent, children: [
    { path: '', redirectTo: defaultPath, pathMatch: 'full' },
    { path: 'current-assignments', component: CurrentAssignmentsComponent },
    { path: 'past-assignments', component: PastAssignmentsComponent },
    { path: 'manage-database', component: ManageDatabaseComponent }
  ] },
  { path: '**', redirectTo: defaultPath }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
