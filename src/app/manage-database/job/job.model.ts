import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  JobApiObj is the interface of returning objects from API
 *  JobApiObj interface uses underscore case for its property names
*/
export interface JobApiObj extends BaseApiObj {
  'job'?: string | null;
}

/**
 *  Job is the base interface for the objects used in the front-end
 *  Job interface uses underscore case for its property names
*/
export interface Job extends BaseDataObj {
  job?: string | null;
}
