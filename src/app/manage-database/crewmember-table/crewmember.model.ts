import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  CrewmemberApiObj is the interface of returning objects from API
 *  CrewmemberApiObj interface uses underscore case for its property names
*/
export interface CrewmemberApiObj extends BaseApiObj {
  'employee'?: string | null;
  'job'?: string | null;
  'employee_number'?: string | null;
}

/**
 *  Crewmember is the base interface for the objects used in the front-end
 *  Crewmember interface uses underscore case for its property names
*/
export interface Crewmember extends BaseDataObj {
  employee?: string | null;
  job?: string | null;
  employeeNumber?: string | null;
}
