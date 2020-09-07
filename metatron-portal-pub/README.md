# *PUB*
#### [grunt](http://gruntjs.com), [grunt-sass](http://github.com/sindresorhus/grunt-sass), [grunt-spritesmith](http://github.com/Ensighten/grunt-spritesmith)를 이용하는 `퍼블리싱 프로젝트` 입니다. 

<br/>

***

<br/>

## *패키지 설치*

```bash
$ npm install
```

<br/>

***

<br/>

## *NPM 스크립트*

##### `PUB` 스크립트 (npm run '스크립트')

- `sprite`
  - 이미지 sprite 실행
- `sass`
  - SASS 빌드 실행
- `build`
  - 이미지 sprite 실행 && SASS 빌드 실행
- `watch`
  - SASS / 이미지 변경 감지 후 **자동** 빌드 실행

##### `UI` 스크립트 (npm run '스크립트')

- `ui:sprite:build`
  - 이미지 sprite 실행
- `ui:sass:build`
  - SASS 빌드 실행
- `ui:build`
  - 이미지 sprite 실행 && SASS 빌드 실행
- `ui:watch`
  - SASS / 이미지 변경 감지 후 **자동** 빌드 실행

<br/>

------

<br/>

##### `PUB`에서 사용하는 스크립트는 

- *client/css/mp.css*
- *client/css/mp.css.map*
- *client/images/sprite.png*

##### 해당 위치에 파일이 생성되고,

<br/>

##### `UI`에서 사용하는 스크립트는 
- *src/assets/css/mp.css*
- *src/assets/css/mp.css.map*
- *src/assets/css/images/sprite.png*

##### UI 프로젝트 하위에 파일이 생성됩니다.
