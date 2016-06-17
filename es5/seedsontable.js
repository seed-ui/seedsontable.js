'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Seedsontable = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _handsontable = require('handsontable');

var _handsontable2 = _interopRequireDefault(_handsontable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Seedsontable = exports.Seedsontable = function (_Handsontable$Core) {
  (0, _inherits3.default)(Seedsontable, _Handsontable$Core);

  function Seedsontable(container, seedData) {
    var userSettings = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    (0, _classCallCheck3.default)(this, Seedsontable);

    var useUserSettings = (0, _assign2.default)({
      columns: seedData.columns,
      data: seedData.data,
      cell: [0, 1, 2].map(function (row) {
        return seedData.columns.map(function (_, col) {
          return { row: row, col: col, type: 'text', readOnly: true, placeholder: false, allowInsertRow: false, allowRemoveRow: false };
        });
      }).reduce(function (all, part) {
        return all.concat(part);
      }, []).concat(seedData.allComments),
      afterSetCellMeta: function afterSetCellMeta(row, col, key, value) {
        if (key === 'comment') _this.seedData.saveCommentAtCell(row, col, value);
      }
    }, Seedsontable.defaultUserSettings, userSettings);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Seedsontable).call(this, container, useUserSettings));

    _this._seedData = seedData;
    // patch
    _this._patch();
    // for remove comment
    _this.addHook('afterRemoveCellMeta', function (row, col, key, value) {
      if (key === 'comment') _this.seedData.removeCommentAtCell(row, col);
    });
    return _this;
  }

  (0, _createClass3.default)(Seedsontable, [{
    key: '_patch',
    value: function _patch() {
      var _this2 = this;

      this._removeCellMeta = this.removeCellMeta;
      this.removeCellMeta = function (row, col, key) {
        var val = _this2.getCellMeta(row, col)[key];
        _this2._removeCellMeta(row, col, key);
        if (val != null) {
          _handsontable2.default.hooks.run(_this2, 'afterRemoveCellMeta', row, col, key, val);
        }
      };
    }
  }, {
    key: 'seedData',
    get: function get() {
      return this._seedData;
    }
  }]);
  return Seedsontable;
}(_handsontable2.default.Core);

Seedsontable.defaultUserSettings = {
  colHeaders: true,
  rowHeaders: true,
  fixedRowsTop: 3,
  manualColumnResize: true,
  manualRowResize: true,
  contextMenu: ['row_above', 'row_below', 'remove_row', '---------', 'undo', 'redo', '---------', 'commentsAddEdit', 'commentsRemove', '---------', 'freeze_column'],
  manualColumnFreeze: true,
  columnSorting: true,
  sortIndicator: true,
  copyPaste: true,
  formulas: true,
  fillHandle: 'vertical',
  outsideClickDeselects: false,
  trimWhitespace: true,
  comments: true,
  search: true
};
//# sourceMappingURL=seedsontable.js.map
