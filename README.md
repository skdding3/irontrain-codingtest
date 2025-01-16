## 아이언트레인 코딩테스트 과제

Demo Link : https://irontrain-codingtest-skdding3s-projects.vercel.app/

주어진 API와 조건을 토대로 과제를 진행하였습니다.

프로젝트 실행 방법
```bash
npm install
npm start
```

라이브러리 선정은 다음과 같습니다.

```Markdown
React: 프론트엔드 라이브러리 
Axios: api 호출 라이브러리
lodash : 스크롤링 성능 최적화(throttle)에 활용되었습니다.
tailwindcss : css 프레임워크
```

- 해결 과정
우선 프론트엔드 개발을 진행할때 가장 먼저 주로 사용한 React와 TailwindCSS, axios 선정하였고, 이에 맞춰 개발을 진행하였습니다.
라이브러리를 사용하지 않고 Grid를 구현하는 방법으로 table태그안에 테이블 내용을 map 함수를 활용하여, 데이터를 우선 뿌려주었습니다.
해당 api 명세에 맞춰 interface를 파일로 따로 빼서 타입을 주입해주었습니다. (State도 타입 주입)

뿌려진 데이터는 조건에 따라 데이터 핸들링을 할 수 있도록 필터링이 될 수 있게 State로 데이터를 관리해주었습니다.
이후 각 헤드에 위치한 부분에 정렬 (website 칼럼은 정렬이 불필요하다 판단을 하여 제외), 검색기능 조회 구현, 행마다 존재하는 주소를 서브행을 tailwind와 state를 활용하여 구현 하였습니다.

스크롤 부분에서는 무한 스크롤을 우선 구현하던 과정에서 lodash 라이브러리를 채용하여, throttle을 기능으로 사용,
유저 사용성을 고려하여 작업했습니다.
