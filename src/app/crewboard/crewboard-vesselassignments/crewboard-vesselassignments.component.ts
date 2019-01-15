import { Component, Input, OnDestroy, OnInit  } from '@angular/core';

// import { Message } from '../../messages/message.model';
// import { MessageService } from '../../messages/message.service';
// import { Vesselassignment } from '../../vesselassignments/vesselassignment.model';

import { MessageService } from '../../assignments/message/message.service';
import { VesselService } from '../../manage-database/vessel-table/vessel.service';

import { HString } from '../../shared/lib/h-string';

interface RouteData {
  routeAbbreviation?: string,
  items?: any[]
}

@Component({
  selector: 'app-crewboard-vesselassignments',
  templateUrl: './crewboard-vesselassignments.component.html',
  styleUrls: ['./crewboard-vesselassignments.component.scss']
})
export class CrewboardVesselassignmentsComponent implements OnDestroy, OnInit {

  @Input() data: any[] = [];

  routeDataList: RouteData[] = [
    { routeAbbreviation: 'ER', items: [null, null, null, null] },
    { routeAbbreviation: 'RW', items: [null, null, null, null] },
    { routeAbbreviation: 'AS', items: [null, null, null, null] },
    { routeAbbreviation: 'SB', items: [null, null, null, null] },
    { routeAbbreviation: 'LE', items: [null, null, null, null] },
    { routeAbbreviation: 'SV', items: [null, null, null, null] },
    { routeAbbreviation: 'BU', items: [null, null, null, null] }
  ];

  updateDelay = 10000; // 10000 ms
  intervalId: any = null;

  HString = HString;

  constructor(
    public messageService: MessageService,
    public vesselService: VesselService
  ) { }

