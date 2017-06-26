import * as Handsontable from "handsontable";

export interface ColumnProperties extends Handsontable.ColumnProperties {
  data: string;
  dataLabel?: string;
  noSeed?: boolean;
}

export interface DataRow {
  id: number;
  [name: string]: string | number | undefined;
}

export interface ContentDataOptions {
  denyNoSeed?: boolean;
}

export interface DataComments {
  [row: string]: {
    [prop: string]: string | undefined;
  }
}

export class SeedsonData {
  private readonly _columns: ColumnProperties[];
  private readonly _columnNames: string[];
  private readonly _columnLabels: string[];
  private readonly _data: DataRow[];
  private readonly _comments: DataComments;

  constructor(columns: ColumnProperties[], sourceData: DataRow[] = [], comments: DataComments = {}) {
    this._columns = columns;
    this._columnNames = SeedsonData.namesFromColumns(columns);
    this._columnLabels = this.columns.map((column) => column.dataLabel || "");
    this._data = [
      this.columnNames.reduce((row, value) => { row[value] = value; return row; }, {} as DataRow),
      this.columnNames.reduce((row, value, index) => { row[value] = this.columnLabels[index]; return row; }, {} as DataRow),
    ].concat(sourceData.map((row) => Object.assign({}, row)));
    this._comments = comments;
  }

  static fromHash(columns: ColumnProperties[], sourceData: {[name: string]: DataRow}, comments?: DataComments) {
    return new SeedsonData(columns, SeedsonData.hashToNative(sourceData), comments);
  }

  static fromArray(columns: ColumnProperties[], sourceData: Array<Array<any>>, comments?: DataComments) {
    return new SeedsonData(columns, SeedsonData.arrayToNative(columns, sourceData), comments);
  }

  static hashToNative(data: {[name: string]: DataRow}) {
    return Object.keys(data).map((key) => data[key]).sort((a, b) => (a.id || 0) - (b.id || 0));
  }

  static nativeToHash(data: DataRow[]) {
    return data.reduce((hash, row) => {
      if (row.id != null) hash[`data${row.id}`] = row;
      return hash;
    }, {} as {[name: string]: DataRow});
  }

  static arrayToNative(columns: ColumnProperties[], data: Array<Array<any>>) {
    const columnNames = SeedsonData.namesFromColumns(columns);
    return data.map((row) =>
      columnNames.reduce((hash, name, index) => {
        hash[name] = row[index];
        return hash;
      }, {} as DataRow)
    );
  }

  static nativeToArray(columns: ColumnProperties[], data: DataRow[]) {
    const columnNames = SeedsonData.namesFromColumns(columns);
    return data.map((row) => columnNames.map((name) => row[name]));
  }

  static namesFromColumns(columns: ColumnProperties[]) {
    return columns.map((column) => column.data);
  }

  get columns() { return this._columns; }

  get columnNames() { return this._columnNames; }

  get columnLabels() { return this._columnLabels; }

  get data() { return this._data; }

  get comments() { return this._comments; }

  contentData(options: ContentDataOptions = {}) {
    const {denyNoSeed} = options;
    let columns = this.columns;
    let contentData = this.data.slice(3);
    if (denyNoSeed) {
      columns = columns.filter((column) => !column.noSeed);
    }
    if (columns.length === this.columns.length) {
      return contentData.map((row) => Object.assign({}, row));
    } else {
      const columnNames = SeedsonData.namesFromColumns(columns);
      return contentData.map((row) =>
        columnNames.reduce((newrow, name) => {
          newrow[name] = row[name];
          return newrow;
        }, {} as DataRow)
      );
    }
  }

  contentDataToHash(options?: ContentDataOptions) {
    return SeedsonData.nativeToHash(this.contentData(options));
  }

  contentDataToArray(options?: ContentDataOptions) {
    return SeedsonData.nativeToArray(this.columns, this.contentData(options));
  }

  setDataAtRowProp(row: Array<[number, string, string]>): void;
  setDataAtRowProp(row: number, prop: string, value: string): void;
  setDataAtRowProp(row: number | Array<[number, string, string]>, prop?: string, value?: string) {
    const inputs = SeedsonData.setDataInputToArray(row as number, prop as string, value as string);
    inputs.forEach(([row, prop, value]) => {
      if (!this.data[row]) this.data[row] = {} as DataRow;
      this.data[row][prop] = value;
    });
  }

  static setDataInputToArray(row: Array<[number, string, string]>): [number, string, string][];
  static setDataInputToArray(row: number, propOrCol: string, value: string): [number, string, string][];
  static setDataInputToArray(row: number | Array<[number, string, string]>, propOrCol?: string, value?: string) {
    if (typeof row === 'object') { // is it an array of changes
      return row;
    } else {
      return [
        [row, propOrCol, value] as [number, string, string],
      ];
    }
  }

  get allComments() {
    return Object.keys(this.comments).map((row) =>
      Object.keys(this.comments[row]).map((prop) =>
        ({row, col: this.columnNames.indexOf(prop), comment: this.comments[row][prop]})
      )
    ).reduce((all, part) => all.concat(part), []);
  }

  saveCommentAtRowProp(row: number, prop: string, comment: string) {
    if (!this.comments[row]) this.comments[row] = {};
    this.comments[row][prop] = comment;
  }

  removeCommentAtRowProp(row: number, prop: string) {
    if (this.comments[row]) delete this.comments[row][prop];
    if (Object.keys(this.comments[row]).length === 0) delete this.comments[row];
  }
}
