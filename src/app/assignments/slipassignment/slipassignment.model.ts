import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  SlipassignmentApiObj is the interface of returning objects from API
 *  SlipassignmentApiObj interface uses underscore case for its property names
*/
export interface SlipassignmentApiObj extends BaseApiObj {
  'date'?: string | null;
  'slip'?: string | null;
  'vessel1_id'?: string | null;
  'vessel2_id'?: string | null;
  'vessel3_id'?: string | null;
  'vessel1_availability'?: '0' | '1' | null;
  'vessel2_availability'?: '0' | '1' | null;
  'vessel3_availability'?: '0' | '1' | null;
}

/**
 *  Slipassignment is the base interface for the objects used in the front-end
 *  Slipassignment interface uses underscore case for its property names
*/
export interface Slipassignment extends BaseDataObj {
  date?: Date | null;
  slip?: string | null;
  vessel1Id?: string | null;
  vessel2Id?: string | null;
  vessel3Id?: string | null;
  vessel1Availability?: '0' | '1' | null;
  vessel2Availability?: '0' | '1' | null;
  vessel3Availability?: '0' | '1' | null;
}
