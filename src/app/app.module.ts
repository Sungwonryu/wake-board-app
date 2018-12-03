import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// app
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';

// auth
import { LoginComponent } from './auth/login/login.component';

// crewboard
import { CrewboardComponent } from './crewboard/crewboard.component';

// main
import { MainComponent } from './main/main.component';

// current-assignments
import { CurrentAssignmentsComponent } from './current-assignments/current-assignments.component';

// past-assignments
import { PastAssignmentsComponent } from './past-assignments/past-assignments.component';

// manage-database
import { ManageDatabaseComponent } from './manage-database/manage-database.component';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CrewboardComponent,
    MainComponent,
    CurrentAssignmentsComponent,
    PastAssignmentsComponent,
    ManageDatabaseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
