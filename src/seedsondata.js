import semver from 'semver';
import 'core-js/fn/array/find';

export class SeedsonData {
  /* columns
   * {data, dataLabel, version, versionColumn, developmentFlagColumn, noSeed}
   */
  constructor(columns, sourceData = [], comments = {}) {
    this._columns = columns;
    this._columnNames = SeedsonData.namesFromColumns(columns);
    this._columnLabels = this.columns.map((column) => column.dataLabel);
    this._columnVersions = this.columns.map((column) => column.version);
    this._versionColumn = this.columns.find((column) => column.versionColumn);
    this._developmentFlagColumn = this.columns.find((column) => column.developmentFlagColumn);
    this._data = [
      this.columnNames.reduce((row, value, index) => { row[value] = value; return row; }, {}),
      this.columnNames.reduce((row, value, index) => { row[value] = this.columnLabels[index]; return row; }, {}),
      this.columnNames.reduce((row, value, index) => { row[value] = this.columnVersions[index]; return row; }, {}),
    ].concat(sourceData.map((row) => Object.assign({}, row)));
    this._comments = comments;
  }

  static fromHash(columns, sourceData, comments) {
    return new SeedsonData(columns, SeedsonData.hashToNative(sourceData), comments);
  }

  static fromArray(columns, sourceData, comments) {
    return new SeedsonData(columns, SeedsonData.arrayToNative(columns, sourceData), comments);
  }

  static hashToNative(data) {
    return Object.keys(data).map((key) => data[key]).sort((a, b) => (a.id || 0) - (b.id || 0));
  }

  static nativeToHash(data) {
    return data.reduce((hash, row) => {
      if (row.id != null) hash[`data${row.id}`] = row;
      return hash;
    }, {});
  }

  static arrayToNative(columns, data) {
    const columnNames = SeedsonData.namesFromColumns(columns);
    return data.map((row) =>
      columnNames.reduce((hash, name, index) => {
        hash[name] = row[index];
        return hash;
      }, {})
    );
  }

  static nativeToArray(columns, data) {
    const columnNames = SeedsonData.namesFromColumns(columns);
    return data.map((row) => columnNames.map((name) => row[name]));
  }

  static namesFromColumns(columns) {
    return columns.map((column) => column.data);
  }

  static isAllowVersion(version, targetVersion) {
    return !version || semver.lte(version, targetVersion);
  }

  get columns() { return this._columns; }

  get columnNames() { return this._columnNames; }

  get columnLabels() { return this._columnLabels; }

  get columnVersions() { return this._columnVersions; }

  get versionColumn() { return this._versionColumn; }

  get developmentFlagColumn() { return this._developmentFlagColumn; }

  get data() { return this._data; }

  get comments() { return this._comments; }

  contentData(options = {}) {
    const {version, denyDevelop, denyNoSeed} = options;
    let columns = this.columns;
    let contentData = this.data.slice(3);
    if (denyDevelop && this.developmentFlagColumn) {
      const developmentFlagColumnName = this.developmentFlagColumn.data;
      contentData = contentData.filter((row) => !row[developmentFlagColumnName]);
    }
    if (version) {
      columns = columns.filter((column) => SeedsonData.isAllowVersion(column.version, version));
      if (this.versionColumn) {
        const versionColumnName = this.versionColumn.data;
        contentData = contentData.filter((row) => SeedsonData.isAllowVersion(row[versionColumnName], version));
      }
    }
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
        }, {})
      );
    }
  }

  contentDataToHash(options) {
    return SeedsonData.nativeToHash(this.contentData(options));
  }

  contentDataToArray(options) {
    return SeedsonData.nativeToArray(this.contentData(options));
  }

  setDataAtRowProp(row, prop, value) {
    const inputs = SeedsonData.setDataInputToArray(row, prop, value);
    inputs.forEach(([row, prop, value]) => {
      if (!this.data[row]) this.data[row] = {};
      this.data[row][prop] = value;
    });
  }

  static setDataInputToArray(row, propOrCol, value) {
    if (typeof row === 'object') { // is it an array of changes
      return row;
    } else {
      return [
        [row, propOrCol, value],
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

  saveCommentAtRowProp(row, prop, comment) {
    if (!this.comments[row]) this.comments[row] = {};
    this.comments[row][prop] = comment;
  }

  removeCommentAtRowProp(row, prop) {
    if (this.comments[row]) delete this.comments[row][prop];
    if (Object.keys(this.comments[row]).length === 0) delete this.comments[row];
  }
}
