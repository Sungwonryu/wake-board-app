import { HObject } from './h-object';

export interface SearchOption {
  property: string,
  value: any,
}

export interface SortOption {
  property: string,
  isDescending?: boolean
}

export class HList {
  static includes(list: any, item: any) {
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array) {
      return list.includes(item);
    }
  }

  static find(list: any, { property, value }: SearchOption) {
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array) {
      const matchedItem = list.find((item: any) => {
        // When item is an object
        if (item && typeof item === 'object') {
          return item[property] === value;
        }
      });
      if (matchedItem) {
        return matchedItem;
      }
    }
  }

  static filter(list: any, { property, value }: SearchOption) {
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array) {
      const matchedItem = list.filter((item: any) => {
        if (item && typeof item === 'object') {
          return item[property] === value;
        }
      });
      if (matchedItem) {
        return matchedItem;
      }
    }
  }

  static findProperty(list: any, { property, value }: SearchOption, findProps: string[]) {
    let result = null;
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array && list.length &&
        typeof property === 'string' && property.length) {

      const matchedItem = list.find((item: any) => {
        if (item && typeof item === 'object') {
          return item[property] === value;
        }
      });
      let findProp;
      let findVal;
      if (matchedItem && typeof matchedItem === 'object') {
        for (let i = 0; i < findProps.length; i++) {
          findProp = findProps[i];
          findVal = matchedItem[findProp];
          if (findVal) {
            break;
          }
        }
        if (findVal) {
          result = findVal;
        }
      }
    }
    return result;
  }

  static camelToSnakeCase(list: any, excludeProps: string[] = []) {
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array) {
      const convertedList = list.map((obj: any) => {
        const convertedObj = HObject.camelToSnakeCase(obj, excludeProps);
        if (convertedObj) {
          return convertedObj;
        }
      });
      if (convertedList.length) {
        return convertedList;
      }
    }
  }

  static snakeToCamelCase(list: any, excludeProps: string[] = []) {
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array) {
      const convertedList = list.map((obj: any) => {
        const convertedObj = HObject.snakeToCamelCase(obj, excludeProps);
        if (convertedObj) {
          return convertedObj;
        }
      });
      if (convertedList.length) {
        return convertedList;
      }
    }
  }

  static isSame(oldList, newList) {
    if (oldList && typeof oldList === 'object' && oldList.constructor === Array &&
        newList && typeof newList === 'object' && newList.constructor === Array) {
      // When oldList and newList are arrays

      let isSame = true;
      if (oldList.length !== newList.length) {
        // When the lengths of newList and oldList are different
       isSame = false;
      } else {
        // When the lengths of newList and oldList are same
        for (let i = 0; i < newList.length; i++) {
          // If newList[i] is different from oldList[i], set isUpdated as true and break out the loop
          // if (!newList[i].isSame(oldList[i])) {
          if (!HObject.isSame(newList[i], oldList[i])) {
            isSame = false;
            break;
          }
        }
      }
      return isSame;
    }
  }

  // /**
  //  *  sort() returns sortedList after sorting list
  //  *  in ascedning order of property values
  // */
  // static sort(list: any, props: string[]) {
  //   if (list && typeof list === 'object' && list.constructor === Array) {
  //     let sortedList;
  //     let compareVal;
  //     let prop;
  //     let prevVal;
  //     let nextVal;
  //
  //     sortedList = list.sort((prevObj, nextObj) => {
  //       // When prevObj[prop] has has a higher value than nextObj[prop],
  //       // compareVal is set to positive
  //       compareVal = 0;
  //
  //       for (let i = 0; i < props.length; i++) {
  //         prop = props[i];
  //         prevVal = prevObj[prop];
  //         nextVal = nextObj[prop];
  //
  //         // When prevVal or nextVal is undefined or null, set it to ''
  //         if (prevVal == null) { prevVal = ''; }
  //         if (nextVal == null) { nextVal = ''; }
  //
  //         // When both prevVal and nextVal are string format numbers
  //         // convert them to number format
  //         if (typeof prevVal !== 'number' && !isNaN(prevVal) &&
  //             typeof nextVal !== 'number' && !isNaN(nextVal)) {
  //           prevVal = Number(prevVal);
  //           nextVal = Number(nextVal);
  //         }
  //
  //         // When both prevVal and nextVal are Date instances
  //         // convert them to number format time value
  //         if (typeof prevVal === 'object' && prevVal instanceof Date &&
  //             typeof nextVal === 'object' && nextVal instanceof Date) {
  //           prevVal = prevVal.getTime();
  //           nextVal = nextVal.getTime();
  //         }
  //
  //         if (typeof prevVal === 'string' && typeof nextVal === 'string') {
  //           compareVal = prevVal.localeCompare(nextVal);
  //         } else if (typeof prevVal === 'number' && typeof nextVal === 'number') {
  //           compareVal = prevVal - nextVal;
  //         } else if (typeof prevVal === 'object' && typeof nextVal === 'object') {
  //           // When both prevVal and nextVal are objects leave compareVal as 0 by default
  //           compareVal = 0;
  //         }
  //
  //         if (compareVal != 0) {
  //           break;
  //         }
  //       }
  //
  //       return compareVal;
  //     }); // end of list.sort()
  //     return sortedList;
  //   } // end of if
  // }

  /**
   *  advSort() returns sortedList after sorting list
   *  based on the settings in opts
  */
  static sort(list: any, opts: SortOption[]) {
    // When list is an array
    if (list && typeof list === 'object' && list.constructor === Array) {
      let sortedList;
      let compareVal;
      let prop;
      let prevVal;
      let nextVal;
      let isDescending;

      sortedList = list.sort((prevObj, nextObj) => {
        // When prevObj[prop] has has a higher value than nextObj[prop],
        // compareVal is set to positive
        compareVal = 0;

        for(let i = 0; i < opts.length; i++) {
          prop = opts[i].property;
          isDescending = opts[i].isDescending;
          prevVal = prevObj[prop];
          nextVal = nextObj[prop];

          // When prevVal or nextVal is undefined or null, set it to ''
          if (prevVal == null) { prevVal = ''; }
          if (nextVal == null) { nextVal = ''; }

          // When both prevVal and nextVal are string format numbers
          // convert them to number format
          if (typeof prevVal !== 'number' && !isNaN(prevVal) &&
              typeof nextVal !== 'number' && !isNaN(nextVal)) {
            prevVal = Number(prevVal);
            nextVal = Number(nextVal);
          }

          if (typeof prevVal === 'string' && typeof nextVal === 'string') {
            // When isDescending is true
            if (isDescending) {
              compareVal = nextVal.localeCompare(prevVal);
            } else {
              compareVal = prevVal.localeCompare(nextVal);
            }
          } else if (typeof prevVal === 'number' && typeof nextVal === 'number') {
            // When isDescending is true
            if (isDescending) {
              compareVal = nextVal - prevVal;
            } else {
              compareVal = prevVal - nextVal;
            }
          } else if (typeof prevVal === 'object' && typeof nextVal === 'object') {
            // When both prevVal and nextVal are objects leave compareVal as 0 by default
            compareVal = 0;
          }

          if (compareVal != 0) {
            break;
          }
        }

        return compareVal;
      }); // end of list.sort()
      return sortedList;
    } // end of if
  }

  static filterAutocompletList(list: any[], prop: string, filterVal: string): any[] {
    filterVal = filterVal.toLowerCase();
    let matchedList = [];

    if (filterVal && typeof filterVal === 'string') {
      matchedList = list.filter((item: any) => {
        const val = item[prop];
        if (val && typeof val === 'string') {
          return val.toLowerCase().indexOf(filterVal) !== -1;
        }
      });
    } else {
      matchedList = list;
    }
    return matchedList;
  }

}
