import Handsontable from 'handsontable';
import io from 'socket.io-client';

export class Synchrotable extends Handsontable.Core {
  constructor(container, synchroSettings, userSettings = {}) {
    super(container, userSettings);
    this._server = synchroSettings.server;
  }

  get server() { return this._server; }

  get socket() { return this._socket; }

  init() {
    super.init();
    this._socket = io(this.server);
    this._setEvents();
  }

  _setEvents() {
    Object.keys(Synchrotable.events).forEach((event) => this.socket.on(event, Synchrotable.events[event].bind(this)));
  }
}

Synchrotable.events = {
  all_data({data}) {},
  users({data}) {},
  setDataAtRowProp({row, prop, value}) {},
  saveCommentAtRowProp({row, prop, comment}) {},
  removeCommentAtRowProp({row, prop}) {},
};
