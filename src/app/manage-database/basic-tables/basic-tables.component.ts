import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListUpdate } from '../../api-storage/api-storage.model';
import { VesseltypeService } from '../vesseltype/vesseltype.service'

// import { HDate } from '../../shared/lib/h-date';
// import { TableActionData } from '../../shared/tables/table.model';

@Component({
  selector: 'app-basic-tables',
  templateUrl: './basic-tables.component.html',
  styleUrls: ['./basic-tables.component.scss']
})
export class BasicTablesComponent implements OnInit, OnDestroy {

  headerMessage = 'The Master Database houses the information used to create Crewboard assignments. To modify or add data, select “Edit Table” underneath the corresponding item.';

  commonTableData = {
    tableView: { headerHeight: '58px', bodyHeight: '270px', headerBgColor: '#041E42', headerColor: '#ffffff', headerFontSize: '16px'},
  }

  vesseltypeTableData = {
    ...this.commonTableData,
    tableColumns: [{ columnDef: 'vesselType', header: 'Vessel Type', width: '130px', cellFn: (row: any) => `${row.vesselType}` }],
    tableTitle: 'Vessel Type',
    dataType: 'vessel_type'
  }

  filterValue = '';

  vesseltypeList: any[] = [];

  $vesseltypeListUpdateSub: Subscription;

  constructor(
    private vesseltypeService: VesseltypeService
  ) { }

  ngOnInit() {
    this.initListUpdate();
    this.vesseltypeList = this.vesseltypeService.getList();
    this.vesseltypeService.api('read');
  }

  initListUpdate() {
    // vesseltype
    this.$vesseltypeListUpdateSub = this.vesseltypeService.$listUpdate.subscribe((listUpdate: ListUpdate) => {
      console.log(`${this.vesseltypeService.object} - list is fetched`);
      if (listUpdate && listUpdate.isUpdated === true) {
        this.vesseltypeList = this.vesseltypeService.getList();
      }
    })
  }

  ngOnDestroy() {
    if (this.$vesseltypeListUpdateSub) {
      this.$vesseltypeListUpdateSub.unsubscribe();
    }
  }

}