  ngOnInit() {
    console.log('Crewboard-vesselassign');
    this.setTableDataList();
    this.intervalId = setInterval(() => {
      this.setTableDataList();
    }, this.updateDelay);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetTableDataList() {
    this.routeDataList.forEach((routeData: RouteData) => {
      for(let i = 0; i < routeData.items.length; i++) {
        routeData.items[i] = null;
      }
    });
  }

  setTableDataList() {
    const currentTime = new Date();
    this.resetTableDataList();
    // this._setRouteData(this.routeDataList[0], this.data, 'route', 'East River', 'callTime', currentTime);
    // this._setRouteData(this.routeDataList[1], this.data, 'route', 'Rockaway', 'callTime', currentTime);
    // this._setRouteData(this.routeDataList[2], this.data, 'route', 'Astoria', 'callTime', currentTime);
    // this._setRouteData(this.routeDataList[3], this.data, 'route', 'South Brooklyn', 'callTime', currentTime);
    // this._setRouteData(this.routeDataList[4], this.data, 'route', 'Lower East Side', 'callTime', currentTime);
    // this._setRouteData(this.routeDataList[5], this.data, 'route', 'Soundview', 'callTime', currentTime);
    // this._setRouteData(this.routeDataList[6], this.data, 'route', 'Backup', 'callTime', currentTime);
    this._setRouteData(this.routeDataList[0], this.data, 'route', 'East River', 'callTimeDT', currentTime);
    this._setRouteData(this.routeDataList[1], this.data, 'route', 'Rockaway', 'callTimeDT', currentTime);
    this._setRouteData(this.routeDataList[2], this.data, 'route', 'Astoria', 'callTimeDT', currentTime);
    this._setRouteData(this.routeDataList[3], this.data, 'route', 'South Brooklyn', 'callTimeDT', currentTime);
    this._setRouteData(this.routeDataList[4], this.data, 'route', 'Lower East Side', 'callTimeDT', currentTime);
    this._setRouteData(this.routeDataList[5], this.data, 'route', 'Soundview', 'callTimeDT', currentTime);
    this._setRouteData(this.routeDataList[6], this.data, 'route', 'Backup', 'callTimeDT', currentTime);
  }

  // _setRouteData(routeData: RouteData, data: any[], filterProp: string, filterVal: any, sortProp: string, currentTime: Date) {
  //   const filteredData = this._filterData(data, filterProp, filterVal);
  //   const sortedTimes = this._getSortedTimes(filteredData, sortProp);
  //   const nonPassedTimes = this._getNonPassedTimes(sortedTimes, currentTime);
  //   if (nonPassedTimes && nonPassedTimes.length) {
  //     for(let i = 0; i < routeData.items.length; i++) {
  //       const time = nonPassedTimes[i];
  //       const sortVal = new Date(time);
  //       if (typeof time === 'number' && sortVal instanceof Date) {
  //         const matchedItem = this._findItem(data, sortProp, sortVal);
  //         routeData.items[i] = matchedItem;
  //       } else {
  //         routeData.items[i] = null;
  //       }
  //     }
  //   }
  // }
  _setRouteData(routeData: RouteData, data: any[], filterProp: string, filterVal: any, sortProp: string, currentTime: Date) {
    const filteredData = this._filterData(data, filterProp, filterVal);
    const sortedData = this._sortData(filteredData, sortProp);

    const sortedTimes = this._getSortedTimes(sortedData, sortProp);
    const nonPassedTimes = this._getNonPassedTimes(sortedTimes, currentTime);
    const firstTime = nonPassedTimes[0];

    let firstItem;
    let firstIndex;
    let lastIndex;
    // firstTime is the first time which hasn't been passed yet
    if (firstTime) {
      firstItem = this._findItem(sortedData, sortProp, new Date(firstTime));
    }
    // firstItem is the first item of nonpassed SortedData
    if (firstItem) {
      firstIndex = sortedData.indexOf(firstItem);
      lastIndex = firstIndex + routeData.items.length - 1;
      if (lastIndex > sortedData.length) {
        lastIndex = sortedData.length;
      }
      for (let i = firstIndex; i <= lastIndex; i++) {
        routeData.items[i - firstIndex] = sortedData[i];
      }
    }
  }

  _filterData(data: any[], prop: string, val: any): any[] {
    return data.filter((item: any) => {
      return item[prop] === val;
    });
  }

  _sortData(data: any[], prop: string): any[] {
    return data.sort((prevObj, nextObj) => {
      if (prevObj && typeof prevObj === 'object' &&
          nextObj && typeof nextObj === 'object') {

        const prevVal = prevObj[prop];
        const nextVal = nextObj[prop];

        if (!prevVal) {
          return -1;
        } else if (!nextVal) {
          return 1;
        } else {
          // When both prevVal and nextVal are not undefined, null or empty valueObj

          if (prevVal instanceof Date && nextVal instanceof Date) {
            if (prevVal.getTime() > nextVal.getTime()) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      }
    });
  }

  _getSortedTimes(data: any[], prop: string): number[] {
    const filteredData = data.filter((item: any) => {
      if (item[prop] !== null) {
        return item[prop] instanceof Date;
      }
    })
    const times = filteredData.map((item: any) => {
      return item[prop].getTime();
    });
    return times.sort();
  }

  _getNonPassedTimes(times: number[], currentTime: Date): number[] {
    return times.filter((time: number) => {
      return time >= currentTime.getTime();
    });
  }

  _findItem(data: any[], prop: string, val: any): any {
    return data.find((item: any) => {
      if (item[prop] instanceof Date) {
        return (item[prop].getTime() === val.getTime());
      } else {
        return item[prop] === val;
      }
    });
  }

  _filterItem(data: any[], prop: string, val: any): any[] {
    return data.filter((item: any) => {
      if (item[prop] instanceof Date) {
        return (item[prop].getTime() === val.getTime());
      } else {
        return item[prop] === val;
      }
    });
  }

  getCrewNumber(item: any) {
    let crewNum = 0;
    if (item.captain1 != null) { crewNum++; }
    if (item.captain2 != null) { crewNum++; }
    if (item.deckhand1 != null) { crewNum++; }
    if (item.deckhand2 != null) { crewNum++; }
    if (item.deckhand3 != null) { crewNum++; }
    if (item.deckhand4 != null) { crewNum++; }
    if (item.gsa1 != null) { crewNum++; }
    if (item.gsa2 != null) { crewNum++; }
    return crewNum;
  }

  // displayCrewName(item: Vesselassignment, prop: string) {
  //   let displayName = '';
  //   if (item && item[prop]) {
  //     const fullName = item[prop].split(',');
  //     const lastName = fullName[0].trim();
  //     const firstName = fullName[1].trim();
  //     // displayName = firstName + ' ' + lastName[0].toUpperCase() + lastName.slice(1, 3);
  //     displayName = firstName + ' ' + lastName[0].toUpperCase() + '.';
  //   }
  //   return displayName;
  // }
  displayCrewName(item: any, prop: string) {
    let displayName = '';
    if (item && item[prop]) {
      const fullName = item[prop].split(',');
      const lastName = fullName[0].trim();
      const firstMiddleName = fullName[1].trim();
      let firstName = firstMiddleName;
      const index = firstMiddleName.lastIndexOf(' ');
      if (index !== -1) {
        firstName = firstMiddleName.substring(0, index);
      }
      // displayName = firstName + ' ' + lastName[0].toUpperCase() + lastName.slice(1, 3);
      displayName = firstName + ' ' + lastName[0].toUpperCase() + '.';
    }
    return displayName;
  }

  // displayVesselText(item: any) {
  //   let vesselText = '';
  //   if (item.vesselName && item.vesselName.length) {
  //     vesselText = item.vesselName;
  //   } else if (item.vesselNo && item.vesselNo.length) {
  //     vesselText = item.vesselNo;
  //   }
  //   // return vesselText;
  //   return this.HString.truncate({
  //     string: vesselText,
  //     maxLength: 15,
  //     endString: '...',
  //     splitString: ' '
  //   });
  // }
  displayVesselText(item: any) {
    let vesselText = this.vesselService.getVesselName(item.vesselId);
    // return vesselText;
    return this.HString.truncate({
      string: vesselText,
      maxLength: 15,
      endString: '...',
      splitString: ' '
    });
  }

  displayMessageSymbol(item: any, prop: string) {
    let messageSymbol = '';
    const messageId = item[prop];
    if (messageId && messageId.length) {
      const messageList = this.messageService.list;
      const message = messageList.find((item: any) => {
        return item.id === messageId;
      });
      if (message) {
        messageSymbol = message.symbol;
      }
    }
    return messageSymbol;
  }
}
