import { PAGES } from '../assets/constants';
import { calculateAverageTime } from '../services/gameService';
const SCORE_AREA_ID = 'score-area';
const PLAY_BTN_ID = 'play-btn';
const TIME_AREA_ID = 'time-taken-area';
const RESULT_MSG_AREA_ID = 'result-msg-area';

const MSG_MISSION_COMPLETE = 'Mission Complete!';
const MSG_MISSION_FAIL = 'Mission Fail!';

class ResultControl {
  constructor(options = {}) {
    this.storeInstance = options.storeInstance || null;
    this.scoreAreaEl = document.getElementById(SCORE_AREA_ID);
    this.playBtnEl = document.getElementById(PLAY_BTN_ID);
    this.timeAreaEl = document.getElementById(TIME_AREA_ID);
    this.resultMsgAreaEl = document.getElementById(RESULT_MSG_AREA_ID);
    this.bindOnClickRestartBtn = this.onClickRestartBtn.bind(this);
    this.init();
  }
  init() {
    this.playBtnEl && this.playBtnEl.addEventListener('click', this.bindOnClickRestartBtn);
    const gameResult = this.processGameResult();
    if (gameResult) {
      this.renderSuccessResult(gameResult);
    } else {
      this.renderFailResult();
    }
  }
  processGameResult() {
    const gameData = {
      resultList: this.storeInstance.getState('resultList')
    };
    const averageTime = calculateAverageTime(gameData);
    if (averageTime === null) {
      return null;
    } else {
      const gameResult = {
        averageTime: averageTime,
        finalScore: this.storeInstance.getState('score')
      };
      return gameResult;
    }
  }
  onClickRestartBtn() {
    this.routeToHome();
  }
  routeToHome() {
    this.destroy();
    location.href = `${location.origin}${location.pathname}#${PAGES.HOME}`;
  }
  renderSuccessResult(gameResult) {
    const { averageTime, finalScore } = { ...gameResult };
    this.resultMsgAreaEl.textContent = MSG_MISSION_COMPLETE;
    this.scoreAreaEl.textContent = finalScore;
    this.timeAreaEl.textContent = averageTime;
    console.log(`당신의 점수는 ${finalScore}점입니다.`);
    console.log(`단어당 평균 답변 시간은 ${averageTime}초입니다.`);
  }
  renderFailResult() {
    this.resultMsgAreaEl.textContent = MSG_MISSION_FAIL;
    this.scoreAreaEl.textContent = 0;
    console.log(`당신의 점수는 0점입니다.`);
  }

  destroy() {
    console.log('[result-page]이벤트 리스너를 해제합니다.');
    this.playBtnEl && this.playBtnEl.removeEventListener('click', this.bindOnClickRestartBtn);
  }
}
export default ResultControl;
