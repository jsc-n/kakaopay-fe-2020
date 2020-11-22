import { capitalize } from '.';
const registerGlobal = (namespace, componentName, componentConstructor) => {
  const nsAlias = namespace;

  // whether the argument of namespace is existed or not
  if (nsAlias) {
    window[nsAlias] = window[nsAlias] || {};

    if (window[nsAlias][componentName]) {
      console.warn(`${componentName} is already!!`);
    } else {
      window[nsAlias][capitalize(componentName)] = componentConstructor;
    }
  } else {
    if (window[componentName]) {
      console.warn(`${componentName} is already!!`);
    } else {
      window[capitalize(componentName)] = componentConstructor;
    }
  }
};

export default registerGlobal;
