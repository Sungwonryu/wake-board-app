export type TableActionType = 'add' | 'edit' | 'delete' | 'duplicate' | 'duplicateAll';
export type ModifyEntryButtonType = 'edit' | 'delete' | 'duplicate';
export type TitlebarComponentType = 'add' | 'duplicateAll' | 'search';

export interface TableActionData {
  tableAction?: TableActionType,
  dataType?: string,
  entries?: any[]
}

export interface TableColumn {
  columnDef?: string,
  header?: string,
  cellFn?: Function,
  width?: string,
  isModifyEntry?: boolean,
  modifyEntryButtons?: ModifyEntryButtonType[]
}

export interface TableView {
  headerHeight?: string, // e.g. '20px'
  bodyHeight?: string, // e.g. '200px'
}

export interface TitlebarView {
  height?: string, // e.g. '20px'
  bgColor?: string,
  titlebarComponents?: TitlebarComponentType[]
}
