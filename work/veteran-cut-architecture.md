# Veteran Cut 구현 위험 감사

감사 기준: `outputs/TheLastLight/game.js` 2026-07-16 스냅샷. 아래 줄 번호는 변경 전 기준이며, 구현할 때는 줄 번호보다 함수명을 앵커로 삼아야 한다. 메인 게임 파일은 이 감사에서 수정하지 않았다.

## 결론

가장 안전한 방향은 **42개 잔상 데이터를 삭제하지 않고, 잔상을 본편 진행 조건에서 완전히 분리한 뒤 “임의의 14개”를 선택 업적 목표로 바꾸는 것**이다. 밤 이동은 별도의 저장 상태를 만들지 않고 `방문 6/6 + 신호 완료 + 추론 미완료`라는 기존 저장값에서 매번 재구성되는 허브 대화상자로 구현한다. 이렇게 하면 v2 저장 형식을 올릴 필요가 없고, 0~42개 잔상을 가진 기존 저장도 모두 보존된다.

권장 최소 변경 범위는 `game.js`의 상수/맵 렌더링/잔상 완료/퍼즐 완료/일과 종료/불러오기/입력 처리, `index.html`의 대화상자 1개와 기억 잠수 버튼 1개, `styles.css`의 루트 글자 크기 및 두 소형 레이아웃, `work/qa-directors-cut.cjs`의 DOM 스텁과 진행 시나리오다.

## 1. 강제 잔상 42개를 선택적 14개로 전환

### 현재 강제 지점

- `achievementDefs` (`game.js:383`)가 `echoes`를 42개 완료 업적으로 설명한다.
- `renderMap` (`game.js:396-400`, 특히 398)은 방문 완료지만 잔상을 안 본 모든 장소를 다시 상호작용할 대상으로 표시한다. 이 표시는 선택 콘텐츠에도 재사용 가능하므로 삭제할 필요가 없다.
- `updateHud` (`game.js:401`)가 `Object.keys(S.afterimages).length/42`를 직접 노출한다.
- `interact` (`game.js:404`)는 방문 장소를 다시 누르면 잔상을 연다. 선택 콘텐츠 진입점으로 그대로 유지한다.
- `openAfterimage` (`game.js:405`)가 완료 수 42에서 업적을 연다.
- `solvePuzzle` (`game.js:473`)이 신호 완료 직후 등대 잔상을 **강제로** 연다.
- `afterVisit` (`game.js:476`)이 그날의 잔상 6개가 모두 없으면 추론을 막는다.
- `begin` (`game.js:512`)도 완료 상태를 불러올 때 등대 잔상을 **강제로** 연다.
- QA는 매 장소 잔상을 열고(`qa-directors-cut.cjs:46`), 등대 잔상 강제 표시를 기대하며(50-51), 최종 42개를 단언한다(64).

### 권장 의미와 호환성

- 목표는 “전체 42개 중 플레이어가 고른 14개”다. 14는 **업적 임계값이지 하드 캡이 아니다**. 15~42개도 계속 볼 수 있어 기존 콘텐츠와 완주 저장이 손실되지 않는다.
- 본편 진행, 균형 엔딩, 추론, 기억 잠수에는 잔상 수를 사용하지 않는다.
- 기존 `S.afterimages` 맵을 그대로 사용하고 `version:2`도 유지한다(`freshState`, `game.js:390`). 새 저장 필드는 불필요하다.
- 메타에 이미 `echoes`가 열린 플레이어의 업적은 절대로 회수하지 않는다.

### 최소 침습 코드 설계

`routes` 선언 뒤에 다음 개념만 추가한다.

```js
const AFTERIMAGE_GOAL = 14;
const VALID_AFTERIMAGE_KEYS = new Set(
  routes.flatMap((dayRoute, day) => dayRoute.map(id => `${day}-${id}`))
);
function afterimageCount(state = S) {
  return Object.entries(state.afterimages || {})
    .filter(([key, value]) => value === true && VALID_AFTERIMAGE_KEYS.has(key)).length;
}
```

