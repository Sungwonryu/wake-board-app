import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

// app
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';

// shared
import { OrdinalSuffixPipe } from './shared/pipes/ordinal-suffix.pipe';
import { TableComponent } from './shared/tables/table/table.component';
import { TableWrapperComponent } from './shared/tables/table-wrapper/table-wrapper.component';
import { ClockComponent } from './shared/clock/clock.component';
import { ParamsService } from './shared/services/params.service';
import { UIService } from './shared/services/ui.service';

// api-storage
import { ApiStorageService } from './api-storage/api-storage.service';

// auth
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';

// crewboard
import { CrewboardComponent } from './crewboard/crewboard.component';

// main
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';

// assignments
import { CurrentAssignmentsComponent } from './assignments/current-assignments/current-assignments.component';
import { PastAssignmentsComponent } from './assignments/past-assignments/past-assignments.component';

// manage-database
import { ManageDatabaseComponent } from './manage-database/manage-database.component';
import { BasicTablesComponent } from './manage-database/basic-tables/basic-tables.component';
import { RelationshipTablesComponent } from './manage-database/relationship-tables/relationship-tables.component';

import { VesselnameService } from './manage-database/vesselname/vesselname.service';
import { VesselnumberService } from './manage-database/vesselnumber/vesselnumber.service';
import { VesseltypeService } from './manage-database/vesseltype/vesseltype.service';
import { VesselcapacityService } from './manage-database/vesselcapacity/vesselcapacity.service';

import { ShiftService } from './manage-database/shift/shift.service';
import { RouteService } from './manage-database/route/route.service';
import { CalltimeService } from './manage-database/calltime/calltime.service';
import { LocationService } from './manage-database/location/location.service';

import { EmployeeService } from './manage-database/employee/employee.service';
import { JobService } from './manage-database/job/job.service';

@NgModule({
  declarations: [
    AppComponent,
    // share
    OrdinalSuffixPipe,
    TableComponent,
    TableWrapperComponent,
    ClockComponent,
    // auth
    LoginComponent,
    // crewboard
    CrewboardComponent,
    // main
    MainComponent,
    HeaderComponent,
    // assignments
    CurrentAssignmentsComponent,
    PastAssignmentsComponent,
    // manage-database
    ManageDatabaseComponent,
    BasicTablesComponent,
    RelationshipTablesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    ApiStorageService,
    ParamsService,
    UIService,
    VesselnameService,
    VesselnumberService,
    VesseltypeService,
    VesselcapacityService,
    ShiftService,
    RouteService,
    LocationService,
    CalltimeService,
    EmployeeService,
    JobService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
