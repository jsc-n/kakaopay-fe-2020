import state from "./assets/state.json";
import routes from "./assets/routes";
import { Store, Router } from "./utils";
class App {
  constructor() {
    this.storeInstance = new Store(state);
    this.routerInstance = new Router({
      routes: routes,
      storeInstance: this.storeInstance,
    });
    this.init();
  }
  init() {
    console.log("kakaopay world");
  }
}
export default App;
