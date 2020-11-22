import { domReady, registerGlobal } from './utils';
import { NAMESPACE } from './assets/constants';
import App from './App';
const COMPONENT_NAME = 'App';

class WrappedApp {
  constructor(config) {
    this.init(config);
  }

  init(config) {
    const cb = () => {
      this.instance = new App(config);
    };
    domReady(cb);
  }
}

registerGlobal(NAMESPACE, COMPONENT_NAME, WrappedApp);
