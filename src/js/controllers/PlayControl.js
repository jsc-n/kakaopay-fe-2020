import { debounce } from '../utils';
import { ENTER_KEY_CODE, PAGES, ERROR_MSG, INFO_MSG } from '../assets/constants';
import { fetchGameData, isWon, isCorrectAnswer, calculateTimeTaken, isValidAnswer } from '../services/gameService';

const API = `https://my-json-server.typicode.com/kakaopay-fe/resources/words`;
const PLAY_BTN_ID = 'play-btn';
const ANSWER_INPUT_ID = 'answer-input';
const TIMER_AREA_ID = 'timer-area';
const SCORE_AREA_ID = 'score-area';
const QUESTION_AREA_ID = 'question-area';
const INFO_MSG_AREA_ID = 'info-msg-area';
const PLAY_MSG = {
  PLAY: '시작',
  INIT: '초기화'
};
const INIT_MSG = '시작 버튼으로 게임 시작';
const INIT_STR = '--';
const BTN_DEBOUNCE_TIME = 100;
const KEY_PRESS_DEBOUNCE_TIME = 100;

class PlayControl {
  constructor(options = {}) {
    this.storeInstance = options.storeInstance || null;
    this.maxRound = 0;
    this.roundCounter = 0;
    this.timer = null;
    this.playingTimeLeft = 0;
    this.currentPlayingData = {
      second: 0,
      text: '',
      isWon: false,
      timeTaken: 0
    };

    this.timerAreaEl = document.getElementById(TIMER_AREA_ID);
    this.scoreAreaEl = document.getElementById(SCORE_AREA_ID);
    this.questionAreaEl = document.getElementById(QUESTION_AREA_ID);
    this.playBtnEl = document.getElementById(PLAY_BTN_ID);
    this.answerInputEl = document.getElementById(ANSWER_INPUT_ID);
    this.infoMsgAreaEl = document.getElementById(INFO_MSG_AREA_ID);

    this.bindOnClickPlayBtn = debounce(this.onClickPlayBtn.bind(this), BTN_DEBOUNCE_TIME);
    this.bindOnPressEnterKey = debounce(this.onPressEnterKey.bind(this), KEY_PRESS_DEBOUNCE_TIME);
    this.bindHandleTimer = this.handleTimer.bind(this);

    this.bindOnChangeState = this.onChangeState.bind(this);
    this.init();
  }
  init() {
    this.playBtnEl && this.playBtnEl.addEventListener('click', this.bindOnClickPlayBtn);
    this.answerInputEl && this.answerInputEl.addEventListener('keyup', this.bindOnPressEnterKey);
    document.addEventListener('statechange', this.bindOnChangeState);
  }
  async initGame() {
    try {
      this.stopTimer();
      this.renderBlockUserInteraction();
      this.renderInfoMsg(INFO_MSG.DATA_LOADING);
      const wordListData = await fetchGameData(API);
      if (!wordListData) throw new Error(ERROR_MSG.INIT_FAIL);
      this.initGameData(wordListData);
      this.renderInitGame();
      this.renderInfoMsg(INFO_MSG.INIT_SUCCESS);
      console.log('게임을 초기화 완료되었습니다.', this.storeInstance.getState());
    } catch (e) {
      console.error(e.message);
      this.renderInfoMsg(INFO_MSG.INIT_FAIL);
    }
  }
  initGameData(wordListData) {
    const resultList = (wordListData && wordListData.slice()) || [];
    if (resultList.length) {
      const gameResult = {
        isWon: false,
        timeTaken: 0
      };
      const newResultList = resultList.map(gameStage => {
        const resultGameStage = {
          ...gameStage,
          ...gameResult
        };
        return resultGameStage;
      });

      this.roundCounter = 0;
      this.maxRound = newResultList.length - 1;
      this.storeInstance.setState({ resultList: newResultList });
      this.storeInstance.setState({ score: newResultList.length });
    } else {
      this.renderInfoMsg(INFO_MSG.INIT_FAIL);
    }
  }
  runGame(round) {
    if (this.maxRound < round) {
      this.endGame();
    } else {
      this.startGame(round);
    }
  }
  startGame(round) {
    console.log('ROUND: ', round);
    const resultList = this.storeInstance.getState('resultList');
    this.currentPlayingData = resultList[round];
    this.playingTimeLeft = this.currentPlayingData.second;
    this.renderStartGame();
    this.timer = setInterval(this.bindHandleTimer, 1000);
  }
  endGame() {
    this.stopTimer();
    console.log('게임 종료', this.storeInstance.getState());
    this.renderInitGame();
    this.destroy();
    location.href = `${location.origin}${location.pathname}#${PAGES.RESULT}`;
  }
  handleTimer() {
    --this.playingTimeLeft;
    this.renderTimeLeft();
    if (this.playingTimeLeft < 1) {
      this.stopTimer();
      this.renderInfoMsg(INFO_MSG.TIME_OVER);
      this.processPlayRounds();
      this.runGame(++this.roundCounter);
    }
  }
  stopTimer() {
    console.log('kill timer');
    this.timer && clearInterval(this.timer);
  }
  processAnswer() {
    const { text: givenText } = { ...this.currentPlayingData };
    const userInputText = this.answerInputEl.value;
    const answerData = {
      userText: userInputText,
      givenText: givenText
    };
    const processedAnswer = {
      isValid: isValidAnswer(answerData),
      isCorrect: isCorrectAnswer(answerData)
    };
    return processedAnswer;
  }
  processPlayRounds() {
    const { second: givenTime } = { ...this.currentPlayingData };
    const userTimeLeft = Number(this.playingTimeLeft);
    const timeData = {
      userTimeLeft: userTimeLeft,
      givenTime: givenTime
    };
    const timeTaken = calculateTimeTaken(timeData);

    const roundResultData = {
      givenTime: givenTime,
      timeTaken: timeTaken
    };

    const isWonRound = isWon(roundResultData);

    if (!isWonRound) {
      let score = this.storeInstance.getState('score');
      this.storeInstance.setState({ score: --score });
    }

    this.currentPlayingData.isWon = isWonRound;
    this.currentPlayingData.timeTaken = timeTaken;
    const resultList = this.storeInstance.getState('resultList');
    resultList[this.roundCounter] = { ...this.currentPlayingData };
    this.storeInstance.setState({ resultList: resultList });
  }

