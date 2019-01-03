import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  EmployeeApiObj is the interface of returning objects from API
 *  EmployeeApiObj interface uses underscore case for its property names
*/
export interface EmployeeApiObj extends BaseApiObj {
  'employee'?: string | null;
}

/**
 *  Employee is the base interface for the objects used in the front-end
 *  Employee interface uses underscore case for its property names
*/
export interface Employee extends BaseDataObj {
  employee?: string | null;
}
