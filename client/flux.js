/**
 * Alt instance.
 */
import Alt from "alt";

import ActionItemSetup from "./actions/ActionItemSetup";
import StoreItemSetup from "./stores/StoreItemSetup";

export default class Flux extends Alt {
  constructor(config = {}) {
    super(config);

    this.addActions("Action", ActionItemSetup);
    this.addStore("Store", StoreItemSetup);
  }
}
