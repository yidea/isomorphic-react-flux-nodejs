/**
 * StoreItemSetup
 */
export default class StoreItemSetup {
  constructor() {
    // Auto-magically bind to methods with `onACTION` or `ACTION`.
    // See: http://alt.js.org/docs/createStore/#storemodelbindactions
    this.bindActions(this.alt.getActions("Action"));

    // TODO: Switch to immutable-js + alt integration.
    // Item setup
    this.value = "";
    this.qarthResponse = null;
    this.loaded = false;
    this.qarthError = "";
  }

  onSetProductName(value) {
    this.value = value;
  }

  onFetchQarth() {
    // empty error
    this.qarthError = null;
    this.loaded = false;
  }

  onFetchQarthSuccess(res) {
    this.qarthResponse = res;
    this.loaded = true;
  }

  onFetchQarthFail(err) {
    this.qarthError = err.message || err.toString();
    this.loaded = true;
  }
}
