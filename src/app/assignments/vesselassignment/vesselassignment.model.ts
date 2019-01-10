import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  VesselassignmentApiObj is the interface of returning objects from API
 *  VesselassignmentApiObj interface uses underscore case for its property names
*/
export interface VesselassignmentApiObj extends BaseApiObj {
  'date'?: string | null;
  'shift'?: string | null;
  'route'?: string | null;
  'call_time'?: string | null;
  'first_departure'?: string | null;
  'vessel_id'?: string | null;
  'captain1'?: string | null;
  'captain2'?: string | null;
  'deckhand1'?: string | null;
  'deckhand2'?: string | null;
  'deckhand3'?: string | null;
  'deckhand4'?: string | null;
  'gsa1'?: string | null;
  'gsa2'?: string | null;
  'captain1_message'?: string | null;
  'captain2_message'?: string | null;
  'deckhand1_message'?: string | null;
  'deckhand2_message'?: string | null;
  'deckhand3_message'?: string | null;
  'deckhand4_message'?: string | null;
  'gsa1_message'?: string | null;
  'gsa2_message'?: string | null;
}

/**
 *  Vesselassignment is the base interface for the objects used in the front-end
 *  Vesselassignment interface uses underscore case for its property names
*/
export interface Vesselassignment extends BaseDataObj {
  date?: string | null;
  shift?: string | null;
  route?: string | null;
  callTime?: string | null;
  firstDeparture?: string | null;
  vesselId?: string | null;
  captain1?: string | null;
  captain2?: string | null;
  deckhand1?: string | null;
  deckhand2?: string | null;
  deckhand3?: string | null;
  deckhand4?: string | null;
  gsa1?: string | null;
  gsa2?: string | null;
  captain1Message?: string | null;
  captain2Message?: string | null;
  deckhand1Message?: string | null;
  deckhand2Message?: string | null;
  deckhand3Message?: string | null;
  deckhand4Message?: string | null;
  gsa1Message?: string | null;
  gsa2Message?: string | null;
}
