import PlayControl from '../controllers/PlayControl';
import '../../scss/pages/home.scss';
const Home = {
  render: async () => {
    let view = `
      <div id='home-page'>  
        <header>
          <div id="timer-wrapper">
            <span>남은 시간: </span>
            <span id="timer-area" class='bold'>--</span>
            <span>초</span>
          </div>
          <div id="score-wrapper">
            <span>점수: </span>
            <span id="score-area" class='bold'>--</span>
            <span>점</span>
          </div>
        </header>
        <main id="content" role="main" class="content-area">
          <section id="question-wrapper" class='titBig'>
            <div id="question-area">시작 버튼으로 게임 시작</div>
          </section>
          <section id="answer-wrapper" >
            <input id="answer-input" placeholder="입력" disabled />
          </section>
          <section id="play-wrapper">
            <button id="play-btn" class='titSmall' type="button" disabled>시작</button>
          </section>
        </main>
      </div>
      `;
    return view;
  },
  afterRender: async storeInstance => {
    const playControlInstance = new PlayControl({ storeInstance: storeInstance });
    await playControlInstance.initGame();
  }
};
export default Home;
