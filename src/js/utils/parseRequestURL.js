const ROOT = '/';
const parseRequestURL = () => {
  const requestURL = window.location.hash.slice(1).toLowerCase() || ROOT;
  const path = requestURL.split('/')[1] || null;
  console.log('요청한 페이지: ', path);
  return path;
};

export default parseRequestURL;
