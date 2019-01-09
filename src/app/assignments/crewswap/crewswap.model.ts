import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  CrewswapApiObj is the interface of returning objects from API
 *  CrewswapApiObj interface uses underscore case for its property names
*/
export interface CrewswapApiObj extends BaseApiObj {
  'date'?: string | null;
  'call_time'?: string | null;
  'first_departure'?: string | null;
  'vessel_number'?: string | null;
  'vessel_name'?: string | null;
  'shift'?: string | null;
  'location'?: string | null;
}

/**
 *  Crewswap is the base interface for the objects used in the front-end
 *  Crewswap interface uses underscore case for its property names
*/
export interface Crewswap extends BaseDataObj {
  date?: Date | null;
  callTime?: Date | null;
  firstDeparture?: Date | null;
  vesselNo?: string | null;
  vesselName?: string | null;
  shift?: string | null;
  location?: string | null;
}
