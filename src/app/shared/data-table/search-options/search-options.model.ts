export interface SearchOptions {
  date?: Date;
  viewDetails: boolean;
  includeDeletedItems: boolean;
}

export interface SearchOptionsParams {
  date?: string;
  viewDetails: '0' | '1';
  includeDeletedItems: '0' | '1';
}