유효 키만 세는 이유는 `validateSave`가 현재 `afterimages`의 객체 여부만 검사하기 때문이다(`game.js:506`). 임계값이 낮아지면 잘못된 키 14개만으로 업적이 열릴 위험이 커진다.

함수별 변경:

1. `achievementDefs` (`game.js:383`): `echoes.d`를 “남은 잔상 14개를 발견했다.”로 변경한다.
2. `updateHud` (`game.js:401`): `afterimageCount()`를 사용한다. 14 초과 저장에서 `42/14`처럼 보이지 않도록 `잔상 14/14 · 총 42` 또는 목표 달성 후 `잔상 목표 달성 · 총 42`로 표시한다.
3. `openAfterimage` (`game.js:405`): 완료 커밋 후 `afterimageCount() >= AFTERIMAGE_GOAL`이면 업적을 연다. `=== 14`가 아니라 `>= 14`여야 구형 저장과 재실행에 안전하다. 현재처럼 `S.afterimages[key]=true` 이후 저장하므로 동일 잔상의 중복 카운트는 생기지 않는다.
4. `solvePuzzle` (`game.js:473`): `openAfterimage('lighthouse')` 분기를 제거하고 저장/맵 갱신 뒤 `afterVisit()`만 호출한다.
5. `afterVisit` (`game.js:476`): `missing` 계산과 차단 토스트를 제거한다. 모든 장소와 신호가 끝났고 추론이 미완료면 아래의 `openNightNavigation()`을 연다.
6. `begin` (`game.js:512`): `lighthouseKey` 강제 잔상 분기를 제거하고, `all && S.puzzleDone[S.day]`이면 `afterVisit()`로 복원한다.
7. `validateSave`/`load` (`game.js:506-507`): 유효 잔상이 14개 이상이고 `echoes`가 없는 구형 v2 저장은 업적을 보충하고 한 번 저장한다. 메타에 이미 있는 업적은 유지한다. 저장 버전 상승은 하지 않는다.

권장 진행 함수의 핵심은 다음처럼 단순해야 한다.

```js
function afterVisit() {
  if (transitioning) return;
  const all = routes[S.day].every(id => S.visited[`${S.day}-${id}`]);
  if (!all || !S.puzzleDone[S.day]) return;
  if (!S.deductions[S.day]) openNightNavigation();
  else if (!S.dives[S.day]) openMemoryDive();
  else finishDay();
}
```

이렇게 하면 잔상 0개로도 정상 완주할 수 있고, 잔상 선택은 아래 밤 허브에서 명시적으로 제공된다.

## 2. 기억 잠수: 조사와 시간선 선택 분리

### 현재 문제

`openMemoryDive`의 물건 버튼 처리(`game.js:487-493`, 특히 491)는 한 번의 클릭으로 다음을 모두 수행한다.

1. 물건을 “살펴봄”으로 저장한다.
2. 설명을 표시한다.
3. 동시에 시간선의 세 슬롯 중 하나에 넣거나 뺀다.

따라서 플레이어가 다섯 설명을 읽는 동안 처음 세 물건이 의도와 무관하게 선택되고, 네 번째 물건부터는 “세 물건만” 토스트를 받는다. 현재 QA도 이 부작용을 전제로 다섯 개를 클릭한 뒤 리셋한다(`qa-directors-cut.cjs:55-57`). 숙련 플레이어에게는 퍼즐이 아니라 UI 정리 작업처럼 느껴지는 지점이다.

### 권장 2단계 UX

`index.html:102-115`의 `#diveDetail` 뒤에 버튼 하나만 추가한다.

```html
<button id="startDiveOrder" class="primary" disabled>시간선 배열 시작</button>
```

`diveRuntime`는 저장되지 않는 UI 상태로만 `phase:'inspect'|'order'`를 가진다.

