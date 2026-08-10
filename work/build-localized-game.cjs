'use strict';

const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

const root = path.resolve(__dirname, '..');
const gameDir = path.join(root, 'outputs', 'TheLastLight');
const translations = require('./localization/translations.en.json');
const sourceFiles = [
  'veteran-content.js',
  'navigation-levels.js',
  'night-conversations.js',
  'veteran-navigation-encounters.js',
  'veteran-climax.js',
  'five-star-content.js',
  'sensory-engine.js',
  'game.js'
];
const hangul = /[가-힣]/;

const overrides = {
  '눈을 뜨자 바다는 별보다 어두웠다. 네가 타고 온 배는 없고, 손에는 젖지 않은 성냥 한 갑만 남아 있다.': 'When you open your eyes, the sea is darker than the stars. The boat that brought you here is gone. In your hand is a single box of dry matches.',
  '절벽 위 등대가 세 번 깜빡인다. 구조 요청이 아니라 너를 알아본 사람의 눈짓처럼.': 'The lighthouse above the cliffs flashes three times—not a distress call, but the wink of someone who recognizes you.',
  '주머니 속 쪽지에는 네 필체로 한 문장만 적혀 있다. “일곱 번째 새벽 전에 불을 꺼.”': 'A note in your pocket bears a single line in your handwriting: “Extinguish the light before the seventh dawn.”',
  '빛을 끈다 — 놓아준다': 'Extinguish the light — let go',
  '빛을 하늘로 돌린다 — 불완전한 이야기를 남긴다': 'Turn the light toward the sky — leave an imperfect story behind',
  '빛을 지킨다 — 대가를 알면서 한 번 더 함께한다': 'Keep the light — remain together once more, knowing the cost',
  '빛을 새벽에 섞는다 — 기억과 미래의 빈틈을 받아들인다': 'Let the light dissolve into dawn — accept the space between memory and the future',
  '놓아주는 빛': 'The Light We Let Go',
  '별자리가 된 항로': 'A Course Written in Stars',
  '한 번 더, 아름다운 밤': 'One More Beautiful Night',
  '기억 다음의 아침': 'The Morning After Memory',
  '너는 불을 끈다. 섬은 비명을 지르지 않는다. 로웬은 밧줄을 놓고, 아델은 마지막 봉투를 내려놓고, 노아는 흙 묻은 손으로 눈을 가린다. 차례로 얼굴이 흐려질 때 너는 이번 일주일의 세부도 함께 사라진다는 걸 깨닫는다. 로웬이 커피에 설탕을 찾았는지, 마레가 안길 때 어느 팔을 먼저 들었는지, 그런 사소한 것부터 없어진다. 멈출 수 있지만 그러면 모두 다시 첫째 날로 돌아간다. 너는 끝까지 손잡이를 놓지 않는다.\n\n살아 있는 세계에서 라온은 새벽 11시 47분에 눈을 뜬다. 몇 년 만에 가슴을 누르던 압박은 사라졌지만, 미라의 목소리를 떠올리려 하자 아무 소리도 나지 않는다. 라온은 잠옷 차림으로 서랍을 뒤져 낡은 구명조끼를 꺼내고, 안쪽 매듭을 손가락으로 두 번 확인한다. 안도와 공포가 동시에 와서 한참을 운다. 고통이 줄었다고 상실까지 취소된 것은 아니다.\n\n세 해 뒤 추모식에는 꽃보다 접이식 의자가 더 많다. 라온은 학생들에게 영웅 이야기를 하지 않는다. 경보가 늦었고, 여러 사람이 실수했고, 한 사람이 마지막 자리를 양보했다고 말한다. 목소리는 기억나지 않지만 이름은 또렷이 읽는다. “미라 벨.” 섬은 사라졌고 미라는 대답하지 못한다. 놓아준다는 선택의 대가는, 다시 확인받을 기회를 포기하는 일이었다.': 'You extinguish the light. The island does not scream. Rowan releases the rope, Adele sets down her final envelope, and Noah covers his eyes with soil-stained hands. As their faces fade one by one, you realize the details of this week are vanishing with them: whether Rowan took sugar in his coffee, which arm Mare lifted first when she embraced you. You could stop it, but everyone would return to Day One. You keep your hand on the lever until the end.\n\nIn the living world, Raon wakes at 11:47 before dawn. The pressure that has gripped his chest for years is gone, yet when he reaches for Mira’s voice, he hears nothing. Still in his pajamas, he searches a drawer for the old life jacket and checks the inner knot twice. Relief and terror arrive together, and he cries for a long time. Less pain does not mean the loss has been undone.\n\nThree years later, folding chairs outnumber flowers at the memorial. Raon tells his students no heroic legend. He tells them the warning came late, several people made mistakes, and one person surrendered the final seat. He cannot recall her voice, but he reads her name clearly: “Mira Bell.” The island is gone, and Mira cannot answer. Letting go meant surrendering the chance to be reassured one more time.',
  '너는 렌즈를 하늘로 돌린다. 섬사람들은 빛의 점이 되고 세이렌호의 마지막 항로는 별자리로 이어진다. 대신 빛에 실을 수 있는 것은 사건의 윤곽뿐이다. 로웬의 거친 농담, 아델이 규정을 어기며 건넨 차, 노아가 화내며 지킨 작은 일들은 전송 과정에서 잘려 나간다. 모두는 더 오래 남지만, 누구도 온전히 남지는 못한다.\n\n몇 달 뒤 어부들은 그 별을 “벨의 갈고리”라 부르고 안개 속에서 방향을 잡는다. 뉴스는 미라를 완벽한 영웅으로 소개하고, 한 기념품 가게는 작은 등대 열쇠고리를 판다. 어떤 방송은 선장을 악당으로 만들고, 다른 방송은 사고 자체가 꾸며졌다고 말한다. 라온은 인터뷰를 중단하고 집으로 돌아와 화를 낸다. 세상에 이야기를 건넨 순간 그 이야기를 통제할 권리도 함께 건넸다는 사실을 받아들이기 어렵다.\n\n십 년 뒤 조난당한 청소년 둘이 그 별을 따라 해안으로 돌아온다. 구조 보고서에는 미라의 이름이 없고 좌표만 적힌다. 라온은 그 사실에 서운해하다가도 보고서를 접어 보관한다. 미라는 유명해졌지만 제대로 알려지지는 않았다. 그래도 누군가는 살아 돌아왔다. 이 엔딩의 대가는 사적인 사람을 공적인 상징으로 내어 주는 것이며, 후일담은 그 불완전한 상징이 실제로 쓸모를 얻는 삶이다.': 'You turn the lens toward the sky. The islanders become points of light, and the Siren’s final course joins into a constellation. But the light can carry only the outline of what happened. Rowan’s rough jokes, the tea Adele passed you against regulations, and the small things Noah defended in anger are cut away in transmission. Everyone endures longer, but no one survives whole.\n\nMonths later, fishers call the constellation “Bell’s Hook” and use it to steer through fog. The news presents Mira as a flawless hero; a souvenir shop sells tiny lighthouse key rings. One broadcast turns the captain into a villain, another claims the disaster was staged. Raon abandons an interview and goes home furious. The moment a story is given to the world, the right to control it is given away as well.\n\nTen years later, two shipwrecked teenagers follow those stars back to shore. Their rescue report records coordinates, not Mira’s name. Raon feels the omission, then folds the report and keeps it. Mira became famous without ever being fully known. Still, someone came home alive. The price of this ending is offering a private person to the world as a public symbol—and watching that imperfect symbol become genuinely useful.',
  '너는 빛을 지킨다. 새벽이 물러나고 섬은 첫째 날 저녁으로 돌아간다. 로웬, 아델, 노아, 마레, 이솔은 이번 일주일을 잊는다. 너만 기억한다. 부두에서 로웬이 “육지에서 왔소?”라고 묻자 처음에는 반가워 웃지만, 열두 번째 같은 질문에는 대답이 늦어진다. 함께 있고 싶다는 소원은 이루어졌고, 서로 함께 기억하고 싶다는 소원은 이루어지지 않았다.\n\n반복이 쌓이면서 너는 사람들을 대사와 동선으로 예측하기 시작한다. 아델이 편지를 떨어뜨리기 전에 주워 주고, 노아가 농담을 끝내기 전에 답한다. 어느 날 노아가 “내 말 좀 끝까지 들으면 안 돼?”라고 화를 낸다. 기억하지 못해도 새 감정은 생긴다. 너는 그제야 이들을 보존한다며 통제하고 있었음을 인정한다. 다음 반복에는 일부러 모르는 척하지만, 그것마저 연기가 된다.\n\n살아 있는 세계의 라온은 매주 같은 밤 11시 47분에 악몽으로 깬다. 등대가 섬을 유지할 때마다 생존자들의 기억에서 조금씩 신호를 빌려 오기 때문이다. 라온은 일상을 살지만 그 밤만큼은 앞으로 가지 못한다. 섬에서는 또 푸른 저녁이 시작되고 로웬이 같은 질문을 한다. 너는 이번에는 솔직히 답한다. “여기 남으려고 왔어요. 그게 당신에게 공평한지는 아직 모르겠어요.” 아름다움을 지킨 대가는 타인의 내일까지 붙잡는 일이다.': 'You keep the light. Dawn withdraws, and the island returns to the evening of Day One. Rowan, Adele, Noah, Mare, and Isol forget the week. Only you remember. At the harbor Rowan asks, “Are you from the mainland?” The first time, you smile with relief. By the twelfth, your answer comes slowly. Your wish to remain together has been granted. Your wish to remember together has not.\n\nAs the cycles accumulate, you begin predicting everyone by their lines and movements. You catch Adele’s letter before she drops it and answer Noah before he finishes the joke. One day he snaps, “Could you let me finish?” New feelings can grow even without old memories. You finally admit that preserving them has become a way of controlling them. In the next cycle you pretend not to know what will happen, but even that becomes a performance.\n\nIn the living world, Raon wakes from the same nightmare every week at 11:47 p.m. Each time the lighthouse sustains the island, it borrows a little signal from the survivors’ memories. Raon lives his life, but on that night he cannot move forward. Another blue evening begins on the island, and Rowan asks the same question. This time you answer honestly: “I came here to stay. I still don’t know whether that is fair to you.” The price of preserving beauty is holding on to someone else’s tomorrow.',
  '너는 빛을 끄지도 붙들지도 않고 새벽의 밝기와 섞는다. 섬은 고정된 장소로 남지 못하고, 살아 있는 누군가가 미라를 구체적으로 기억할 때만 잠깐 나타나는 얕은 물결이 된다. 반복은 끝나지만 너도 원하는 때에 로웬이나 노아를 부를 수 없다. 어떤 날에는 아델의 목소리만 오고, 어떤 날에는 빈 부두만 열린다. 균형은 모두를 갖는 보상이 아니라 불완전함을 계속 견디는 방식이다.\n\n라온은 교사가 되어 학생들에게 구조 매듭을 가르친다. 한 아이가 왜 매듭을 두 번 확인하냐고 묻자 라온은 “나를 살린 사람이 그렇게 했어”라고 답한다. 창밖에 산호색 빛이 잠깐 번지고, 미라는 그 교실을 보지만 말을 걸 수 없다. 라온도 그것이 기적이라고 우기지 않는다. 수업이 끝나면 출석부를 챙기고 장을 보러 간다. 기억은 일상을 대신하지 않고 그 안에 짧게 자리를 얻는다.\n\n몇 년 뒤 해양 사고 기록관은 서로 맞지 않는 증언들을 하나의 정답으로 합치지 않기로 한다. 선장의 늦은 명령, 고장 난 무전기, 미라의 항로 변경, 라온의 구명조끼가 각자 다른 서랍에 남는다. 방문자는 완벽한 영웅도 단독 범인도 찾지 못한다. 미라는 기억될 때만 그 방의 빛을 느끼고, 기억되지 않는 날에는 아무것도 느끼지 않는다. 이 엔딩의 대가는 안정된 존재와 재회의 권리를 포기하는 것이고, 후일담은 그 빈틈 덕분에 산 사람들의 삶이 계속 움직이는 것이다.': 'You neither extinguish the light nor hold it fast. You blend it into dawn. The island can no longer remain a fixed place; it becomes a shallow ripple that appears only when someone living remembers Mira in detail. The cycle ends, but you cannot summon Rowan or Noah whenever you wish. Some days only Adele’s voice arrives. On others, an empty harbor opens. Balance is not the reward of keeping everything. It is the practice of enduring what remains incomplete.\n\nRaon becomes a teacher and shows his students how to tie rescue knots. When a child asks why he checks each knot twice, he answers, “The person who saved me did that.” Coral light briefly spreads beyond the window. Mira sees the classroom but cannot speak into it. Raon does not insist it was a miracle. When class ends, he gathers the attendance book and goes shopping. Memory does not replace ordinary life; it earns a brief place within it.\n\nYears later, the Maritime Accident Archive decides not to force conflicting testimony into a single answer. The captain’s delayed order, the failed radio, Mira’s course correction, and Raon’s life jacket remain in separate drawers. Visitors find neither a perfect hero nor a lone culprit. Mira feels the room’s light only on days she is remembered. On other days, she feels nothing. The price of this ending is surrendering a stable existence and the promise of reunion. In that open space, the lives of the living keep moving.',
  '마지막 빛': 'The Last Light',
  '프롤로그': 'Prologue',
  '미라': 'Mira',
  '미라 벨': 'Mira Bell',
  '세이렌호': 'the Siren',
  '세이렌 등대': 'the Siren Lighthouse'
};

