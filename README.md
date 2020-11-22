# kakaopay-fe-2020

Typing Game(타자게임) 구현  
: 주어진 단어가 표시되면 input에 단어를 정해진 시간 내에 입력하여 점수를 획득하는 어플리케이션 개발

## Quick start guide

- Clone 또는 download git repo
- Install [Node.js](http://nodejs.org/en/)
- Run `node --version`, `npm --version`: 'node'와 'npm'이 잘 설치 되었는지 확인
  - 프로젝트에 사용된 version 정보
    - node version `v14.15.0`
    - npm version `6.14.8`
- Run `npm install`: 'package.json'에 정의된 모듈 및 플러그인 설치
- Run `npm run build`: 프로젝트 빌드 후 `./public/**` 위치에 빌드 결과물 export
- Run `npm run test`: 단위 테스트 실행
- Run `npm run start`: 로컬 서버 [127.0.0.1:8083/public/](127.0.0.1:8083/public/) 실행

## 해결 전략

### 프로젝트 설계 구조

![architecture](https://user-images.githubusercontent.com/74660746/99907779-26eaeb80-2d22-11eb-81ea-a85dd45a3394.png)

메인 컴포넌트 및 모듈 간략 설명

- 페이지간 라우팅 처리를 위한 `Router.js` 컴포넌트
- 데이터를 관리하는 `Store.js` 컴포넌트
- 각 페이지의 view 조작 및 비지니스 로직 처리를 위한 Controller(`(Play|Result)Control.js`)/Service(`gameService.js`) 컴포넌트
- 기타 유틸성 함수들 정의
  - 사용자 클릭, 키보드 입력에 대한 이벤트 어뷰징을 막기위해 `debounce` 적용
  - `axios` instance를 생성하여 api fetch 처리를 위한 `doFetch.js` 함수 정의

### 설계 전략

어플리케이션 설계를 할때 고려 했던 것들

- view 조작, business logic, 데이터 상태 관리 처리를 분리 할 것
- 사용자 인터렉션 어뷰징에 대한 처리할 것
- 코드의 재사용성을 고려하여 최소 기능 단위로 함수를 작성 할 것
- 사용자에게 게임 status에 대한 정보를 잘 전달할 수 있게 UX를 고려 할 것
- API 응답에 대한 validation 처리를 할 것
- 사전 정의 되지 않은 경로에 대한 예외 처리를 할 것
- CSS 재사용성을 고려할 것

### 중요 컴포넌트 설명

Router.js

- 페이지 간 라우팅 처리를 위한 컴포넌트
- 사전 정의된 라우팅 정보(`assets/route.js`) 와 다른 경로로 진입할 경우 에러(`Error404.js`) 페이지로 라우팅
- 홈(`Home.js`) 페이지와 결과(`Result.js`)페이지 이동시 Router에 정의된 `hashchange` 이벤트 핸들러를 활용하여 라우팅 처리
- 페이지 간 이동시 각 페이지에서 사용하던 event listner 삭제

(Home|Result|Error404).js

- `Render()`할수를 활용하여 페이지 DOM 렌더링
- `afterRender()` 함수를 활용하여 각 페이지에 필요한 Controller 생성

Store.js

- Controller/Service 에서 상태 관리가 필요한 데이터 관리를 위한 컴포넌트
- 상태관리가 필요한 데이터 정보를 `assets/state.json` 파일에 사전 정의
- `statechange` custom event 를 생성하여 state 저장이 완료된 경우 event dispatch
- `setState()`, `getState()`를 함수를 활용하여 데이터 관리

(Play|Result)Control.js

- `Render()`할수를 활용하여 페이지 DOM 렌더링
- `afterRender()` 함수를 활용하여 각 페이지에 필요한 Controller 생성

gameService.js

- 평균시간 계산, 문제를 푸는데 걸린시간 계산, 정답을 맞춰는 지 처리, api fetch 등 비지니스 로직에 대한 함수들 정의.

### 테스트 시나리오

- **게임 비지니스 로직**에 대한 단위 테스트 진행
- 비지니스 로직 및 data validation 체크
- `mocha` 라이브러리를 활용
- `npm run test` 스크립트를 이용해 단위 테스트 실행
- 테스트 시나리오
  - 주어진 시간 안에 정답을 입력하지 못한 경우
  - 주어진 시간 안에 정답을 입력한 경우
  - 유저가 입력한 단어가 정답이 아닌 경우
  - 유저가 입력한 단어가 정답인 경우
  - 평균 시간을 계산할때 주어진 시간 보다 걸린 시간이 더 긴 경우
  - 평균 시간을 계산할때 계산식에 오류가 없는 경우
  - 평균 시간을 계산할때 이긴 게임이 하나도 없는 경우
  - 게임 문제를 가져오는 api timeout 난 경우
  - 게임 문제를 가져오는 api 의 response 형식이 사전 정의된 형식과 다른 경우
  - 각 함수 별 파라미터 validation 테스트
- 샘플 테스트 결과물  
  ![test_result](https://user-images.githubusercontent.com/74660746/99907201-d1610f80-2d1e-11eb-8852-dd69a9081aea.png)

## 기타

### 프로젝트 구조

```
kakaopay-fe-2020
|---- src
|      |---- html
|      |      |---- index.html
|      |---- js
|      |      |---- assets
|      |      |      |---- constants.js
|      |      |      |---- routes.js
|      |      |      |---- state.json
|      |      |---- controllers
|      |      |      |---- PlayControl.js
|      |      |      |---- ResultControl.js
|      |      |---- pages
|      |      |      |---- Error404.js
|      |      |      |---- Home.js
|      |      |      |---- Result.js
|      |      |---- services
|      |      |      |---- gameService.js
|      |      |      |---- gameService.spec.js
|      |      |---- utils
|      |      |      |---- capitalize.js
|      |      |      |---- debounce.js
|      |      |      |---- doFetch.js
|      |      |      |---- domReady.js
|      |      |      |---- parseRequestURL.js
|      |      |      |---- registerGlobal.js
|      |      |      |---- Router.js
|      |      |      |---- Store.js
|      |      |---- App.js
|      |      |---- index.js
|      |      |---- WrappedApp.js
|      |---- scss
|      |      |---- base
|      |      |      |---- _mixin.scss
|      |      |      |---- common.scss
|      |      |---- pages
|      |             |---- home.scss
|      |             |---- result.scss
|---- .babelrc
|---- .eslintrc.json
|---- .gitignore
|---- .mocharc.json
|---- .prettierignore
|---- .prettierrc.json
|---- package-lock.json
|---- package.json
|---- webpack.config.js
|---- README.md
```
