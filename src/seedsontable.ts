import * as Handsontable from "handsontable";
import {SeedsonData} from "./seedsondata";

export class Seedsontable extends Handsontable.Core {
  static defaultUserSettings = {
    rowHeaders: true,
    manualColumnResize: true,
    manualRowResize: true,
    contextMenu: [
      'row_above',
      'row_below',
      'remove_row',
      '---------',
      'undo',
      'redo',
      '---------',
      'commentsAddEdit',
      'commentsRemove',
      '---------',
      'freeze_column',
    ],
    manualColumnFreeze: true,
    columnSorting: true,
    sortIndicator: true,
    copyPaste: true,
    fillHandle: 'vertical',
    outsideClickDeselects: false,
    trimWhitespace: true,
    comments: true,
    search: true,
  } as Handsontable.ColumnProperties;

  private readonly _seedData: SeedsonData;

  constructor(container: Element, seedData: SeedsonData, userSettings = {}) {
    const useUserSettings = Object.assign(
      {
        colHeaders: seedData.columnLabels,
        columns: seedData.columns,
        data: seedData.data,
        cell: seedData.allComments,
        afterSetCellMeta: (row: number, col: number, key: string, value: string) => {
          if (key === 'comment') this.seedData.saveCommentAtRowProp(row, this.seedData.columnNames[col], value);
        },
      },
      Seedsontable.defaultUserSettings,
      userSettings
    );
    super(container, useUserSettings);
    this._seedData = seedData;
    // patch
    this._patch();
    // for remove comment
    this.addHook('afterRemoveCellMeta', ((row: number, col: number, key: string, _: string) => {
      if (key === 'comment') this.seedData.removeCommentAtRowProp(row, this.seedData.columnNames[col]);
    }) as any);
  }

  get seedData() { return this._seedData; }

  private _patch() {
    const removeCellMeta = this.removeCellMeta.bind(this);
    this.removeCellMeta = (row, col, key) => {
      removeCellMeta(row, col, key);
      const val = (this.getCellMeta(row, col) as any)[key];
      if (val != null) {
        ((Handsontable.hooks) as any).run(this, 'afterRemoveCellMeta', row, col, key, val);
      }
    };
  }
}