const ui = {
  '◆ 배 · ✦ 신호 · ◉ 구조 · ⚙ 스위치 · ▣ 문 · ≋ 조류 · ▲ 암초 · ◎ 등대': '◆ Boat · ✦ Signal · ◉ Rescue · ⚙ Switch · ▣ Gate · ≋ Current · ▲ Reef · ◎ Lighthouse',
  '6×6 항해 지도': '6×6 navigation chart',
  '게임패드': 'Gamepad',
  '계속': 'Continue',
  '계속하기': 'Resume',
  '고대비': 'High contrast',
  '기록': 'Notes',
  '기억 보관함': 'Memory Archive',
  '기억 보관함 닫기': 'Close Memory Archive',
  '기억 잇기': 'Connect Memory',
  '기억 잠수': 'Memory Dive',
  '기억, 상실, 그리고 놓아주는 용기에 관한 이야기': 'A story of memory, loss, and the courage to let go',
  '기억의 흐름 보기': 'Reveal memory flow',
  '끄기': 'Off',
  '날짜': 'Day',
  '남쪽으로 조타': 'Steer south',
  '느림': 'Slow',
  '동쪽으로 조타': 'Steer east',
  '등대의 주파수 조율기': 'Lighthouse Frequency Tuner',
  '마지막 빛이': 'Where the Last Light',
  '마지막 빛이 잠든 곳': 'Where the Last Light Sleeps',
  '모든 소리 끄기': 'Mute all sound',
  '모든 퍼즐은 ‘도움 받기’로 해결할 수 있습니다. 진행과 엔딩에 불이익이 없습니다.': 'Every puzzle can be completed with an assist. Using help never affects progress or endings.',
  '물건을 골라 그날의 온도를 되찾으세요.': 'Choose an object and recover the warmth of that day.',
  '바다의 목소리를 맞춰라': 'Tune the Voice of the Sea',
  '밤 항해': 'Night Voyages',
  '밤길에 남은 목소리': 'Voices Left on the Night Road',
  '밤의 항로': 'The Night Crossing',
  '번쩍임 줄이기': 'Reduce flashes',
  '보통': 'Normal',
  '부두': 'Harbor',
  '북쪽으로 조타': 'Steer north',
  '불이 낮아진 뒤': 'After the Light Burns Low',
  '빠른 이동': 'Instant travel',
  '새 이야기': 'New Story',
  '새 이야기 시작': 'Begin New Story',
  '서쪽으로 조타': 'Steer west',
  '선택의 파문': 'Consequences',
  '설정': 'Settings',
  '설정 · 접근성': 'Settings · Accessibility',
  '설정 닫기': 'Close settings',
  '섬 지도': 'Island map',
  '섬사람들': 'Islanders',
  '세 물건을 시간 순서대로 골라 기억을 잇습니다.': 'Choose three objects in chronological order to reconnect the memory.',
  '소리 단서 자막': 'Sound cue captions',
  '소리 켜기 또는 끄기': 'Toggle sound',
  '순서 다시 고르기': 'Reset order',
  '시간선 배열 시작': 'Build the Timeline',
  '시네마틱 연출': 'Cinematic effects',
  '신호 속에 숨은 기억을 찾아야 한다.': 'Find the memory hidden inside the signal.',
  '아직 선택한 기억 없음': 'No memories selected',
  '업적': 'Achievements',
  '엔딩과 업적은 기억 보관함에 남지만, 진행 중인 날짜와 단서는 처음부터 시작합니다.': 'Endings and achievements remain in the Memory Archive, but the current day and clues will restart.',
  '여행자': 'Traveler',
  '오늘은 두 잔상만 더 붙잡을 수 있습니다. 보지 않은 관점은 다음 항해를 위해 남으며, 결말에는 불이익이 없습니다.': 'You can hold on to only two echoes tonight. Unseen perspectives remain for another voyage and never penalize an ending.',
  '오늘의 기록 중 결론을 지지하는 증거 세 장을 먼저 고르세요.': 'Choose three pieces of evidence from today that support your conclusion.',
  '오늘의 대화를 마친다': 'End Tonight’s Conversation',
  '오늘의 약속': 'Today’s Promise',
  '오늘의 추론': 'Today’s Deduction',
  '오늘의 추론 시작': 'Begin Today’s Deduction',
  '오늘의 탐험 진행': 'Today’s exploration progress',
  '움직임 줄이기': 'Reduce motion',
  '유리 조각': 'Glass Shards',
  '은은하게': 'Subtle',
  '음악': 'Music',
  '이동': 'Move',
  '이어하기': 'Continue',
  '일지': 'Journal',
  '일지의 단서로 해결': 'Solve from journal clues',
  '잠든 곳': 'Sleeps',
  '잠시 숨을 고르자': 'Take a Breath',
  '저장하기': 'Save',
  '전체': 'Full',
  '전체 음량': 'Master volume',
  '조사': 'Interact',
  '즉시': 'Instant',
  '지원': 'Supported',
  '처음 항로로': 'Restart route',
  '첫째 날': 'Day One',
  '추론 보드': 'Deduction Board',
  '큰 글자': 'Large text',
  '타이틀로': 'Return to Title',
  '텍스트 속도': 'Text speed',
  '파도·바람': 'Waves · Wind',
  '파도가 이름을 지우기 전에, 등대의 불을 밝혀라.': 'Before the waves erase every name, light the lighthouse.',
  '퍼즐 도움 받기': 'Use Puzzle Assist',
  '항로 도움 받기': 'Use Route Assist',
  '항해 방향 조작': 'Navigation controls',
  '항해일지': 'Logbook',
  '항해일지 닫기': 'Close logbook',
  '현재 항해 유지': 'Keep Current Voyage',
  '현재 항해를 덮어쓸까요?': 'Overwrite the Current Voyage?',
  '확인': 'Confirm',
  '효과음': 'Sound effects',
  'E / 클릭 ·': 'E / Click ·',
  'J · 항해일지': 'J · Logbook',
  'WASD / 방향키 ·': 'WASD / Arrow Keys ·',
  'Z · 한 수 되돌리기': 'Z · Undo Move'
};

