---
layout: post
title: socket.io와 hapi를 활용한 간단한 chat app
description: socket.io와 hapi를 활용한 간단한 chat app
modified: 2015-07-29
---

## chat app

socket.io와 hapi를 활용하여 간단한 chat app을 구현했다. socket.io의 sample로 제공되어진 [express를 활용한 chat app sample code](https://github.com/socketio/socket.io/tree/master/examples/chat)를 참고하였다. 

### 설치 및 테스트 

1. github에서 source code를 다운받아 압축을 임의의 폴더에서 해제한다. 
2. 압축을 푼 폴더로 이동하여 Command Prompt에서 `npm install`을 실행하여 필요한  socket.io와 hapi 모듈을 설치한다.
3. Command Prompt에서 `node .`로 서버를 구동시킨다. 
4. [troy](http://troy.labs.daum.net/)사이트로 가서 스마트폰 스크린 2개를 선택한다. 필요하다면 [troy에 대해 간단히 설명한 이전 글](http://dakoo.github.io/daum-troy/)을 참조한다. 
5. troy이 URL에 `localhost:3001`을 입력하여 chat app에 접속한다. 
6. nickname화면이 나타나면 성공이다. nickname을 입력해보자. 
7. nickname을 입력해서 들어간 대화창에서 스크린 두개간의 대화를 나누어본다. 

### 블로그

socket.io와 hapi를 활용한 간단한 chat app 프로젝트를 포함하여 다양한 web 기술을 다루고 있는 [블로그](http://dakoo.github.io)에 방문하면 더 많은 정보를 얻을 있다. 

### 향후 계획

위치 기반의 chat app 구현을 통해 서버와 클라이언트의 좀 더 복잡한 코드를 다루어볼 계획이다.  