
export class EventManager {
  constructor() {
    this.eventSubscriptions = {};
  }

  subscribe(eventName, callback) {
    if (this.eventSubscriptions[eventName] === undefined) {
      this.eventSubscriptions[eventName] = [];
    }
    this.eventSubscriptions[eventName].push(callback);
  }

  dispatch(eventName, eventObject) {
    this.eventSubscriptions[eventName].forEach(callback => {
      callback.call(eventObject);
    })
  }
}
