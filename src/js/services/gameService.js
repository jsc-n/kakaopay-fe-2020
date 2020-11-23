import { doFetch } from '../utils';
import { ERROR_MSG } from '../assets/constants';

const isValidAnswer = (data = {}) => {
  const { userText } = { ...data };
  // 빈 문자열 또는 공백이 입력된 경우
  const trimedUserText = (userText && userText.length && userText.trim()) || '';
  const isValid = trimedUserText.length > 0 || false;
  return isValid;
};
const isWon = (data = {}) => {
  try {
    const { givenTime, timeTaken } = { ...data };
    if (givenTime === undefined || givenTime === null || typeof givenTime !== 'number' || timeTaken === undefined || timeTaken === null || typeof timeTaken !== 'number') {
      throw new Error(ERROR_MSG.INVALID_PARAM);
    }
    if (timeTaken === givenTime) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e.message);
  }
};
const isCorrectAnswer = (data = {}) => {
  try {
    const { userText, givenText } = { ...data };
    if (userText === undefined || userText === null || typeof userText !== 'string' || givenText === undefined || givenText === null || typeof givenText !== 'string') {
      throw new Error(ERROR_MSG.INVALID_PARAM);
    }
    let isCorrect = false;
    if (!userText || !givenText) {
      return isCorrect;
    } else {
      isCorrect = givenText === userText;
      return isCorrect;
    }
  } catch (e) {
    console.error(e.message);
  }
};
const calculateTimeTaken = (data = {}) => {
  try {
    const { givenTime, userTimeLeft } = { ...data };
    if (givenTime === undefined || givenTime === null || typeof givenTime !== 'number' || userTimeLeft === undefined || userTimeLeft === null || typeof userTimeLeft !== 'number') {
      throw new Error(ERROR_MSG.INVALID_PARAM);
    }
    let timeTaken = givenTime;
    if (!givenTime || !userTimeLeft) {
      return timeTaken;
    } else {
      timeTaken = Number(givenTime) - Number(userTimeLeft);
      return timeTaken;
    }
  } catch (e) {
    console.error(e.message);
  }
};
const calculateAverageTime = (data = {}) => {
  try {
    const { resultList } = { ...data };

    if (resultList === undefined || resultList === null || typeof resultList !== 'object') {
      throw new Error(ERROR_MSG.INVALID_PARAM);
    }

    let averageTime = 0;
    let gameResult = Object.values(resultList).reduce(
      (acc, { timeTaken, isWon }) => {
        let newAcc = JSON.parse(JSON.stringify(acc));
        if (isWon) {
          newAcc.totalTimeWon += Number(timeTaken);
          ++newAcc.totalWonGames;
        }
        acc = newAcc;
        return acc;
      },
      { totalTimeWon: 0, totalWonGames: 0 }
    );

    for (const { second, timeTaken } of Object.values(resultList)) {
      if (timeTaken > second) throw new Error(ERROR_MSG.INVALID_TOTAL_TIME);
    }
    if (!gameResult.totalWonGames) return null;
    averageTime = (gameResult.totalTimeWon && Number.parseFloat(gameResult.totalTimeWon / gameResult.totalWonGames).toFixed(2)) || 0;
    return averageTime;
  } catch (e) {
    console.error(e.message);
  }
};
const fetchGameData = async (api, options = {}) => {
  try {
    const response = await doFetch.get(api, options);
    if (!Array.isArray(response)) throw new Error(ERROR_MSG.INVALID_RESPONSE);
    for (const data of response) {
      if (typeof data !== 'object') throw new Error(ERROR_MSG.INVALID_RESPONSE);
      const { second, text } = { ...data };
      if (second === undefined || second === null || typeof second !== 'number' || !text || typeof text !== 'string') {
        throw new Error(ERROR_MSG.INVALID_RESPONSE);
      }
    }
    return response;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

export { isValidAnswer, fetchGameData, isWon, calculateTimeTaken, isCorrectAnswer, calculateAverageTime };
