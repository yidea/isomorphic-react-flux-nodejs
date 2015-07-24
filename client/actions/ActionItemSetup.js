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

  fetchQarth(type, productName) {
    this.dispatch();

    return api.fetchQarth(type, productName)
      .then(res => {
        this.actions.fetchQarthSuccess(res);
      })
      .catch(err => {
        this.actions.fetchQarthFail(err);
      });
  }

  saveToFirebase(type, data) {
    this.dispatch();

    //api
  }
}
