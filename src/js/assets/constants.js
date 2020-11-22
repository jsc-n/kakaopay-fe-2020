const API = {
  TIMEOUT: 2000,
  get BASE_URL() {
    return `https://my-json-server.typicode.com/kakaopay-fe/resources/words`;
  }
};
const NAMESPACE = 'kakaopay';
const ENTER_KEY_CODE = 13;
const PAGES = {
  HOME: '/home',
  RESULT: '/result',
  ERROR_404: '/error/404'
};
const ERROR_MSG = {
  INVALID_PARAM: '파라미터 규칙/타입이 잘못 되었습니다.',
  INVALID_TOTAL_TIME: '총 플레이 시간이 주어진 게임 시간보다 깁니다.',
  INVALID_RESPONSE: '요청에 의해 받아온 응답이 [Validate] 하지 않습니다.',
  REQUEST_TIME_OUT: '요청에 대한 응답이 [timeout] 되었습니다.',
  INIT_FAIL: '게임 초기화에 실패했습니다.'
};
export { API, NAMESPACE, ENTER_KEY_CODE, PAGES, ERROR_MSG };
