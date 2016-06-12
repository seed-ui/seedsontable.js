"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CellOwners = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CellOwners = exports.CellOwners = function () {
  function CellOwners(table) {
    (0, _classCallCheck3.default)(this, CellOwners);

    this._table = table;
    this._setEvents();
  }

  (0, _createClass3.default)(CellOwners, [{
    key: "_setEvents",
    value: function _setEvents() {}
  }, {
    key: "table",
    get: function get() {
      return this._table;
    }
  }]);
  return CellOwners;
}();
//# sourceMappingURL=cellowners.js.map
