(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const SAVE='last-light-save-v1';
const locs={
 harbor:{name:'잔물결 부두',icon:'⚓',x:17,y:67}, village:{name:'빈집 마을',icon:'⌂',x:30,y:60},
 orchard:{name:'유리나무 과수원',icon:'♧',x:44,y:52}, chapel:{name:'조수의 예배당',icon:'♢',x:56,y:39},
 cliff:{name:'바람 절벽',icon:'≈',x:70,y:43}, lighthouse:{name:'세이렌 등대',icon:'✦',x:79,y:14}
};
const days=[
 {name:'첫째 날 · 밀물',obj:'섬사람들에게 등대가 꺼진 이유를 묻자',weather:'바다는 아직 네 이름을 모른다.',required:Object.keys(locs),freq:3,phase:8},
 {name:'둘째 날 · 종소리',obj:'멈춘 종과 사라진 배의 기록을 찾자',weather:'안개 속에서 누군가 세 번 종을 울린다.',required:Object.keys(locs),freq:9,phase:2},
 {name:'셋째 날 · 붉은 우편',obj:'배달되지 못한 편지의 수신인을 찾자',weather:'주소 없는 편지가 파도보다 먼저 도착했다.',required:Object.keys(locs),freq:6,phase:5},
 {name:'넷째 날 · 역류',obj:'섬의 시계가 거꾸로 가는 까닭을 밝히자',weather:'오늘 파도는 바다로 돌아가지 않는다.',required:Object.keys(locs),freq:11,phase:7},
 {name:'다섯째 날 · 빈 이름',obj:'사람들이 숨기는 미라의 기록을 되찾자',weather:'모두가 너를 알지만 아무도 네 이름을 부르지 않는다.',required:Object.keys(locs),freq:2,phase:4},
 {name:'여섯째 날 · 침몰',obj:'7년 전 세이렌호의 마지막 밤을 기억하자',weather:'비가 위가 아니라 기억 속에서 내린다.',required:['harbor','village','orchard','chapel','cliff','lighthouse'],freq:8,phase:9},
 {name:'일곱째 날 · 새벽',obj:'등대 꼭대기에서 마지막 선택을 하자',weather:'밤은 끝나려 하고, 섬은 끝나지 않으려 한다.',required:['harbor','village','orchard','chapel','cliff','lighthouse'],freq:5,phase:1}
];
const people={
 harbor:['로웬','부두지기','파도보다 오래 기다린 남자'], village:['아델','우편집배원','수신인 없는 편지를 배달하는 여자'],
 orchard:['노아','정원사','유리 열매 속 기억을 돌보는 아이'], chapel:['마레 수녀','종지기','죽은 이보다 산 이를 위해 기도하는 사람'],
 cliff:['이솔','기상관측원','내일의 날씨를 말하지 않는 노인'], lighthouse:['등대','세이렌','섬에서 유일하게 늙지 않는 빛']
};
const story={
 harbor:[
 ['부두 끝에 한 남자가 빈 밧줄을 감고 있었다. 배는 없었고 밧줄은 바다 아래로 길게 이어졌다.','“육지에서 왔소?” 그가 묻는다. 대답하기도 전에 고개를 젓는다. “아니, 그럴 리 없지. 마지막 배는 7년 전에 떠났으니까.”','그는 네 젖지 않은 외투를 오래 바라본다. 주머니에서는 낡은 승선권 한 장이 나온다. 이름 칸만 바닷물에 번져 있다.'],
 ['새벽 안개 속에서 밧줄이 팽팽해진다. 로웬은 당기지 말라고 한다. 아래에는 배가 아니라 “배가 돌아오기를 바라는 마음”이 매달려 있다고.','창고 장부에는 같은 날짜가 일곱 번 반복된다. 세이렌호, 승객 23명, 승무원 4명. 구조자 1명. 실종자 1명. 두 숫자는 이상하게 겹쳐 보인다.','종이 사이에서 작은 청동 열쇠를 찾았다. 로웬은 그 열쇠가 선장실 것이 아니라 네 방 것이었다고 말하다가 입을 다문다.'],
 ['부두 우편함에는 붉은 봉투가 끼어 있다. 발신인은 ‘미라’, 수신인은 ‘아직 살아 있는 나’. 글씨가 네 필체와 닮았다.','편지에는 폭풍 전날의 사소한 것들이 적혀 있다. 차가웠던 수프, 선장의 흰 장갑, 갑판에서 혼자 울던 아이. 끝에는 한 문장. “등대를 믿지 마.”','로웬은 편지를 태우자고 한다. 불꽃은 기억을 없애지 못하지만, 적어도 기억이 너를 읽지는 못하게 한다고.'],
 ['물이 부두에서 바다 쪽으로 오르막처럼 솟아 있다. 그 표면에 얼굴들이 비친다. 모두 너를 향해 입을 움직이지만 소리는 뒤집혀 들린다.','장부를 거꾸로 읽자 문장이 된다. “미라가 조타륜을 돌렸다. 불빛을 향해서.” 그런데 폭풍 그날, 등대는 꺼져 있었다.','로웬이 처음으로 네 손을 잡는다. 그의 손은 차갑지도 따뜻하지도 않다. “기억은 사실과 달라. 하지만 거짓말도 아니야.”'],
 ['빈 승선권에 햇빛을 비추자 이름이 떠오른다. 미라 벨. 세이렌호의 일등항해사. 네 이름이다.','로웬은 7년 전 배에 타고 있었다고 고백한다. 그는 죽었다. 그러나 이 섬의 다른 이들은 죽은 사람도, 살아남은 사람도 아니다. “우린 네가 놓지 못한 마지막 순간에 남은 모습들이오.”','밧줄 끝에서 작은 구명조끼가 올라온다. 안쪽에 아이가 쓴 글씨가 있다. ‘미라 언니가 나를 구했어요.’'],
 ['폭풍이 돌아왔다. 부두에는 세이렌호가 반쯤 잠긴 채 기다린다. 갑판 위의 사람들은 그날과 똑같은 자세로 얼어 있다.','너는 조타륜을 붙잡았던 손을 기억한다. 꺼진 등대 쪽이 아니라, 절벽을 피해 얕은 만으로 배를 돌렸다. 스물여섯 명은 살았다.','하지만 구명정의 마지막 자리를 아이에게 내주고 너는 배에 남았다. 구조자 1명, 실종자 1명. 둘 다 너였다.'],
 ['새벽의 부두는 놀라울 만큼 작다. 로웬은 밧줄을 풀어 바다에 놓아준다. 매달려 있던 기다림이 물결이 되어 멀어진다.','“우리가 사라지는 건 죽는 게 아니오. 드디어 그날 다음 날로 가는 거지.” 그는 웃는다. 처음 보는 웃음인데 오래 기억한 표정 같다.','빈 배 한 척이 기다린다. 등대를 끄면 탈 수 있고, 켜두면 섬은 다시 첫째 날로 돌아간다.']
 ],
 village:[
 ['집마다 식탁이 차려져 있지만 음식에는 먼지가 없다. 우편집배원 아델만 골목을 돌며 같은 편지를 같은 문에 넣고 있다.','그녀는 네게 17번지 편지를 건넨다. “여긴 16번지까지만 있어요. 그래도 주소가 틀린 건 아니에요.”','골목 끝, 벽뿐인 곳에 문손잡이가 있다. 손을 대자 아주 잠깐 네 침실 냄새가 난다.'],
 ['마을의 모든 시계가 11시 47분에 멈췄다. 아델은 매일 자정에 태엽을 감지만 분침은 같은 자리로 되돌아온다.','빈집에서 아이의 키를 표시한 벽을 발견한다. 마지막 줄은 7년 전 날짜, 옆에는 ‘라온, 이제 미라 언니 어깨까지’.','거울 속 네 모습 뒤에 젖은 승객들이 서 있다. 돌아보면 아무도 없다. 거울의 너만 한 박자 늦게 돌아본다.'],
 ['17번지 문이 오늘은 나타나 있다. 안은 세이렌호의 네 선실이다. 책상 위에 쓰다 만 붉은 편지 일곱 장.','첫 편지는 사과, 둘째는 보고서, 셋째는 유서다. 넷째부터는 같은 문장이 반복된다. “내가 한 선택을 누가 기억해 줬으면.”','아델은 편지를 가져가지 않는다. “수신인이 받았으니까요.” 네가 수신인이냐 묻자, 그녀는 슬프게 웃는다.'],
 ['마을 사람들이 창문마다 서 있다. 그들은 네가 지나갈 때마다 촛불을 하나씩 끈다. 어둠은 위협이 아니라 작별처럼 다정하다.','17번지 방의 시계를 앞으로 돌리자 바깥 풍경이 변한다. 폭풍 다음 날, 구조된 사람들이 서로의 이름을 부르는 모습.','단 한 사람만 불리지 않는다. 바다로 돌아간 사람. 너는 그 빈자리가 오래도록 자신을 탓하고 있었다.'],
 ['아델의 가방 안에는 배달 완료 도장이 찍힌 편지가 수백 장이다. 모두 네가 죽은 뒤 살아남은 이들이 보낸 편지다.','라온은 자라 교사가 되었고, 매년 학생들과 바다에 꽃을 띄웠다. 선장은 다시는 배를 타지 않았지만 네 어머니를 평생 찾아뵈었다.','네 선택은 사람들의 삶 속에서 계속되었다. 이 섬만 그 사실을 몰랐다. 네 죄책감으로 지어진 섬이기 때문이다.'],
 ['집들이 파도처럼 기울고 골목은 배의 복도로 변한다. 문마다 승객들이 갇혀 있다. 너는 하나씩 열며 그들의 이름을 부른다.','이름을 들은 사람들은 폭풍이 아닌 각자의 다음 날로 걸어간다. 결혼식, 병원, 작은 교실, 늙은 개가 기다리는 집.','아델은 마지막 편지를 네게 준다. 봉투에는 ‘이 섬에게’. 아직 뜯지 않는다.'],
 ['마을의 식탁에는 따뜻한 아침이 놓였다. 사람은 없지만 의자마다 눌린 자국이 남아 있다. 부재가 꼭 상실만은 아니라는 듯이.','아델은 우편가방을 내려놓는다. “마지막 편지는 직접 배달해 주세요. 이 섬은 당신이니까.”','봉투 안에는 빈 종이 한 장. 네가 어떤 결말을 쓰든 그것이 섬이 받게 될 첫 미래다.']
 ],
 orchard:[
 ['검은 가지마다 투명한 열매가 열린다. 그 안에서 아주 작은 장면들이 눈처럼 흔들린다. 정원사 노아는 깨지기 쉬우니 거짓말을 하지 말라고 한다.','첫 열매 속 너는 웃고 있다. 폭풍 전날 갑판에서 라온에게 별자리 매듭을 가르치는 모습. 기억 속에는 없던 행복이다.','노아는 나쁜 기억만 남기려는 사람에게 좋은 기억이 먼저 사라진다고 말한다.'],
 ['밤이 되자 열매들이 종처럼 울린다. 각각 다른 사람의 목소리다. 노아는 가장 조용한 것을 골라야 네 기억이라고 한다.','작은 열매 속 어머니가 등대를 그린 엽서를 건넨다. “길을 잃으면 빛을 보렴.” 너는 그 말을 너무 문자 그대로 믿었다.','열매가 손안에서 금 간다. 안의 바다가 흘러나오지만 손바닥은 젖지 않는다.'],
 ['붉은 봉투를 나무 아래 묻자 새 열매가 자란다. 안에는 폭풍 뒤의 시간이 담겼다. 네가 보지 못한 세계다.','라온이 병원에서 깨어나 가장 먼저 네 이름을 묻는다. 누군가는 고개를 젓고, 누군가는 창밖을 본다.','노아는 기억이 죽은 사람의 소유가 아니라 살아남은 사람의 행동이라고 말한다.'],
 ['열매들이 가지로 떨어지고, 깨진 조각은 하늘로 올라간다. 시간도 방향을 잃었다.','거꾸로 흐르는 장면 속에서 네가 구명조끼를 벗어 라온에게 입힌다. 두려워 우는 아이에게 너는 “나는 수영을 잘해”라고 거짓말했다.','노아가 묻는다. 누군가를 살린 거짓말은 죄일까, 약속일까.'],
 ['노아가 자신의 정체를 알려준다. 그는 실존 인물이 아니라 네가 가지지 못한 미래의 모습이다. 살아남았다면 길렀을 아이, 심었을 나무, 늙어갈 얼굴.','“그래도 난 가짜가 아니야.” 그가 말한다. “가능성도 기억만큼 사람을 만들거든.”','그는 가장 밝은 열매를 건넨다. 안에는 아무 장면도 없다. 아직 일어나지 않은 날이기 때문이다.'],
 ['폭풍에 나무가 부러진다. 유리 열매들이 땅에 쏟아져 수천 개의 과거를 비춘다. 모두 주우려면 영원히 이 밤에 머물러야 한다.','너는 가장 아픈 열매 하나만 골라 품는다. 조타실 창문이 깨지고, 물이 들어오고, 네가 살고 싶다고 소리치는 장면.','희생한 사람도 살고 싶었다. 그 사실은 희생을 더럽히지 않는다. 오히려 선택을 온전하게 만든다.'],
 ['과수원에는 투명한 씨앗 하나만 남았다. 노아는 그것을 네 주머니에 넣는다. 섬을 떠나도 가져갈 수 없는 물건이지만, 가져가려는 마음은 남는다고.','“미래는 기억하지 못하는 기억이야.” 노아가 손을 흔든다. 그의 몸 너머로 새벽빛이 비친다.','씨앗에서 아주 작은 초록 잎이 나온다. 이 섬에서 처음 보는 색이다.']
 ],
 chapel:[
 ['예배당은 바다 쪽으로 기울어져 있다. 마레 수녀는 물에 잠긴 종을 치고, 소리는 하늘에서 들린다.','벽에는 27개의 이름이 새겨져 있다. 마지막 이름만 긁혀 알아볼 수 없다. 손가락으로 더듬으면 네 심장이 종처럼 울린다.','수녀는 이름을 읽는 것이 죽은 이를 부르는 일이 아니라 산 자가 대답하는 일이라고 말한다.'],
 ['종 아래에서 세 번 울림이 온다. 짧게, 길게, 짧게. 세이렌호의 조난 신호와 다르다. 누군가 보낸 “살아 있다”는 답신이다.','종줄에는 7년치 소금이 굳어 있다. 네가 매일 밤 이 종을 울려 누구도 떠나지 못하게 했다는 말을 수녀는 삼킨다.','기도서 사이에서 네 서명이 든 결혼식 축사를 발견한다. 폭풍 다음 주에 읽을 예정이었다.'],
 ['마레는 편지를 큰 소리로 읽으라고 한다. 목소리를 내면 문장 사이에 숨은 말이 들린다. “나를 용서해”가 아니라 “나를 기억해.”','너는 자신을 용서하려고 섬을 만든 게 아니었다. 누군가 네 선택을 정확히 기억하기를 바라서 만들었다.','하지만 기억은 반복될수록 닳았고, 영웅은 죄인이 되었으며, 구조는 침몰로 바뀌었다.'],
 ['예배당 바닥의 물이 천장으로 떨어진다. 그 속에서 11시 47분 이후의 종소리가 들린다. 생존자 수를 알리는 스물여섯 번의 울림.','스물일곱 번째 소리는 없다. 마레는 침묵도 하나의 종소리라고 한다. “당신의 몫이었어요.”','너는 처음으로 벽의 마지막 이름을 읽는다. 미라 벨. 글자는 처음부터 지워진 적이 없다.'],
 ['마레는 자신의 얼굴을 보여준다. 배에 타고 있던 의사 마레나 벨, 네 언니다. 그는 생존했으며 네 이름으로 해안 구조 재단을 세웠다.','섬의 마레는 실제 언니가 아니라 네가 마지막으로 본 표정이다. 두려움과 사랑이 반씩 섞인 얼굴.','“나는 너를 용서하러 온 게 아니야. 네가 잘못한 게 없으니까.” 그 말에 종이 스스로 울린다.'],
 ['폭풍 속 예배당은 세이렌호의 의무실이 된다. 부상자들은 구명정으로 옮겨지고 언니는 마지막까지 네 손을 놓지 않는다.','너는 언니의 손을 억지로 떼고 문을 잠갔다. 언니가 배로 돌아오지 못하게. 그가 살아남은 것은 네가 미움받을 각오를 했기 때문이다.','문 너머 언니의 비명이 7년 동안 파도 소리로 남아 있었다. 이제 그 뒤의 말이 들린다. “사랑해, 미라.”'],
 ['마레는 종줄을 네게 건넨다. 한 번 울리면 떠나는 이를 위한 소리, 두 번 울리면 남는 이를 위한 소리.','너는 세 번 울린다. 떠나는 사람, 남는 사람, 그리고 둘 사이에 잠시 머물렀던 모두를 위해.','예배당 벽의 이름들이 빛이 되어 새벽 하늘로 올라간다. 네 이름은 마지막까지 남아 있다.']
 ],
 cliff:[
 ['절벽의 풍향계는 바람과 반대로 돈다. 이솔은 내일의 날씨 대신 어제의 날씨를 정확히 예보한다.','관측일지에는 폭풍이 갑자기 생긴 것이 아니라 등대 빛을 따라 움직였다고 적혀 있다. 빛이 배를 살린 게 아니라 폭풍을 불렀다는 뜻일까.','망원경으로 바다를 보면 수평선 아래에 또 하나의 섬이 거꾸로 매달려 있다.'],
 ['이솔은 종소리의 간격을 재고 있다. 47초마다 파도가 멈추고, 그때 섬 전체가 아주 조금 투명해진다.','그는 네 그림자가 서쪽이 아니라 등대 쪽으로 기운다고 지적한다. “빛이 널 비추는 게 아니야. 널 만들고 있지.”','바람이 네 이름을 부르려다 첫 음절에서 부서진다.'],
 ['망원경 속에서 붉은 편지가 바다 위를 날아간다. 그것은 섬 바깥으로 나가지 못하고 등대 주위를 계속 돈다.','이솔은 이 섬이 지도가 아니라 순간이라고 말한다. 11시 47분, 네 의식이 끊어지기 직전의 1분이 7년만큼 늘어난 곳.','그러면 섬사람들은 유령이 아니라 기억이고, 너 역시 기억일 가능성이 있다.'],
 ['풍향계를 바로 돌리자 바람이 7년 만에 미래 쪽에서 분다. 소금 냄새 사이로 자동차와 커피, 낯선 도시의 냄새가 난다.','망원경 너머 라온이 어른이 되어 해안에 서 있다. 그는 네 사진을 들고 있으나 슬퍼 보이지만은 않는다.','살아남은 사람의 삶이 계속되는 것은 죽은 사람을 배신하는 일이 아니다.'],
 ['이솔은 사실 네 배의 선장이었다. 그는 등대가 꺼진 것을 알고도 항로를 바꾸지 않았다. 판단을 미룬 사이 네가 조타륜을 잡았다.','너는 그를 탓하기 위해 섬에 남겨두었지만, 세월이 지나며 그의 얼굴조차 잊어 노인으로 만들어버렸다.','그는 용서를 구하지 않는다. 다만 책임은 나눌 수 있어도 죽음은 네 잘못이 아니라고 말한다.'],
 ['절벽 위에서 폭풍의 전체 모습이 보인다. 등대 빛이 폭풍을 부른 게 아니다. 너의 기억이 원인과 결과를 이어 붙였을 뿐이다.','세상에는 이유 없는 파도가 있고, 누구의 잘못도 아닌 상실이 있다. 그 사실이 가장 견디기 어려워 너는 자신을 범인으로 만들었다.','이솔은 망원경을 바다에 던진다. “이제 직접 봐.” 수평선은 처음으로 하나뿐이다.'],
 ['바람이 잦아들고 풍향계가 멈춘다. 이솔은 내일의 날씨를 처음 예보한다. “맑음. 단, 여기에는 내일이 없겠지.”','그의 몸이 새 떼처럼 흩어진다. 새들은 바다가 아니라 육지 쪽으로 날아간다.','절벽 아래 빈 배가 부두에 닿는 것이 보인다. 마지막 선택의 시간이 가까워진다.']
 ],
 lighthouse:[
 ['등대 문은 네 손바닥에 맞춰 열린다. 내부 벽에는 셀 수 없이 많은 손톱자국이 원을 그린다.','빛을 켜자 바다에서 답신이 온다. 말이 아니라 심장처럼 규칙적인 파형. 누군가 아직 이 섬을 기억하고 있다.','계단 맨 위에는 네 이름 없는 명찰이 놓여 있다. 뒷면에 “마지막 당직, 미라 벨.”'],
 ['렌즈 안쪽에 작은 금이 있다. 금 사이로 보면 등대 내부가 배의 조타실로 겹친다.','종의 답신을 신호로 바꾸면 한 문장이 된다. “언니, 나는 살았어.” 라온의 목소리다. 7년 전이 아니라 오늘의 목소리.','등대는 구조 신호를 보내는 기계가 아니다. 살아 있는 세계의 기억을 받아 이 섬에 비추는 기계다.'],
 ['붉은 편지를 렌즈 앞에 대면 숨은 잉크가 떠오른다. “등대를 믿지 마. 등대는 내가 만든 거니까.”','너는 죽는 순간 어머니의 엽서, 배의 경광등, 해안의 불빛을 하나로 엮어 이 등대를 만들었다. 돌아갈 길을 밝히기 위해서.','하지만 돌아갈 몸은 없었다. 빛은 길 대신 섬을 만들었다.'],
 ['계단이 아래가 아니라 과거로 이어진다. 한 층마다 폭풍의 10초가 반복된다. 올라갈수록 네가 했던 선택이 선명해진다.','렌즈는 진실을 비추지 않는다. 가장 오래 바라본 생각을 진실처럼 키운다. 너는 7년 동안 “내가 침몰시켰다”는 생각만 비췄다.','오늘 신호에는 다른 문장을 실어 보낸다. “나는 그들을 살렸다.”'],
 ['등대 불빛 속에서 네 몸이 투명해진다. 피부 안에 피 대신 파도와 별이 흐른다.','세이렌 섬은 실제 장소가 아니다. 너는 미라의 영혼조차 아니다. 죽는 순간 남긴 전기 신호와 살아남은 이들의 기억이 만든 마지막 메아리다.','그렇다면 느끼는 슬픔은 가짜일까? 렌즈는 대답하지 않는다. 빛은 존재의 허가를 필요로 하지 않는다.'],
 ['폭풍이 렌즈를 깨뜨린다. 바깥의 섬이 조각마다 다른 모습으로 갈라진다. 죄의 섬, 영웅의 섬, 평범한 여자의 섬.','너는 조각을 하나씩 맞춘다. 어느 하나도 완전한 진실이 아니다. 모두 합쳐야 미라가 된다. 두려웠고, 실수했고, 사랑했고, 끝내 선택한 사람.','마지막 조각을 끼우자 등대 불이 새벽보다 밝게 타오른다.'],
 ['등대 꼭대기에서 모두가 기다린다. 로웬, 아델, 노아, 마레, 이솔. 기억으로 태어났지만 함께 보낸 일주일은 누구의 과거에도 없던 진짜 시간이다.','빛을 끄면 섬과 너는 사라지고 살아 있는 이들의 기억은 마침내 아픔에서 풀려난다. 빛을 지키면 섬은 남지만 모두 첫째 날을 다시 산다.','세 번째 길도 있다. 등대의 빛을 바다로 보내지 않고 하늘로 돌리는 것. 섬은 사라지지만 이야기는 별빛처럼 누구에게나 닿을 것이다.']
 ]
};
/* LEGACY ENGINE (kept for comparison during the director's-cut migration)
const intros={harbor:'부두의 밧줄은 오늘도 무언가를 기다린다.',village:'창문마다 말하지 못한 하루가 고여 있다.',orchard:'유리 열매 안에서 잊힌 계절이 반짝인다.',chapel:'물속의 종이 네 심장과 같은 박자로 운다.',cliff:'바람은 언제나 진실의 반대쪽에서도 분다.',lighthouse:'빛은 길을 보여주기도, 그림자를 만들기도 한다.'};
let S={day:0,visited:{},current:'harbor',clues:[],memories:[],people:[],truth:0,mercy:0,seconds:0,puzzleDone:{},ending:null};
let pages=[],pageIndex=0,typing=false,timer=null,lastTick=Date.now(),moving=false;

function renderMap(){
 const nav=$('#locations'); nav.innerHTML='';
 Object.entries(locs).forEach(([id,l])=>{const b=document.createElement('button'); b.className='location'; b.dataset.id=id;b.dataset.name=l.name;b.innerHTML=`<span class="icon">${l.icon}</span>`;
  const key=`${S.day}-${id}`, req=days[S.day]?.required.includes(id); if(S.visited[key])b.classList.add('done'); else if(req)b.classList.add('available');
  b.addEventListener('click',()=>travel(id)); nav.appendChild(b);
 }); updateHud(); moveTraveler(false);
}
function updateHud(){const d=days[Math.min(S.day,6)];$('#dayLabel').textContent=d.name;$('#objective').textContent=d.obj;$('#moodLine').textContent=d.weather;$('#locationLabel').textContent=locs[S.current].name;$('#clueCount').textContent=`${S.clues.length}/42`;}
function moveTraveler(anim=true){const l=locs[S.current],t=$('#traveler');if(!anim)t.style.transition='none';t.style.left=l.x+'%';t.style.top=l.y+'%';requestAnimationFrame(()=>t.style.transition='');}
function travel(id){if(moving||$('#storyDialog').open||$('#puzzleDialog').open)return;if(id===S.current){interact();return} moving=true;S.current=id;moveTraveler(true);updateHud();setTimeout(()=>{moving=false;interact()},document.body.classList.contains('reduce-motion')?20:1900)}
function interact(){
 const key=`${S.day}-${S.current}`;
 if(S.visited[key]){showStory(people[S.current][0],locs[S.current].name,[intros[S.current],'오늘 이곳에서 찾을 것은 이미 찾았다. 그래도 풍경은 조금 달라 보인다. 기억은 되풀이되어도 바라보는 사람은 변하기 때문이다.']);return}
 const seq=story[S.current][S.day]; if(!seq)return;
 S.visited[key]=true; if(!S.people.includes(S.current))S.people.push(S.current);
 S.clues.push({day:S.day,title:`${locs[S.current].name}의 기록`,text:seq[seq.length-1]});
 if(S.current==='orchard'||S.current==='chapel')S.memories.push({title:`유리 조각 ${S.memories.length+1}`,text:seq[1]});
 showStory(people[S.current][0],locs[S.current].name,[intros[S.current],...seq],()=>{
   if(S.current==='lighthouse'&&!S.puzzleDone[S.day])openPuzzle(); else afterVisit();
 }); renderMap(); autosave();
}
function showStory(speaker,title,texts,onDone,choice){pages=texts;pageIndex=0;$('#speaker').textContent=speaker;$('#storyTitle').textContent=title;$('#choices').innerHTML='';$('#nextStory').style.display='inline-block';$('#storyDialog').showModal();$('#nextStory').onclick=()=>{
 if(typing){finishType();return} pageIndex++; if(pageIndex<pages.length)typePage(pages[pageIndex]); else if(choice){showChoices(choice,onDone)} else {$('#storyDialog').close();onDone?.()}
 }; typePage(pages[0]);}
function typePage(text){clearInterval(timer);typing=true;const el=$('#storyText');el.textContent='';let i=0,speed=+$('#textSpeed').value;if(!speed){el.textContent=text;typing=false;return}timer=setInterval(()=>{el.textContent+=text[i++]||'';if(i>=text.length){clearInterval(timer);typing=false}},speed)}
function finishType(){clearInterval(timer);$('#storyText').textContent=pages[pageIndex];typing=false}
function showChoices(opts,onDone){$('#nextStory').style.display='none';const c=$('#choices');c.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.textContent=o.label;b.onclick=()=>{S[o.stat]++;$('#storyDialog').close();toast(o.reply);if(o.end)ending(o.end);else onDone?.()};c.appendChild(b)})}
function afterVisit(){
 const d=days[S.day],all=d.required.every(id=>S.visited[`${S.day}-${id}`])&&S.puzzleDone[S.day];
 if(all){if(S.day===6){finalChoice();return}showStory('미라의 항해일지',`${d.name}의 끝`,['밤이 등대 아래로 접힌다. 오늘 모은 기억들이 유리 조각처럼 서로의 모서리를 맞춘다.',dayReflections[S.day]],()=>{S.day++;S.current='harbor';renderMap();autosave();toast('새로운 날이 밝았습니다')},reflectionChoices[S.day]);}
}
const dayReflections=[
 '사람들은 모두 무언가를 숨기고 있다. 그러나 숨김은 언제나 기만은 아니다. 너무 날카로운 진실을 맨손으로 건네지 않으려는 다정함일 수도 있다.',
 '11시 47분. 멈춘 시각은 사고가 난 때일까, 내가 마지막으로 나였던 때일까. 종의 답신은 여전히 가슴 안에서 울린다.',
 '나는 나에게 편지를 썼다. 기억해 달라고. 죄가 아니라 선택을, 죽음이 아니라 그 이전의 삶을.',
 '기억은 등대 렌즈 같다. 오래 비춘 생각을 크게 만든다. 내가 범인이라는 생각도, 내가 영웅이라는 생각도 모두 나의 일부일 뿐 전부는 아니다.',
 '나는 미라 벨의 메아리다. 그렇다면 이번 주의 나는 누구의 기억에도 없던 새로운 사람일까.',
 '나는 살고 싶었다. 그래서 내 선택은 희생이 아니라 선택이었다. 빼앗긴 죽음 속에서도 마지막 한순간은 내 것이었다.'
];
const reflectionChoices=[
 [{label:'“사람들을 믿어 보겠다.”',stat:'mercy',reply:'다정함이 섬에 작은 온기를 남겼다.'},{label:'“모든 진실을 밝혀내겠다.”',stat:'truth',reply:'결심이 등대의 렌즈를 맑게 했다.'}],
 [{label:'종소리에 답한다.',stat:'mercy',reply:'멀리서 네 이름의 첫 음절이 들렸다.'},{label:'멈춘 시각을 기록한다.',stat:'truth',reply:'11시 47분 아래에 밑줄을 그었다.'}],
 [{label:'편지를 간직한다.',stat:'mercy',reply:'붉은 봉투가 심장 가까이 따뜻해졌다.'},{label:'숨은 문장을 해독한다.',stat:'truth',reply:'잉크 아래의 진실이 모습을 드러냈다.'}],
 [{label:'살아남은 이들의 내일을 본다.',stat:'mercy',reply:'수평선 너머에 아침이 이어졌다.'},{label:'폭풍의 원인을 끝까지 좇는다.',stat:'truth',reply:'등대 빛의 그림자가 짧아졌다.'}],
 [{label:'메아리도 사람이라고 믿는다.',stat:'mercy',reply:'심장이 없는 가슴에서 박동이 느껴졌다.'},{label:'내가 무엇인지 받아들인다.',stat:'truth',reply:'거울 속 네 모습이 같은 순간에 움직였다.'}],
 [{label:'살고 싶었던 나를 안아준다.',stat:'mercy',reply:'폭풍 속 비명이 잠시 잦아들었다.'},{label:'일어난 모든 일을 기억한다.',stat:'truth',reply:'깨진 렌즈의 조각들이 하나로 모였다.'}]
];
function openPuzzle(){const d=days[S.day];$('#freq').value=6;$('#phase').value=5;$('#puzzleHint').textContent=`힌트: ${S.day%2?'종소리는 높은 곳에서 낮은 곳으로 가라앉는다.':'파도 사이의 숨은 박자를 찾아라.'}`;updateWave();$('#puzzleDialog').showModal()}
function updateWave(){const f=+$('#freq').value,p=+$('#phase').value,d=days[S.day];$('#freqOut').value=f;$('#phaseOut').value=p;$('#userWave').style.setProperty('--scale',(.45+f/12).toFixed(2));$('#userWave').style.setProperty('--shift',(p-d.phase)*7+'px')}
$('#freq').oninput=$('#phase').oninput=updateWave;
$('#checkTune').onclick=()=>{const d=days[S.day],dist=Math.abs($('#freq').value-d.freq)+Math.abs($('#phase').value-d.phase);if(dist<=1){solvePuzzle()}else $('#tunerFeedback').textContent=dist<5?'거의 맞았다. 두 파형이 서로를 스치고 있다.':'잡음이 거세다. 다른 기억의 주파수다.'};
$('#puzzleAssist').onclick=()=>{$('#freq').value=days[S.day].freq;$('#phase').value=days[S.day].phase;updateWave();setTimeout(solvePuzzle,300)};
function solvePuzzle(){S.puzzleDone[S.day]=true;$('#puzzleDialog').close();toast('신호가 바다 너머에 닿았습니다');autosave();afterVisit()}
function finalChoice(){showStory('세이렌 등대','마지막 빛',['렌즈 손잡이에 손을 얹는다. 어떤 선택도 미라를 되살리지는 못한다. 하지만 어떤 의미로 기억될지는 정할 수 있다.','바다는 고요하다. 처음으로 네 대답을 재촉하지 않는다.'],()=>{},[
 {label:'빛을 끈다 — 모두를 놓아준다',stat:'mercy',reply:'해방의 엔딩',end:'release'},
 {label:'빛을 하늘로 돌린다 — 이야기가 된다',stat:'truth',reply:'별자리의 엔딩',end:'stars'},
 {label:'빛을 지킨다 — 한 번 더 함께한다',stat:'mercy',reply:'영원의 엔딩',end:'remain'}
 ]);}
function ending(type){S.ending=type;autosave();const e={
 release:['놓아주는 빛','너는 불을 끈다. 어둠은 생각보다 따뜻하다. 섬사람들이 하나씩 새벽 속으로 걸어간다. 누구도 뒤돌아보지 않지만, 모두 한 번씩 네 손을 잡는다.\n\n마지막으로 섬이 사라진다. 살아 있는 세계에서 라온은 오래 간직한 붉은 외투를 바다에 띄운다. 이유 없이 마음이 가벼워진 그는 집으로 돌아간다.\n\n미라 벨은 잊히지 않았다. 다만 더 이상 마지막 순간에만 머물지 않는다.'],
 stars:['별자리가 된 항로','너는 렌즈를 하늘로 돌린다. 빛은 구름을 뚫고 오래전에 출발한 별빛과 만난다. 섬사람들은 작은 점이 되어 서로를 잇고, 세이렌호의 항로는 새로운 별자리가 된다.\n\n훗날 길 잃은 이들은 이름 모를 그 별을 보고 방향을 찾는다. 그들은 미라를 모르지만 미라의 선택 안에서 살아간다.\n\n이야기는 기억보다 멀리 간다.'],
 remain:['한 번 더, 아름다운 밤','너는 빛을 지킨다. 새벽이 뒤로 물러나고 섬은 첫째 날의 푸른 저녁으로 돌아간다. 모두의 기억은 지워지지만, 손바닥에는 함께 보낸 일주일의 온기가 남는다.\n\n부두에서 로웬이 처음 보는 얼굴로 묻는다. “육지에서 왔소?”\n\n이번에는 네가 먼저 웃는다. “아니요. 하지만 함께 떠날 수는 있어요.”']};
 showStory('FIN',e[type][0],[e[type][1],`플레이 시간 ${formatTime(S.seconds)} · 발견한 기록 ${S.clues.length}/42 · 유리 조각 ${S.memories.length}/14`],()=>{showScreen('title')});}

function openJournal(tab='notes'){$$('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));const out=$('#journalContent');let arr;if(tab==='notes')arr=S.clues;else if(tab==='memories')arr=S.memories;else arr=S.people.map(id=>({title:`${people[id][0]} · ${people[id][1]}`,text:people[id][2]}));out.innerHTML=arr.length?arr.map((e,i)=>`<article class="entry"><p class="speaker">${String(i+1).padStart(2,'0')}</p><h3>${e.title}</h3><p>${e.text}</p></article>`).join(''):'<p>아직 기록된 것이 없다.</p>';$('#journalDialog').showModal()}
$$('.tabs button').forEach(b=>b.onclick=()=>openJournal(b.dataset.tab));$$('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
function autosave(){localStorage.setItem(SAVE,JSON.stringify(S))}function load(){try{const s=JSON.parse(localStorage.getItem(SAVE));if(s)S={...S,...s}}catch{}}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2400)}
function formatTime(s){return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function showScreen(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(id==='title'){document.body.classList.remove('story-focus');audio?.setStory?.({speaker:'',title:'',choiceMode:false});if(audio?.deactivate)void audio.deactivate();else void audio?.suspend?.()}}
function begin(fresh){if(fresh){localStorage.removeItem(SAVE);S={day:0,visited:{},current:'harbor',clues:[],memories:[],people:[],truth:0,mercy:0,seconds:0,puzzleDone:{},ending:null}}else load();showScreen('game');renderMap();if(fresh)showStory('미라','프롤로그',['눈을 뜨자 바다는 별보다 어두웠다. 네가 타고 온 배는 없고, 손에는 젖지 않은 성냥 한 갑만 남아 있다.','절벽 위 등대가 세 번 깜빡인다. 구조 요청이 아니라 너를 알아본 사람의 눈짓처럼.','주머니 속 쪽지에는 네 필체로 한 문장만 적혀 있다. “일곱 번째 새벽 전에 불을 꺼.”'],()=>{})}
$('#newGame').onclick=()=>begin(true);$('#continueGame').onclick=()=>begin(false);$('#journalBtn').onclick=()=>openJournal();$('#menuBtn').onclick=()=>$('#menuDialog').showModal();$('#resume').onclick=()=>$('#menuDialog').close();$('#save').onclick=()=>{autosave();toast('항해일지를 저장했습니다')};$('#toTitle').onclick=()=>{$('#menuDialog').close();showScreen('title')};
$('#openSettings').onclick=$('#settings').onclick=()=>$('#settingsDialog').showModal();
['largeText','reduceMotion','highContrast'].forEach(id=>{$('#'+id).onchange=e=>{document.body.classList.toggle(id.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),e.target.checked);localStorage.setItem('setting-'+id,e.target.checked)}});
setInterval(()=>{if($('#game').classList.contains('active')&&!$('#menuDialog').open){S.seconds++;$('#playTime').textContent=formatTime(S.seconds);if(S.seconds%30===0)autosave()}},1000);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#storyDialog').open||$('#puzzleDialog').open)return;$('#menuDialog').open?$('#menuDialog').close():$('#menuDialog').showModal();return}if(e.key.toLowerCase()==='j'){openJournal();return}if(e.key.toLowerCase()==='e'){interact();return}const ids=Object.keys(locs),i=ids.indexOf(S.current);if(['ArrowRight','ArrowDown','d','s'].includes(e.key))travel(ids[Math.min(ids.length-1,i+1)]);if(['ArrowLeft','ArrowUp','a','w'].includes(e.key))travel(ids[Math.max(0,i-1)])});
const has=!!localStorage.getItem(SAVE);$('#continueGame').disabled=!has;['largeText','reduceMotion','highContrast'].forEach(id=>{const v=localStorage.getItem('setting-'+id)==='true';$('#'+id).checked=v;document.body.classList.toggle(id.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v)});
*/

// DIRECTOR'S CUT ENGINE
const SAVE_V2='last-light-save-v2';
const intros={harbor:'부두의 밧줄은 오늘도 무언가를 기다린다.',village:'창문마다 말하지 못한 하루가 고여 있다.',orchard:'유리 열매 안에서 잊힌 계절이 반짝인다.',chapel:'물속의 종이 네 심장과 같은 박자로 운다.',cliff:'바람은 언제나 진실의 반대쪽에서도 분다.',lighthouse:'빛은 길을 보여주기도, 그림자를 만들기도 한다.'};
const AFTERIMAGE_GOAL=14,AFTERIMAGE_DAILY_LIMIT=2;
const veteranBranchReactions=window.VETERAN_BRANCH_REACTIONS||{};
const veteranEndingCopy=window.VETERAN_ENDINGS||null;
const navigationLevels=window.NAVIGATION_LEVELS?.levels||[];
const nightConversations=window.NIGHT_CONVERSATIONS||[];
const navigationEncounters=window.NAVIGATION_ENCOUNTERS||[];
const veteranClimax=window.VETERAN_CLIMAX||[];
const fiveStarUpgrade=window.FIVE_STAR_UPGRADE||{ripples:{},broadcast:[],stormOutcomes:{}};
const consequenceRipples=fiveStarUpgrade.ripples||{};
const finalBroadcastStages=fiveStarUpgrade.broadcast||[];
const stormOutcomes=fiveStarUpgrade.stormOutcomes||{};
const portraitBySpeaker={미라:'portrait-mira-v2.png',로웬:'portrait-harbor-v2.png',아델:'portrait-village-v2.png',노아:'portrait-orchard-v2.png',마레:'portrait-chapel-v2.png',이솔:'portrait-cliff-v2.png'};
const afterimageOpeners=['고르지 않은 물건도 네가 돌아보기를 조용히 기다렸다.','안개가 걷힌 자리에 첫 선택과 다른 온도의 장면이 남는다.','같은 기억의 뒷면에는 누구도 정답이라 부르지 않은 목소리가 있다.','붙잡지 않은 관점이 파도에 닳으면서도 끝내 사라지지 않았다.','네 이름을 아는 섬은 네가 외면한 손길까지 정확히 기억한다.','폭풍은 한 선택만 남기려 하지만 사물들은 서로 다른 순간을 증언한다.','새벽 앞에서 마지막 잔상은 답보다 놓아줄 질문을 건넨다.'];
const bondFarewells={로웬:'로웬은 마지막 매듭을 네 손목이 아니라 빈 말뚝에 묶는다. “기다리는 버릇도 언젠가는 풀어야 하오.” 그는 늘 치워 두던 두 번째 커피잔을 네게 건네고, 이번에는 네가 다 마실 때까지 먼저 돌아서지 않는다.',아델:'아델은 수취인 칸이 빈 봉투를 내민다. 안에는 네가 밤마다 물었던 질문들이 적혀 있고 답은 없다. “배달은 도착시키는 일이지, 대신 읽는 일이 아니니까요.” 네가 봉투를 접자 그녀는 처음으로 반송 도장을 찍지 않는다.',노아:'노아는 금 간 열매 하나를 흙에 묻고 네 손에 씨처럼 작은 유리 조각을 쥐여 준다. “똑같이 자라진 않을 거야. 그게 실패라는 뜻도 아니고.” 뒤돌아선 아이가 울었는지는 보이지 않지만, 과수원에는 전에 없던 새 잎 냄새가 난다.',마레:'마레는 종을 울리는 대신 네 이마에 젖은 손을 얹는다. 기도문도 용서도 강요하지 않고 “네가 살고 싶었다는 문장까지 가져가”라고 말한다. 네가 계단을 오르는 동안 종은 한 번도 울리지 않지만 발밑에서 오래 진동한다.',이솔:'이솔은 내일의 날씨가 적힌 봉투를 끝내 열지 않고 풍향계에서 낡은 깃을 떼어 준다. “예보는 돌아오겠다는 약속이 아니야. 그래도 나갈 방향은 정할 수 있지.” 바람은 처음으로 등대가 아닌 육지 쪽에서 분다.'};
(window.VETERAN_DELAYED_REWRITES||[]).forEach(r=>{
 const line=story[r.loc]?.[r.dayIndex]?.[r.sentence-1];
 if(line===r.from)story[r.loc][r.dayIndex][r.sentence-1]=r.to;
});
const branchReactions={
 harbor:{truth:'로웬은 네가 장부부터 펼치는 모습을 보고 숫자 하나를 가리지 않는다. “이번에는 끝까지 읽겠군.”',mercy:'로웬은 장부보다 먼저 네게 마른 수건을 건넨다. 전에는 없던 행동이다.',balanced:'너는 밧줄의 매듭과 그것을 묶은 손을 함께 본다. 로웬이 말없이 다음 장을 편다.'},
 village:{truth:'아델은 봉투의 소인과 필체가 다른 것을 네가 알아챘다고 인정한다. 오늘은 주소를 숨기지 않는다.',mercy:'아델은 배달 규칙을 어기고 네 대답을 기다린다. 우편보다 사람이 늦어도 된다고 배운 표정이다.',balanced:'너는 편지의 문장과 봉투를 쥔 아델의 떨림을 번갈아 본다. 17번지 문이 반쯤 열린다.'},
 orchard:{truth:'노아는 가장 흐린 열매까지 닦아 둔다. 좋은 기억만 고르지 않을 사람에게 보여줄 준비다.',mercy:'노아는 금 간 열매를 버리지 않고 흙에 눕힌다. “깨진 것도 자라는 데 쓸 수 있어.”',balanced:'너는 열매 속 장면과 그것을 돌보는 노아의 손을 함께 기억한다. 가지에 새 잎 하나가 돋는다.'},
 chapel:{truth:'마레는 기도서 대신 구조 일지를 제단 위에 놓는다. 믿음보다 시각과 숫자로 대답할 차례다.',mercy:'마레는 종을 울리기 전에 네가 준비될 때까지 기다린다. 침묵도 예식의 일부가 된다.',balanced:'너는 벽의 이름을 읽고 그 이름을 만진 사람도 바라본다. 종이 울리지 않고 낮게 진동한다.'},
 cliff:{truth:'이솔은 망원경의 배율을 낮춰 왜곡을 줄인다. 이번에는 예보와 관측을 구분해 적는다.',mercy:'이솔은 바람이 아니라 네 숨이 고르게 될 때까지 관측을 멈춘다. 노인의 어깨가 조금 내려간다.',balanced:'너는 풍향계의 방향과 그것을 오래 지킨 이솔의 등을 함께 본다. 바람이 두 갈래로 분다.'},
 lighthouse:{truth:'렌즈는 네가 감추지 않은 모순을 받아 더 투명해진다. 금마다 다른 장면이 정확히 맺힌다.',mercy:'등대 불은 바다보다 계단 아래 사람들을 먼저 비춘다. 빛의 목적이 구조만은 아니었다.',balanced:'너는 빛이 드러내는 것과 따뜻하게 하는 것을 함께 둔다. 렌즈 속 두 파형이 한 번 포개진다.'}
};
const routes=[
 ['harbor','village','orchard','chapel','cliff','lighthouse'],
 ['harbor','cliff','chapel','village','orchard','lighthouse'],
 ['village','harbor','orchard','chapel','cliff','lighthouse'],
 ['harbor','cliff','orchard','village','chapel','lighthouse'],
 ['harbor','village','orchard','cliff','chapel','lighthouse'],
 ['harbor','village','orchard','chapel','cliff','lighthouse'],
 ['harbor','village','orchard','chapel','cliff','lighthouse']
];
const routeTiers=[
 [['harbor'],['village','orchard'],['chapel','cliff'],['lighthouse']],
 [['harbor'],['cliff','chapel'],['village','orchard'],['lighthouse']],
 [['village'],['harbor','orchard'],['chapel','cliff'],['lighthouse']],
 [['harbor'],['cliff','orchard'],['village','chapel'],['lighthouse']],
 [['harbor'],['village'],['orchard','cliff'],['chapel'],['lighthouse']],
 [['harbor'],['village','orchard'],['chapel','cliff'],['lighthouse']],
 [['harbor'],['village','orchard'],['chapel','cliff'],['lighthouse']]
];
const echoes={
 harbor:{labels:['검은 밧줄을 당긴다','붉은 우편함을 연다'],a:[
  '밧줄 끝의 무게가 잠깐 네 쪽으로 움직인다. 물 아래 누군가도 같은 속도로 당기고 있다. 손을 놓자 로웬이 처음으로 안도한다.',
  '손바닥에 소금 자국이 숫자 27을 만든다. 장부의 승선 인원과 같지만, 구조 기록의 합계와는 하나가 어긋난다.',
  '밧줄에 붉은 실 한 올이 묶여 있다. 네 선실 커튼에서 뜯긴 실이다. 편지가 이 길을 따라 바다에서 올라온 것처럼 보인다.',
  '밧줄을 잡은 순간 파도가 거꾸로 흐른다. 끝에서 조타륜의 진동이 전해지고, 네 손이 먼저 항로를 기억한다.',
  '구명조끼의 매듭은 네가 라온에게 가르친 방식이다. 구조자는 배 밖에서 온 사람이 아니라 배 안에 있었다.',
  '매듭을 풀 때마다 얼어 있던 갑판의 한 사람이 움직인다. 기억은 붙잡는 힘보다 놓는 순서를 요구한다.',
  '마지막 매듭 안에는 아무것도 없다. 기다림이 물건을 필요로 하지 않게 된 것이다.'
 ],b:[
  '우편함 안에는 마른 성냥 한 개와 “불을 켜지 마”라는 쪽지가 있다. 잉크가 아직 따뜻하다. 섬은 네 도착을 미리 알고 있었다.',
  '청동 열쇠에 17이라는 숫자가 새겨져 있다. 마을에는 없는 주소다. 아델이 멀리서 그 열쇠를 보고 우편가방을 닫는다.',
  '붉은 봉투의 풀칠에서는 어머니의 비누 냄새가 난다. 미라는 유서를 쓰면서도 집에 보낼 세탁물을 생각했을 것이다.',
  '우편함 속 물은 쏟아지지 않고 천장처럼 고여 있다. 그 표면에 폭풍 다음 날의 맑은 하늘이 비친다.',
  '라온이 수십 년 뒤 보낸 답장이 들어 있다. “언니가 구한 건 제 한 번의 삶이 아니라, 그 뒤의 모든 날이었어요.”',
  '편지를 꺼내자 얼어 있던 승객 하나가 숨을 쉰다. 이름을 읽는 일은 과거를 고치는 대신 그 사람에게 다음 장면을 준다.',
  '우편함은 비어 있다. 아델은 빈 곳도 배달 완료의 한 형태라고 말한다.'
 ]},
 village:{labels:['17번지 손잡이를 돌린다','식탁의 빈 의자에 앉는다'],a:[
  '벽뿐인 곳에서 문이 열린다. 안쪽은 네 선실이지만 침대에는 젖은 사람 대신 가지런히 개킨 붉은 외투가 놓여 있다.',
  '열쇠가 맞는다. 방 안 시계만 11시 48분을 가리킨다. 사고 뒤에도 시간이 한 번은 더 움직였다는 증거다.',
  '책상 서랍에서 붉은 편지의 먹지를 찾는다. 눌린 자국을 비스듬히 보면 “살아남은 아이에게”라는 첫 수신인이 보인다.',
  '시계를 앞으로 돌리자 방의 먼지가 일곱 해만큼 쌓인다. 기억 밖의 시간도 정말 흘렀다.',
  '문 안쪽에 살아남은 이들이 보낸 사진들이 붙어 있다. 섬은 그들의 얼굴을 지우려 했지만 웃음 모양까지 지우지는 못했다.',
  '문을 열 때마다 다른 승객의 다음 날이 이어진다. 네가 보지 못한 미래가 복도보다 길다.',
  '17번지는 사라지고 손잡이만 남는다. 아델은 문보다 열려고 한 손이 중요했다고 말한다.'
 ],b:[
  '맞은편 접시에 수프 한 숟갈이 남아 있다. 평범하게 식사를 끝내고 싶었던 사람의 흔적이 영웅담보다 오래 마음에 걸린다.',
  '의자 아래 라온의 젖은 구두가 있다. 한 짝은 아이 크기, 다른 한 짝은 어른 크기다. 살아남은 시간이 사물에 겹쳤다.',
  '식탁보 아래에 승객들이 돌려 쓴 짧은 감사가 있다. 누구도 네 죽음을 요구하지 않았고, 누구도 네 삶을 가볍게 여기지 않았다.',
  '촛불을 끄자 창문 밖에 폭풍 다음 날의 아침 식사가 보인다. 빈자리 하나를 두고 사람들은 오래 침묵한다.',
  '아델이 맞은편에 앉아 처음으로 배달이 아닌 이야기를 한다. 그는 실제 집배원이 아니라 네가 편지를 기다리며 만든 목소리다.',
  '승객들의 이름을 하나 부를 때마다 식기가 따뜻해진다. 추모는 죽은 순간이 아니라 살았던 습관을 기억하는 일이다.',
  '빈 의자에 햇빛이 앉는다. 누군가 없어도 자리는 다음 사람을 밀어내지 않는다.'
 ]},
 orchard:{labels:['가장 어두운 열매를 딴다','아직 빈 열매를 고른다'],a:[
  '열매 속에서 네가 라온에게 별자리 매듭을 가르친다. 죽기 전날에도 너는 웃었고, 그 사실은 비극의 일부가 되기를 거부한다.',
  '어머니의 엽서가 접히며 작은 배가 된다. “빛을 보라”는 말은 등대로 가라는 명령이 아니라 혼자가 아니라는 약속이었다.',
  '편지를 묻었던 손이 보인다. 네 손은 죄인의 손이 아니라 답장을 기다리던 사람의 손처럼 떨린다.',
  '라온에게 조끼를 입히며 “수영을 잘한다”고 말하는 네 목소리가 들린다. 두려움이 거짓말보다 먼저 들린다.',
  '열매 안의 노아는 자라지 않는다. 가능성이 상실되었다고 해서 사랑까지 가짜가 되는 것은 아니다.',
  '가장 아픈 장면을 끝까지 본다. 너는 죽고 싶지 않다고 소리친다. 그 외침 때문에 뒤의 선택이 더 선명해진다.',
  '어두운 열매가 흙이 되어 손가락 사이로 빠진다. 기억은 사라지지 않고 다른 것이 자랄 자리를 만든다.'
 ],b:[
  '빈 유리 안에는 장면 대신 네 숨소리만 맺힌다. 노아는 미래가 아직 내용을 정하지 않았기 때문에 가장 무겁다고 한다.',
  '열매에 오늘의 네 모습이 비친다. 과거에 없던 일주일이므로, 기억으로 태어난 너도 새로운 기억을 만들 수 있다.',
  '빈 열매에 붉은 편지를 비추자 라온의 교실이 생긴다. 아이들은 네 이름을 모르지만 구조 매듭을 배운다.',
  '열매 안에서 시계가 11시 48분으로 넘어간다. 네가 없는 시간도 네 선택을 품은 채 계속되었다.',
  '노아가 씨앗을 심는 미래가 잠깐 보인다. 실제로 일어나지 않아도 그 장면이 너를 더 다정하게 만든다.',
  '네가 살아남았다면 했을 사소한 일들이 비친다. 빨래, 늦잠, 언니와의 말다툼. 위대한 희생보다 잃기 아까운 것들이다.',
  '열매에 첫 초록 잎이 돋는다. 비어 있음은 결핍이 아니라 아직 선택되지 않은 색이었다.'
 ]},
 chapel:{labels:['종을 한 번 울린다','벽의 마지막 이름을 만진다'],a:[
  '종소리가 물속으로 내려가 섬 전체의 접시와 창문을 떨게 한다. 죽은 이를 위한 소리라기보다 잠든 기억을 깨우는 소리다.',
  '짧게, 길게, 짧게. 종이 “살아 있다”는 답신을 돌려준다. 누군가는 조난 신호를 들었고, 대답했다.',
  '편지의 숨은 문장이 종 울림 사이에서 완성된다. “용서해”가 아니라 “정확히 기억해.”',
  '스물여섯 번의 작은 메아리가 돌아온다. 마지막 한 번의 침묵은 실패가 아니라 미라의 자리다.',
  '종소리가 마레의 얼굴을 언니의 얼굴로 겹친다. 살아 있는 원본과 섬의 기억은 서로 다른 시간을 갖는다.',
  '폭풍의 비명 뒤에 묻힌 “사랑해”가 이번에는 끊기지 않는다. 너는 대답하지 못했던 대답을 한다.',
  '세 번째 울림은 떠난 이와 남은 이 사이에 잠시 존재했던 모두를 위한 것이다.'
 ],b:[
  '손가락 아래 글자가 처음부터 선명하다. 이름을 지운 것은 바닷물이 아니라 네 시선이었다.',
  '이름 옆에 작은 홈이 스물여섯 개 있다. 생존자가 해마다 한 번씩 찾아와 남긴 흔적이다.',
  '미라 벨 아래에 다른 필체로 “받았음”이라고 적혀 있다. 아델의 도장보다 오래된 언니의 글씨다.',
  '이름을 따라 읽자 바닥의 물이 천장으로 오른다. 중력보다 죄책감이 먼저 뒤집혔던 것이다.',
  '마레나 벨이라는 이름이 미라 옆에 나타난다. 죽은 이의 명단이 아니라 그날 서로를 잃은 사람의 명단이었다.',
  '두 이름 사이의 금이 문처럼 열린다. 의무실에서 언니의 손을 놓던 장면이 이번에는 끝까지 이어진다.',
  '네 이름이 빛으로 떠오르지만 사라지지 않는다. 놓아준다는 것은 지우는 일이 아니다.'
 ]},
 cliff:{labels:['풍향계를 바로 돌린다','망원경 없이 수평선을 본다'],a:[
  '바람이 처음으로 바다 쪽을 가리킨다. 이솔의 일지에는 폭풍의 원인이 빈칸이다. 원인 없는 상실을 견디기 어려워 누군가를 범인으로 만들었다.',
  '47초마다 멈추던 파도가 한 박자 더 간다. 섬은 고장 난 시계가 아니라 멈추기를 선택한 기억이었다.',
  '붉은 편지가 등대 주위를 돌다 네 손으로 돌아온다. 섬 밖의 수신인은 이미 답장을 보냈다.',
  '미래 쪽 바람에서 커피와 자동차 냄새가 난다. 살아 있는 세계는 추모만 하며 살지 않았다.',
  '이솔의 선장 제복 단추가 보인다. 그는 책임을 피했지만 네 죽음을 명령하지는 않았다. 잘못과 원인을 같은 말로 부를 수 없다.',
  '풍향계를 부러뜨리자 폭풍이 자연 현상으로 돌아간다. 이유가 없다는 사실은 잔인하지만 거짓 범인을 놓아준다.',
  '바람은 내일의 날씨를 남기고 간다. 맑음. 예보를 들을 사람이 없어도 내일은 온다.'
 ],b:[
  '맨눈으로 본 바다는 하나뿐이다. 망원경 아래 매달렸던 두 번째 섬은 네가 진실을 멀리서만 보려 할 때 생긴 그림자였다.',
  '수평선에서 라온의 성인 모습이 잠깐 손을 흔든다. 그는 너를 잊지 않았지만 매일 슬퍼하지도 않았다.',
  '편지는 바다 밖으로 나가지 못한다. 대신 네가 편지 쪽으로 한 걸음 움직인다. 수신인과 발신인의 거리가 사라진다.',
  '미래의 라온이 학생들과 구명 매듭을 연습한다. 추모가 기술이 되어 낯선 사람을 살릴 준비를 한다.',
  '선장의 얼굴은 네 기억이 닳을수록 늙었다. 원망은 상대를 정확히 보존하지도 못했다.',
  '폭풍 전체를 보자 등대 빛과 파도가 우연히 겹친 순간이 보인다. 우연은 설명이 부족한 것이 아니라 설명의 끝일 수 있다.',
  '새 떼가 육지로 향한다. 이솔이 사라진 자리에는 낡은 망원경 대신 맨눈으로 보기 좋은 높이의 돌 하나만 남는다.'
 ]},
 lighthouse:{labels:['렌즈의 금을 들여다본다','마지막 신호에 답한다'],a:[
  '금 사이로 조타실이 보인다. 빛은 구조를 지시한 것이 아니라 네 마지막 시선들이 겹쳐 만들어진 기억의 장치였다.',
  '렌즈 안에서 라온의 현재 목소리가 들린다. 등대는 과거를 송신하는 기계가 아니라 살아 있는 세계의 기억을 수신한다.',
  '붉은 편지의 숨은 잉크가 드러난다. “등대를 믿지 마. 하지만 네가 만든 빛까지 미워하지는 마.”',
  '한 층마다 반복되던 10초가 이번에는 다음 1초로 넘어간다. 조타륜을 돌린 손이 죄가 아니라 선택으로 보인다.',
  '피부 안에 파도와 별이 흐른다. 메아리는 원본이 아니지만, 원본에 없던 일주일을 살아냈다.',
  '깨진 렌즈 조각은 죄인, 영웅, 겁먹은 사람을 각각 비춘다. 하나만 버리면 미라도 온전하지 않다.',
  '마지막 금이 새벽빛을 통과시킨다. 흠집은 빛을 망치지 않고 여러 방향으로 보낸다.'
 ],b:[
  '신호는 심장처럼 두 번 짧게 뛴다. “들었다.” 누군가의 기억이 네 존재를 허락하는 대신 네 말을 끝까지 듣는다.',
  '“언니, 나는 살았어.” 라온의 말 뒤에 교실의 소음과 웃음이 이어진다. 한 문장이 아니라 한 생애가 답신이다.',
  '너는 “기억해 줘” 대신 “살아 줘”를 보낸다. 두 문장의 차이가 섬의 파도를 조금 낮춘다.',
  '“나는 그들을 살렸다.” 신호가 돌아올 때 문장은 “너도 살고 싶었다”로 바뀌어 있다.',
  '살아 있는 세계는 메아리에게 이름을 묻지 않는다. 다만 라온이 오래전 미라에게 배운 박자로 답한다.',
  '너는 신호를 일부러 끊었다 다시 잇는다. 완벽한 기록보다 끊어진 곳을 인정한 이야기가 더 멀리 간다.',
  '마지막 방송에는 결론 대신 모든 사람의 이름과 잠깐의 침묵을 싣는다. 듣는 이가 자신의 의미를 고를 자리다.'
 ]}
};
const deductionData=[
 {q:'승선 인원 27명인데 구조자 1명과 실종자 1명이 같은 시각에 덧써진 이유는?',a:['구조선이 한 명을 기록에서 누락했다','두 항목은 아직 이름이 지워진 같은 한 사람을 가리킨다','섬이 존재하지 않는 승객을 만들었다'],c:1,e:'구조자와 실종자는 같은 한 사람의 두 기록이다. 이름과 그날의 선택은 아직 밝혀지지 않았다.'},
 {q:'종이 보낸 짧게·길게·짧게 신호는 무엇을 뜻하는가?',a:['등대가 폭풍을 부른다는 경고','살아남은 세계가 보낸 “들었다, 살아 있다”는 답신','선장이 항로를 바꾸라는 명령'],c:1,e:'섬은 신호를 보내기만 한 것이 아니다. 7년 동안 살아 있는 이들의 기억을 받아 왔다.'},
 {q:'붉은 편지의 발신인과 “아직 살아 있는 나”가 같은 필압을 남긴 이유는?',a:['선장이 두 사람의 필체를 흉내 냈다','라온이 훗날 과거로 편지를 보냈다','편지가 바깥으로 배달된 것이 아니라 같은 기록 안에서 되돌아왔다'],c:2,e:'편지는 시간을 건넌 답장이 아니라 한 기록 안에서 되돌아온 질문이다. 누가, 무엇으로 이 글을 읽는지는 아직 단정할 수 없다.'},
 {q:'등대 빛과 폭풍이 함께 움직인 것처럼 보인 이유는?',a:['등대가 기상 무기였기 때문','기억이 우연한 두 사건을 원인과 결과로 엮었기 때문','이솔이 관측 기록을 조작했기 때문'],c:1,e:'이유 없는 상실을 견디지 못한 기억이 빛을 범인으로 만들었다.'},
 {q:'섬사람들의 정체를 가장 정확히 설명한 것은?',a:['모두 배에서 죽은 유령','미라가 마지막으로 본 모습과 이후의 소식이 섞인 기억','구조를 기다리는 실제 생존자'],c:1,e:'죽은 이와 살아남은 이 모두 섬에 있다. 이들은 원본이 아니라 미라 안에 남은 버전이다.'},
 {q:'미라의 선택을 온전히 만드는 빠진 사실은?',a:['그녀는 죽음을 예견했다','그녀 역시 살고 싶었고 두려웠다','선장이 비밀리에 명령했다'],c:1,e:'살고 싶지 않은 사람의 희생담이 아니라, 살고 싶었던 사람이 끝내 선택한 행동이기에 의미가 있다.'},
 {q:'등대를 끄거나 돌리는 행위가 바꾸는 것은 무엇인가?',a:['7년 전 사고의 결과','살아남은 사람의 실제 기억','미라의 마지막 순간이 앞으로 어떤 이야기로 남을지'],c:2,e:'과거는 바뀌지 않는다. 하지만 죄, 구조, 사랑 중 무엇을 비출지는 지금의 선택이다.'}
];
const deductionEvidence=[['harbor','village','lighthouse'],['harbor','chapel','lighthouse'],['village','orchard','lighthouse'],['harbor','cliff','lighthouse'],['village','chapel','cliff'],['harbor','orchard','chapel'],['orchard','cliff','lighthouse']];
const diveData=[
 {title:'폭풍 전날의 저녁',intro:'사고 기록에는 없던 평범한 두 시간이 유리 바닥 아래 남아 있다. 큰 사건이 일어나기 전, 사람들은 큰 의미가 없는 일을 했다.',answer:['soup','cards','knot'],objects:[
  {id:'soup',label:'식은 수프',text:'미라는 수프가 너무 짜다며 빵을 세 조각이나 넣었다. 라온은 당근만 골라 미라의 접시에 옮겼다. 둘은 다음 항구에서 제대로 된 저녁을 먹자고 약속했다.'},
  {id:'cards',label:'닳은 카드',text:'식사 뒤 승객 네 명이 카드놀이를 했다. 미라는 규칙을 몰라 세 번 연속 이겼고, 로웬은 초보의 운은 바다에서 가장 위험하다며 웃었다.'},
  {id:'soap',label:'레몬 비누',text:'마레는 의무실에서 레몬 비누를 아껴 썼다. 미라는 그 냄새가 고향 부엌과 같다고 했고, 언니는 다음 휴가에 함께 돌아가자고 답했다.'},
  {id:'shoe',label:'젖은 구두',text:'라온이 갑판 물웅덩이에 발을 담가 한쪽 양말을 젖혔다. 미라는 난간에 양말을 널며 선장에게 들키면 갈매기 탓을 하자고 속삭였다.'},
  {id:'knot',label:'별자리 매듭',text:'밤이 되자 미라는 라온에게 끈 하나로 북쪽을 기억하는 법을 가르쳤다. 아이는 매듭을 주머니에 넣고 “내일도 해요”라고 말했다.'}
 ]},
 {title:'읽지 못한 축사',intro:'마레가 결혼식에서 읽으려던 종이 주위로 그날 아침의 물건들이 떠오른다. 폭풍은 한 사람의 미래만 멈춘 것이 아니다.',answer:['photo','ribbon','pen'],objects:[
  {id:'photo',label:'자매의 사진',text:'사진 속 미라와 마레는 열두 살과 열다섯 살이다. 둘은 동시에 웃지 않는다. 한 사람이 웃으면 다른 사람은 일부러 무서운 얼굴을 했다.'},
  {id:'ribbon',label:'산호색 리본',text:'마레는 미라의 결혼 선물 상자에 리본을 묶었다가 세 번 풀었다. 미라가 화려한 것을 싫어한다는 걸 알면서도 이날만은 예외이고 싶었다.'},
  {id:'receipt',label:'케이크 영수증',text:'가장 작은 케이크를 주문하고도 이름 철자가 틀렸다. 마레는 고치지 않았다. 미라가 틀린 이름을 보고 더 크게 웃을 것을 알았다.'},
  {id:'bell',label:'작은 종',text:'하객을 부를 손바닥만 한 종이다. 사고 뒤 마레는 이 종을 구조 재단 책상에 두었고, 좋은 소식이 올 때마다 한 번 울렸다.'},
  {id:'pen',label:'파란 만년필',text:'축사의 마지막 문장은 번져 있다. “네가 길을 잃으면 내가 찾겠다.” 마레는 그 문장을 지키지 못했다고 믿었지만, 일곱 해 동안 미라의 이름을 찾았다.'}
 ]},
 {title:'라온의 주머니',intro:'아이의 구명조끼 안쪽에 서로 다른 시기의 물건들이 들어 있다. 살아남은 한 사람이 나이를 먹는 동안 간직한 것들이다.',answer:['boot','star','note'],objects:[
  {id:'star',label:'종이별',text:'열 살 라온이 병원에서 접었다. 별의 안쪽에는 “미라 언니가 돌아오면 주기”라고 썼다. 간호사는 별을 버리지 않고 퇴원 가방에 넣었다.'},
  {id:'boot',label:'작은 장화',text:'구조 당시 신었던 장화 한 짝이다. 라온은 발이 자란 뒤에도 버리지 않았다. 다른 한 짝은 바다가 갖고 있으니 이것은 증거가 아니라 짝이라고 말했다.'},
  {id:'drawing',label:'등대 그림',text:'열세 살 라온은 등대에 창문을 스물일곱 개 그렸다. 미술 교사는 너무 많다고 했지만 라온은 사람마다 불 하나가 필요하다고 고치지 않았다.'},
  {id:'tin',label:'도시락 통',text:'교사가 된 라온이 첫 현장학습에 가져갔다. 학생들은 안쪽 뚜껑의 낡은 매듭 그림을 보고 그날 처음 구조 매듭을 배웠다.'},
  {id:'note',label:'출석부 쪽지',text:'“사고를 말할 때 영웅이라는 단어만 쓰지 말 것. 그 사람은 살고 싶었던 평범한 사람이었다.” 라온이 매년 수업 전에 자신에게 남긴 메모다.'}
 ]},
 {title:'11시 48분의 아침',intro:'섬의 모든 시계가 멈춘 뒤에도 육지의 시계는 움직였다. 구조 직후 한 시간의 파편이 순서를 기다린다.',answer:['radio','towel','list'],objects:[
  {id:'radio',label:'구조 무전기',text:'11시 48분, 해안 경비대는 스물여섯 명을 확인했다. 잡음 뒤에서 선장은 한 명이 배에 남았다고 세 번 말했지만 이름을 끝내 발음하지 못했다.'},
  {id:'towel',label:'회색 담요',text:'마레는 라온에게 담요를 둘러주면서도 바다만 보았다. 아이는 담요 아래서 미라가 가르친 매듭을 풀었다 묶기를 반복했다.'},
  {id:'coffee',label:'종이컵 커피',text:'로웬은 구조소 커피를 한 모금도 마시지 못했다. 컵에는 손톱자국이 다섯 개 남았다. 그는 훗날 배를 탈 때마다 같은 컵을 챙겼다.'},
  {id:'watch',label:'멈춘 손목시계',text:'미라의 시계는 조타실에서 발견되어 11시 47분을 가리켰다. 하지만 내부 톱니는 한 칸 더 움직인 흔적을 남겼다.'},
  {id:'list',label:'생존자 명단',text:'명단 맨 아래에는 이름 없는 가로줄이 하나 있다. 마레가 미라의 이름을 쓰려다 종이를 찢을 것 같아 펜을 멈춘 자리다.'}
 ]},
 {title:'일곱 해의 답장',intro:'아델의 우편가방 깊은 곳에서 미라가 받지 못한 계절들이 쏟아진다. 어느 것도 사고를 설명하지 않지만 모두 선택의 결과다.',answer:['report','ticket','class'],objects:[
  {id:'report',label:'중학교 성적표',text:'라온의 수학 점수는 낮고 체육 점수는 높다. 보호자 의견 칸에 마레가 “실패해도 집에 돌아오는 연습을 하고 있습니다”라고 썼다.'},
  {id:'flower',label:'눌린 들꽃',text:'사고 3주기, 라온은 바다에 꽃을 던지지 않고 책에 눌렀다. 사라지게 보내는 것보다 모양이 변해도 곁에 두고 싶었다.'},
  {id:'ticket',label:'버스 승차권',text:'라온이 처음 혼자 섬 근처 해안으로 간 날의 표다. 그는 도착하자마자 돌아오는 표부터 샀다. 미라는 돌아오는 길도 용기라고 가르친 적이 없지만 라온은 배웠다.'},
  {id:'badge',label:'구조 재단 배지',text:'마레나 벨이 세운 작은 재단의 첫 배지다. 등대 대신 열린 문이 그려져 있다. 재단은 일곱 해 동안 마흔세 명을 집으로 돌려보냈다.'},
  {id:'class',label:'교실 단체사진',text:'사진 뒤 학생 스물일곱 명이 제각기 매듭을 들고 있다. 중앙의 라온은 카메라가 아니라 창밖의 바다를 보지만 표정은 슬프지 않다.'}
 ]},
 {title:'폭풍의 마지막 60초',intro:'이번 기억은 순서를 틀리면 다시 부서진다. 죄책감이 지운 행동들을 사물의 위치로 복원해야 한다.',answer:['glass','wheel','jacket'],objects:[
  {id:'glass',label:'깨진 창 조각',text:'첫 충격은 11시 46분 12초에 왔다. 조타실 창이 안쪽으로 깨졌고 미라는 왼팔을 다쳤다. 그래도 엔진 전신기는 움직였다.'},
  {id:'key',label:'의무실 열쇠',text:'미라는 마레가 갑판으로 돌아오지 못하게 의무실 문을 잠갔다. 언니의 비명은 미움이 아니라 함께 죽으려 했던 사람의 절박함이었다.'},
  {id:'wheel',label:'젖은 조타륜',text:'선장이 판단을 미루는 동안 미라는 얕은 만으로 방향을 틀었다. 바위와 충돌했지만 배가 뒤집히는 대신 구명정을 내릴 시간을 벌었다.'},
  {id:'boat',label:'구명정 걸쇠',text:'스물여섯 번째 사람이 탄 뒤 걸쇠가 끊어졌다. 배로 돌아올 사다리는 파도에 떨어졌다. 미라는 이미 돌아오지 못할 가능성을 알았다.'},
  {id:'jacket',label:'붉은 외투',text:'미라는 외투와 구명조끼를 라온에게 입혔다. 마지막으로 남은 것은 영웅의 제복이 아니라 추워하던 아이에게 건넨 평범한 옷이었다.'}
 ]},
 {title:'오지 않은 다음 날',intro:'사실의 기억이 아니라 가능성의 방이다. 미라가 살아 있었다면 대단하지 않았을 아침이 다섯 물건으로 놓여 있다.',answer:['alarm','bread','postcard'],objects:[
  {id:'alarm',label:'늦은 알람',text:'미라는 휴가 첫날 알람을 세 번 끄고 마레의 전화를 받지 않았을 것이다. 마레는 화를 냈다가 점심때 수프를 들고 찾아왔을 것이다.'},
  {id:'laundry',label:'밀린 빨래',text:'붉은 외투는 세탁기 안에서 다른 옷을 분홍색으로 물들였을 것이다. 미라는 새 옷을 사주는 대신 모두 잘 어울린다고 우겼을 것이다.'},
  {id:'bread',label:'탄 빵',text:'결혼식 다음 날 아침, 미라는 빵을 태우고 창문을 열었을 것이다. 연기와 바다 냄새가 섞이고 아무도 그것을 운명이라 부르지 않았을 것이다.'},
  {id:'seed',label:'사과 씨앗',text:'노아는 존재하지 않았지만 미라는 언젠가 아이와 씨앗을 심었을지 모른다. 열매가 열리지 않아도 둘은 물 주는 일을 한동안 계속했을 것이다.'},
  {id:'postcard',label:'빈 엽서',text:'미라는 어머니에게 “잘 도착했어요”라고 썼을 것이다. 특별한 소식이 없는 문장이야말로 모두가 기다렸던 구조 신호였을 것이다.'}
 ]}
];
const divePrompts=[
 '저녁 식사에서 카드놀이를 지나 갑판 수업으로 이어진 세 물건을 고르세요.',
 '마레가 사진을 본 뒤 선물을 묶고 마지막 문장을 쓴 순서를 고르세요.',
 '구조 당시의 물건, 병원에서 만든 물건, 성인이 된 뒤의 기록을 차례로 고르세요.',
 '첫 구조 무전, 몸을 덥힌 물건, 마지막으로 작성한 공식 기록을 차례로 고르세요.',
 '학창 시절의 기록, 처음 혼자 떠난 여행, 교사가 된 현재를 차례로 고르세요.',
 '첫 충격, 항로를 바꾼 행동, 라온에게 마지막으로 건넨 물건을 차례로 고르세요.',
 '눈을 뜬 뒤, 아침을 만들고, 무사함을 알리는 순서로 가능성의 사물을 고르세요.'
];
const dayReflections=[
 '사람들은 무언가를 숨겼다. 너무 날카로운 진실을 맨손으로 건네지 않으려는 다정함도 숨김의 한 종류였다.',
 '11시 47분은 사고 시각이면서 내가 마지막으로 나였던 때다. 그러나 시계 하나는 11시 48분으로 움직였다.',
 '나는 나에게 편지를 썼다. 죄가 아니라 선택을, 죽음이 아니라 그 이전의 삶을 정확히 기억해 달라고.',
 '기억은 오래 비춘 생각을 크게 만든다. 범인이라는 생각도 영웅이라는 생각도 나의 일부지만 전부는 아니다.',
 '나는 미라 벨의 메아리다. 그래도 이번 일주일은 누구의 과거에도 없던 나의 시간이었다.',
 '나는 살고 싶었다. 그래서 마지막 한순간의 선택은 빼앗긴 죽음 속에서도 온전히 내 것이었다.'
];
const reflectionChoices=[
 [{label:'사람들이 건넨 다정함을 믿는다',stat:'mercy',result:'섬의 창문 몇 개가 따뜻해진다.'},{label:'기록의 모순을 끝까지 좇는다',stat:'truth',result:'등대 렌즈의 안개가 걷힌다.'}],
 [{label:'종소리에 내 이름으로 답한다',stat:'mercy',result:'멀리서 누군가 같은 박자로 답한다.'},{label:'11시 48분을 일지에 기록한다',stat:'truth',result:'멈춘 시간 뒤에 다음 1분이 생긴다.'}],
 [{label:'편지를 가슴 가까이 간직한다',stat:'mercy',result:'붉은 봉투에서 집의 냄새가 난다.'},{label:'숨은 잉크까지 모두 읽는다',stat:'truth',result:'문장 아래 눌린 진실이 떠오른다.'}],
 [{label:'살아남은 이들의 내일을 본다',stat:'mercy',result:'수평선 너머 아침이 이어진다.'},{label:'폭풍의 원인을 끝까지 해체한다',stat:'truth',result:'빛과 파도가 서로 다른 박자로 움직인다.'}],
 [{label:'메아리도 새로운 사람이 될 수 있다',stat:'mercy',result:'심장 없는 가슴에서 박동이 느껴진다.'},{label:'내가 기억의 구조임을 받아들인다',stat:'truth',result:'거울 속 모습이 같은 순간에 움직인다.'}],
 [{label:'살고 싶었던 나를 안아준다',stat:'mercy',result:'폭풍 속 비명이 한 사람의 목소리로 돌아온다.'},{label:'일어난 일을 빠짐없이 기억한다',stat:'truth',result:'깨진 렌즈가 서로의 모서리를 찾는다.'}]
];
const achievementDefs={first:{n:'첫 번째 불씨',d:'첫 기록을 발견했다.'},listener:{n:'바다의 청자',d:'도움 없이 신호 퍼즐을 풀었다.'},navigator:{n:'밤바다의 항해사',d:'일곱 밤의 항로를 완주했다.'},confidant:{n:'불이 낮아진 뒤',d:'일곱 번의 밤 대화를 마쳤다.'},helmsman:{n:'폭풍의 다섯 손잡이',d:'마지막 폭풍의 다섯 대가를 선택했다.'},glass:{n:'유리 정원사',d:'유리 조각 14개를 모았다.'},echoes:{n:'다른 쪽의 이야기',d:'선택한 남은 잔상 14개를 발견했다.'},ripples:{n:'돌아온 파도',d:'이전 선택이 만든 열네 결과를 끝까지 확인했다.'},broadcaster:{n:'마지막 송신자',d:'네 문장으로 최후 방송을 완성했다.'},detective:{n:'모순을 잇는 사람',d:'일곱 추론을 완성했다.'},diver:{n:'사소한 날들의 수집가',d:'기억 잠수 일곱 편을 복원했다.'},balanced:{n:'두 손으로 든 빛',d:'진실과 자비의 균형을 이루었다.'},witness:{n:'일곱 번째 새벽',d:'섬의 모든 날을 기억했다.'},fourth:{n:'새벽을 만든 사람',d:'숨겨진 네 번째 길을 열었다.'}};

const storageFallback={};let storageDegraded=false;
function storageGet(k){if(storageDegraded&&Object.prototype.hasOwnProperty.call(storageFallback,k))return storageFallback[k];try{const v=localStorage.getItem(k);return v??storageFallback[k]??null}catch{storageDegraded=true;return storageFallback[k]??null}}
function storageSet(k,v){storageFallback[k]=String(v);try{localStorage.setItem(k,String(v));return true}catch{storageDegraded=true;return false}}
function storageRemove(k){storageFallback[k]=null;try{localStorage.removeItem(k);delete storageFallback[k]}catch{storageDegraded=true}}
function readMeta(){try{const m=JSON.parse(storageGet('last-light-meta-v1'));return m&&Array.isArray(m.endingsSeen)&&m.achievements&&typeof m.achievements==='object'?m:{endingsSeen:[],achievements:{}}}catch{return{endingsSeen:[],achievements:{}}}}
const freshState=()=>{const meta=readMeta();return{version:2,day:0,visited:{},afterimages:{},current:'harbor',clues:[],memories:[],people:[],truth:0,mercy:0,seconds:0,puzzleDone:{},deductions:{},dives:{},diveSeen:{},navigationDone:{},navigationProgress:{},navigationLogs:{},navigationEncounters:{},navEncounterPending:null,ripplesSeen:{},broadcast:{stage:0,decisions:[],pending:null,completed:false},conversations:{},bonds:{},storm:{stage:0,decisions:[],pending:null,completed:false},choicesTrail:[],achievements:{...meta.achievements},ending:null,endingsSeen:[...meta.endingsSeen],atFinalChoice:false,pending:null,puzzleAttempts:{},assists:0,updatedAt:null}};
let S=freshState(),pages=[],pageIndex=0,typing=false,typeTimer=null,moving=false,transitioning=false,puzzleRuntime=null,deductionRuntime=null,diveRuntime=null,navigationRuntime=null,conversationRuntime=null,audio=null,lastPadButtons=[],gamepadChoiceIndex=0,sceneCueTimer=null;
const anyDialogOpen=()=>$$('dialog').some(d=>d.open);
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const afterimageKeys=()=>Object.keys(S.afterimages).filter(k=>/^\d-[a-z]+$/.test(k)&&S.afterimages[k]);
const afterimageCount=()=>afterimageKeys().length;
const dayAfterimageCount=(day=S.day)=>afterimageKeys().filter(k=>k.startsWith(`${day}-`)).length;
const canCollectAfterimage=(id,day=S.day)=>!!S.visited[`${day}-${id}`]&&!S.afterimages[`${day}-${id}`]&&dayAfterimageCount(day)<AFTERIMAGE_DAILY_LIMIT&&afterimageCount()<AFTERIMAGE_GOAL;
const completedConversationCount=()=>Object.values(S.conversations).filter(c=>c?.done).length;
const encounterRecords=()=>Object.entries(S.navigationEncounters).map(([key,value])=>({key,...value})).filter(record=>record.choiceId&&consequenceRipples[record.choiceId]);
const rippleForRecord=record=>consequenceRipples[record?.choiceId]||null;
const navigationChoiceData=choiceId=>navigationEncounters.flatMap(encounter=>encounter.choices.map(choice=>({...choice,encounterTitle:encounter.title}))).find(choice=>choice.id===choiceId);
function pendingRippleRecords(){if(S.day<=0)return[];return encounterRecords().filter(record=>record.key.startsWith(`${S.day-1}-`)&&!S.ripplesSeen[record.key])}
function navigationRippleEffects(day=S.day){if(day<=0)return{bonus:0,charts:[],labels:[]};const records=encounterRecords().filter(record=>record.key.startsWith(`${day-1}-`)),effects=records.map(record=>({record,ripple:rippleForRecord(record)})).filter(x=>x.ripple);return{bonus:Math.min(2,effects.filter(x=>x.ripple.effect==='fuel').length),charts:effects.filter(x=>x.ripple.effect==='chart').map(x=>x.ripple.effectLabel),labels:effects.map(x=>x.ripple.effectLabel)}}
function showSceneCue(text){const cue=$('#sceneCue');if(!cue)return;cue.textContent=text;cue.classList.add('show');clearTimeout(sceneCueTimer);sceneCueTimer=setTimeout(()=>cue.classList.remove('show'),2600)}
function resolveRippleRecords(records,onComplete){
 if(!records.length)return false;
 records.forEach(record=>{S.ripplesSeen[record.key]=true});if(Object.keys(S.ripplesSeen).length>=14)unlock('ripples');autosave();showSceneCue(`${records.length}개의 이전 선택이 지금의 섬을 바꾸었습니다.`);onComplete?.();return true
}
function openPendingRipples(){
 const records=pendingRippleRecords();if(!records.length)return false;
 const pages=records.map(record=>rippleForRecord(record).next),title=S.day===6?'폭풍 전날의 파문':`${days[S.day].name} · 돌아온 결과`;
 showStory('섬의 파문',title,pages,()=>resolveRippleRecords(records));
 return true
}
function finalDayReady(){return S.day===6&&routes[6].every(id=>S.visited[`6-${id}`])&&S.navigationDone[6]&&S.puzzleDone[6]&&S.deductions[6]&&S.dives[6]&&S.conversations[6]?.done}
function finalDayRippleRecords(){if(!finalDayReady())return[];return encounterRecords().filter(record=>record.key.startsWith('6-')&&!S.ripplesSeen[record.key])}
function resumeFinalSequence(){if(S.atFinalChoice||S.broadcast?.completed){finalChoice();return}if(S.storm?.completed){openFinalBroadcast();return}openStormClimax()}
function openFinalDayRipples(onComplete=resumeFinalSequence){
 const records=finalDayRippleRecords();if(!records.length)return false;
 const pages=records.flatMap(record=>{const ripple=rippleForRecord(record);return[ripple.next,`폭풍에 남은 도움 · ${ripple.effectLabel}`]});
 showStory('섬의 파문','일곱 번째 밤 · 폭풍으로 돌아온 선택',pages,()=>resolveRippleRecords(records,onComplete));
 return true
}

function isUnlocked(id){const tiers=routeTiers[S.day]||routeTiers[6],tierIndex=tiers.findIndex(t=>t.includes(id));if(tierIndex<0)return false;return tiers.slice(0,tierIndex).flat().every(prev=>S.visited[`${S.day}-${prev}`])}
function renderMap(){
 const nav=$('#locations');nav.innerHTML='';
 Object.entries(locs).forEach(([id,l])=>{const key=`${S.day}-${id}`,done=!!S.visited[key],after=!!S.afterimages[key],open=isUnlocked(id),echoReady=canCollectAfterimage(id);const b=document.createElement('button');b.className='location';b.dataset.id=id;b.dataset.name=l.name;b.setAttribute('aria-label',`${l.name}${done?(after?' 완료':echoReady?' 완료, 선택 잔상 발견 가능':' 완료'):open?' 조사 가능':' 잠김'}`);b.innerHTML=`<span class="icon" aria-hidden="true">${l.icon}</span>`;if(done){b.classList.add('done');if(echoReady)b.classList.add('afterimage')}else if(open)b.classList.add('available');else b.classList.add('locked');b.onclick=()=>travel(id);nav.appendChild(b)});
 const island=$('#island');island.dataset.scene=S.current;island.dataset.rippleCount=String(pendingRippleRecords().length);island.className=`day-${S.day}`;updateHud();moveTraveler(false);setAmbience();
}
function updateHud(){const d=days[Math.min(S.day,6)],done=routes[S.day].filter(id=>S.visited[`${S.day}-${id}`]).length,next=routes[S.day].find(id=>!S.visited[`${S.day}-${id}`]),after=Math.min(afterimageCount(),AFTERIMAGE_GOAL);$('#dayLabel').textContent=d.name;$('#objective').textContent=next?`${d.obj} · 다음: ${locs[next].name}`:d.obj;$('#moodLine').textContent=d.weather;$('#locationLabel').textContent=locs[S.current].name;$('#clueCount').textContent=`기록 ${S.clues.length}/42 · 선택 잔상 ${after}/${AFTERIMAGE_GOAL}`;$('#dayProgress').style.width=`${done/6*100}%`;$('#playTime').textContent=formatTime(S.seconds)}
function moveTraveler(animate=true){const l=locs[S.current],t=$('#traveler');if(!animate)t.style.transition='none';t.style.left=l.x+'%';t.style.top=l.y+'%';requestAnimationFrame(()=>t.style.transition='')}
function travel(id){if(moving||anyDialogOpen()||!$('#game').classList.contains('active'))return;if(!isUnlocked(id)&&!S.visited[`${S.day}-${id}`]){const available=routes[S.day].filter(x=>isUnlocked(x)&&!S.visited[`${S.day}-${x}`]).map(x=>locs[x].name).join(' 또는 ');toast(`지금은 ${available}의 단서를 먼저 확인할 수 있습니다.`);return}if(id===S.current){interact();return}moving=true;S.current=id;sfx('travel');$('#island').dataset.scene=id;moveTraveler(true);updateHud();setAmbience();showSceneCue(`${days[S.day].name} · ${locs[id].name}`);const delay=$('#instantTravel').checked||document.body.classList.contains('reduce-motion')?20:620;setTimeout(()=>{moving=false;interact()},delay)}
function interact(){if(anyDialogOpen()||moving||!$('#game').classList.contains('active'))return;const key=`${S.day}-${S.current}`;if(S.visited[key]){if(canCollectAfterimage(S.current)){openAfterimage(S.current);return}showStory(people[S.current][0],locs[S.current].name,[intros[S.current],S.clues.find(c=>c.key===key)?.echo||'오늘 이곳에서 찾을 것은 이미 찾았다. 기억은 같아도 바라보는 사람은 달라졌다.'],afterVisit);return}if(!isUnlocked(S.current)){toast('아직 이 장소의 기억은 열리지 않았습니다.');return}if(S.current==='lighthouse'&&!S.navigationDone[S.day]){openNavigation();return}startScene(S.current)}
function openAfterimage(id){if(!canCollectAfterimage(id)){toast(afterimageCount()>=AFTERIMAGE_GOAL?'필요한 잔상 열네 개를 모두 기록했습니다.':'오늘 붙잡을 수 있는 잔상 두 개를 모두 골랐습니다.');return}const key=`${S.day}-${id}`,clue=S.clues.find(c=>c.key===key),e=echoes[id],alt=clue?.echo===e.a[S.day]?e.b[S.day]:e.a[S.day];showStory(people[id][0],`${locs[id].name} · 남은 잔상`,[afterimageOpeners[S.day],alt],()=>{S.afterimages[key]=true;if(clue)clue.afterimage=alt;if(afterimageCount()>=AFTERIMAGE_GOAL)unlock('echoes');autosave();renderMap();toast(`선택 잔상 ${afterimageCount()}/${AFTERIMAGE_GOAL}를 항해일지에 기록했습니다.`);afterVisit()})}
function startScene(id,resume=false){const seq=story[id]?.[S.day];if(!seq)return;if(!resume)S.pending={day:S.day,loc:id,page:0,choice:null};autosave();playMotif(id);const mode=S.truth>S.mercy?'truth':S.mercy>S.truth?'mercy':'balanced',branch=S.day>0?(veteranBranchReactions[id]?.[S.day]?.[mode]||branchReactions[id][mode]):null;const texts=[...(S.day===0?[intros[id]]:[]),...seq,...(branch?[branch]:[])],start=resume?Math.min(S.pending?.page||0,texts.length-1):0;showStory(people[id][0],locs[id].name,texts,()=>commitVisit(id,null),getEchoOptions(id),start)}
function getEchoOptions(id){const e=echoes[id],d=S.day;return[{label:e.labels[0],stat:'truth',result:e.a[d],tag:`${locs[id].name}에서 사실을 택함`},{label:e.labels[1],stat:'mercy',result:e.b[d],tag:`${locs[id].name}에서 마음을 택함`}];}
function commitVisit(id,echo){const key=`${S.day}-${id}`;if(S.visited[key])return;const pendingChoice=S.pending?.choice;if(pendingChoice){if(pendingChoice.stat)S[pendingChoice.stat]++;if(pendingChoice.tag)S.choicesTrail.push({day:S.day,text:pendingChoice.tag,stat:pendingChoice.stat})}S.visited[key]=true;if(!S.people.includes(id))S.people.push(id);const e=echo||pendingChoice?.result||story[id][S.day][2];S.clues.push({key,day:S.day,title:`${locs[id].name} · ${days[S.day].name.split(' · ')[1]}`,text:story[id][S.day][2],echo:e});if(id==='orchard'||id==='chapel')S.memories.push({title:`유리 조각 ${S.memories.length+1}`,text:e});S.pending=null;unlock('first');if(S.memories.length===14)unlock('glass');sfx('clue');autosave();renderMap();if(id==='lighthouse'&&!S.puzzleDone[S.day])openPuzzle();else afterVisit()}

function setStoryPortrait(speaker){const img=$('#storyPortrait'),name=Object.keys(portraitBySpeaker).find(n=>String(speaker).startsWith(n));if(!name){img.hidden=true;img.removeAttribute('src');img.alt='';return}img.src=`assets/${portraitBySpeaker[name]}`;img.alt=`${name} 인물화`;img.hidden=false}
function showStory(speaker,title,texts,onDone,choices,startPage=0){pages=texts;pageIndex=startPage;$('#speaker').textContent=speaker;$('#storyTitle').textContent=title;setStoryPortrait(speaker);$('#choices').innerHTML='';$('#nextStory').style.display='inline-block';audio?.setStory?.({speaker,title,page:pageIndex,choiceMode:false});document.body.classList.add('story-focus');const d=$('#storyDialog');if(!d.open)d.showModal();$('#nextStory').onclick=()=>advanceStory(onDone,choices);typePage(pages[pageIndex])}
function advanceStory(onDone,choices){if(typing){finishType();return}pageIndex++;if(S.pending){S.pending.page=pageIndex;autosave(false)}if(pageIndex<pages.length){sfx('page');audio?.setStory?.({page:pageIndex,choiceMode:false});typePage(pages[pageIndex])}else if(choices)showChoices(choices,onDone);else{$('#storyDialog').close();onDone?.()}}
function typePage(text){clearInterval(typeTimer);typing=true;const el=$('#storyText');el.textContent='';let i=0,speed=+$('#textSpeed').value;if(!speed){el.textContent=text;typing=false;return}typeTimer=setInterval(()=>{el.textContent+=text[i++]||'';if(i>=text.length){clearInterval(typeTimer);typing=false}},speed)}
function finishType(){clearInterval(typeTimer);$('#storyText').textContent=pages[pageIndex];typing=false}
function showChoices(opts,onDone){$('#nextStory').style.display='none';const c=$('#choices');c.innerHTML='';gamepadChoiceIndex=0;audio?.setStory?.({page:pageIndex,choiceMode:true});opts.forEach((o,index)=>{const b=document.createElement('button');b.textContent=o.label;if(index===0)b.classList.add('gamepad-selected');b.onclick=()=>{const sceneChoice=!!S.pending&&!o.end;if(sceneChoice){S.pending.choice={stat:o.stat,tag:o.tag,result:o.result};S.pending.phase='result'}else{if(o.stat)S[o.stat]++;if(o.tag)S.choicesTrail.push({day:S.day,text:o.tag,stat:o.stat})}o.onPick?.();audio?.setStory?.({choiceMode:false});$('#storyDialog').close();sfx('choice');autosave(false);if(o.end){ending(o.end);return}if(o.result)showStory(people[S.current]?.[0]||'미라','선택이 남긴 것',[o.result],onDone);else onDone?.()};c.appendChild(b)})}

const navigationSignalMessages={
 'harbor-bell':'젖은 종이 한 번 울린다. 누군가 출항보다 귀환 시간을 적어 두었다.','dawn-code':'새벽 신호는 구조 요청이 아니라 “아직 듣고 있다”는 답신이었다.',
 'west-wake':'서쪽 항적에 배가 아니라 구명정의 좁은 물결이 남아 있다.','midnight-mark':'자정 표식 아래 11시 48분에서 멈춘 시계가 매달려 있다.','east-wake':'동쪽 물결은 폭풍을 피하지 않고 되짚어 들어갔다.','return-call':'잡음 사이에서 “인원 확인, 다시 세어”라는 목소리가 반복된다.',
 'low-lantern':'낮은 등불은 갑판이 아니라 물 위의 얼굴을 비췄다.','bell-note':'종의 세 박자가 닫힌 문과 같은 간격으로 답한다.','west-warning':'서쪽 경고는 너무 일찍 지워져 오히려 누군가 읽었다는 흔적이 됐다.','open-water':'빈 바다에서 두 항로가 한순간 겹친다.','sunken-letter':'가라앉은 편지에는 수신인 대신 “살아남을 사람에게”라고 쓰여 있다.',
 'breach':'파손 보고는 선체보다 의무실 문을 먼저 기록했다.','warm-voice':'희미한 목소리가 이름 대신 체온과 맥박을 부른다.','far-shore':'먼 해안의 불빛은 사고 뒤에도 여러 해 동안 같은 밤에 켜졌다.','chapel-flash':'예배당 섬광이 구조등과 같은 세 박자로 되돌아온다.',
 'west-glass':'서쪽 유리 조각에는 미라가 웃기 전 숨을 고르는 순간이 남아 있다.','orchard-tone':'과수원의 음은 영웅담보다 아침 식탁의 숟가락 소리를 품고 있다.','split-star':'갈라진 별은 두 선택이 모두 누군가를 살렸고, 모두 무언가를 잃었다고 말한다.','east-glass':'동쪽 유리에는 폭풍 다음 날의 맑은 하늘이 비친다.',
 'west-name':'서쪽 이름을 읽자 물 아래에서 한 사람이 숨을 들이쉰다.','bell-echo':'종의 메아리가 구조 명단의 빈칸 하나를 채운다.','mid-sea-name':'한가운데 이름은 승객도 선원도 아닌 아이의 애칭이었다.','east-name':'동쪽 이름 뒤에 “귀환”이라는 낡은 도장이 떠오른다.',
 'first-name':'첫 이름은 사망자 명단이 아니라 당직표에서 시작했다.','buried-call':'묻힌 호출은 도움보다 “문을 열어 달라”고 반복한다.','unlit-star':'꺼진 별에는 미라가 선택하지 못한 항로가 남아 있다.','middle-wake':'중앙 항적에서 구명정과 세이렌호가 서로 반대 방향으로 움직인다.','keeper-code':'등대지기의 암호는 불을 켜는 법이 아니라 멈추는 법을 적었다.','last-name':'마지막 이름의 소금이 녹자 네 필체와 다른 획이 드러난다.'
};
const navigationDebriefs=[
 '처음으로 네 손이 섬의 지도가 아니라 파도의 저항을 기억한다. 등대에 닿았지만, 돌아온 신호 하나가 네가 보낸 것보다 오래됐다.',
 '조류를 거슬러 모은 네 신호는 하나의 문장이 된다. “사고 뒤에도 누군가는 항로를 되짚었다.”',
 '청동문이 열릴 때 등대 쪽이 아니라 바다 아래에서 먼저 빛이 샌다. 누군가 기억을 가둔 문은 한 겹이 아니었다.',
 '표류자를 배에 올리는 순간 이동 가능한 길이 줄었지만, 신호의 잡음은 처음으로 사람의 호흡이 된다.',
 '남은 연료는 충분하지 않았다. 그래서 무엇을 지나칠지가 아니라 누구와 함께 도착할지를 항로로 써야 했다.',
 '두 문과 두 사람을 모두 지나자 항로표의 선들이 구명정 모양을 만든다. 세이렌호만이 그 밤의 유일한 배는 아니었다.',
 '마지막 부표가 켜지자 바다가 폭풍의 밤으로 겹친다. 네가 조타륜을 잡은 손과, 의무실 문을 두드린 다른 손이 동시에 보인다.'
];
const navKey=p=>`${p[0]},${p[1]}`;
const samePos=(a,b)=>a?.[0]===b?.[0]&&a?.[1]===b?.[1];
const navDirDelta={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
function navSnapshot(){return{pos:[...navigationRuntime.pos],collected:[...navigationRuntime.collected],activated:[...navigationRuntime.activated],rescued:[...navigationRuntime.rescued],moves:navigationRuntime.moves,assisted:navigationRuntime.assisted,log:[...navigationRuntime.log]}}
function restoreNavSnapshot(s){navigationRuntime.pos=[...s.pos];navigationRuntime.collected=new Set(s.collected||[]);navigationRuntime.activated=new Set(s.activated||[]);navigationRuntime.rescued=new Set(s.rescued||[]);navigationRuntime.moves=s.moves||0;navigationRuntime.assisted=!!s.assisted;navigationRuntime.log=[...(s.log||[])]}
function persistNavigation(){if(!navigationRuntime)return;S.navigationProgress[S.day]={...navSnapshot(),history:navigationRuntime.history.map(h=>({...h,pos:[...h.pos],collected:[...h.collected],activated:[...h.activated],rescued:[...h.rescued],log:[...h.log]}))};autosave(false)}
function openNavigation(){
 const level=navigationLevels[S.day];
 if(!level){S.navigationDone[S.day]=true;startScene('lighthouse');return}
 const saved=S.navigationProgress[S.day],effects=navigationRippleEffects(),arrows={U:'↑',R:'→',D:'↓',L:'←'},effectLog=[];
 if(effects.bonus)effectLog.push(`이전 선택이 남긴 보급으로 조타 여유가 ${effects.bonus}칸 늘었다.`);
 if(effects.charts.length)effectLog.push(`되돌아온 기록이 첫 조타를 비춘다: ${[...level.minimalSolution.slice(0,3)].map(x=>arrows[x]).join(' ')}`);
 navigationRuntime={level,effects,effectiveLimit:level.moveLimit+effects.bonus,pos:[...(saved?.pos||level.start)],collected:new Set(saved?.collected||[]),activated:new Set(saved?.activated||[]),rescued:new Set(saved?.rescued||[]),moves:saved?.moves||0,assisted:!!saved?.assisted,log:[...(saved?.log||[...effectLog,'파도 소리를 따라 첫 조타를 준비한다.'])],history:(saved?.history||[]).map(h=>({...h,pos:[...h.pos],collected:[...(h.collected||[])],activated:[...(h.activated||[])],rescued:[...(h.rescued||[])],log:[...(h.log||[])]}))};
 if(effectLog.length)showSceneCue('어제의 선택이 오늘의 항로를 바꾸었습니다.');
 $('#navigationTitle').textContent=`${days[S.day].name} · ${level.title}`;$('#navigationBriefing').textContent=level.briefing;renderNavigation();if(!$('#navigationDialog').open)$('#navigationDialog').showModal();
}
function navigationGateOpen(gate,activated=navigationRuntime.activated){return navigationRuntime.level.switches.some(sw=>activated.has(sw.id)&&(sw.opens||[]).includes(gate.id))}
function navigationBlocked(pos,activated=navigationRuntime.activated){const l=navigationRuntime.level;if(pos[0]<0||pos[0]>=6||pos[1]<0||pos[1]>=6)return'지도 밖은 암초와 안개뿐이다.';if(l.reefs.some(p=>samePos(p,pos)))return'암초가 항로를 막는다.';const gate=l.gates.find(g=>samePos(g.pos,pos));if(gate&&!navigationGateOpen(gate,activated))return'잠긴 문이다. 연결된 종이나 구조등을 먼저 찾아야 한다.';return''}
function applyNavigationDiscoveries(pos,activated,collected,rescued,events){const l=navigationRuntime.level;const sw=l.switches.find(x=>samePos(x.pos,pos));if(sw&&!activated.has(sw.id)){activated.add(sw.id);events.push(`스위치 ${sw.id.replace(/-/g,' ')}가 켜지고 먼 문이 열린다.`)}const signal=l.signals.find(x=>samePos(x.pos,pos));if(signal&&!collected.has(signal.id)){collected.add(signal.id);events.push(navigationSignalMessages[signal.id]||`${signal.id} 신호를 기록했다.`)}const survivor=l.survivors.find(x=>samePos(x.pos,pos));if(survivor&&!rescued.has(survivor.id)){rescued.add(survivor.id);events.push(`${survivor.id}의 손을 잡아 배에 올린다. 좌석 하나의 무게만큼 항로의 의미가 달라진다.`)}}
function resolveNavigationMove(dir){
 const delta=navDirDelta[dir],l=navigationRuntime.level;if(!delta)return null;
 if(l.limitMode==='hard'&&!navigationRuntime.assisted&&navigationRuntime.moves>=navigationRuntime.effectiveLimit)return{error:'연료 한계에 닿았다. 되돌리기나 처음 항로를 사용해 계획을 고치자.'};
 const activated=new Set(navigationRuntime.activated),collected=new Set(navigationRuntime.collected),rescued=new Set(navigationRuntime.rescued),events=[];let pos=[navigationRuntime.pos[0]+delta[0],navigationRuntime.pos[1]+delta[1]],block=navigationBlocked(pos,activated);if(block)return{error:block};
 const visitedPushes=new Set();
 for(let guard=0;guard<12;guard++){
  applyNavigationDiscoveries(pos,activated,collected,rescued,events);
  const current=l.currents.find(c=>samePos(c.pos,pos));if(!current)break;
  const token=`${navKey(pos)}-${current.dir}`;if(visitedPushes.has(token))return{error:'조류가 원을 그린다. 이 각도로는 빠져나갈 수 없다.'};visitedPushes.add(token);
  const push=navDirDelta[current.dir],next=[pos[0]+push[0],pos[1]+push[1]];block=navigationBlocked(next,activated);if(block)return{error:`조류 끝이 막혀 있다. ${block}`};events.push(`조류가 배를 ${current.dir==='U'?'북':current.dir==='D'?'남':current.dir==='L'?'서':'동'}쪽으로 밀었다.`);pos=next;
 }
 applyNavigationDiscoveries(pos,activated,collected,rescued,events);return{pos,activated,collected,rescued,events};
}
function tryNavigationMove(dir){if(!navigationRuntime||!$('#navigationDialog').open)return;const result=resolveNavigationMove(dir);if(result.error){navigationRuntime.log=[result.error,...navigationRuntime.log].slice(0,4);sfx('wrong');renderNavigation();return}navigationRuntime.history.push(navSnapshot());navigationRuntime.pos=result.pos;navigationRuntime.activated=result.activated;navigationRuntime.collected=result.collected;navigationRuntime.rescued=result.rescued;navigationRuntime.moves++;navigationRuntime.log=[...(result.events.length?result.events:['파도만 갈라지고 신호는 없다.']),...navigationRuntime.log].slice(0,4);sfx('step');persistNavigation();renderNavigation();const encounter=nextUnseenNavigationEncounter();if(encounter){$('#navigationDialog').close();openNavigationEncounter(encounter.signalId);return}if(navigationComplete())setTimeout(completeNavigation,220)}
function nextUnseenNavigationEncounter(){if(!navigationRuntime)return null;return navigationEncounters.find(e=>e.day===S.day+1&&navigationRuntime.collected.has(e.signalId)&&!S.navigationEncounters[`${S.day}-${e.signalId}`])||null}
function openNavigationEncounter(signalId){const data=navigationEncounters.find(e=>e.day===S.day+1&&e.signalId===signalId);if(!data){S.navigationEncounters[`${S.day}-${signalId}`]={choiceId:'missing-data'};openNavigation();return}const pending=S.navEncounterPending;if(pending?.day===S.day&&pending.signalId===signalId&&pending.choice){showStory('밤바다 신호',data.title,[pending.choice.result],commitNavigationEncounter);return}S.navEncounterPending={day:S.day,signalId,choice:null};autosave(false);const choices=data.choices.map(o=>({label:o.label,result:o.result,onPick:()=>{S.navEncounterPending.choice={id:o.id,stat:o.stat,result:o.result,title:data.title};autosave(false)}}));showStory('밤바다 신호',data.title,data.pages,commitNavigationEncounter,choices)}
function commitNavigationEncounter(){const pending=S.navEncounterPending;if(!pending?.choice)return;const key=`${pending.day}-${pending.signalId}`,choice=pending.choice;if(!S.navigationEncounters[key]){if(choice.stat)S[choice.stat]++;S.choicesTrail.push({day:S.day,text:`항해 신호 · ${choice.title}: ${choice.id}`,stat:choice.stat});S.navigationEncounters[key]={choiceId:choice.id,stat:choice.stat,title:choice.title}}S.navEncounterPending=null;autosave();const next=nextUnseenNavigationEncounter();if(next){openNavigationEncounter(next.signalId);return}if(navigationComplete()){setTimeout(completeNavigation,180);return}openNavigation()}
function navigationComplete(){const l=navigationRuntime.level;return samePos(navigationRuntime.pos,l.goal)&&navigationRuntime.collected.size===l.signals.length&&navigationRuntime.activated.size===l.switches.length&&navigationRuntime.rescued.size===l.survivors.length}
function renderNavigation(){
 const r=navigationRuntime,l=r.level,grid=$('#navigationGrid');grid.innerHTML='';
 for(let y=0;y<6;y++)for(let x=0;x<6;x++){const pos=[x,y],cell=document.createElement('button'),icons=[],labels=[];cell.className='nav-cell';cell.setAttribute('role','gridcell');const reef=l.reefs.some(p=>samePos(p,pos)),gate=l.gates.find(g=>samePos(g.pos,pos)),current=l.currents.find(c=>samePos(c.pos,pos)),signal=l.signals.find(s=>samePos(s.pos,pos)),sw=l.switches.find(s=>samePos(s.pos,pos)),survivor=l.survivors.find(s=>samePos(s.pos,pos));if(reef){cell.classList.add('reef');icons.push('▲');labels.push('암초')}if(gate){cell.classList.add('gate');if(navigationGateOpen(gate))cell.classList.add('open');icons.push(navigationGateOpen(gate)?'□':'▣');labels.push(navigationGateOpen(gate)?'열린 문':'잠긴 문')}if(current){cell.classList.add('current');icons.push('≋');labels.push(`${current.dir} 방향 조류`)}if(signal&&!r.collected.has(signal.id)){icons.push('✦');labels.push('기억 신호')}if(sw){icons.push(r.activated.has(sw.id)?'◌':'⚙');labels.push(r.activated.has(sw.id)?'켜진 스위치':'스위치')}if(survivor&&!r.rescued.has(survivor.id)){icons.push('◉');labels.push('표류자')}if(samePos(pos,l.goal)){cell.classList.add('goal');icons.push('◎');labels.push('등대 부표')}if(samePos(pos,r.pos)){cell.classList.add('player');icons.push('◆');labels.push('현재 배 위치')}cell.innerHTML=`<span class="cell-icons">${icons.join(' ')||'·'}</span>${current?`<span class="current-arrow">${{U:'↑',R:'→',D:'↓',L:'←'}[current.dir]}</span>`:''}`;cell.setAttribute('aria-label',`${x+1}열 ${y+1}행, ${labels.join(', ')||'빈 바다'}`);const dx=x-r.pos[0],dy=y-r.pos[1];if(Math.abs(dx)+Math.abs(dy)===1)cell.onclick=()=>tryNavigationMove(dx===1?'R':dx===-1?'L':dy===1?'D':'U');else{cell.tabIndex=-1;cell.setAttribute('aria-disabled','true')}grid.appendChild(cell)}
 const over=r.moves>r.effectiveLimit,bonus=r.effectiveLimit-l.moveLimit;$('#navigationMoves').textContent=`조타 ${r.moves}/${r.effectiveLimit}${bonus?` · 선택 보너스 +${bonus}`:''}${r.assisted?' · 안전 항로':''}`;$('#navigationMoves').classList.toggle('over-limit',over);$('#navigationObjectives').innerHTML=`<b>항해 목표</b><br>✦ 신호 ${r.collected.size}/${l.signals.length}<br>⚙ 장치 ${r.activated.size}/${l.switches.length}<br>◉ 구조 ${r.rescued.size}/${l.survivors.length}<br>◎ 모든 목표 뒤 등대 도착${r.effects.labels.length?`<br><small>이전 선택 · ${r.effects.labels.map(esc).join(' / ')}</small>`:''}`;$('#navigationLog').textContent=r.log.join('\n');$('#navigationUndo').disabled=!r.history.length;
}
function undoNavigation(){if(!navigationRuntime?.history.length)return;const previous=navigationRuntime.history.pop(),history=navigationRuntime.history;restoreNavSnapshot(previous);navigationRuntime.history=history;navigationRuntime.log=['한 번의 조타를 되돌렸다.',...navigationRuntime.log].slice(0,4);persistNavigation();renderNavigation()}
function resetNavigation(){if(!navigationRuntime)return;const level=navigationRuntime.level,assisted=navigationRuntime.assisted,effects=navigationRuntime.effects,effectiveLimit=navigationRuntime.effectiveLimit;navigationRuntime={level,effects,effectiveLimit,pos:[...level.start],collected:new Set(),activated:new Set(),rescued:new Set(),moves:0,assisted,log:['처음 부표로 돌아왔다. 이번에는 전체 항로를 먼저 읽는다.'],history:[]};persistNavigation();renderNavigation()}
function assistNavigation(){if(!navigationRuntime)return;if(!navigationRuntime.assisted){navigationRuntime.assisted=true;S.assists++;const arrows={U:'↑',R:'→',D:'↓',L:'←'};navigationRuntime.log=[`안전 항로: ${[...navigationRuntime.level.minimalSolution].map(x=>arrows[x]).join(' ')}`,'연료 제한을 안전 모드로 바꿨다.',...navigationRuntime.log].slice(0,4);persistNavigation();renderNavigation();return}navigationRuntime.collected=new Set(navigationRuntime.level.signals.map(x=>x.id));navigationRuntime.activated=new Set(navigationRuntime.level.switches.map(x=>x.id));navigationRuntime.rescued=new Set(navigationRuntime.level.survivors.map(x=>x.id));navigationRuntime.pos=[...navigationRuntime.level.goal];navigationRuntime.log=['일지의 항로를 따라 남은 조타를 완성했다.'];renderNavigation();setTimeout(completeNavigation,180)}
function completeNavigation(){if(!navigationRuntime||S.navigationDone[S.day])return;const l=navigationRuntime.level,summary=navigationDebriefs[S.day],effectText=navigationRuntime.effects.labels.length?`어제의 결정은 실제 항로에 남았다. ${navigationRuntime.effects.labels.join(' ')}`:'';S.navigationDone[S.day]=true;S.navigationLogs[S.day]={title:l.title,moves:navigationRuntime.moves,limit:navigationRuntime.effectiveLimit,baseLimit:l.moveLimit,assisted:navigationRuntime.assisted,text:summary,signals:[...navigationRuntime.collected],consequences:[...navigationRuntime.effects.labels]};delete S.navigationProgress[S.day];if(Object.values(S.navigationDone).filter(Boolean).length===7)unlock('navigator');$('#navigationDialog').close();navigationRuntime=null;autosave();sfx('solve');showStory('미라',`${l.title} · 항해 완료`,[summary,...(effectText?[effectText]:[]),'등대의 낮은 문이 열린다. 이제 섬이 들려준 기록과 바다에서 직접 되찾은 신호를 함께 대면해야 한다.'],()=>{if(S.visited[`${S.day}-lighthouse`]){if(!S.puzzleDone[S.day])openPuzzle();else afterVisit()}else startScene('lighthouse')})}

/* superseded puzzle renderer
function openPuzzle(){puzzleRuntime={mode:['tuner','sequence','phrase','tuner','sequence','phrase','lens'][S.day],input:[],assisted:false};const body=$('#puzzleBody'),mode=puzzleRuntime.mode;$('#tunerFeedback').textContent='신호 속에 숨은 기억을 찾아야 한다.';$('#checkTune').style.display='inline-block';
 if(mode==='tuner'){const d=days[S.day];$('#puzzleHint').textContent=`관측일지: 파형 폭 ${d.freq}, 시간 밀림 ${d.phase}. 두 기록을 렌즈에 옮겨라.`;body.innerHTML=`<div class="tuner"><div id="targetWave" class="wave target"></div><div id="userWave" class="wave user"></div></div><label>파형 폭 <input id="freq" type="range" min="1" max="12" value="6"><output id="freqOut">6</output></label><label>시간 밀림 <input id="phase" type="range" min="0" max="10" value="5"><output id="phaseOut">5</output></label>`;$('#targetWave').style.setProperty('--wave-size',`${36+d.freq*9}px`);$('#freq').oninput=$('#phase').oninput=updateWave;updateWave()}
 if(mode==='sequence'){const glyphs=['◯','△','◇','✦'],seq=S.day===1?[0,2,1,3]:[3,1,0,2,3];puzzleRuntime.answer=seq;$('#puzzleHint').textContent=`종의 기록: ${seq.map(i=>glyphs[i]).join(' → ')}. 들린 순서대로 되돌려 보내라.`;body.innerHTML=`<div class="assembled" id="assembled">아직 입력 없음</div><div class="memory-sequence">${glyphs.map((g,i)=>`<button data-tone="${i}" aria-label="기억 음 ${g}">${g}</button>`).join('')}</div>`;$$('[data-tone]').forEach(b=>b.onclick=()=>{puzzleRuntime.input.push(+b.dataset.tone);$('#assembled').textContent=puzzleRuntime.input.map(i=>glyphs[i]).join(' → ');b.classList.add('lit');setTimeout(()=>b.classList.remove('lit'),180);sfx('tone',+b.dataset.tone)})}
 if(mode==='phrase'){const answer=S.day===2?['나를','용서하지','말고','기억해']:['나는','두려웠고','그래도','선택했다'];puzzleRuntime.answer=answer;$('#puzzleHint').textContent='잡음 속 단어를 눌러 방송 문장을 복원하라. 선택한 순서가 곧 문장이 된다.';const shuffled=S.day===2?['기억해','나를','말고','용서하지']:['선택했다','두려웠고','나는','그래도'];body.innerHTML=`<div class="assembled" id="assembled">아직 입력 없음</div><div class="word-bank">${shuffled.map(w=>`<button data-word="${w}">${w}</button>`).join('')}</div><button id="resetWords" class="text-btn">다시 배열</button>`;$$('[data-word]').forEach(b=>b.onclick=()=>{if(b.classList.contains('selected'))return;b.classList.add('selected');puzzleRuntime.input.push(b.dataset.word);$('#assembled').textContent=puzzleRuntime.input.join(' ');sfx('tone',puzzleRuntime.input.length)});$('#resetWords').onclick=()=>{puzzleRuntime.input=[];$$('[data-word]').forEach(b=>b.classList.remove('selected'));$('#assembled').textContent='아직 입력 없음'}}
 if(mode==='lens'){puzzleRuntime.answer=[0,2,4,6,8];$('#puzzleHint').textContent='금이 간 렌즈에서 빛나는 다섯 조각(네 모서리와 중심)을 골라 새벽빛을 완성하라.';body.innerHTML=`<div class="lens-grid">${Array.from({length:9},(_,i)=>`<button data-lens="${i}" aria-label="렌즈 조각 ${i+1}">◫</button>`).join('')}</div>`;$$('[data-lens]').forEach(b=>b.onclick=()=>{const i=+b.dataset.lens;b.classList.toggle('active');puzzleRuntime.input=b.classList.contains('active')?[...puzzleRuntime.input,i]:puzzleRuntime.input.filter(x=>x!==i);sfx('tone',i%4)})}
 $('#puzzleDialog').showModal()}
function updateWave(){if(!$('#freq'))return;const f=+$('#freq').value,p=+$('#phase').value,d=days[S.day];$('#freqOut').value=f;$('#phaseOut').value=p;$('#userWave').style.setProperty('--wave-size',`${36+f*9}px`);$('#userWave').style.setProperty('--shift',(p-d.phase)*7+'px')}
function checkPuzzle(){const mode=puzzleRuntime.mode;let ok=false;if(mode==='tuner'){const d=days[S.day],f=+$('#freq').value,p=+$('#phase').value;ok=f===d.freq&&p===d.phase;if(!ok)$('#tunerFeedback').textContent=`${f<d.freq?'파형을 더 넓혀라.':f>d.freq?'파형을 더 좁혀라.':'폭은 맞았다.'} ${p<d.phase?'밀림을 늦춰라.':p>d.phase?'밀림을 앞당겨라.':'시간도 맞았다.'}`;}else{ok=JSON.stringify(puzzleRuntime.input)===JSON.stringify(puzzleRuntime.answer);if(!ok)$('#tunerFeedback').textContent=mode==='sequence'?'울림의 순서가 다르다. 기록을 보며 처음부터 다시 입력하라.':mode==='phrase'?'문장은 맞는 단어보다 말하는 순서가 중요하다. 다시 배열해 보자.':'빛이 중심에서 이어지지 않는다. 네 모서리와 가운데를 확인하라.'}if(!ok&&mode!=='lens'){$$('#puzzleBody .selected').forEach(b=>b.classList.remove('selected'));puzzleRuntime.input=[];if($('#assembled'))$('#assembled').textContent='아직 입력 없음'}}if(ok)solvePuzzle()}
*/
function openPuzzle(){
 puzzleRuntime={mode:['tuner','sequence','phrase','tuner','sequence','phrase','lens'][S.day],input:[],assisted:false};
 const body=$('#puzzleBody'),mode=puzzleRuntime.mode;
 $('#tunerFeedback').textContent='신호 속에 숨은 기억을 찾아야 한다.';
 if(mode==='tuner'){
  const d=days[S.day];
  $('#puzzleHint').textContent='두 파형이 정확히 겹쳐 한 줄처럼 보이도록 폭과 시간 밀림을 조율하라. 숫자는 답이 아니라 조타 눈금이다.';
  body.innerHTML='<div class="tuner"><div id="targetWave" class="wave target"></div><div id="userWave" class="wave user"></div></div><label>파형 폭 <input id="freq" type="range" min="1" max="12" value="6"><output id="freqOut">6</output></label><label>시간 밀림 <input id="phase" type="range" min="0" max="10" value="5"><output id="phaseOut">5</output></label>';
  $('#targetWave').style.setProperty('--wave-size',`${36+d.freq*9}px`);
  $('#freq').oninput=$('#phase').oninput=updateWave;updateWave();
 }
 if(mode==='sequence'){
  const glyphs=['원','세모','마름모','별'],seq=S.day===1?[0,2,1,3]:[3,1,0,2,3];puzzleRuntime.answer=seq;
  $('#puzzleHint').textContent='‘신호 다시 듣기’를 누르면 네 개의 종이 빛과 높낮이로 울린다. 기억한 순서대로 되돌려 보내라.';
  body.innerHTML=`<button id="replaySignal" class="text-btn">신호 다시 듣기</button><div class="assembled" id="assembled">아직 입력 없음</div><div class="memory-sequence">${glyphs.map((g,i)=>`<button data-tone="${i}" aria-label="기억 음 ${g}">${g}</button>`).join('')}</div>`;
  $$('[data-tone]').forEach(b=>b.onclick=()=>{puzzleRuntime.input.push(+b.dataset.tone);$('#assembled').textContent=puzzleRuntime.input.map(i=>glyphs[i]).join(' → ');b.classList.add('lit');setTimeout(()=>b.classList.remove('lit'),180);sfx('tone',+b.dataset.tone)});
  $('#replaySignal').onclick=playSequenceClue;setTimeout(playSequenceClue,260);
 }
 if(mode==='phrase'){
  const answer=S.day===2?['나를','용서하지','말고','기억해']:['나는','두려웠고','그래도','선택했다'];
  const shuffled=S.day===2?['기억해','나를','말고','용서하지']:['선택했다','두려웠고','나는','그래도'];puzzleRuntime.answer=answer;
  $('#puzzleHint').textContent='잡음 속 단어를 눌러 방송 문장을 복원하라. 선택한 순서가 곧 문장이 된다.';
  body.innerHTML=`<div class="assembled" id="assembled">아직 입력 없음</div><div class="word-bank">${shuffled.map(w=>`<button data-word="${w}">${w}</button>`).join('')}</div><button id="resetWords" class="text-btn">다시 배열</button>`;
  $$('[data-word]').forEach(b=>b.onclick=()=>{if(b.classList.contains('selected'))return;b.classList.add('selected');puzzleRuntime.input.push(b.dataset.word);$('#assembled').textContent=puzzleRuntime.input.join(' ');sfx('tone',puzzleRuntime.input.length)});
  $('#resetWords').onclick=()=>{puzzleRuntime.input=[];$$('[data-word]').forEach(b=>b.classList.remove('selected'));$('#assembled').textContent='아직 입력 없음'};
 }
 if(mode==='lens'){
  puzzleRuntime.answer=[0,2,4,6,8];
  $('#puzzleHint').textContent='빛은 서로 가장 멀리 떨어진 조각들을 잇고, 모든 대각선이 만나는 한 점에서 잠시 머문다. 다섯 조각으로 새벽빛을 완성하라.';
  body.innerHTML=`<div class="lens-grid">${Array.from({length:9},(_,i)=>`<button data-lens="${i}" aria-label="렌즈 조각 ${i+1}">조각</button>`).join('')}</div>`;
  $$('[data-lens]').forEach(b=>b.onclick=()=>{const i=+b.dataset.lens;b.classList.toggle('active');puzzleRuntime.input=b.classList.contains('active')?[...puzzleRuntime.input,i]:puzzleRuntime.input.filter(x=>x!==i);sfx('tone',i%4)});
 }
 $('#puzzleDialog').showModal();
}
function playSequenceClue(){if(!puzzleRuntime||puzzleRuntime.mode!=='sequence'||puzzleRuntime.playing)return;puzzleRuntime.playing=true;const buttons=$$('[data-tone]');puzzleRuntime.answer.forEach((tone,i)=>setTimeout(()=>{buttons[tone]?.classList.add('lit');sfx('tone',tone);setTimeout(()=>buttons[tone]?.classList.remove('lit'),260)},i*520));setTimeout(()=>{if(puzzleRuntime)puzzleRuntime.playing=false},puzzleRuntime.answer.length*520+100)}
function updateWave(){if(!$('#freq'))return;const f=+$('#freq').value,p=+$('#phase').value,d=days[S.day];$('#freqOut').value=f;$('#phaseOut').value=p;$('#userWave').style.setProperty('--wave-size',`${36+f*9}px`);$('#userWave').style.setProperty('--shift',(p-d.phase)*7+'px')}
function checkPuzzle(){
 const mode=puzzleRuntime.mode;let ok=false;
 if(mode==='tuner'){
  const d=days[S.day],f=+$('#freq').value,p=+$('#phase').value;ok=f===d.freq&&p===d.phase;
  if(!ok)$('#tunerFeedback').textContent=`${f<d.freq?'파형을 더 넓혀라.':f>d.freq?'파형을 더 좁혀라.':'폭은 맞았다.'} ${p<d.phase?'밀림을 늦춰라.':p>d.phase?'밀림을 앞당겨라.':'시간도 맞았다.'}`;
 }else{
  const input=mode==='lens'?[...puzzleRuntime.input].sort((a,b)=>a-b):puzzleRuntime.input;
  ok=JSON.stringify(input)===JSON.stringify(puzzleRuntime.answer);
   if(!ok)$('#tunerFeedback').textContent=mode==='sequence'?'울림의 순서가 다르다. 신호를 다시 듣고 박자 사이의 높낮이를 기억하자.':mode==='phrase'?'맞는 단어를 말하는 순서로 배열해야 한다.':'빛줄기 사이가 끊긴다. 서로 가장 먼 조각과 대각선의 교차점을 확인하자.';
  if(!ok&&mode!=='lens'){$$('#puzzleBody .selected').forEach(b=>b.classList.remove('selected'));puzzleRuntime.input=[];if($('#assembled'))$('#assembled').textContent='아직 입력 없음'}
 }
 if(ok)solvePuzzle();
}
function solvePuzzle(){const assisted=puzzleRuntime?.assisted;S.puzzleDone[S.day]=true;if(!assisted)unlock('listener');$('#puzzleDialog').close();sfx('solve');toast(assisted?'일지의 단서가 신호를 완성했습니다.':'신호가 바다 너머에 닿았습니다.');autosave();renderMap();afterVisit()}
function assistPuzzle(){S.assists++;puzzleRuntime.assisted=true;solvePuzzle()}

function afterVisit(){if(transitioning)return;const all=routes[S.day].every(id=>S.visited[`${S.day}-${id}`]);if(all&&S.puzzleDone[S.day]){if(!S.deductions[S.day])openEchoHub();else if(!S.dives[S.day])openMemoryDive();else if(!S.conversations[S.day]?.done)openNightConversation();else finishDay()}}
function openEchoHub(){const today=dayAfterimageCount(),remaining=Math.max(0,AFTERIMAGE_DAILY_LIMIT-today),total=afterimageCount();$('#echoHubProgress').textContent=`오늘 선택 ${today}/${AFTERIMAGE_DAILY_LIMIT} · 전체 ${total}/${AFTERIMAGE_GOAL}${total>=AFTERIMAGE_GOAL?' · 수집 목표 완료':''}`;const box=$('#echoHubLocations');box.innerHTML='';routes[S.day].filter(id=>canCollectAfterimage(id)).forEach(id=>{const clue=S.clues.find(c=>c.key===`${S.day}-${id}`),b=document.createElement('button');b.innerHTML=`<b>${esc(locs[id].name)}</b>${esc(clue?.echo||'고르지 않은 관점이 낮게 울린다.')}`;b.onclick=()=>{$('#echoHubDialog').close();openAfterimage(id)};box.appendChild(b)});if(!box.children.length)box.innerHTML=`<p>${total>=AFTERIMAGE_GOAL?'필요한 잔상을 모두 기록했습니다. 이제 사건을 연결할 시간입니다.':remaining===0?'오늘 고른 두 목소리를 품고 추론으로 나아갑니다.':'붙잡을 수 있는 잔상이 없습니다.'}</p>`;if(!$('#echoHubDialog').open)$('#echoHubDialog').showModal();$('#startDeduction').focus()}
function startDeductionFromHub(){$('#echoHubDialog').close();openDeduction()}
function openDeduction(){
 const d=deductionData[S.day],clues=S.clues.filter(c=>c.day===S.day);deductionRuntime={selected:[]};
 $('#deductionTitle').textContent=`${days[S.day].name}의 추론`;$('#deductionQuestion').textContent=d.q;$('#deductionFeedback').textContent='증거 세 장을 고르면 결론을 선택할 수 있습니다.';
 const evidence=$('#evidenceBoard');evidence.innerHTML='';
 clues.forEach(c=>{const loc=c.key.split('-')[1],b=document.createElement('button');b.className='evidence-card';b.dataset.loc=loc;b.innerHTML=`<b>${esc(c.title)}</b><span>${esc(c.text)}</span><small>당신이 남긴 관점 · ${esc(c.echo||'')}</small>`;b.onclick=()=>{if(b.classList.contains('selected')){b.classList.remove('selected');deductionRuntime.selected=deductionRuntime.selected.filter(x=>x!==loc)}else if(deductionRuntime.selected.length<3){b.classList.add('selected');deductionRuntime.selected.push(loc)}else{toast('증거는 세 장까지 연결할 수 있습니다.')}$$('#deductionChoices button').forEach(x=>x.disabled=deductionRuntime.selected.length!==3);$('#deductionFeedback').textContent=`선택한 증거 ${deductionRuntime.selected.length}/3`};evidence.appendChild(b)});
 const box=$('#deductionChoices');box.innerHTML='';
 d.a.forEach((x,i)=>{const b=document.createElement('button');b.textContent=x;b.disabled=true;b.onclick=()=>{const support=deductionRuntime.selected.filter(x=>deductionEvidence[S.day].includes(x)).length;if(i===d.c&&support>=2){solveDeduction(false);return}const attempt=S.puzzleAttempts[`d${S.day}`]=(S.puzzleAttempts[`d${S.day}`]||0)+1;if(i!==d.c)$('#deductionFeedback').textContent='그 결론으로는 오늘의 기록 하나가 설명되지 않는다. 질문의 주어와 시제를 다시 확인하자.';else if(attempt<2)$('#deductionFeedback').textContent='결론은 맞지만 연결이 약하다. 같은 숫자·시각·필압이 서로 다른 장소에서 반복되는 카드 두 장 이상을 찾아보자.';else{const names=deductionEvidence[S.day].map(id=>locs[id].name).join('·');$('#deductionFeedback').textContent=`두 번째 힌트: ${names}의 기록 사이에 직접 반복된 표식을 찾아보자.`}sfx('wrong')};box.appendChild(b)});
 $('#deductionDialog').showModal();
}
function solveDeduction(assisted=false){const d=deductionData[S.day];if(assisted)S.assists++;S.deductions[S.day]={evidence:assisted?[...deductionEvidence[S.day]]:[...(deductionRuntime?.selected||[])],conclusion:d.a[d.c],assisted};$('#deductionDialog').close();toast(d.e);sfx('solve');if(Object.keys(S.deductions).length===7)unlock('detective');autosave();setTimeout(openMemoryDive,350)}
function openMemoryDive(){
 const d=diveData[S.day];diveRuntime={input:[],seen:new Set(S.diveSeen[S.day]||[]),assisted:false,phase:'inspect'};
 $('#diveTitle').textContent=d.title;$('#diveIntro').textContent=d.intro;$('#diveInstruction').textContent='먼저 순서를 추측하지 말고 다섯 물건의 생활 흔적을 모두 살펴보세요.';$('#diveDetail').textContent='사건의 증거가 아닌, 그 사람이 하루를 보낸 방식을 찾아보세요.';$('#diveTimeline').textContent='관찰 단계 · 아직 시간선을 만들지 않습니다';$('#diveFeedback').textContent='';$('#startDiveOrder').hidden=false;$('#startDiveOrder').disabled=diveRuntime.seen.size<d.objects.length;$('#checkDive').disabled=true;$('#resetDive').disabled=true;
 const box=$('#diveObjects');box.innerHTML='';
 d.objects.forEach(o=>{const b=document.createElement('button');b.textContent=o.label;b.dataset.object=o.id;if(diveRuntime.seen.has(o.id))b.classList.add('seen');b.onclick=()=>handleDiveObject(o,b);box.appendChild(b)});
 $('#memoryDiveDialog').showModal();
}
function handleDiveObject(o,b){const d=diveData[S.day];diveRuntime.seen.add(o.id);b.classList.add('seen');$('#diveDetail').textContent=o.text;S.diveSeen[S.day]=[...diveRuntime.seen];if(diveRuntime.phase==='inspect'){const left=d.objects.length-diveRuntime.seen.size;$('#diveFeedback').textContent=left?`생활 흔적 ${left}개가 아직 보이지 않는다.`:'다섯 물건을 모두 보았다. 이제 질문을 읽고 시간선을 만들 수 있다.';$('#startDiveOrder').disabled=left>0;autosave(false);sfx('tone',diveRuntime.seen.size);return}if(b.classList.contains('chosen')){b.classList.remove('chosen');diveRuntime.input=diveRuntime.input.filter(x=>x!==o.id)}else if(diveRuntime.input.length<3){b.classList.add('chosen');diveRuntime.input.push(o.id)}else{toast('시간선에는 세 물건만 놓을 수 있습니다. 하나를 빼고 다시 고르세요.');return}$('#diveTimeline').textContent=diveRuntime.input.length?diveRuntime.input.map(id=>d.objects.find(x=>x.id===id).label).join(' → '):'아직 선택한 기억 없음';sfx('tone',diveRuntime.input.length)}
function startDiveOrder(){const d=diveData[S.day];if(!diveRuntime||diveRuntime.seen.size<d.objects.length)return;diveRuntime.phase='order';diveRuntime.input=[];$('#startDiveOrder').hidden=true;$('#diveInstruction').textContent=divePrompts[S.day];$('#diveDetail').textContent='질문에 답하는 세 물건을 일어난 시간순으로 고르세요. 방금 본 설명은 물건을 다시 누르면 확인할 수 있습니다.';$('#diveTimeline').textContent='아직 선택한 기억 없음';$('#diveFeedback').textContent='관찰과 배열이 분리되었습니다. 기억한 의미를 시간으로 이어 보세요.';$('#checkDive').disabled=false;$('#resetDive').disabled=false;$$('#diveObjects button').forEach(b=>b.classList.remove('chosen'))}
function checkDive(){const d=diveData[S.day];if(diveRuntime.phase!=='order'){$('#diveFeedback').textContent='다섯 생활 흔적을 먼저 살펴본 뒤 시간선 배열을 시작하세요.';sfx('wrong');return}const ok=JSON.stringify(diveRuntime.input)===JSON.stringify(d.answer);if(ok){solveDive();return}S.puzzleAttempts[`m${S.day}`]=(S.puzzleAttempts[`m${S.day}`]||0)+1;$('#diveFeedback').textContent=diveRuntime.input.length!==3?'시간선에는 정확히 세 물건이 필요하다.':'사물은 맞아도 시간이 어긋났다. 질문과 각 설명의 시점을 다시 확인해 보자.';sfx('wrong')}
function resetDive(){if(diveRuntime?.phase!=='order')return;diveRuntime.input=[];$$('#diveObjects button').forEach(b=>b.classList.remove('chosen'));$('#diveTimeline').textContent='아직 선택한 기억 없음'}
function solveDive(){S.dives[S.day]=true;$('#memoryDiveDialog').close();sfx('solve');if(Object.keys(S.dives).length===7)unlock('diver');autosave();toast('사건이 아니라 한 사람의 하루를 기억했습니다.');setTimeout(openNightConversation,350)}
function assistDive(){S.assists++;diveRuntime.assisted=true;solveDive()}
function setConversationPortrait(name){const img=$('#conversationPortrait'),file=portraitBySpeaker[name];if(!file){img.hidden=true;img.removeAttribute('src');img.alt='';return}img.src=`assets/${file}`;img.alt=`${name} 인물화`;img.hidden=false}
function openNightConversation(){
 const data=nightConversations[S.day];if(!data){finishDay();return}const saved=S.conversations[S.day]||{speakerId:null,asked:[],auxiliaryAsked:null,done:false};if(saved.done){afterVisit();return}if(!Array.isArray(saved.asked))saved.asked=[];saved.auxiliaryAsked=saved.auxiliaryAsked||null;S.conversations[S.day]=saved;conversationRuntime={data,state:saved};renderNightConversation();if(!$('#conversationDialog').open)$('#conversationDialog').showModal();
}
function renderNightConversation(response=''){
 const {data,state}=conversationRuntime,choice=data.choices.find(c=>c.id===state.speakerId),box=$('#conversationChoices');box.innerHTML='';$('#conversationResponse').textContent=response;
 if(!choice){setConversationPortrait('');$('#conversationTitle').textContent=data.title;$('#conversationIntro').textContent='오늘 밤 한 사람이 네 곁에 오래 남고, 다른 한 사람은 떠나기 전 짧은 말을 건넨다. 누구 곁에 앉을지는 이 항해에서 되돌릴 수 없다.';data.choices.forEach(c=>{const b=document.createElement('button');b.innerHTML=`<b>${esc(c.name)}와 오래 이야기한다</b><span>${esc(c.intro)}</span>`;b.onclick=()=>{state.speakerId=c.id;autosave(false);renderNightConversation(c.intro);sfx('choice')};box.appendChild(b)});$('#conversationProgress').textContent='주 대화 한 사람 · 세 질문 · 멀어지는 목소리 한 질문';$('#finishConversation').hidden=true;return}
 const auxiliary=data.choices.find(c=>c.id!==state.speakerId);setConversationPortrait(choice.name);$('#conversationTitle').textContent=`${data.title} · ${choice.name}`;$('#conversationIntro').textContent=choice.intro;choice.questions.forEach(q=>{const asked=state.asked.includes(q.id),b=document.createElement('button');b.textContent=`${asked?'✓ ':''}${q.label}`;b.disabled=asked||state.asked.length>=3;b.onclick=()=>askNightQuestion(choice,q);box.appendChild(b)});if(state.asked.length>=3&&auxiliary){const marker=document.createElement('p');marker.className='conversation-aside-label';marker.textContent=`${auxiliary.name}이 떠나기 전, 하나만 물을 수 있다.`;box.appendChild(marker);auxiliary.questions.forEach(q=>{const asked=state.auxiliaryAsked===q.id,b=document.createElement('button');b.textContent=`${asked?'✓ ':''}${q.label}`;b.disabled=!!state.auxiliaryAsked;b.onclick=()=>askAuxiliaryQuestion(auxiliary,q);box.appendChild(b)})}$('#conversationProgress').textContent=`가까운 대답 ${state.asked.length}/3 · 멀어지는 대답 ${state.auxiliaryAsked?'1/1':'0/1'} · 듣지 못한 말은 다음 플레이에 남습니다.`;$('#finishConversation').hidden=state.asked.length<3||!state.auxiliaryAsked;
}
function askNightQuestion(choice,q){const state=conversationRuntime.state;if(state.asked.includes(q.id)||state.asked.length>=3)return;state.asked.push(q.id);if(q.stat)S[q.stat]++;S.bonds[choice.name]=(S.bonds[choice.name]||0)+1;S.choicesTrail.push({day:S.day,text:`밤 대화 · ${choice.name}: ${q.label}`,stat:q.stat});autosave(false);renderNightConversation(q.answer);sfx('choice')}
function askAuxiliaryQuestion(choice,q){const state=conversationRuntime.state;if(state.auxiliaryAsked||state.asked.length<3)return;state.auxiliaryAsked=q.id;if(q.stat)S[q.stat]++;S.bonds[choice.name]=(S.bonds[choice.name]||0)+1;S.choicesTrail.push({day:S.day,text:`멀어지는 목소리 · ${choice.name}: ${q.label}`,stat:q.stat});autosave(false);renderNightConversation(`${choice.intro}\n\n${q.answer}`);sfx('choice')}
function finishNightConversation(){if(!conversationRuntime||conversationRuntime.state.asked.length<3||!conversationRuntime.state.auxiliaryAsked)return;conversationRuntime.state.done=true;if(completedConversationCount()===7)unlock('confidant');$('#conversationDialog').close();const name=conversationRuntime.data.choices.find(c=>c.id===conversationRuntime.state.speakerId)?.name||'누군가';conversationRuntime=null;autosave();toast(`${name}와 나눈 네 조각의 말을 항해일지에 남겼습니다.`);setTimeout(afterVisit,250)}
function stormOutcomePages(){return(S.storm?.decisions||[]).map(decision=>stormOutcomes[decision.flag]?.aftermath).filter(Boolean)}
function broadcastTranscript(){return(S.broadcast?.decisions||[]).map(decision=>decision.line).filter(Boolean).join('\n\n')}
function openFinalBroadcast(){
 const broadcast=S.broadcast||(S.broadcast={stage:0,decisions:[],pending:null,completed:false});if(!Array.isArray(broadcast.decisions))broadcast.decisions=[];
 if(broadcast.completed){finalChoice();return}
 $('#island').dataset.scene='storm';audio?.setScene?.({day:S.day,location:'storm',phase:'broadcast'});
 if(broadcast.pending){const stage=finalBroadcastStages[broadcast.pending.stage]||finalBroadcastStages[broadcast.stage];showStory('미라',stage?.title||'최후 방송',[broadcast.pending.result],commitBroadcastDecision);return}
 const stage=finalBroadcastStages[broadcast.stage];if(!stage){completeFinalBroadcast();return}
 const choices=stage.choices.map(option=>({label:option.label,result:option.result,onPick:()=>{broadcast.pending={stage:broadcast.stage,stageId:stage.id,choiceId:option.id,label:option.label,line:option.line,stat:option.stat,result:option.result};autosave(false)}}));
 showStory('미라',stage.title,stage.pages,commitBroadcastDecision,choices)
}
function commitBroadcastDecision(){
 const broadcast=S.broadcast,pending=broadcast?.pending;if(!pending)return;
 if(!broadcast.decisions.some(decision=>decision.stageId===pending.stageId)){if(pending.stat)S[pending.stat]++;broadcast.decisions.push({stageId:pending.stageId,choiceId:pending.choiceId,label:pending.label,line:pending.line,stat:pending.stat});S.choicesTrail.push({day:S.day,text:`최후 방송 · ${pending.label}`,stat:pending.stat})}
 broadcast.stage=Math.max(broadcast.stage,pending.stage+1);broadcast.pending=null;autosave();setTimeout(openFinalBroadcast,220)
}
function completeFinalBroadcast(){
 const broadcast=S.broadcast;if(broadcast.completed){finalChoice();return}broadcast.completed=true;broadcast.stage=finalBroadcastStages.length;unlock('broadcaster');autosave();sfx('signal');const transcript=broadcastTranscript();
 showStory('미라','최후 방송 · 송신',['네가 고른 네 문장은 서로를 완벽하게 설명하지 않는다. 그래서 이 방송은 영웅담이나 자백이 아니라, 다음 사람이 고쳐 읽을 수 있는 기록이 된다.',transcript,'송신 버튼을 누르자 섬의 모든 창문에 같은 새벽빛이 켜진다. 이제 마지막 빛을 어디에 둘지 선택할 수 있다.'],finalChoice)
}
function openStormClimax(){
 $('#island').dataset.scene='storm';const storm=S.storm||(S.storm={stage:0,decisions:[],pending:null,completed:false});if(!Array.isArray(storm.decisions))storm.decisions=[];
 audio?.setScene?.({day:S.day,location:'storm',phase:'storm'});if(storm.stage===0&&!storm.pending)sfx('thunder');
 if(storm.completed){openFinalBroadcast();return}if(storm.pending){const stage=veteranClimax[storm.pending.stage]||veteranClimax[storm.stage];showStory('미라',stage?.title||'폭풍의 대가',[storm.pending.result],commitStormDecision);return}
 const stage=veteranClimax[storm.stage];if(!stage){completeStormClimax();return}const choices=stage.choices.map(o=>({label:`${o.label}${o.cost?` · 대가: ${o.cost}`:''}`,result:o.result,onPick:()=>{storm.pending={stage:storm.stage,stageId:stage.id,choiceId:o.id,label:o.label,stat:o.stat,result:o.result,cost:o.cost||'',flag:o.flag||''};autosave(false)}}));showStory('세이렌호의 기억',stage.title,stage.pages,commitStormDecision,choices)
}
function commitStormDecision(){const storm=S.storm,p=storm?.pending;if(!p)return;if(!storm.decisions.some(d=>d.stageId===p.stageId)){if(p.stat)S[p.stat]++;storm.decisions.push({stageId:p.stageId,choiceId:p.choiceId,label:p.label,stat:p.stat,cost:p.cost,flag:p.flag});S.choicesTrail.push({day:S.day,text:`폭풍 재구성 · ${p.label}`,stat:p.stat})}storm.stage=Math.max(storm.stage,p.stage+1);storm.pending=null;autosave();setTimeout(openStormClimax,220)}
function completeStormClimax(){const storm=S.storm;if(storm.completed){openFinalBroadcast();return}storm.completed=true;storm.stage=veteranClimax.length;unlock('helmsman');autosave();const costs=storm.decisions.map((d,i)=>`${i+1}. ${d.label}${d.cost?` — ${d.cost}`:''}`),outcomes=stormOutcomePages();showStory('미라','폭풍이 지나간 자리',['기억 속 폭풍은 멎었지만 네가 고른 다섯 대가는 지워지지 않는다. 아무 선택도 모두를 구하지 못했고, 그래서 마지막 자리를 내어 준 한 사람의 행동은 예정된 영웅담이 아니라 두려움 속에서 감당한 결정으로 돌아온다.',...outcomes,`선택의 대가\n${costs.join('\n')}`,'라온은 네 손에서 젖은 명단을 받아 든다. “이제 불을 어떻게 할지는 과거의 미라가 아니라, 여기까지 전부 본 네가 정해야 해.” 하지만 먼저, 살아 있는 해안에 무엇을 말할지 네 목소리로 정해야 한다.'],openFinalBroadcast)}
function finishDay(){if(transitioning)return;transitioning=true;if(S.day===6){unlock('witness');transitioning=false;if(openFinalDayRipples())return;resumeFinalSequence();return}const d=S.day;const advanceState=()=>{S.day=d+1;S.current=routes[d+1][0];transitioning=false};const revealNextDay=()=>{autosave();renderMap();if(!openPendingRipples())toast('새로운 날이 밝았습니다.')};showStory('미라의 항해일지',`${days[d].name}의 끝`,['오늘의 단서들이 하나의 항로로 이어진다.',dayReflections[d]],revealNextDay,reflectionChoices[d].map(o=>({...o,tag:`${days[d].name}: ${o.label}`,onPick:advanceState})))}
function finalChoice(){if(!S.broadcast?.completed){openFinalBroadcast();return}const delta=S.truth-S.mercy,balanced=Math.abs(delta)<=3,completePath=Object.keys(S.deductions).length===7&&Object.values(S.navigationDone).filter(Boolean).length===7&&completedConversationCount()===7&&S.storm?.completed&&S.broadcast?.completed;if(balanced&&completePath)unlock('balanced');const opts=[];if(delta<=3)opts.push({label:`빛을 끈다 — 놓아준다${delta< -3?' · 당신이 지킨 사람들의 온기가 이 길을 열었다':''}`,end:'release'});if(delta>=-3)opts.push({label:`빛을 하늘로 돌린다 — 불완전한 이야기를 남긴다${delta>3?' · 당신이 모은 사실들이 이 길을 열었다':''}`,end:'stars'});opts.push({label:'빛을 지킨다 — 대가를 알면서 한 번 더 함께한다',end:'remain'});if(balanced&&completePath){opts.push({label:'빛을 새벽에 섞는다 — 기억과 미래의 빈틈을 받아들인다',end:'dawn'});unlock('fourth')}$('#island').dataset.scene='storm';audio?.setScene?.({day:S.day,location:'storm',phase:'final-choice'});showStory('세이렌 등대','마지막 빛',['렌즈 손잡이에 손을 얹는다. 과거의 결과는 바뀌지 않는다. 그러나 무엇을 비추며 기억할지는 지금의 네가 정한다. 네가 외면한 관점과 듣지 못한 질문도 이 선택의 일부다.',`네 목소리로 완성한 방송이 아직 바다를 건너고 있다.\n\n${broadcastTranscript()}`,`너는 진실을 ${S.truth}번, 사람의 마음을 ${S.mercy}번 먼저 바라봤다. 그래서 지금 손이 닿는 빛은 ${opts.length}개뿐이다. 다른 길은 새 항해에서 다른 선택을 해야 열린다.`],()=>{},opts)}
function chunkPages(lines,size=4){const pages=[];for(let i=0;i<lines.length;i+=size)pages.push(lines.slice(i,i+size).join('\n\n'));return pages}
function rippleEndingPages(){return chunkPages(encounterRecords().map(record=>rippleForRecord(record)?.ending).filter(Boolean),4)}
function stormEndingPages(){return chunkPages((S.storm?.decisions||[]).map(decision=>stormOutcomes[decision.flag]?.ending).filter(Boolean),3)}
function ending(type){const valid=['release','stars','remain','dawn'];if(!valid.includes(type)){S.ending=null;S.atFinalChoice=true;autosave();finalChoice();return}if(!S.endingsSeen.includes(type))S.endingsSeen.push(type);S.ending=type;playFinale(type);autosave();const path=S.truth>S.mercy?'너는 끝까지 사실의 모서리를 놓치지 않았다. 그 정직함은 위로가 되기도, 한 사람을 상징으로 납작하게 만들기도 했다.':S.mercy>S.truth?'너는 사실 속에서도 사람의 온기를 먼저 놓지 않았다. 그 다정함은 누군가를 살렸지만 모든 진실을 대신 말해 주지는 못했다.':'너는 진실과 다정함을 어느 하나의 그림자로 만들지 않았다. 균형은 보상이 아니라 두 대가를 함께 감당하는 일이었다.';const fallback={release:['놓아주는 빛','너는 불을 끈다. 섬은 새벽 속으로 걸어간다.'],stars:['별자리가 된 항로','너는 렌즈를 하늘로 돌린다. 항로는 불완전한 별자리가 된다.'],remain:['한 번 더, 아름다운 밤','너는 빛을 지킨다. 섬은 첫째 날의 저녁으로 돌아간다.'],dawn:['기억 다음의 아침','너는 빛을 새벽에 섞는다. 기억은 미래가 길을 묻는 창이 된다.']},e=veteranEndingCopy?.[type]||fallback[type],body=String(e[1]).split(/\n\s*\n/).filter(Boolean),bond=Object.entries(S.bonds).sort((a,b)=>b[1]-a[1])[0]?.[0],bondLine=bondFarewells[bond]||'섬에서 들은 목소리들이 마지막 빛의 가장자리에 남는다.',broadcastPage=`마지막으로 해안에 남은 목소리\n\n${broadcastTranscript()}`;showStory('FIN',e[0],[...body,path,bondLine,broadcastPage,...rippleEndingPages(),...stormEndingPages(),`플레이 시간 ${formatTime(S.seconds)} · 기록 ${S.clues.length}/42 · 선택 잔상 ${Math.min(afterimageCount(),AFTERIMAGE_GOAL)}/${AFTERIMAGE_GOAL} · 항해 조우 ${Object.keys(S.navigationEncounters).length}/14 · 돌아온 파문 ${Object.keys(S.ripplesSeen).length}/14 · 최후 방송 ${S.broadcast?.decisions?.length||0}/4 · 밤 항해 ${Object.values(S.navigationDone).filter(Boolean).length}/7 · 폭풍 선택 ${S.storm?.decisions?.length||0}/5 · 추론 ${Object.keys(S.deductions).length}/7 · 엔딩 ${S.endingsSeen.length}/4`],()=>{S.ending=null;S.atFinalChoice=true;autosave();showScreen('title');updateContinue()})}

function openJournal(tab='notes'){
 if(anyDialogOpen())return;$$('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));const out=$('#journalContent');
 if(tab==='notes')out.innerHTML=S.clues.length?S.clues.map((e,i)=>`<article class="entry"><p class="speaker">${String(i+1).padStart(2,'0')}</p><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p><span class="choice-trail">선택한 기억 · ${esc(e.echo||'')}</span>${e.afterimage?`<p class="choice-trail">남은 잔상 · ${esc(e.afterimage)}</p>`:''}</article>`).join(''):'<p>아직 기록된 것이 없다.</p>';
 if(tab==='memories')out.innerHTML=S.memories.length?S.memories.map((e,i)=>`<article class="entry"><p class="speaker">GLASS ${i+1}</p><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></article>`).join(''):'<p>과수원과 예배당에서 기억의 조각을 찾을 수 있다.</p>';
 if(tab==='navigation')out.innerHTML=days.map((day,i)=>{const log=S.navigationLogs[i];return`<article class="entry ${log?'solved':'locked'}"><p class="speaker">NIGHT ${i+1} · ${log?'CROSSED':'UNCHARTED'}</p><h3>${esc(log?.title||day.name)}</h3><p>${log?esc(log.text):'등대에 오르기 전 밤바다에서 직접 항로를 찾아야 한다.'}</p>${log?`<span class="choice-trail">조타 ${log.moves}/${log.limit}${log.assisted?' · 안전 항로 사용':''}</span>${log.consequences?.length?`<p class="choice-trail">이전 선택의 도움 · ${log.consequences.map(esc).join(' / ')}</p>`:''}`:''}</article>`}).join('');
 if(tab==='ripples'){const records=encounterRecords();out.innerHTML=records.length?`${records.map(record=>{const ripple=rippleForRecord(record),choice=navigationChoiceData(record.choiceId),seen=!!S.ripplesSeen[record.key];return`<article class="ripple-entry ${seen?'':'pending'}"><p class="speaker">${seen?'CONSEQUENCE RETURNED':'CONSEQUENCE PENDING'}</p><h3>${esc(record.title||choice?.encounterTitle||'밤바다의 선택')}</h3><p class="ripple-decision">내 선택 · ${esc(choice?.label||record.choiceId)}</p><p class="ripple-result">${esc(seen?ripple.next:'이 결정의 결과는 다음 날의 항로나 마지막 폭풍에서 돌아옵니다.')}</p><span class="choice-trail">${esc(ripple.effectLabel)}</span></article>`}).join('')}${S.broadcast?.decisions?.length?`<article class="broadcast-transcript"><p class="speaker">FINAL BROADCAST</p>${esc(broadcastTranscript())}</article>`:''}`:'<p>밤 항해에서 내린 중요한 결정이 다음 날의 세계와 마지막 방송에 기록됩니다.</p>'}
 if(tab==='people')out.innerHTML=S.people.length?S.people.map(id=>`<article class="entry"><p class="speaker">${esc(people[id][1])}</p><h3>${esc(people[id][0])}</h3><p>${esc(people[id][2])}</p><span class="choice-trail">밤 대화 ${S.bonds[people[id][0]]||0}개</span></article>`).join(''):'<p>아직 만난 사람이 없다.</p>';
 if(tab==='deductions')out.innerHTML=deductionData.map((d,i)=>{const solved=S.deductions[i],evidence=solved&&typeof solved==='object'?(solved.evidence||[]).map(id=>locs[id]?.name||id).join(' · '):'';return`<article class="entry ${solved?'solved':'locked'}"><p class="speaker">DAY ${i+1} · ${solved?'RESOLVED':'UNRESOLVED'}</p><h3>${esc(d.q)}</h3><p>${solved?esc(solved.conclusion||d.e):'이 날의 모든 장소를 조사하면 추론할 수 있다.'}</p>${evidence?`<span class="choice-trail">연결한 증거 · ${esc(evidence)}</span>`:''}</article>`}).join('');
 if(tab==='achievements')out.innerHTML=Object.entries(achievementDefs).map(([id,a])=>`<article class="entry ${S.achievements[id]?'solved':'locked'}"><p class="speaker">${S.achievements[id]?'UNLOCKED':'LOCKED'}</p><h3>${esc(S.achievements[id]?a.n:'???')}</h3><p>${esc(S.achievements[id]?a.d:'이야기 속에서 아직 발견하지 못한 길이다.')}</p></article>`).join('');
 $('#journalDialog').showModal()
}
function openCollection(){const meta=readMeta(),names={release:'놓아주는 빛',stars:'별자리가 된 항로',remain:'한 번 더, 아름다운 밤',dawn:'기억 다음의 아침'};$('#collectionContent').innerHTML=`<p>발견한 엔딩 ${meta.endingsSeen.length}/4 · 해제한 업적 ${Object.keys(meta.achievements).length}/${Object.keys(achievementDefs).length}</p>${['release','stars','remain','dawn'].map((id,i)=>`<article class="entry ${meta.endingsSeen.includes(id)?'solved':'locked'}"><p class="speaker">ENDING ${i+1}</p><h3>${meta.endingsSeen.includes(id)?names[id]:'???'}</h3><p>${meta.endingsSeen.includes(id)?'이 결말은 새 게임 뒤에도 보존됩니다.':'등대에서 아직 선택하지 않은 빛입니다.'}</p></article>`).join('')}`;$('#collectionDialog').showModal()}
function unlock(id){if(S.achievements[id])return;S.achievements[id]=Date.now();const a=achievementDefs[id];if(a)toast(`업적 해제 · ${a.n}`)}
function autosave(show=false){S.updatedAt=new Date().toISOString();const ok=storageSet(SAVE_V2,JSON.stringify(S));storageSet('last-light-meta-v1',JSON.stringify({endingsSeen:S.endingsSeen,achievements:S.achievements}));if(show)toast(ok?'안전한 체크포인트를 저장했습니다.':'브라우저 저장이 막혀 이번 실행의 임시 저장을 사용합니다.');updateContinue()}
function validateSave(raw){if(!raw||typeof raw!=='object')return null;if(raw.version!==2||!Number.isInteger(raw.day)||raw.day<0||raw.day>6)return null;if(raw.ending!==null&&!['release','stars','remain','dawn'].includes(raw.ending))return null;for(const k of ['truth','mercy','seconds','assists'])if(raw[k]!==undefined&&(!Number.isFinite(raw[k])||raw[k]<0))return null;if(raw.pending&&(typeof raw.pending!=='object'||raw.pending.day!==raw.day||!locs[raw.pending.loc]))return null;const base=freshState(),v={...base,...raw};for(const k of ['visited','afterimages','puzzleDone','deductions','dives','diveSeen','navigationDone','navigationProgress','navigationLogs','navigationEncounters','ripplesSeen','conversations','bonds','achievements','puzzleAttempts'])if(!v[k]||typeof v[k]!=='object'||Array.isArray(v[k]))v[k]={};if(!v.storm||typeof v.storm!=='object'||Array.isArray(v.storm))v.storm=base.storm;else{v.storm={...base.storm,...v.storm};if(!Array.isArray(v.storm.decisions))v.storm.decisions=[];if(v.storm.pending&&typeof v.storm.pending!=='object')v.storm.pending=null}if(!v.broadcast||typeof v.broadcast!=='object'||Array.isArray(v.broadcast))v.broadcast=base.broadcast;else{v.broadcast={...base.broadcast,...v.broadcast};if(!Array.isArray(v.broadcast.decisions))v.broadcast.decisions=[];if(v.broadcast.pending&&typeof v.broadcast.pending!=='object')v.broadcast.pending=null;if(!Number.isInteger(v.broadcast.stage)||v.broadcast.stage<0)v.broadcast.stage=0}if(v.navEncounterPending&&typeof v.navEncounterPending!=='object')v.navEncounterPending=null;for(const k of ['clues','memories','people','choicesTrail','endingsSeen'])if(!Array.isArray(v[k]))v[k]=[];if(!locs[v.current])v.current=routes[v.day][0];return v}
function load(){try{const parsed=JSON.parse(storageGet(SAVE_V2));const raw=window.localizeRuntimeValue?window.localizeRuntimeValue(parsed):parsed;const v=validateSave(raw);if(!v)throw Error('invalid');S=v;if(afterimageCount()>=AFTERIMAGE_GOAL&&!S.achievements.echoes)S.achievements.echoes=Date.now();return true}catch{storageRemove(SAVE_V2);updateContinue();toast('손상된 저장을 격리했습니다. 새 이야기를 시작할 수 있습니다.');return false}}
function updateContinue(){$('#continueGame').disabled=!storageGet(SAVE_V2)}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>e.classList.remove('show'),3000)}
function formatTime(s){return`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function showScreen(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
function begin(fresh){initAudio();if(fresh){S=freshState();storageRemove(SAVE_V2);autosave()}else if(!load())return;showScreen('game');renderMap();if(S.ending){ending(S.ending);return}if(openFinalDayRipples())return;if(S.atFinalChoice){S.broadcast?.completed?finalChoice():openFinalBroadcast();return}if(S.day===6&&S.storm?.completed&&!S.broadcast?.completed){openFinalBroadcast();return}if(openPendingRipples())return;if(S.day===6&&S.storm&&(S.storm.pending||S.storm.stage>0)&&!S.storm.completed){openStormClimax();return}if(S.navEncounterPending?.day===S.day){openNavigation();$('#navigationDialog').close();openNavigationEncounter(S.navEncounterPending.signalId);return}if(S.navigationProgress[S.day]&&!S.navigationDone[S.day]){openNavigation();return}if(S.pending&&S.pending.day===S.day&&locs[S.pending.loc]){S.current=S.pending.loc;renderMap();if(S.pending.choice?.result)showStory(people[S.current][0],'선택이 남긴 것',[S.pending.choice.result],()=>commitVisit(S.current,S.pending.choice.result));else startScene(S.pending.loc,true);return}const all=routes[S.day].every(id=>S.visited[`${S.day}-${id}`]);if(all&&!S.navigationDone[S.day]){S.current='lighthouse';renderMap();openNavigation();return}if(all&&!S.puzzleDone[S.day]){openPuzzle();return}if(all&&S.puzzleDone[S.day]){afterVisit();return}if(fresh)showStory('미라','프롤로그',['눈을 뜨자 바다는 별보다 어두웠다. 네가 타고 온 배는 없고, 손에는 젖지 않은 성냥 한 갑만 남아 있다.','절벽 위 등대가 세 번 깜빡인다. 구조 요청이 아니라 너를 알아본 사람의 눈짓처럼.','주머니 속 쪽지에는 네 필체로 한 문장만 적혀 있다. “일곱 번째 새벽 전에 불을 꺼.”'],()=>{})}
function requestNewGame(){if(storageGet(SAVE_V2)){$('#newGameDialog').showModal();return}begin(true)}

function audioSettings(){return{master:+$('#volume').value/100,music:+$('#musicVolume').value/100,ambience:+$('#ambienceVolume').value/100,sfx:+$('#effectsVolume').value/100,muted:$('#muteSound').checked,captions:$('#soundCaptions').checked,reduceFlashes:$('#reduceFlashes').checked,cinematicIntensity:$('#cinematicIntensity').value}}
function initAudio(){try{if(!window.LastLightSensory)return;const settings=audioSettings(),wasMuted=audio?.muted;audio=audio||window.LastLightSensory.create({settings});audio.configure?.(settings);if(settings.muted){if(wasMuted===false||audio.context?.state==='running')audio.setMuted?.(true)}else if(wasMuted===true||!audio.started||audio.context?.state==='suspended')audio.setMuted?.(false);setAmbience()}catch{audio=null}}
function setAmbience(){audio?.setScene?.({day:S.day,location:$('#island').dataset.scene==='storm'?'storm':S.current,phase:$('#island').dataset.scene==='storm'?'storm':'map'})}
function sfx(type,n=0){audio?.cue?.(type,{index:n})}
function playMotif(id){audio?.setScene?.({day:S.day,location:id,phase:'story'});audio?.cue?.(id==='chapel'?'bell':'signal',{caption:`${locs[id]?.name||'섬'}의 짧은 음악 모티프가 들린다.`})}
function playFinale(type){audio?.setScene?.({day:S.day,location:'storm',phase:'finale'});audio?.finale?.(type)}
function toggleSound(){const muted=!$('#muteSound').checked;$('#muteSound').checked=muted;storageSet('ll-mute',muted);initAudio();$('#soundBtn').textContent=muted?'♪̸':'♪'}

$('#newGame').onclick=requestNewGame;$('#confirmNew').onclick=()=>{$('#newGameDialog').close();begin(true)};$('#cancelNew').onclick=()=>$('#newGameDialog').close();$('#continueGame').onclick=()=>begin(false);$('#collectionBtn').onclick=openCollection;$('#journalBtn').onclick=()=>openJournal();$('#soundBtn').onclick=toggleSound;$('#menuBtn').onclick=()=>{if(!anyDialogOpen())$('#menuDialog').showModal()};$('#resume').onclick=()=>$('#menuDialog').close();$('#save').onclick=()=>autosave(true);$('#toTitle').onclick=()=>{$('#menuDialog').close();showScreen('title');updateContinue()};$('#openSettings').onclick=()=>$('#settingsDialog').showModal();$('#settings').onclick=()=>{$('#menuDialog').close();$('#settingsDialog').showModal()};$('#checkTune').onclick=checkPuzzle;$('#puzzleAssist').onclick=assistPuzzle;$('#deductionAssist').onclick=()=>solveDeduction(true);$('#checkDive').onclick=checkDive;$('#resetDive').onclick=resetDive;$('#diveAssist').onclick=assistDive;$('#startDiveOrder').onclick=startDiveOrder;$('#startDeduction').onclick=startDeductionFromHub;$('#finishConversation').onclick=finishNightConversation;$$('[data-nav-dir]').forEach(b=>b.onclick=()=>tryNavigationMove(b.dataset.navDir));$('#navigationUndo').onclick=undoNavigation;$('#navigationReset').onclick=resetNavigation;$('#navigationAssist').onclick=assistNavigation;
$$('.tabs button').forEach(b=>b.onclick=()=>{const tab=b.dataset.tab;$('#journalDialog').close();openJournal(tab)});$$('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
['storyDialog','puzzleDialog','navigationDialog','echoHubDialog','deductionDialog','memoryDiveDialog','conversationDialog'].forEach(id=>$('#'+id).addEventListener('cancel',e=>{e.preventDefault();if(id==='storyDialog'&&typing)finishType();else toast('진행 장면은 끝까지 확인해야 합니다. 도움 기능은 언제든 사용할 수 있습니다.')}));
$('#storyDialog').addEventListener('close',()=>{document.body.classList.remove('story-focus');audio?.setStory?.({speaker:'',title:'',choiceMode:false})});
function applySettingClass(id,on){const cls=id.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),target=id==='largeText'?document.documentElement:document.body;target.classList.toggle(cls,on);if(id==='largeText')document.body.classList.remove(cls)}
['largeText','reduceMotion','highContrast','instantTravel','reduceFlashes'].forEach(id=>{$('#'+id).onchange=e=>{applySettingClass(id,e.target.checked);storageSet('ll-'+id,e.target.checked);audio?.configure?.(audioSettings())}});$('#textSpeed').onchange=e=>storageSet('ll-textSpeed',e.target.value);['volume','musicVolume','ambienceVolume','effectsVolume'].forEach(id=>{$('#'+id).oninput=e=>{storageSet('ll-'+id,e.target.value);initAudio()}});$('#soundCaptions').onchange=e=>{storageSet('ll-soundCaptions',e.target.checked);initAudio()};$('#cinematicIntensity').onchange=e=>{storageSet('ll-cinematicIntensity',e.target.value);initAudio()};$('#muteSound').onchange=e=>{storageSet('ll-mute',e.target.checked);initAudio();$('#soundBtn').textContent=e.target.checked?'♪̸':'♪'};
setInterval(()=>{if($('#game').classList.contains('active')&&!$('#menuDialog').open){S.seconds++;$('#playTime').textContent=formatTime(S.seconds);if(S.seconds%30===0)autosave()}},1000);
document.addEventListener('keydown',e=>{if(!$('#game').classList.contains('active'))return;const tag=document.activeElement?.tagName;if(['INPUT','SELECT','TEXTAREA'].includes(tag))return;if($('#navigationDialog').open){const k=e.key.toLowerCase(),dir={arrowup:'U',w:'U',arrowright:'R',d:'R',arrowdown:'D',s:'D',arrowleft:'L',a:'L'}[k];if(dir){e.preventDefault();tryNavigationMove(dir)}else if(k==='z'){e.preventDefault();undoNavigation()}else if(k==='r'){e.preventDefault();resetNavigation()}else if(e.key==='Escape')e.preventDefault();return}if($('#storyDialog').open){const choiceButtons=$$('#choices button');if(['Enter',' '].includes(e.key)){e.preventDefault();if(choiceButtons.length){const active=choiceButtons.includes(document.activeElement)?document.activeElement:choiceButtons[gamepadChoiceIndex];active?.click()}else $('#nextStory').click()}if(e.key==='Escape')e.preventDefault();return}if($('#puzzleDialog').open||$('#echoHubDialog').open||$('#deductionDialog').open||$('#memoryDiveDialog').open||$('#conversationDialog').open){if(e.key==='Escape')e.preventDefault();return}if($('#journalDialog').open||$('#settingsDialog').open){if(e.key==='Escape')document.querySelector('dialog[open]').close();return}if($('#menuDialog').open){if(e.key==='Escape')$('#menuDialog').close();return}if(e.key==='Escape'){$('#menuDialog').showModal();return}if(e.key.toLowerCase()==='j'){openJournal();return}if(e.key.toLowerCase()==='e'){interact();return}const ids=routes[S.day],i=ids.indexOf(S.current);if(['ArrowRight','ArrowDown','d','s'].includes(e.key))travel(ids[Math.min(ids.length-1,i+1)]);if(['ArrowLeft','ArrowUp','a','w'].includes(e.key))travel(ids[Math.max(0,i-1)])});
function gamepadFocusable(scope){return[...scope.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled])')].filter(x=>x.offsetParent!==null||x===document.activeElement)}
function focusByPad(scope,delta){const nodes=gamepadFocusable(scope);if(!nodes.length)return;let i=nodes.indexOf(document.activeElement);i=i<0?(delta>0?0:nodes.length-1):(i+delta+nodes.length)%nodes.length;nodes[i].focus()}
function activateFocused(scope){const nodes=gamepadFocusable(scope),a=document.activeElement;if(nodes.includes(a)){if(a.matches('button,input[type="checkbox"]'))a.click();return true}return false}
function pollGamepad(){
 const gp=navigator.getGamepads?.()[0];
 if(gp){
  const pressed=gp.buttons.map(b=>b.pressed),edge=i=>pressed[i]&&!lastPadButtons[i],padUp=edge(12),padDown=edge(13),padLeft=edge(14),padRight=edge(15),accept=edge(0),back=edge(1),assist=edge(3);
  if($('#title').classList.contains('active')&&!anyDialogOpen()){if(padLeft||padUp)focusByPad($('#title'),-1);if(padRight||padDown)focusByPad($('#title'),1);if(accept&&!activateFocused($('#title')))($('#continueGame').disabled?$('#newGame'):$('#continueGame')).click();lastPadButtons=pressed;requestAnimationFrame(pollGamepad);return}
  if($('#storyDialog').open){const choices=$$('#choices button');if(choices.length){if(padLeft||padUp||padRight||padDown){gamepadChoiceIndex=(gamepadChoiceIndex+(padRight||padDown?1:-1)+choices.length)%choices.length;choices.forEach((b,i)=>b.classList.toggle('gamepad-selected',i===gamepadChoiceIndex));choices[gamepadChoiceIndex].focus()}if(accept)choices[gamepadChoiceIndex].click()}else if(accept)$('#nextStory').click();lastPadButtons=pressed;requestAnimationFrame(pollGamepad);return}
  if($('#navigationDialog').open){if(padUp)tryNavigationMove('U');if(padRight)tryNavigationMove('R');if(padDown)tryNavigationMove('D');if(padLeft)tryNavigationMove('L');if(back)undoNavigation();if(assist)assistNavigation();lastPadButtons=pressed;requestAnimationFrame(pollGamepad);return}
  const open=$$('dialog').find(d=>d.open);
  if(open){const a=document.activeElement;if((padLeft||padRight)&&a?.matches?.('input[type="range"]')){const step=padRight?1:-1;a.value=Math.max(+a.min,Math.min(+a.max,+a.value+step));a.dispatchEvent(new Event('input',{bubbles:true}))}else if((padUp||padDown)&&a?.matches?.('select')){a.selectedIndex=Math.max(0,Math.min(a.options.length-1,a.selectedIndex+(padDown?1:-1)));a.dispatchEvent(new Event('change',{bubbles:true}))}else{if(padLeft||padUp)focusByPad(open,-1);if(padRight||padDown)focusByPad(open,1)}if(accept)activateFocused(open);if(assist&&open===$('#puzzleDialog'))$('#puzzleAssist').click();if(assist&&open===$('#deductionDialog'))$('#deductionAssist').click();if(assist&&open===$('#memoryDiveDialog'))$('#diveAssist').click();if(back&&[$('#menuDialog'),$('#journalDialog'),$('#settingsDialog'),$('#collectionDialog'),$('#newGameDialog')].includes(open))open.close();lastPadButtons=pressed;requestAnimationFrame(pollGamepad);return}
  if(edge(9))$('#menuDialog').showModal();else if(assist)openJournal();else if(accept)interact();else{const ids=routes[S.day],i=ids.indexOf(S.current);if(padLeft||padUp)travel(ids[Math.max(0,i-1)]);if(padRight||padDown)travel(ids[Math.min(ids.length-1,i+1)])}
  lastPadButtons=pressed;
 }
 requestAnimationFrame(pollGamepad)
}
['largeText','reduceMotion','highContrast','instantTravel','reduceFlashes'].forEach(id=>{const v=storageGet('ll-'+id)==='true';$('#'+id).checked=v;applySettingClass(id,v)});$('#textSpeed').value=storageGet('ll-textSpeed')||'8';$('#volume').value=storageGet('ll-volume')||'55';$('#musicVolume').value=storageGet('ll-musicVolume')||'52';$('#ambienceVolume').value=storageGet('ll-ambienceVolume')||'64';$('#effectsVolume').value=storageGet('ll-effectsVolume')||'70';$('#soundCaptions').checked=storageGet('ll-soundCaptions')==='true';$('#cinematicIntensity').value=storageGet('ll-cinematicIntensity')||'full';$('#muteSound').checked=storageGet('ll-mute')==='true';$('#soundBtn').textContent=$('#muteSound').checked?'♪̸':'♪';updateContinue();pollGamepad();
})();
