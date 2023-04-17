import { MessageQueue } from "./PubSubMQ.js";

/**
 * @callback Action
 * @param {string} state
 * @param {any} [payload]
 * @returns {any}
 */

export default class Store {
  /**
   * @param {Object.<string, Action>} actions A dictionary where each key represents a defined "action" and
   * each value represents an associated function that will be invoke when such an "action" is dispatched.
   * @param {any} initialState Initial value of the state.
   */
  constructor(actions, initialState = {}) {
    /**
     * @type {MessageQueue}
     */
    this.messageQueue = new MessageQueue();

    /**
     * Defined actions.
     * @type {Object.<string, Action>}
     */
    this.actions = actions;

    /**
     * @type {any}
     */
    this.state = initialState;
  }

  /**
   * Dispatches an action defined in the dictionary specified to the `Store` class constructor.
   * @param {string} actionName Name of the defined action.
   * @param {any} payload Payload to be given as 2nd argument to the defined action.
   * @returns {boolean} `true` if action is invoked succesfully and the new state is pushed successfully
   * to all subscribers, otherwise `false`.
   */
  dispatch(actionName, payload) {
    if (typeof this.actions?.[actionName] === "function") {
      this.state = this.actions[actionName](this.state, payload);
      this.messageQueue.publish(this.state);
      return true;
    } else {
      console.error(`Action "${actionName}" is not defined.`);
      return false;
    }
  }

  /**
   * Adds a new subscriber that will listen for state changes.
   * @param {function} callback A subscriber that will be invoked with the new state value every time the state
   * changes.
   * @returns A subscription object which has a `unscubscribe` method for cancelling the subscription.
   */
  subscribe(callback) {
    callback(this.state);
    return this.messageQueue.subscribe(callback);
  }
}
