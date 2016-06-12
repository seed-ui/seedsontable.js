import Handsontable from 'handsontable';

export class Seedsontable extends Handsontable.Core {
  constructor(container, seedData, userSettings = {}) {
    const useUserSettings = Object.assign(
      {
        columns: seedData.columns,
        data: seedData.data,
        cell: [0, 1, 2].map((row) =>
          seedData.columns.map((_, col) =>
            ({row, col, type: 'text', readOnly: true, placeholder: false})
          )
        ).reduce((all, part) => all.concat(part), []).concat(seedData.allComments),
        afterSetCellMeta: (row, col, key, value) => {
          if (key === 'comment') this.seedData.saveCommentAtCell(row, col, value);
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
    this.addHook('afterRemoveCellMeta', (row, col, key, value) => {
      if (key === 'comment') this.seedData.removeCommentAtCell(row, col);
    });
  }

  get seedData() { return this._seedData; }

  _patch() {
    this._removeCellMeta = this.removeCellMeta;
    this.removeCellMeta = (row, col, key) => {
      const val = this.getCellMeta(row, col)[key];
      this._removeCellMeta(row, col, key);
      if (val != null) {
        Handsontable.hooks.run(this, 'afterRemoveCellMeta', row, col, key, val);
      }
    };
  }
}

Seedsontable.defaultUserSettings = {
  colHeaders: true,
  rowHeaders: true,
  fixedRowsTop: 3,
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
  formulas: true,
  fillHandle: 'vertical',
  outsideClickDeselects: false,
  trimWhitespace: true,
  comments: true,
};
