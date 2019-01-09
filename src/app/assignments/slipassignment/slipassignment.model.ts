import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  SlipassignmentApiObj is the interface of returning objects from API
 *  SlipassignmentApiObj interface uses underscore case for its property names
*/
export interface SlipassignmentApiObj extends BaseApiObj {
  'date'?: string | null;
  'slip'?: string | null;
  'vessel1_number'?: string | null;
  'vessel2_number'?: string | null;
  'vessel3_number'?: string | null;
  'vessel1_name'?: string | null;
  'vessel2_name'?: string | null;
  'vessel3_name'?: string | null;
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
  vessel1Number?: string | null;
  vessel2Number?: string | null;
  vessel3Number?: string | null;
  vessel1Name?: string | null;
  vessel2Name?: string | null;
  vessel3Name?: string | null;
  vessel1Availability?: '0' | '1' | null;
  vessel2Availability?: '0' | '1' | null;
  vessel3Availability?: '0' | '1' | null;
}