const dictionary = { ...translations, ...ui, ...overrides };

function escapeTemplate(value) {
  return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function transformJavaScript(file) {
  const source = fs.readFileSync(path.join(gameDir, file), 'utf8');
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
  const replacements = [];
  walk.simple(ast, {
    Literal(node) {
      if (typeof node.value !== 'string' || !hangul.test(node.value)) return;
      const translated = dictionary[node.value];
      if (!translated) throw new Error(`Missing translation in ${file}: ${node.value}`);
      replacements.push({ start: node.start, end: node.end, value: JSON.stringify(translated) });
    },
    TemplateElement(node) {
      if (!hangul.test(node.value.cooked)) return;
      const translated = dictionary[node.value.cooked];
      if (!translated) throw new Error(`Missing template translation in ${file}: ${node.value.cooked}`);
      replacements.push({ start: node.start, end: node.end, value: escapeTemplate(translated) });
    }
  });
  let output = source;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, replacement.start) + replacement.value + output.slice(replacement.end);
  }
  acorn.parse(output, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
  const outFile = file.replace(/\.js$/, '.en.js');
  fs.writeFileSync(path.join(gameDir, outFile), output);
  return { file: outFile, replacements: replacements.length };
}

function replaceAllExact(source, map) {
  return Object.entries(map)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((value, [from, to]) => value.split(from).join(to), source);
}

