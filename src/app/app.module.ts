import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

// app
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';

// shared
import { TableComponent } from './shared/tables/table/table.component';
import { TableWrapperComponent } from './shared/tables/table-wrapper/table-wrapper.component';

// auth
import { LoginComponent } from './auth/login/login.component';

// crewboard
import { CrewboardComponent } from './crewboard/crewboard.component';

// main
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';

// current-assignments
import { CurrentAssignmentsComponent } from './current-assignments/current-assignments.component';

// past-assignments
import { PastAssignmentsComponent } from './past-assignments/past-assignments.component';

// manage-database
import { ManageDatabaseComponent } from './manage-database/manage-database.component';
import { BasicTablesComponent } from './manage-database/basic-tables/basic-tables.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TableWrapperComponent,
    LoginComponent,
    CrewboardComponent,
    MainComponent,
    HeaderComponent,
    CurrentAssignmentsComponent,
    PastAssignmentsComponent,
    ManageDatabaseComponent,
    BasicTablesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
