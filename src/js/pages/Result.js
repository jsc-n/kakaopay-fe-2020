import ResultControl from '../controllers/ResultControl';
import '../../scss/base/common.scss';
import '../../scss/pages/result.scss';
const Result = {
  render: async () => {
    let view = `
      <div id='result-page'>  
        <header>
          <div id='result-msg-area' class='titMiddle bold'>Mission Complete!</div>
        </header>
        <main id="content" role="main" class="content-area">
          <section id="score-wrapper" class='titBig'>
            <span>당신의 점수는 </span>
            <span id='score-area'>--</span>
            <span>점입니다.</span>
          </section>
          <section id="time-taken-wrapper" class='titSmall'>
            <span>단어당 평균 답변 시간은 </span>
            <span id='time-taken-area' class='bold'>--</span>
            <span>초입니다.</span>
          </section>
          <section id="play-wrapper">
            <button id="play-btn" type="button">다시 시작</button>
          </section>
        </main>
      </div>
        `;
    return view;
  },
  afterRender: async storeInstance => {
    new ResultControl({ storeInstance: storeInstance });
  }
};
export default Result;
