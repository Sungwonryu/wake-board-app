import { HString } from './h-string';

export class HObject {
  /**
   *  isSame() compares obj1 and obj2
   *  If obj1 and obj2 have different property names or values
   *  it will return false, otherwise it will return true
  */
  static isSame(obj1: any, obj2: any) {
    let isValid = true;

    if (obj1 && typeof obj1 === 'object' &&
        obj2 && typeof obj2 === 'object') {

      for(let prop in obj1) {
        if (obj1.hasOwnProperty(prop)) {
          if (obj1[prop] == null) {
            // When obj1[prop] is either null or undefined
            if (obj1[prop] === null && obj2[prop] !== null) {
              // When obj1[prop] is null and obj[prop] is not null
              isValid = false;
              break;
            }
          } else if (typeof obj1[prop] !== 'object') {
            // When typeof val is not 'object' such as 'string' and 'number'
            if (!obj2[prop] || obj1[prop] !== obj2[prop]) {
              // When obj2[prop] is either null or undefined
              // or obj1[prop] is not same as obj2[prop]
              isValid = false;
              break;
            }
          } else if (obj1[prop] instanceof Date) {
            //  When obj1[prop] is an object and an instance of Date
            if (typeof obj2[prop] !== 'object' ||
                !(obj2[prop] instanceof Date) ||
                obj1[prop].getTime() !== obj2[prop].getTime()) {
              // When obj2[prop] is not an object or an instance of Date
              // or the two Date instances are not the same time
              isValid = false;
              break;
            }
          }
        }
      }
    } else {
      // When either obj1 and obj2 are not an object
      isValid = false;
    }
    return isValid;
  }

  /**
   *  camelToSnakeCase() converts an object with camel case properties
   *  to snakecaseObj with snake case properties and return snakecaseObj
   *  If obj is not an object, undefined will be returned
  */
  static camelToSnakeCase(obj: any, excludeProps: string[] = []) {
    if (obj && typeof obj === 'object') {
      const snakecaseObj = {};
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (!excludeProps ||
              typeof excludeProps !== 'object' ||
              excludeProps.constructor !== Array) {
              // When excludeProp is not an array
            excludeProps = [];
          }
          if (!excludeProps.includes(prop)) {
            // When excludeProps has 0 length or prop is not included in excludeProps
            const snakecaseProp = HString.camelToSnakeCase(prop);
            snakecaseObj[snakecaseProp] = obj[prop];
          }
        }
      }
      return snakecaseObj;
    }
  }

  /**
   *  snakeToCamelCase() converts an object with snake case properties
   *  to camelcaseObj with camel case properties and return camelcaseObj
   *  If obj is not an object, undefined will be returned
  */
  static snakeToCamelCase(obj: any, excludeProps?: string[]) {
    if (obj && typeof obj === 'object') {
      const camelcaseObj = {};
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (!excludeProps ||
              typeof excludeProps !== 'object' ||
              excludeProps.constructor !== Array) {
              // When excludeProp is not an array
            excludeProps = [];
          }
          if (!excludeProps.includes(prop)) {
            // When excludeProps has 0 length or prop is not included in excludeProps
            const camelcaseProp = HString.snakeToCamelCase(prop);
            camelcaseObj[camelcaseProp] = obj[prop];
          }
        }
      }
      return camelcaseObj;
    }
  }

  /**
   *  trimString() removes white space from both ends of string properties
  */
  static trimString(obj: any) {
    if (obj && typeof obj === 'object') {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'string') {
          obj[prop] = obj[prop].trim();
        }
      }
      return obj;
    }
  }
}