function buildLoader() {
  const loader = `'use strict';\n(() => {\n  const koToEn = ${JSON.stringify(dictionary)};\n  const enToKo = Object.fromEntries(Object.entries(koToEn).map(([ko, en]) => [en, ko]));\n  let language = 'en';\n  try { language = localStorage.getItem('lastLight.language') || 'en'; } catch {}\n  if (!['en', 'ko'].includes(language)) language = 'en';\n  window.THE_LAST_LIGHT_LANGUAGE = language;\n  document.documentElement.lang = language;\n  const map = language === 'en' ? koToEn : enToKo;\n  const translateExact = value => map[value] || value;\n  window.localizeRuntimeValue = function localizeRuntimeValue(value) {\n    if (typeof value === 'string') return translateExact(value);\n    if (Array.isArray(value)) return value.map(window.localizeRuntimeValue);\n    if (value && typeof value === 'object') {\n      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, window.localizeRuntimeValue(item)]));\n    }\n    return value;\n  };\n  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);\n  const nodes = [];\n  while (walker.nextNode()) nodes.push(walker.currentNode);\n  nodes.forEach(node => {\n    const trimmed = node.nodeValue.trim();\n    if (!trimmed || !map[trimmed]) return;\n    node.nodeValue = node.nodeValue.replace(trimmed, map[trimmed]);\n  });\n  document.querySelectorAll('[aria-label],[title],[alt]').forEach(element => {\n    for (const attr of ['aria-label', 'title', 'alt']) {\n      const value = element.getAttribute(attr);\n      if (value && map[value]) element.setAttribute(attr, map[value]);\n    }\n  });\n  document.title = language === 'en' ? 'Where the Last Light Sleeps' : '마지막 빛이 잠든 곳';\n  const selector = document.getElementById('languageSelect');\n  if (selector) {\n    selector.value = language;\n    selector.addEventListener('change', () => {\n      try { localStorage.setItem('lastLight.language', selector.value); } catch {}\n      location.reload();\n    });\n  }\n  const sourceNames = ${JSON.stringify(sourceFiles)};\n  const selected = sourceNames.map(name => language === 'en' ? name.replace(/\\.js$/, '.en.js') : name);\n  selected.reduce((chain, src) => chain.then(() => new Promise((resolve, reject) => {\n    const script = document.createElement('script');\n    script.src = src;\n    script.onload = resolve;\n    script.onerror = () => reject(new Error('Failed to load ' + src));\n    document.body.appendChild(script);\n  })), Promise.resolve()).catch(error => {\n    const toast = document.getElementById('toast');\n    if (toast) toast.textContent = error.message;\n  });\n})();\n`;
  fs.writeFileSync(path.join(gameDir, 'language-loader.js'), loader);
}

function buildHtml() {
  const templatePath = path.join(gameDir, 'index.ko.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = replaceAllExact(html, ui);
  html = html.replace('<html lang="ko">', '<html lang="en">');
  html = html.replace(
    '    <label><input id="largeText" type="checkbox"> Large text</label>',
    '    <label class="language-setting">Language / 언어 <select id="languageSelect"><option value="en" selected>English</option><option value="ko">한국어</option></select></label>\n    <label><input id="largeText" type="checkbox"> Large text</label>'
  );
  html = html.replace(/  <script src="veteran-content\.js"><\/script>[\s\S]*?  <script src="game\.js"><\/script>/, '  <script src="language-loader.js"></script>');
  if (!html.includes('id="languageSelect"') || !html.includes('language-loader.js')) throw new Error('Failed to inject localization loader into index.html');
  fs.writeFileSync(path.join(gameDir, 'index.html'), html);
}

const results = sourceFiles.map(transformJavaScript);
buildLoader();
buildHtml();
console.log(JSON.stringify({ languageDefault: 'en', alternateLanguage: 'ko', dictionaryEntries: Object.keys(dictionary).length, files: results }, null, 2));
