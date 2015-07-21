/**
 * ActionItemSetup
 */
import api from "../utils/api";

export default class Actions {
  constructor() {
    this.generateActions(
      "setProductName",
      "fetchQarthSuccess",
      "fetchQarthFail"
    );
  }

  fetchQarth(value) {
    this.dispatch();
    
    return api.fetchQarth(value)
      .then(res => {
        this.actions.fetchQarthSuccess(res);
      })
      .catch(err => {
        this.actions.fetchQarthFail(err);
      });
  }
}
