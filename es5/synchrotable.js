'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Synchrotable = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _handsontable = require('handsontable');

var _handsontable2 = _interopRequireDefault(_handsontable);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Synchrotable = exports.Synchrotable = function (_Handsontable$Core) {
  (0, _inherits3.default)(Synchrotable, _Handsontable$Core);

  function Synchrotable(container, synchroSettings) {
    var userSettings = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    (0, _classCallCheck3.default)(this, Synchrotable);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Synchrotable).call(this, container, userSettings));

    _this._server = synchroSettings.server;
    return _this;
  }

  (0, _createClass3.default)(Synchrotable, [{
    key: 'init',
    value: function init() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Synchrotable.prototype), 'init', this).call(this);
      this._socket = (0, _socket2.default)(this.server);
      this._setEvents();
    }
  }, {
    key: '_setEvents',
    value: function _setEvents() {
      var _this2 = this;

      (0, _keys2.default)(Synchrotable.events).forEach(function (event) {
        return _this2.socket.on(event, Synchrotable.events[event].bind(_this2));
      });
    }
  }, {
    key: 'server',
    get: function get() {
      return this._server;
    }
  }, {
    key: 'socket',
    get: function get() {
      return this._socket;
    }
  }]);
  return Synchrotable;
}(_handsontable2.default.Core);

Synchrotable.events = {
  all_data: function all_data(_ref) {
    var data = _ref.data;
  },
  users: function users(_ref2) {
    var data = _ref2.data;
  },
  setDataAtRowProp: function setDataAtRowProp(_ref3) {
    var row = _ref3.row;
    var prop = _ref3.prop;
    var value = _ref3.value;
  },
  saveCommentAtRowProp: function saveCommentAtRowProp(_ref4) {
    var row = _ref4.row;
    var prop = _ref4.prop;
    var comment = _ref4.comment;
  },
  removeCommentAtRowProp: function removeCommentAtRowProp(_ref5) {
    var row = _ref5.row;
    var prop = _ref5.prop;
  }
};
//# sourceMappingURL=synchrotable.js.map
