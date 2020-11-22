var assert = require('assert');
import { isWon, isCorrectAnswer, calculateTimeTaken, calculateAverageTime, fetchGameData } from '../services/gameService';
import { ERROR_MSG, API } from '../assets/constants';
describe('gameService module test', function() {
  describe('[isWon] function test', function() {
    it('expect to throw error, when param is (null)', function() {
      try {
        const result = isWon();
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param is (empty json)', function() {
      try {
        const result = isWon({});
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to return false, when user spent more than given time', function() {
      const data = {
        givenTime: 16,
        timeTaken: 16
      };
      const result = isWon(data);
      assert.equal(result, false);
    });
    it('expect to return true, when user finishs the round within time', function() {
      const data = {
        givenTime: 16,
        timeTaken: 1
      };
      const result = isWon(data);
      assert.equal(result, true);
    });
  });
  describe('[isCorrectAnswer] function test', function() {
    it('expect to throw error, when param is (null)', function() {
      try {
        const result = isCorrectAnswer();
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param is (empty json)', function() {
      try {
        const result = isCorrectAnswer({});
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param(one of key-value is missing) does not exist', function() {
      try {
        const data = {
          userText: 'kakaopay'
        };
        const result = isCorrectAnswer(data);
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to return false, when user answer is not correct', function() {
      const data = {
        userText: 'kakaopay',
        givenText: 'ka'
      };
      const result = isCorrectAnswer(data);
      assert.equal(result, false);
    });
    it('expect to return true, when user answer is correct', function() {
      const data = {
        userText: 'kakaopay',
        givenText: 'kakaopay'
      };
      const result = isCorrectAnswer(data);
      assert.equal(result, true);
    });
  });
  describe('[calculateTimeTaken] function test', function() {
    it('expect to throw error, when param is (null)', function() {
      try {
        const result = calculateTimeTaken();
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param is (empty json)', function() {
      try {
        const result = calculateTimeTaken({});
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param(one of key-value is missing) does not exist', function() {
      try {
        const data = {
          givenTime: 3
        };
        const result = calculateTimeTaken(data);
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to return given time, when user did not finish within time', function() {
      const data = {
        givenTime: 3,
        userTimeLeft: 0
      };
      const result = calculateTimeTaken(data);
      assert.equal(result, data.givenTime);
    });
    it('expect to return any number greater than -1, when user did finish within time', function() {
      const data = {
        givenTime: 3,
        userTimeLeft: 1
      };
      const result = calculateTimeTaken(data);
      assert.equal(result > -1, true);
    });
  });
  describe('[calculateAverageTime] function test', function() {
    it('expect to throw error, when param is (null)', function() {
      try {
        const result = calculateAverageTime();
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param is (empty json)', function() {
      try {
        const result = calculateAverageTime({});
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when param does not match type', function() {
      try {
        const data = {
          resultList: 3
        };
        const result = calculateAverageTime(data);
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_PARAM);
      }
    });
    it('expect to throw error, when time taken is greater than given time', function() {
      try {
        const data = {
          resultList: [
            { second: 10, timeTaken: 2, isWon: true },
            { second: 3, timeTaken: 4, isWon: true }
          ]
        };
        const result = calculateAverageTime(data);
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.INVALID_TOTAL_TIME);
      }
    });
    it('expect to return any number greater than 0, when calculation succeeds', function() {
      const data = {
        resultList: [
          { second: 10, timeTaken: 2, isWon: true },
          { second: 3, timeTaken: 2, isWon: true }
        ]
      };
      const result = calculateAverageTime(data);
      assert.equal(result > 0, true);
    });
    it('expect to return null, if there is no won game', function() {
      const data = {
        resultList: [
          { second: 10, timeTaken: 10, isWon: false },
          { second: 3, timeTaken: 3, isWon: false }
        ]
      };
      const result = calculateAverageTime(data);
      assert.equal(result, null);
    });
  });
  describe('[fetchGameData] function test', function() {
    it('expect to throw error, when request timeout', async function() {
      try {
        const options = {
          baseURL: API.BASE_URL,
          timeout: 2,
          withCredentials: true
        };
        const result = await fetchGameData(API.BASE_URL, options);
      } catch (e) {
        assert.equal(e.message, ERROR_MSG.REQUEST_TIME_OUT);
      }
    });
    it('validation check for response of fetchGameData', async function() {
      try {
        const response = await fetchGameData();
        if (!Array.isArray(response)) throw new Error(ERROR_MSG.INVALID_RESPONSE);
        for (const data of response) {
          if (typeof data !== 'object') throw new Error(ERROR_MSG.INVALID_RESPONSE);
          const { second, text } = { ...data };
          if (second === undefined || second === null || typeof second !== 'number' || !text || typeof text !== 'string') {
            throw new Error(ERROR_MSG.INVALID_RESPONSE);
          }
        }
        assert.ok(response);
      } catch (e) {
        if (e.message === ERROR_MSG.INVALID_RESPONSE) {
          assert.equal(e.message, ERROR_MSG.INVALID_RESPONSE);
        } else if (e.message === ERROR_MSG.REQUEST_TIME_OUT) {
          assert.equal(e.message, ERROR_MSG.REQUEST_TIME_OUT);
        } else {
          console.log('알수없는 오류', e.message);
        }
      }
    });
  });
});
