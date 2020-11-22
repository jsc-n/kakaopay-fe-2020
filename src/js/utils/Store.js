class Store {
  constructor(defaultStates = {}) {
    this.stateChangeEvent = new CustomEvent('statechange');
    this.state = Object.assign({}, this.__deepCopy(defaultStates));
  }
  async setState(data = {}) {
    const prevState = this.state;
    this.state = await Object.assign(prevState, this.__deepCopy(data));
    document.dispatchEvent(this.stateChangeEvent);
  }
  __deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  getState(key) {
    if (key) {
      return this.__deepCopy(this.state[key]);
    } else {
      return this.__deepCopy(this.state);
    }
  }
}
export default Store;
