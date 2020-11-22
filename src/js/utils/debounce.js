const debounce = (func, wait, immediate) => {
  let timeout;

  return function() {
    const context = this;
    const args = arguments;
    let callNow = immediate && !timeout;
    let cb = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(cb, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
export default debounce;
