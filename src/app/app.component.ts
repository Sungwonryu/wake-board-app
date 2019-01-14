import { Component } from '@angular/core';

import { AuthService } from './auth/auth.service';

import { VesselnameService } from './manage-database/vesselname/vesselname.service';
import { VesselnumberService } from './manage-database/vesselnumber/vesselnumber.service';
import { VesselcapacityService } from './manage-database/vesselcapacity/vesselcapacity.service';
import { VesseltypeService } from './manage-database/vesseltype/vesseltype.service';
import { CalltimeService } from './manage-database/calltime/calltime.service';
import { ShiftnameService } from './manage-database/shiftname/shiftname.service';
import { RouteService } from './manage-database/route/route.service';
import { LocationService } from './manage-database/location/location.service';
import { EmployeeService } from './manage-database/employee/employee.service';

import { JobService } from './manage-database/job/job.service';
import { VesselService } from './manage-database/vessel-table/vessel.service';
import { ShiftService } from './manage-database/shift-table/shift.service';
import { CrewmemberService } from './manage-database/crewmember-table/crewmember.service';

import { NoteService } from './assignments/note/note.service';
import { CrewswapService } from './assignments/crewswap/crewswap.service';
import { SlipassignmentService } from './assignments/slipassignment/slipassignment.service';
import { VesselassignmentService } from './assignments/vesselassignment/vesselassignment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private vesselnameService: VesselnameService,
    private vesselnumberService: VesselnumberService,
    private vesselcapacityService: VesselcapacityService,
    private vesseltypeService: VesseltypeService,
    private calltimeService: CalltimeService,
    private shiftnameService: ShiftnameService,
    private routeService: RouteService,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private jobService: JobService,

    private vesselService: VesselService,
    private shiftService: ShiftService,
    private crewmemberService: CrewmemberService,

    private noteService: NoteService,
    private slipassignmentService: SlipassignmentService,
    private crewswapService: CrewswapService,
    private vesselassignmentService: VesselassignmentService
  ) {

    this.vesselnameService.api('read');
    this.vesselnumberService.api('read');
    this.vesselcapacityService.api('read');
    this.vesseltypeService.api('read');
    this.calltimeService.api('read');
    this.shiftnameService.api('read');
    this.routeService.api('read');
    this.locationService.api('read');
    this.employeeService.api('read');
    this.jobService.api('read');

    this.vesselService.api('read');
    this.shiftService.api('read');
    this.crewmemberService.api('read');

    this.noteService.api('read');
    this.slipassignmentService.api('read');
    this.crewswapService.api('read');
    this.vesselassignmentService.api('read');

    this.authService.login({
      email: 'admin1@test.com',
      password: '12345678'
    });
  }

}