- 조사 단계: 물건 클릭은 `seen`, 상세 설명, `S.diveSeen[S.day]`, 자동 저장만 갱신한다. `input`과 `.chosen`은 절대 바꾸지 않는다.
- 다섯 개를 모두 조사하면 `#startDiveOrder`를 활성화하고 라이브 영역으로 “조사 완료”를 알린다.
- 배열 시작: `phase='order'`, 빈 `input`, 선택 안내문으로 전환하고 시작 버튼은 숨긴다. 그때부터 물건 버튼이 `.chosen`을 토글한다.
- `#checkDive`와 `#resetDive`는 배열 단계 전에는 비활성화한다.
- `checkDive` (`game.js:494`)는 가장 먼저 `phase==='order'`를 확인한다. 이후 기존 정답 비교를 유지한다.
- `resetDive` (`game.js:495`)는 배열만 비우며 `seen`은 지우지 않는다.
- `assistDive` (`game.js:497`)는 어느 단계에서든 작동하도록 유지한다.
- 이벤트 연결부(`game.js:522`)에 `$('#startDiveOrder').onclick=startDiveOrder`만 추가한다.

저장/복원은 새 필드 없이 안전하다. `diveSeen`은 이미 저장되므로 중단 후 다섯 물건이 모두 보인 상태라면 시작 버튼이 즉시 활성화된다. 시간선 입력은 현재도 저장되지 않으므로 재접속 시 배열만 다시 시작한다. 세 항목짜리 입력을 새 저장 필드로 추가하는 것은 이 수정의 가치에 비해 검증 표면을 불필요하게 키운다.

게임패드는 일반 대화상자 포커스 순회(`game.js:528-538`)를 그대로 탄다. 단, 숨김/비활성 버튼이 `gamepadFocusable`에서 제외되는지 실제 브라우저와 하네스 양쪽에서 확인해야 한다.

## 3. 큰 글자 rem 버그

### 원인

`styles.css:13`의 `body.large-text{font-size:120%}`는 `rem` 기반 자식 글자에는 영향을 주지 않는다. 예를 들어 이야기 본문은 `1.08rem`, 제목은 `2rem`이다(`styles.css:9`). `rem`은 `body`가 아니라 루트 `html` 글자 크기를 기준으로 한다.

### 최소 수정

- CSS를 `html.large-text{font-size:120%}`로 바꾼다.
- 설정 적용 두 곳(`game.js:525`의 변경 이벤트, `game.js:544`의 초기 복원)이 `largeText`에 한해서 `document.documentElement`에 클래스를 붙이도록 공통 헬퍼를 둔다. 나머지 `reduceMotion`, `highContrast`, `instantTravel`은 계속 `document.body`를 사용한다.

```js
function applySettingClass(id, enabled) {
  const cls = id.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
  const target = id === 'largeText' ? document.documentElement : document.body;
  target.classList.toggle(cls, enabled);
}
```

루트 확대는 고정 높이 UI와 충돌할 수 있으므로 `html.large-text dialog{overflow:auto}`와 `html.large-text .title-copy{max-height:calc(100vh - 2rem);overflow:auto}` 정도만 보강한다. 전체 치수를 다시 설계하는 변경은 피한다.

## 4. 새 밤 이동 대화상자 통합

### 왜 별도 저장 상태를 만들지 않는가

밤 허브가 필요한 상태는 이미 저장에 완전히 표현되어 있다.

```text
오늘 장소 6/6 방문 + 오늘 신호 완료 + 오늘 추론 미완료
```

따라서 `nightPhase`, `nightDialogOpen`, `nightRoam` 같은 필드를 `freshState`에 넣지 않는다. 창이 열려 있을 때 종료해도 `begin` → `afterVisit`이 같은 창을 다시 만든다. 이는 모달의 열린 상태를 저장하는 것보다 손상과 교착 위험이 낮다.

