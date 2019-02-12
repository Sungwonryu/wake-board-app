export type TableActionType = 'add' | 'edit' | 'update' | 'override' | 'delete' | 'duplicate' | 'duplicateAll';
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
  messagePropFn?: Function,
  width?: string,
  textAlign?: string,
  colorCode?: string,
  isModifyEntry?: boolean,
  modifyEntryButtons?: ModifyEntryButtonType[]
}

export interface TableView {
  headerHeight?: string, // e.g. '20px'
  bodyHeight?: string, // e.g. '200px'
  headerBgColor?: string, // e.g. '#ECECEC'
  headerColor?: string, // e.g. '#FFFFFF'
  headerFontFamily?: string, // e.g. 'Lato Bold'
  headerFontSize?: string // e.g. '14px'
}

export interface TitlebarView {
  height?: string, // e.g. '20px'
  bgColor?: string,
  titlebarComponents?: TitlebarComponentType[]
}
