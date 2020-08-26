# *Metatron-Portal*

#### `Data Discovery` Portal Project

***

<br/>

## Project modules

* **`metatron-portal`** 
  * **Root project**
* **`metatron-portal-server`**
  * **Java, Spring-boot, JPA**
* **`metatron-portal-ui`**
  * **Angular, TypeScript**
* **`metatron-portal-pub`**
  * **Html,Css, Resources**

<br/>

***

<br/>

## Installation

- **Node Installation**

  - **OS X ( Using HomeBrew )**

  ```bash
  $ brew install node
  ```

  - **Other OS**
    - https://nodejs.org/en/download


- **Angular CLI Installation**

```bash
$ npm install -g @angular/cli
```

- **UI Modules Installation**

```bash
$ cd metatron-portal-ui
$ npm install
```

- **PUB Modules Installation**

```bash
$ cd metatron-portal-pub
$ npm install
```

<br/>

***

<br/>

### Local Server Run

- **UI**

```bash
$ cd metatron-portal-ui
$ npm start
```

- **Server**

```bash
$ cd metatron-portal-server
$ mvn clean install -Dmaven.test.skip=true -U
$ mvn spring-boot:run
```

<br/>

***

<br/>

### Project Production Build

- **UI**

```bash
$ cd metatron-portal-ui
$ npm run prod:build
```

- **Server**

```bash
$ cd metatron-portal-server
$ mvn clean package -Dmaven.test.skip=true -U
```
