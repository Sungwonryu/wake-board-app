import { HDate } from '../shared/lib/h-date';
import { HObject } from '../shared/lib/h-object';

/**
 *  BaseDataApiObj is the base interface of retrieving objects from API
 *  BaseDataApiObj interface uses snake case for its property names
*/
export interface BaseApiObj {
  'id'?: string | null;
  'edit_user_id'?: string | null;
  'delete_user_id'?: string | null;
  'edit_time'?: string | null;
  'deleted_at'?: string | null;
  'updated_at'?: string | null;
}

/**
 *  BaseDataObj is the base interface for the objects used for setting BaseData class instance
 *  BaseDataObj interface uses camel case for its property names
*/
export interface BaseDataObj {
  id?: string | null;
  editUserId?: string | null;
  deleteUserId?: string | null;
  editTime?: Date | null;
  deletedAt?: Date | null;
  updatedAt?: Date | null;
  // The following properties are only used in front-end and set inside services
  editUser?: string | null;
  deleteUser?: string | null;
}

const excludeProps: string[] = ['editUser', 'deleteUser', 'callTimeDT', 'firstDepartureDT'];
const datetimeProps = ['editTime', 'deletedAt', 'updatedAt'];
const dateProps = ['date', 'assignDate', 'expirationDate'];
const timeProps = ['callTime', 'firstDeparture'];

export class BaseData {

  static apiObjToDataObj(obj?: any) {
    let data = {};
    if (obj && typeof obj === 'object') {
      // Convert object from snakecase to camelcase
      obj = HObject.snakeToCamelCase(obj);
      for(let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          let dt;
          if (datetimeProps.includes(prop) || dateProps.includes(prop)) {
            // When prop is found in either datetimeProps or dateProps
            dt = HDate.toDate(obj[prop]);
            data[prop] = dt ? dt : null;
          } else if (timeProps.includes(prop)) {
            // When prop is found in timeProps
            if (obj[prop] && typeof obj[prop] === 'string') {
              data[prop] = obj[prop].slice(0, 5);
            }
            let dateStr = obj['assignDate'] ? obj['assignDate'] : obj['date'];
            dt = HDate.toDate(dateStr + ' ' + obj[prop]);
            data[(prop + 'DT')] = dt ? dt : null;
          } else if (timeProps.includes(prop)) {

          } else {
            // When prop is not found datetimeProps, dateProps or timeProps,
            if (typeof obj[prop] === 'string' || obj[prop] === null) {
              data[prop] = obj[prop];
            }
          }
        }
      }
    }
    return data;
  }

  static dataObjToApiObj(data?: any) {
    let obj = {};
    if (data && typeof data === 'object') {
      for(let prop in data) {
        if (data.hasOwnProperty(prop) && !excludeProps.includes[prop]) {
          if (datetimeProps.includes(prop) || dateProps.includes(prop)) {
            // When prop is found in datetimeProps, dateProps or datetimeProps
            // and prop is not found in excludeProps
            if (data[prop] && data[prop] instanceof Date) {
              // When data[prop] is an instance of Date
              if (datetimeProps.includes(prop)) {
                obj[prop] = HDate.toDBDatetimeString(data[prop]);
              }
              if (dateProps.includes(prop)) {
                obj[prop] = HDate.toDBDateString(data[prop]);
              }
            } else {
              obj[prop] = null;
            }
          } else if (timeProps.includes(prop)) {
            if (data[prop] && typeof data[prop] === 'string' && data[prop].length === 5) {
              obj[prop] = data[prop] + ':00';
            }
          } else {
            // When prop is not found data.datetimeProps, data.dateProps or data.timeProps,
            if (typeof data[prop] === 'string' || data[prop] === null) {
              obj[prop] = data[prop];
            }
          }
        }
      }
      // Convert object from camelcase to snakecase
      obj = HObject.camelToSnakeCase(obj);
    }
    return obj;
  }
}
