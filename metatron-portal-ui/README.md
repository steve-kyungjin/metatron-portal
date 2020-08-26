# UI Project

<br/>

- - -

<br/>

## *로컬 서버 실행 방법*

UI 서버를 실행하는 명렁어는 `npm start` 입니다. 

프로젝트에 node_modules 디렉토리가 없는 경우 `npm install` 명령어를 통해서 설치해주세요.

`npm run pub:watch` 은 퍼블리싱 SASS 또는 이미지 변경을 감지하는 스크립트이고, 해당 스크립트가 실행되어 있으면 SASS & 이미지 변경을 자동으로 감지해서 변경된 내용이 UI 프로젝트에 바로 적용됩니다.

브라우저에 `http://localhost:4300` 을 입력해주세요.

<br/>


```json
기본 포트(4300)를 변경하고 싶은 경우 UI 서버를 실행하는 명렁어에 --port 옵션을 추가로 사용하시면 됩니다.

--port (Number) (Default: 4300) Port to listen to for serving.
```

<br/>

- - -

<br/>

## *프로젝트 프러덕션 빌드 방법*


`npm run prod:build` 를 실행하시면 됩니다.

해당 명령어를 사용하면 프로젝트가 `/dist` 로 번들됩니다.

<br/>

- - -

<br/>

## *NPM 스크립트*

- `start`
  - 로컬 서버 실행
- `node-modules:reinstall`
  - 패키지 삭제후 재설치
- `package:reinstall`
  - package.lock.json 삭제 && 패키지 삭제후 재설치
- `pub:watch`
  - 퍼블리싱 SASS & 이미지 변경 감지모드 실행
- `pub:build`
  - 퍼블리싱 SASS & 이미지 빌드
- `local:build`
  - 로컬 빌드 시, `/dist`로 프로젝트 번들
- `dev:build`
  - 개발 빌드 시, `/dist`로 프로젝트 번들
- `prod:build`
  - 프러덕션 빌드 시, `/dist`로 프로젝트 번들