### DOM과 동작

`index.html`에서 퍼즐 대화상자 뒤, 추론 대화상자 앞에 다음 구조를 추가한다.

```html
<dialog id="nightNavigationDialog" class="night-navigation-dialog"
        aria-describedby="nightAfterimageProgress">
  <div class="story-inner">
    <p class="speaker">AFTER HOURS</p>
    <h2>밤길을 더 걸을까요?</h2>
    <p id="nightAfterimageProgress"></p>
    <div id="nightLocations" class="night-locations"></div>
    <button id="startDeduction" class="primary">오늘의 추론 시작</button>
  </div>
</dialog>
```

`openNightNavigation()`은 그날 방문했지만 아직 잔상을 보지 않은 장소 버튼만 만든다. 장소 버튼은 창을 닫고 `S.current=id`, `renderMap()`, `openAfterimage(id)`를 호출한다. 잔상이 끝나면 기존 `openAfterimage`의 `afterVisit()` 호출을 통해 밤 허브가 다시 열린다. `추론 시작`은 창을 닫고 `openDeduction()`을 호출한다. 선택 콘텐츠임을 명확히 하기 위해 기본 포커스는 `추론 시작`에 둔다.

동시 `showModal()` 예외를 막기 위해 `if (!dialog.open) dialog.showModal()`을 사용한다. 예약된 포커스 콜백도 `if (dialog.open)`을 다시 확인해야 한다.

### 저장/복원 연결점

- `solvePuzzle` (`game.js:473`): 저장 후 `afterVisit()` → 밤 허브.
- `afterVisit` (`game.js:476`): 추론 전에는 밤 허브, 추론 후에는 기존 기억 잠수/일 종료.
- `begin` (`game.js:512`): `all && puzzleDone`이면 무조건 `afterVisit()`으로 파생 복원.
- 잔상 읽기 중 종료: `S.afterimages[key]`는 마지막 페이지 완료 때만 커밋되므로 다시 밤 허브로 돌아와 해당 잔상을 다시 선택한다. 중복 커밋은 없다.
- 밤 허브 자체에서 종료: 이미 퍼즐 완료 저장이 있으므로 그대로 복원된다.

### 키보드/게임패드 연결점

- `anyDialogOpen` (`game.js:392`)은 모든 `dialog`를 검사하므로 자동 포함된다.
- 진행 모달 취소 방지 배열(`game.js:524`)에 `nightNavigationDialog`를 추가한다.
- 키보드 분기(`game.js:527`)에서 퍼즐/추론/기억 잠수와 같은 진행 모달 그룹에 밤 허브를 포함한다. 그렇지 않으면 Escape가 열린 밤 허브 위에 일시정지 모달을 열려고 한다.
- 일반 게임패드 모달 처리(`game.js:537-538`)는 D-pad/A를 자동 지원한다. B로 닫을 수 있는 허용 목록에는 밤 허브를 **추가하지 않는다**. 닫힘 뒤 진행 경로가 사라지는 것을 막기 위해서다.
- `openNightNavigation()`이 `#startDeduction`에 명시적으로 포커스를 주면 A 버튼도 첫 입력부터 동작한다. 브라우저 자동 포커스에 의존하지 않는다.
- `styles.css`에는 `.night-navigation-dialog` 폭/최대 높이와 `.night-locations` 그리드만 추가한다. 기존 `.story-inner`, `.primary`, 버튼 스타일을 재사용한다.

## 5. 회귀 위험