  onPressEnterKey(e) {
    const inputEl = (e && e.target) || null;
    const { keyCode } = e || null;
    const { value: userInput } = inputEl;
    //todo: val, ver check
    if (keyCode === ENTER_KEY_CODE) {
      console.log('Enter 키 입력 받음', userInput);
      const { isValid, isCorrect } = { ...this.processAnswer() };

      if (isValid && isCorrect) {
        this.stopTimer();
        this.renderInfoMsg(INFO_MSG.CORRECT_ANS);
        this.processPlayRounds();
        this.runGame(++this.roundCounter);
      } else {
        isValid ? this.renderInfoMsg(INFO_MSG.WRONG_ANS) : this.renderInfoMsg(INFO_MSG.EMPTY_ANS);
        this.renderInitInput();
      }
    }
  }

  onClickPlayBtn(e) {
    const btnEl = (e && e.target) || null;
    const isActive = btnEl && btnEl.classList.contains('active');
    if (!isActive) {
      console.log('게임을 시작합니다.');
      this.renderInfoMsg('');
      this.runGame(0);
    } else {
      console.log('게임을 초기화합니다.');
      this.initGame();
    }
  }
  onChangeState() {
    console.log('setState success', this.storeInstance.getState());
  }
  renderInitGame() {
    this.timerAreaEl.textContent = INIT_STR;
    this.scoreAreaEl.textContent = INIT_STR;
    this.questionAreaEl.textContent = INIT_MSG;
    this.answerInputEl.value = '';
    this.answerInputEl.disabled = true;
    this.playBtnEl.textContent = PLAY_MSG.PLAY;
    this.playBtnEl.classList.remove('active');
    this.playBtnEl.disabled = false;
  }
  renderStartGame() {
    console.log('플레이 중인 데이터', this.currentPlayingData);
    const score = this.storeInstance.getState('score');
    this.timerAreaEl.textContent = this.playingTimeLeft;
    this.scoreAreaEl.textContent = score;
    this.questionAreaEl.textContent = this.currentPlayingData.text;

    this.answerInputEl.value = '';
    this.playBtnEl.textContent = PLAY_MSG.INIT;
    this.answerInputEl.disabled = false;
    this.playBtnEl.classList.add('active');
  }
  renderTimeLeft() {
    this.timerAreaEl.textContent = this.playingTimeLeft;
  }
  renderInitInput() {
    this.answerInputEl.value = '';
  }
  renderBlockUserInteraction() {
    this.playBtnEl.disabled = true;
    this.answerInputEl.disabled = true;
  }
  renderInfoMsg(message) {
    this.infoMsgAreaEl.textContent = message;
  }
  destroy() {
    console.log('[play-page]이벤트 리스너를 해제합니다.');
    this.playBtnEl && this.playBtnEl.removeEventListener('click', this.bindOnClickPlayBtn);
    this.answerInputEl && this.answerInputEl.removeEventListener('keyup', this.bindOnPressEnterKey);
    document.removeEventListener('statechange', this.bindOnChangeState);
  }
}
export default PlayControl;
