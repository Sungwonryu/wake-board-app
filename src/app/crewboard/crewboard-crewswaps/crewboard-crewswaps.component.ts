import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { VesselService } from '../../manage-database/vessel-table/vessel.service';

interface TableItem {
  id?: number,
  crewswaps?: any[],
  callTime?: Date,
  firstDeparture?: Date
}

@Component({
  selector: 'app-crewboard-crewswaps',
  templateUrl: './crewboard-crewswaps.component.html',
  styleUrls: ['./crewboard-crewswaps.component.scss']
})
export class CrewboardCrewswapsComponent implements OnDestroy, OnInit {

  @Input() data: any[] = [];

  tableDataList = [
    [{ id: 1, crewswaps: [], callTime: null, firstDeparture: null }, { id: 2, crewswaps: [], callTime: null, firstDeparture: null }, { id: 3, crewswaps: [], callTime: null, firstDeparture: null }, { id: 4, crewswaps: [], callTime: null, firstDeparture: null }],
    [{ id: 1, crewswaps: [], callTime: null, firstDeparture: null }, { id: 2, crewswaps: [], callTime: null, firstDeparture: null }, { id: 3, crewswaps: [], callTime: null, firstDeparture: null }],
    [{ id: 1, crewswaps: [], callTime: null, firstDeparture: null }, { id: 2, crewswaps: [], callTime: null, firstDeparture: null }, { id: 3, crewswaps: [], callTime: null, firstDeparture: null }]
  ];
  updateDelay = 1000; // 1000 ms
  intervalId: any = null;

  constructor(
    public vesselService: VesselService
  ) { }

  ngOnInit() {
    this.setTableDataList();
    this.intervalId = setInterval(() => {
      this.resetTableDataList();
      this.setTableDataList();
    }, this.updateDelay);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetTableDataList() {
    this.tableDataList.forEach((tableData: TableItem[]) => {
      tableData.forEach((item: TableItem) => {
        item.callTime = null;
        item.firstDeparture = null;
        item.crewswaps = [];
      });
    });
  }

  setTableDataList() {
    const currentTime = new Date();
    this.resetTableDataList();
    // this._setTableData(this.tableDataList[0], this.data, 'location', 'GMD and Pier 11', 'callTimeDT', 'firstDepartureDT', currentTime);
    // this._setTableData(this.tableDataList[1], this.data, 'location', 'Pier11 Only', 'firstDepartureDT', 'firstDepartureDT', currentTime);
    // this._setTableData(this.tableDataList[2], this.data, 'location', 'GMD Only', 'callTimeDT', 'firstDepartureDT', currentTime);
    this._setTableData(this.tableDataList[0], this.data, 'location', 'Homeport and Pier 11', 'callTimeDT', 'firstDepartureDT', currentTime);
    this._setTableData(this.tableDataList[1], this.data, 'location', 'Pier11 Only', 'firstDepartureDT', 'firstDepartureDT', currentTime);
    this._setTableData(this.tableDataList[2], this.data, 'location', 'Homeport Only', 'callTimeDT', 'firstDepartureDT', currentTime);
  }

  _setTableData(tableData: TableItem[], data: any[], filterProp: string, filterVal: any, sortProp1: string, sortProp2: string, currentTime: Date) {
    // Filter data using a such criterion that 'locationId' is '1' from data
    // Get sortedUniqueTimes from filteredData
    // Get nonPassedTimes from sortedUniqueTimes
    const filteredData = this._filterList(data, filterProp, filterVal);
    const sortedUniqueTimes = this._getSortedUniqueTimes(filteredData, sortProp1);
    const nonPassedTimes = this._getNonPassedTimes(sortedUniqueTimes, currentTime);
    if (nonPassedTimes && nonPassedTimes.length) {
      tableData.forEach((item: TableItem, index) => {
        const timeNum = nonPassedTimes[index];
        const nonPassedTime = new Date(timeNum);
        if (typeof timeNum === 'number' && nonPassedTime instanceof Date) {
          item[sortProp1] = nonPassedTime;
          const list = this._filterList(filteredData, sortProp1, nonPassedTime);
          item.crewswaps = this._sortListByDate(list, sortProp2);
        }
      });
    }
  }

  _filterList(list: any[], prop: string, val: any): any[] {
    return list.filter((item: any) => {
      if (item[prop] instanceof Date) {
        return item[prop].getTime() === val.getTime();
      } else {
        return item[prop] === val;
      }
    });
  }

  _sortListByDate(list: any[], prop: string): any[] {
    return list.sort((prevItem: any, nextItem: any) => {
      return prevItem[prop].getTime() - nextItem[prop].getTime();
    });
  }

  _getSortedUniqueTimes(data: any[], prop: string): number[] {
    // Get filteredData whose items do have prop property value
    const filteredData = data.filter((item: any) => {
      if (item &&
          typeof item === 'object' &&
          item[prop] !== null &&
          item[prop] instanceof Date) {
        return true;
      }
    });

    const times = filteredData.map((item: any) => {
      return item[prop].getTime();
    });
    // const uniqueTimes = [...new Set(times)];
    const uniqueTimes = times.filter((val, index) => {
      return times.indexOf(val) === index;
    });
    return uniqueTimes.sort();
  }

  _getNonPassedTimes(times: number[], currentTime: Date): number[] {
    return times.filter((time: number) => {
      return time >= currentTime.getTime();
    });
  }

  conditionalInterpolation(origVal: any, compVal: any, str: string, condition: boolean = true) {
    return ((origVal === compVal) === condition) ? str : '';
  }

  isDateInstance(obj: any) {
    return obj instanceof Date;
  }
}