| 위험 | 원인 | 방어 |
|---|---|---|
| 잔상 0개 진행 교착 | `solvePuzzle`, `afterVisit`, `begin` 중 한 곳에 기존 강제가 남음 | 세 함수 모두 한 묶음으로 수정하고 0개 완주 테스트 |
| 기존 14~41개 저장에서 업적 미해제 | 업적 검사는 새 잔상 완료 순간에만 실행 | 불러오기 시 유효 잔상 수로 보충, 메타 저장 |
| 조작된 저장으로 14개 업적 해제 | 현재 카운트가 객체 키를 그대로 신뢰 | 유효한 42개 키와 값 `true`만 계산 |
| 밤 허브 위 중첩 모달 | Escape 분기가 새 모달을 모름 | 키보드 진행 모달 목록 및 cancel 목록 갱신 |
| 밤 허브에서 컨트롤러 A 무반응 | 활성 요소가 창 밖에 남아 있음 | 열 때 `startDeduction.focus()`, 하네스에 focus 모델 추가 |
| B/Escape로 밤 허브가 닫혀 진행 실종 | 일반 닫기 허용 목록에 잘못 포함 | 진행 모달로 취급하고 B 허용 목록에서 제외 |
| 잔상 선택 후 배경/현재 위치 불일치 | `openAfterimage(id)`는 `S.current`를 바꾸지 않음 | 호출 전에 `S.current=id; renderMap()` |
| 기억 조사 중 시간선이 다시 채워짐 | 기존 단일 onclick 로직 일부가 남음 | `phase` 분기 전에는 `input`/`.chosen` 수정 금지 단언 |
| 기억 잠수 복원 후 시작 버튼 비활성 | `seen`은 복원됐지만 CTA 상태를 재계산하지 않음 | `openMemoryDive`에서 `seen.size===objects.length`로 계산 |
| 큰 글자 체크는 켜졌지만 rem은 그대로 | body와 html 양쪽에 서로 다른 클래스 적용 | 공통 `applySettingClass`, computed-size 테스트 |
| 큰 글자에서 모달/타이틀 잘림 | 루트 확대와 고정 높이 조합 | 720p/768p 및 200% OS 배율 시 스크롤/포커스 검사 |
| 구형 42개 저장의 HUD가 `42/14` | 원시 카운트 표기 | 목표 달성 문구와 총 발견 수를 분리 |
| 밤 허브 `showModal()` 예외 | `afterVisit` 중복 호출 | `dialog.open` 가드, 빠른 연타 테스트 |

## 6. QA 하네스 변경과 테스트 체크리스트

### `work/qa-directors-cut.cjs` 구조 변경

1. ID 목록(`17`)에 `nightNavigationDialog`, `nightAfterimageProgress`, `nightLocations`, `startDeduction`, `diveInstruction`, `startDiveOrder`를 추가한다. 새 Dialog ID가 `dialogs` 배열(`22`)에 포함되어야 `anyDialogOpen`과 `dialog[open]`이 정확해진다.
2. `document` 스텁(`23-27`)에 `documentElement`를 추가한다. `El`에는 `focus()`로 `document.activeElement`를 설정하는 기능, `hidden`, `offsetParent`, 최소 `matches()`를 추가한다. 이것이 큰 글자 및 게임패드 검증에 필요하다.
3. 메인 루프에서 매 장소 강제 잔상을 여는 `46`을 제거한다. 퍼즐 도움 후 `storyDialog`를 기대하는 `50-51` 대신 `nightNavigationDialog`를 기대한다.
4. 매일 밤 허브에서 잔상 두 개를 선택해 읽고, 다시 열린 허브에서 `startDeduction`을 누른다. 7일이면 선택적 목표 14개가 된다.
5. 기억 잠수 루프(`55-58`)는 다섯 물건 조사 → `input` 0개 단언 → `startDiveOrder` → 정답 세 개 선택 → 확인 순서로 바꾼다. 기존 `resetDive` 우회는 제거한다.
6. 최종 카운트 단언(`64`)을 `afterimages===14`와 `achievements.echoes`로 바꾼다. 방문/단서 42, 퍼즐/추론/잠수 7은 유지한다.

### 반드시 통과할 자동 테스트

