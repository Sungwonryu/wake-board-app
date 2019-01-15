import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  CrewshiftApiObj is the interface of returning objects from API
 *  CrewshiftApiObj interface uses underscore case for its property names
*/
export interface CrewshiftApiObj extends BaseApiObj {
  'shift'?: string | null;
  'location'?: string | null;
}

/**
 *  Crewshift is the base interface for the objects used in the front-end
 *  Crewshift interface uses underscore case for its property names
*/
export interface Crewshift extends BaseDataObj {
  shift?: string | null;
  location?: string | null;
}
