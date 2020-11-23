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
const INFO_MSG = {
  INIT_FAIL: '게임 초기화에 실패했습니다. 새로고침 해주세요.',
  INIT_SUCCESS: '게임 초기화에 성공했습니다. 시작버튼 클릭!',
  DATA_LOADING: '데이터를 로딩 중입니다. 잠시만 기다려주세요~',
  CORRECT_ANS: '정답!',
  WRONG_ANS: '정답이 아닙니다. 다시 입력하세요!',
  EMPTY_ANS: '아무것도 입력하시지 않았습니다. 답을 적어주세요',
  TIME_OVER: '시간안에 입력하지 못하셨습니다. 다음 문제로 넘어갑니다.'
};
export { API, NAMESPACE, ENTER_KEY_CODE, PAGES, ERROR_MSG, INFO_MSG };
