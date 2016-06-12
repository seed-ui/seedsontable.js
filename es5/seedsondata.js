'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeedsonData = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

require('core-js/fn/array/find');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SeedsonData = exports.SeedsonData = function () {
  /* columns
   * {data, dataLabel, version, versionColumn, developmentFlagColumn, noSeed}
   */

  function SeedsonData(columns, sourceData) {
    var _this = this;

    var comments = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    (0, _classCallCheck3.default)(this, SeedsonData);

    this._columns = columns;
    this._columnNames = SeedsonData.namesFromColumns(columns);
    this._columnLabels = this.columns.map(function (column) {
      return column.dataLabel;
    });
    this._columnVersions = this.columns.map(function (column) {
      return column.version;
    });
    this._versionColumn = this.columns.find(function (column) {
      return column.versionColumn;
    });
    this._developmentFlagColumn = this.columns.find(function (column) {
      return column.developmentFlagColumn;
    });
    this._data = [this.columnNames.reduce(function (row, value, index) {
      row[value] = value;return row;
    }, {}), this.columnNames.reduce(function (row, value, index) {
      row[value] = _this.columnLabels[index];return row;
    }, {}), this.columnNames.reduce(function (row, value, index) {
      row[value] = _this.columnVersions[index];return row;
    }, {})].concat(sourceData.map(function (row) {
      return (0, _assign2.default)({}, row);
    }));
    this._comments = comments;
  }

  (0, _createClass3.default)(SeedsonData, [{
    key: 'contentData',
    value: function contentData() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var version = options.version;
      var denyDevelop = options.denyDevelop;
      var denyNoSeed = options.denyNoSeed;

      var columns = this.columns;
      var contentData = this.data.slice(3);
      if (denyDevelop && this.developmentFlagColumn) {
        (function () {
          var developmentFlagColumnName = _this2.developmentFlagColumn.data;
          contentData = contentData.filter(function (row) {
            return !row[developmentFlagColumnName];
          });
        })();
      }
      if (version) {
        columns = columns.filter(function (column) {
          return SeedsonData.isAllowVersion(column.version, version);
        });
        if (this.versionColumn) {
          (function () {
            var versionColumnName = _this2.versionColumn.data;
            contentData = contentData.filter(function (row) {
              return SeedsonData.isAllowVersion(row[versionColumnName], version);
            });
          })();
        }
      }
      if (denyNoSeed) {
        columns = columns.filter(function (column) {
          return !column.noSeed;
        });
      }
      if (columns.length === this.columns.length) {
        return contentData.map(function (row) {
          return (0, _assign2.default)({}, row);
        });
      } else {
        var _ret3 = function () {
          var columnNames = SeedsonData.namesFromColumns(columns);
          return {
            v: contentData.map(function (row) {
              return columnNames.reduce(function (newrow, name) {
                newrow[name] = row[name];
                return newrow;
              }, {});
            })
          };
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret3)) === "object") return _ret3.v;
      }
    }
  }, {
    key: 'contentDataToHash',
    value: function contentDataToHash(options) {
      return SeedsonData.nativeToHash(this.contentData(options));
    }
  }, {
    key: 'contentDataToArray',
    value: function contentDataToArray(options) {
      return SeedsonData.nativeToArray(this.contentData(options));
    }
  }, {
    key: 'setDataAtRowProp',
    value: function setDataAtRowProp(row, prop, value) {
      var _this3 = this;

      var inputs = SeedsonData.setDataInputToArray(row, prop, value);
      inputs.forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 3);

        var row = _ref2[0];
        var prop = _ref2[1];
        var value = _ref2[2];

        if (!_this3.data[row]) _this3.data[row] = {};
        _this3.data[row][prop] = value;
      });
    }
  }, {
    key: 'saveCommentAtRowProp',
    value: function saveCommentAtRowProp(row, prop, comment) {
      if (!this.comments[row]) this.comments[row] = {};
      this.comments[row][prop] = comment;
    }
  }, {
    key: 'removeCommentAtRowProp',
    value: function removeCommentAtRowProp(row, prop) {
      if (this.comments[row]) delete this.comments[row][prop];
      if ((0, _keys2.default)(this.comments[row]).length === 0) delete this.comments[row];
    }
  }, {
    key: 'columns',
    get: function get() {
      return this._columns;
    }
  }, {
    key: 'columnNames',
    get: function get() {
      return this._columnNames;
    }
  }, {
    key: 'columnLabels',
    get: function get() {
      return this._columnLabels;
    }
  }, {
    key: 'columnVersions',
    get: function get() {
      return this._columnVersions;
    }
  }, {
    key: 'versionColumn',
    get: function get() {
      return this._versionColumn;
    }
  }, {
    key: 'developmentFlagColumn',
    get: function get() {
      return this._developmentFlagColumn;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }
  }, {
    key: 'comments',
    get: function get() {
      return this._comments;
    }
  }, {
    key: 'allComments',
    get: function get() {
      var _this4 = this;

      return (0, _keys2.default)(this.comments).map(function (row) {
        return (0, _keys2.default)(_this4.comments[row]).map(function (prop) {
          return { row: row, col: _this4.columnNames.indexOf(prop), comment: _this4.comments[row][prop] };
        });
      }).reduce(function (all, part) {
        return all.concat(part);
      }, []);
    }
  }], [{
    key: 'fromHash',
    value: function fromHash(columns, sourceData) {
      return new SeedsonData(columns, SeedsonData.hashToNative(sourceData));
    }
  }, {
    key: 'fromArray',
    value: function fromArray(columns, sourceData) {
      return new SeedsonData(columns, SeedsonData.arrayToNative(columns, sourceData));
    }
  }, {
    key: 'hashToNative',
    value: function hashToNative(data) {
      return (0, _keys2.default)(data).map(function (key) {
        return data[key];
      }).sort(function (a, b) {
        return (a.id || 0) - (b.id || 0);
      });
    }
  }, {
    key: 'nativeToHash',
    value: function nativeToHash(data) {
      return data.reduce(function (hash, row) {
        if (row.id != null) hash['data' + row.id] = row;
        return hash;
      }, {});
    }
  }, {
    key: 'arrayToNative',
    value: function arrayToNative(columns, data) {
      var columnNames = SeedsonData.namesFromColumns(columns);
      return data.map(function (row) {
        return columnNames.reduce(function (hash, name, index) {
          hash[name] = row[index];
          return hash;
        }, {});
      });
    }
  }, {
    key: 'nativeToArray',
    value: function nativeToArray(columns, data) {
      var columnNames = SeedsonData.namesFromColumns(columns);
      return data.map(function (row) {
        return columnNames.map(function (name) {
          return row[name];
        });
      });
    }
  }, {
    key: 'namesFromColumns',
    value: function namesFromColumns(columns) {
      return columns.map(function (column) {
        return column.data;
      });
    }
  }, {
    key: 'isAllowVersion',
    value: function isAllowVersion(version, targetVersion) {
      return !version || _semver2.default.lte(version, targetVersion);
    }
  }, {
    key: 'setDataInputToArray',
    value: function setDataInputToArray(row, propOrCol, value) {
      if ((typeof row === 'undefined' ? 'undefined' : (0, _typeof3.default)(row)) === 'object') {
        // is it an array of changes
        return row;
      } else {
        return [[row, propOrCol, value]];
      }
    }
  }]);
  return SeedsonData;
}();
//# sourceMappingURL=seedsondata.js.map
