# *Server Project*

<br/>

------

<br/>

## *로컬 서버 실행 방법*

```shell
$ mvn spring-boot:run
```

<br/>

------

<br/>

## *프로젝트 패키징*

```shell
$ mvn clean package
```



<br/>

------

<br/>

## Lombok 설정방법 ( Intellij IDEA )

- Intellij IDEA > Preferences 에서 "plugins" 검색 

- "lombok" 입력 후 Search in repositories 클릭

  ![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202018-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.51.05.png?version=1&modificationDate=1521615321000&api=v2)
  ![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202018-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.51.14.png?version=1&modificationDate=1521615340000&api=v2)
  ![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202018-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.51.24.png?version=1&modificationDate=1521615354000&api=v2)
  ![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/image.png?version=1&modificationDate=1535431349000&api=v2)

<br/>

------

<br/>

## 클래스 경로 추가 ( QueryDSL )

- File > Project Structure
  - Modules > metatron-portal-server 선택
  - src-gen/java 경로 선택 후 Sources 클릭
  - src-gen/java 경로가 추가 되었는지 확인 후 저장

![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202018-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.07.06.png?version=1&modificationDate=1521616256000&api=v2)
![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202018-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.07.24.png?version=1&modificationDate=1521616382000&api=v2)
![Foo](https://tde.sktelecom.com/wiki/download/attachments/159061371/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202018-03-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.07.45.png?version=1&modificationDate=1521616397000&api=v2)