- [ ] 잔상 0개 경로로 7일, 42장소, 7퍼즐, 7추론, 7잠수, 임의 엔딩 완주; `echoes` 미해제.
- [ ] 잔상 2개/일 경로로 총 14개 완주; 정확히 14번째 완료 때 `echoes` 해제.
- [ ] 15번째 이후도 열람 가능하고 업적/카운트/저장이 중복되지 않음.
- [ ] 구형 42개 저장을 불러와 진행 가능; 업적 유지; HUD는 목표 달성으로 표시.
- [ ] 구형 14~41개 저장에 `echoes`가 없으면 불러오기 시 보충되고 메타에 지속됨.
- [ ] 잘못된 afterimage 키 14개는 목표 카운트와 업적에 포함되지 않음.
- [ ] 신호 완료 직후 등대 잔상이 강제로 열리지 않고 밤 허브가 열림.
- [ ] 밤 허브에서 바로 추론을 선택하면 잔상 없이 진행.
- [ ] 밤 허브에서 장소 선택 → 잔상 완료 → 같은 밤 허브 재표시.
- [ ] 밤 허브에서 저장/종료/이어하기 → 같은 날짜의 밤 허브 복원.
- [ ] 잔상 중간 종료 → 카운트 미증가; 재진입 후 완료하면 한 번만 증가.
- [ ] 밤 허브에서 Escape/B는 닫히지 않고, 메뉴가 중첩되지 않음.
- [ ] 밤 허브에서 D-pad 포커스 순환, A 선택, 기본 A가 `추론 시작` 실행.
- [ ] 기억 잠수 조사 단계에서 다섯 버튼을 눌러도 `.chosen`과 `input`은 0.
- [ ] 다섯 물건 전에는 `startDiveOrder`, `checkDive`, `resetDive` 비활성.
- [ ] 다섯 물건 후 배열 시작, 정답/오답/리셋/도움 경로 정상.
- [ ] 조사 완료 직후 종료/이어하기 → 다섯 seen 유지, 배열 시작 버튼 활성.
- [ ] 큰 글자 체크 시 `html.large-text`만 적용되고 이야기 본문의 계산 글자 크기가 약 1.2배.
- [ ] 큰 글자 해제 및 재실행 시 저장값과 루트 클래스 일치.
- [ ] 1280×720, 1366×768, 1920×1080에서 큰 글자 + 고대비 + 모션 감소 조합으로 모든 진행 버튼과 마지막 줄에 스크롤/키보드/게임패드로 접근 가능.

### 수동 회귀 스모크

- [ ] 새 게임 첫 장면 중단/선택 결과 중단의 원자적 저장 테스트(`qa-directors-cut.cjs:72-85`)가 그대로 통과.
- [ ] 4개 엔딩 메타 보존 테스트(`68-70`)가 그대로 통과.
- [ ] 렌즈 퍼즐 역순 선택, 튜너 range 게임패드, 새 게임 확인, 저장소 차단 fallback, 손상 저장 격리가 그대로 통과.
- [ ] 각 날짜의 마지막 장소가 등대가 아닌 경로에서도 퍼즐 → 밤 허브 → 추론 순서가 동일.
- [ ] 잔상 목표를 무시한 플레이어에게 업적/엔딩 손실을 암시하는 문구가 없음.

## 구현 순서

1. `AFTERIMAGE_GOAL`, 유효 카운터, 강제 게이트 제거 및 구형 저장 보충.
2. 파생 상태 기반 밤 허브 추가 후 0개/14개/구형 저장 테스트.
3. 기억 잠수 2단계 UX와 하네스 갱신.
4. 큰 글자 루트 클래스 수정 및 720p 시각 점검.
5. 전체 기존 QA와 컨트롤러/저장 회귀 스모크.

이 순서는 각 단계가 독립적으로 되돌릴 수 있고, 새 영구 상태를 만들지 않아 Veteran Cut의 핵심 불만을 가장 작은 회귀 표면으로 해결한다.
