# @keuli/discord

## 디스코드 봇 **“크리”**

---

“[디스코드 채널: 투자 리딩 정보 공유방](https://discord.gg/DcyBgnYwfr)”의 전용 봇 “크리”의 오픈소스입니다!!

RPG 기능, 투자 기능과 같은 게임성을 제외한 모든 기능이 존재합니다!!

<br/>

### 기능

| 전용 명령어? | 타입 | 이름  | 설명  | 옵션? |
| ------------ | ---- | ----- | ----- | ----- |
| X            | test | /ping | Pong! | X     |

<br/>

## 설정

프로젝트를 클론하고 나서 어떻게 시작할지 모르는 분들을 위해 쓴 설명입니다!!

Node.Js를 설치하고 진행해주세요!

```bash
npm i --g typescript ts-node
```

로 타입스크립트를 다운해주세요!! 이 프로젝트는 타입스크립트 프로젝트입니다!

그러고, src 폴더를 클릭해주세요!

그 후, config.json 파일을 만들어주세요!

```json
{ "token": "", "clientId": "", "guildId": "", "logId": "", "errorLogId": "" }
```

config.json을 위와 같은 형태로 만들고

<br/>

~~옵션에 대한 설명입니다~~

| token      | 봇 토큰           | discord development 사이트에서 얻으실 수 있어요! |
| ---------- | ----------------- | ------------------------------------------------ |
| clientId   | application ID    | discord development 사이트에서 얻으실 수 있어요! |
| guildId    | 전용 길드 ID      |                                                  |
| logId      | 로그 채널 ID      | 전용 길드에 로그용 채널을 만들어주세요!          |
| errorLogId | 에러 로그 채널 ID | 전용 길드에 에러 로그용 채널을 만들어주세요!     |

<br/>

config.json에 값을 다 채우셨다면

```bash
npm i --save
```

를 입력하고 [y/n] 표시가 나오면, y를 입력하고 엔터를 눌러주세요!

<br/>

```bash
npm start
```

명령어를 이용하여 프로젝트를 시작할 수 있습니다!
