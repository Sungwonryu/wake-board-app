import { BaseApiObj, BaseDataObj } from '../../api-storage/base-data';

/**
 *  NoteApiObj is the interface of returning objects from API
 *  NoteApiObj interface uses underscore case for its property names
*/
export interface NoteApiObj extends BaseApiObj {
  'date'?: string | null;
  'expiration_date'?: string | null;
  'note'?: string | null;
  'priority_id'?: string | null;
  'duration_id'?: string | null;
  'color_id'?: string | null;
}

/**
 *  Note is the base interface for the objects used in the front-end
 *  Note interface uses underscore case for its property names
*/
export interface Note extends BaseDataObj {
  date?: Date | null;
  expirationDate?: Date | null;
  note?: string | null;
  priorityId?: string | null;
  durationId?: string | null;
  colorId?: string | null;
}
