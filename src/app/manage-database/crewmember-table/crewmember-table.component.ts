import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HString } from '../../shared/lib/h-string';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { CrewmemberService } from './crewmember.service';

@Component({
  selector: 'app-crewmember-table',
  templateUrl: './crewmember-table.component.html',
  styleUrls: ['./crewmember-table.component.scss']
})
export class CrewmemberTableComponent implements OnInit {

  HString = HString;

  tableData = {
    titlebarView: { height: '50px', bgColor: '#041E42', titlebarComponents: ['add', 'search'] },
    tableView: { headerHeight: '40px', bodyHeight: '350px' },
    tableColumns: [
      { columnDef: 'employee', header: 'Employee Name', width: '330px', cellFn: (row: any) => `${this.HString.toDefaultString(row.employee)}` },
      { columnDef: 'job', header: 'Job Title', width: '330px', cellFn: (row: any) => `${this.HString.toDefaultString(row.job)}` },
      { columnDef: 'modifyEntry', header: 'Modify Entry', width: '244px', isModifyEntry: true, modifyEntryButtons: ['edit', 'delete'] }
    ],
    tableTitle: 'CREW MEMBER RELATIONSHIPS',
    dataType: 'employees'
    // dataType: 'crew_members'
  };

  crewmemberList: any[] = [];
  $crewmemberListUpdateSub: Subscription;

  constructor(
    private crewmemberService: CrewmemberService
  ) { }

  ngOnInit() {
    console.log('CrewmemberTableComponent is init - this: ', this);
    this.initListUpdate();
    this.initList();
    this.initService();
  }

  initListUpdate() {
    // crewmember
    this.$crewmemberListUpdateSub = this.crewmemberService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.crewmemberService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.crewmemberList = this.crewmemberService.getList();
      }
    });
  }

  initList() {
    this.crewmemberList = this.crewmemberService.getList();
  }

  initService() {
    this.crewmemberService.api('read');
  }

  ngOnDestroy() {
    if (this.$crewmemberListUpdateSub) {
      this.$crewmemberListUpdateSub.unsubscribe();
    }
  }

}
