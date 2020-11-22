import { PAGES } from '../assets/constants';
import { parseRequestURL } from '.';
const CONTENT_ID = 'main-layout';
const ROOT = '/';

class Router {
  constructor(options = {}) {
    this.routes = options.routes || null;
    this.storeInstance = options.storeInstance || null;
    this.containerEl = document.getElementById(CONTENT_ID);
    this.init();
  }
  async init() {
    await this.goto();
    window.addEventListener('hashchange', this.goto.bind(this));
  }
  async goto() {
    const pathFrag = parseRequestURL();
    const path = (pathFrag && `/${pathFrag}`) || ROOT;
    // path === ROOT && history.replaceState({}, '', `/#${PAGES.HOME}`);
    const page = this.routes[path] || this.routes[PAGES.ERROR_404];
    this.containerEl.innerHTML = await page.render();
    await page.afterRender(this.storeInstance);
  }
  destroy() {
    window.removeEventListener('hashchange', this.goto.bind(this));
  }
}
export default Router;
