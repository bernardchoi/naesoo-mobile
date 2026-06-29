const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "index.html");
const manifestPath = path.join(root, "manifest.json");
const serviceWorkerPath = path.join(root, "sw.js");
const appIconSvgPath = path.join(root, "app-icon.svg");
const versesPath = path.join(root, "verses.json");
const archivePath = path.join(root, "archive.json");
const bulletinsDir = path.join(root, "bulletins");
const archiveIndex = JSON.parse(fs.readFileSync(archivePath, "utf8"));
const currentBulletinSlug = process.argv[2] || archiveIndex.current;
const currentBulletinPath = path.join(bulletinsDir, `${currentBulletinSlug}.json`);
const heroBackground = `data:image/jpeg;base64,${fs.readFileSync(path.join(root, "assets", "hero-building.jpg")).toString("base64")}`;
const churchLogo = `data:image/png;base64,${fs.readFileSync(path.join(root, "assets", "church-logo.png")).toString("base64")}`;

const embeddedBulletin = {
  church: {
    name: "내수동교회",
    denomination: "대한예수교장로회",
    pastor: "원로목사 박희천 · 담임목사 박지웅",
    address: "서울시 종로구 경희궁2길 5-6(내수동)",
    phone: "02-737-6351",
    fax: "02-723-5184",
    website: "http://naesoo.or.kr",
    email: "nsch1954@naver.com",
    youtube: "https://m.youtube.com/@NSCH1954",
    instagram: "https://m.instagram.com/naesoodong_church/",
  },
  issue: {
    date: "2026년 6월 21일",
    volume: "제73권 25호",
    sloganYear: "2026 표어",
    slogan: "예배의 부흥, 성령의 세대",
  },
  worship: {
    title: "주일예배",
    note: "주일 1·2부 예배 전 20분 기도회가 있으니, 미리 오셔서 기도로 준비해 주시기 바랍니다.",
    times: ["1부 오전 9:00", "2부 오전 11:00", "3부 오후 1:30"],
    rows: [
      { label: "사회", first: "김재달 목사", second: "김재달 목사", third: null },
      { label: "입례송 / 신앙고백", first: "고개 들어 / 사도신경", second: "고개 들어 / 사도신경", third: null },
      { label: "찬양", first: "경배와 찬양", second: "경배와 찬양", third: "경배와 찬양" },
      { label: "대표기도", first: "신성현 장로", second: "김현문 안수집사", third: null },
      { label: "찬양", first: "임마누엘 찬양대\n주를 앙모하는 자", second: "글로리아 찬양대\n임재", third: null },
      { label: "성경본문", first: "사무엘상 2:29-30", second: "사무엘상 2:29-30", third: "요한복음 4:21-26" },
      { label: "설교", first: "영광의 무게: 하나님을 가장 무겁게 여기는 삶\n윤주남 목사", second: "영광의 무게: 하나님을 가장 무겁게 여기는 삶\n윤주남 목사", third: "참예배\n이정우 목사" },
      { label: "찬송", first: "찬송가 94장, 주 예수보다 더 귀한 것은 없네\n복음성가, 내 눈 주의 영광을 보네", second: "찬송가 94장, 주 예수보다 더 귀한 것은 없네\n복음성가, 내 눈 주의 영광을 보네", third: "주님을 예배하는 것" },
      { label: "축도", first: "하나님의 나라 확장을 위한 우리 교회 공동체가 되게 하시고 성령이 충만하여 세상을 향하여 섬기는 삶 되게 하소서!", second: "하나님의 나라 확장을 위한 우리 교회 공동체가 되게 하시고 성령이 충만하여 세상을 향하여 섬기는 삶 되게 하소서!", third: "" },
    ],
    nextPrayer: "다음 주 대표기도: 1부 김희경 안수집사 / 2부 박진수 장로",
  },
  weekly: [
    { title: "새벽예배", time: "월~금 오전 5:30", body: "월 윤주남 목사 · 화 최정현 목사 · 수 김재달 목사 · 목 이정우 목사 · 금 고민영 목사" },
    { title: "수요 오전예배", time: "오전 10:30", body: "조계웅 목사" },
    { title: "수요 저녁예배", time: "오후 7:00", body: "주를 기쁘시게 하기 위해 · 에베소서 5:8-14 · 고민영 목사" },
    { title: "Center Worship", time: "오후 8:00", body: "이정우 목사" },
    { title: "금요부흥집회", time: "오후 8:00", body: "윤주남 목사" },
  ],
  worshipCampaign: [
    "예배 20분 전까지 오셔서 기도로 예배를 준비해 주시기 바랍니다.",
    "예배 시간을 엄수해 주시기 바랍니다.",
    "예배당 앞자리와 가운데 자리부터 순서대로 앉아 주시기 바랍니다.",
    "예배당 내 음료 반입은 금지합니다.",
    "복장은 단정히 갖추어 주시기 바랍니다.",
    "핸드폰은 무음 또는 진동으로 설정해 주시기 바랍니다.",
    "교회 내·외부 주차장에서는 주차 질서를 지켜 주시기 바랍니다.",
  ],
  news: [
    {
      category: "today",
      priority: "결과",
      title: "2026년도 중직자(장로) 선거 공동의회(3차 투표) 결과",
      body: "지난 주일, 본 교회 직분관리규정(제4조 선출직)에 의거해 실시한 중직자(장로) 선거 공동의회(3차 투표) 결과를 다음과 같이 공지합니다.",
      bullets: [
        "총 투표수: 1,060표(유효투표수 1,035표, 무효(기권)표 25표)",
        "확정 당선표: 708표",
        "확정 당선자: 곽성림, 윤청호, 이기동, 이영호, 조한진(이상 안수집사)",
        "피택 중직자들은 일정 기간의 훈련과 준비 과정을 거친 후 임직하게 되며, 교회의 덕과 질서를 위해 임직 전까지는 현재의 직분명을 사용합니다.",
      ],
    },
    {
      category: "schedule",
      priority: "일정",
      title: "하계 특별새벽예배 안내",
      body: "2026년 하계 특별새벽예배는 대학·청년부 주관으로 드려집니다. 새벽이슬 같은 청년들이 말씀으로 깨어나고 받은 사명에 다시 뜨거워질 수 있도록 기도와 참여를 부탁드립니다.",
      bullets: [
        "주제: 사명 - 처음 그 소원, 끝까지 그 길(빌 2:13)",
        "일시/장소: 6월 29일(월)~7월 4일(토) 오전 5시 20분, 본당",
        "대상: 모든 성도",
        "평일에는 예배 후 간식이 제공되며, 토요일에는 자원하신 성도님들께서 식사를 준비해 주십니다.",
      ],
      speakerSchedule: [
        ["6월 29일(월)", "박지웅 담임목사"],
        ["6월 30일(화)~7월 2일(목)", "문현진 목사 · 강원도 영월 옥광교회 담임"],
        ["7월 3일(금)", "이정우 목사"],
        ["7월 4일(토)", "연한흠 목사"],
      ],
      calendar: {
        title: "내수동교회 하계 특별새벽예배",
        start: "2026-06-29T05:20:00+09:00",
        end: "2026-07-04T06:20:00+09:00",
        location: "내수동교회 본당",
        description: "주제: 사명 - 처음 그 소원, 끝까지 그 길(빌 2:13)",
      },
    },
    {
      category: "schedule",
      priority: "일정",
      title: "새가족 환영회",
      body: "상반기에 등록한 새가족을 위한 환영회가 열립니다. 새로 등록하신 성도님들의 많은 참여를 바랍니다.",
      bullets: ["일시/장소: 7월 5일(주일) 오후 12시 30분, 샬롬홀(별관 2층)", "대상자: 작년 12월부터 현재까지 등록하신 성도"],
      calendar: {
        title: "내수동교회 새가족 환영회",
        start: "2026-07-05T12:30:00+09:00",
        end: "2026-07-05T14:00:00+09:00",
        location: "내수동교회 샬롬홀(별관 2층)",
        description: "상반기에 등록한 새가족을 위한 환영회입니다.",
      },
    },
    {
      category: "schedule",
      priority: "일정",
      title: "목양국 사역 일정",
      bullets: [
        "60세대 공동체 수련회: 6월 27일(토)~6월 28일(주일), 김회수양관",
        "전체 국장·마을장·목자 중간모임: 7월 11일(토) 오전 9시 30분~12시, 본당",
        "구역 종강모임: 7월 12일(주일)~7월 18일(토)",
      ],
    },
    {
      category: "apply",
      priority: "접수",
      title: "세대별 공동체·구역 모임 사연 접수",
      body: "세대별 공동체 상반기 종강 모임을 맞아 7월 5일(주일)까지 사연을 접수합니다. 위 내용 중 한 가지 이상을 엽서에 적어 사연함에 넣어 주세요. 참여해 주신 모든 분께 쉼만한물가 아메리카노 쿠폰 2매를 드립니다.",
      bullets: ["상반기 세대별 공동체·구역 모임을 마친 소감", "구역 모임을 통해 받은 은혜", "구역 소개 및 자랑(리더, 목자, 구역원, 구역, 기타 등)", "사연함과 엽서는 2층 본당 앞 주보대에 비치되어 있습니다."],
    },
    {
      category: "schedule",
      priority: "확인",
      title: "2026년도 상반기 정기 회계감사 실시",
      bullets: ["기간: 6월 14일(주일)~6월 28일(주일)", "내용: 예산 집행 및 회계 처리 실태", "기타: 각 부서 및 전체 감사는 하반기 실시 예정입니다."],
    },
    {
      category: "apply",
      priority: "신청",
      title: "2026년 하반기 주일 지정주차 신청",
      body: "36개월 이하 유아 동반 다자녀 가정과 장애인 및 노약자들을 위한 2026년 하반기 본관 지정주차 신청을 받습니다. 우선순위에 따라 배정될 예정입니다.",
      bullets: ["신청 기간: 오늘까지", "기존 주일 지정주차카드를 가지고 계신 분들도 다시 신청하고 배정받아야 합니다.", "주일에는 지정주차카드가 있는 차량에 한해 본관/뉴문 주차장 이용이 가능합니다."],
    },
    {
      category: "care",
      priority: "모임",
      title: "전도회",
      bullets: ["안나여전도회(66년생~56년생): 오늘 2부 예배 후 본관 5층 찬양대실"],
    },
    {
      category: "care",
      priority: "일정",
      title: "결혼",
      bullets: [
        "강민욱 형제 · 윤희수 자매(청년부) 6월 27일(토) 오전 11시 20분, 더파티움 여의도",
        "조제영 형제(청년부) · 지혜린 자매(청년부) 6월 27일(토) 오후 3시 30분, 지타워컨벤션",
        "임재성 형제 · 홍서경 자매(한소환 성도 자녀) 6월 27일(토) 오후 5시, 노블발렌티 삼성",
        "김진훈A 형제(김명기 집사 · 임희선 권사) · 김주희 자매 7월 4일(토) 오후 6시 30분, 아펠가모 광화문 LL층(지하 2층)",
      ],
    },
    {
      category: "care",
      priority: "환영",
      title: "새가족 등록",
      bullets: ["23) 이홍만 성도", "24) 이다연 성도"],
      body: "따뜻한 환영과 교제 가운데 잘 정착하도록 성도님들의 관심과 기도를 부탁드립니다.",
    },
  ],
  sermon: {
    title: "영광의 무게: 하나님을 가장 무겁게 여기는 삶",
    passage: "사무엘상 2:29-30",
    preacher: "윤주남 목사",
    summary: [
      "하나님은 ‘나를 존중히 여기는 자를 내가 존중히 여기고’라고 말씀하십니다. 여기서 ‘존중히 여기다’는 히브리어 카베드로 ‘무겁게 여기다, 중하게 여기다’라는 뜻입니다. 또 ‘영광’이라는 말, 카보드도 같은 뿌리에서 나온 단어입니다.",
      "그러므로 성경이 말하는 ‘영광’은 단지 빛나고 화려한 모습이 아니라 ‘하나님의 존귀하심과 거룩한 무게’를 뜻합니다. 하나님을 존중한다는 것은 단순히 믿는다고 말하는 것이 아니라, 내 삶의 저울에서 하나님을 가장 무거운 분으로 모시는 것입니다.",
      "엘리의 문제는 하나님을 모른 것이 아니라, 하나님보다 아들들을 더 중히 여겼다는 데 있었습니다. 하나님보다 더 무겁게 여기는 것이 있다면 그것이 곧 우상입니다. 반면 한나는 눈물로 얻은 아들 사무엘을 하나님께 다시 드림으로 응답보다 하나님을 더 귀하게 여기는 믿음을 보여 주었습니다. 이러한 믿음은 하나님께서 먼저 독생자 예수 그리스도를 우리를 위해 내어주신 십자가의 은혜를 아는 데서 나옵니다.",
      "하나님은 하나님을 카베드, 곧 무겁게 여기며 존중하는 사람을 귀하게 여기십니다. 그러므로 우리도 예배와 말씀과 기도를 소중히 여기며 하나님의 카보드, 곧 영광의 무게를 아는 성도로 살아가야 합니다. 하나님을 가장 무겁게 여기는 삶이 가정을 살리고, 자녀를 살리고, 교회를 세우는 은혜의 통로가 됩니다.",
    ],
    questions: [
      "하나님께서 엘리에게 ‘네 아들들을 나보다 더 중히 여겼다’고 책망하신 이유는 무엇입니까? 엘리의 모습 속에서 하나님보다 더 무겁게 여기는 것이 있을 때, 신앙과 가정에 어떤 문제가 일어나는지 함께 나누어 봅시다.",
      "한나는 눈물로 얻은 사무엘을 다시 하나님께 드렸습니다. 한나의 이 모습은 ‘하나님을 가장 무겁게 여기는 믿음’을 어떻게 보여 줍니까? 또 이 믿음이 십자가의 은혜와 어떻게 연결되는지 생각해 봅시다.",
      "내 삶의 저울에서 지금 하나님보다 더 무겁게 자리 잡고 있는 것은 무엇입니까? 가정, 자녀, 물질, 인정, 계획, 염려 가운데 내가 하나님보다 더 붙들고 있는 것이 있다면 무엇인지 정직하게 돌아보고 나누어 봅시다.",
      "하나님을 가장 무겁게 여기는 삶은 말이 아니라, 예배와 말씀과 기도의 우선순위로 드러납니다. 이번 한 주 동안 내가 하나님을 가장 귀하게 여긴다는 것을 실제로 나타내기 위해 어떤 결단을 할 수 있겠습니까?",
    ],
  },
  district: {
    title: "구역교회 모임 순서와 시간",
    theme: "영광의 무게: 하나님을 가장 무겁게 여기는 삶",
    welcome: "서로 인사하며 지난 주 언약 맺기 실천한 내용을 나누기",
    icebreaker: "요즘 내 일상에서 가장 마음이 많이 가는 것은 무엇인지를 나눠봅시다.",
    praise: ["찬송가 94장, 주 예수보다 더 귀한 것은 없네", "복음성가, 내 눈 주의 영광을 보네"],
    prayer: "기도제목 나누기, 교회와 다음세대를 위해, 태신자를 위한 기도",
    ministry: "교회에서 맡은 섬김 나누기",
    order: [
      ["구역원들을 환영", "환영", "10분"],
      ["역동적인 찬양", "찬양", "15분"],
      ["교재(말씀)를 통한 삶의 나눔", "말씀 나눔", "40분"],
      ["회원들 간의 기도와 돌봄으로 섬김", "기도 나눔", "15분"],
      ["모든 구역원들의 사역에 참여", "사역 나눔", "10분"],
      ["임재하신 성령 안에서 마무리", "소망 나눔", "5분"],
    ],
    closing: "돌아가며 말씀을 토대로 한 주간 실천하고자 하는 사항들을 함께 나누고 실천을 약속합니다.",
    song: "성경암송: 사무엘상 2:30 - 그러므로 이스라엘의 하나님 나 여호와가 말하노라 내가 전에 네 집과 네 조상의 집이 내 앞에 영원히 행하리라 하였으나 이제 나 여호와가 말하노니 결단코 그렇게 하지 아니하리라 나를 존중히 여기는 자를 내가 존중히 여기고 나를 멸시하는 자를 내가 경멸하리라",
  },
  meetings: [
    ["유아부(2~4세)", "오전 11:00", "본관 4층/유아부실"],
    ["유치부(5~7세)", "오전 11:00", "본관 5층/유치부실"],
    ["유년부(1~3학년)", "오전 11:00", "교육관 2층/유년부실"],
    ["초등부(4~6학년)", "1부 오전 9:00 / 2부 오전 11:00", "본관 4층/비전홀"],
    ["어와나(10~13세)", "오후 12:50", "교육관 3층/중등부실"],
    ["중등부", "오전 9:00", "교육관 3층/중등부실"],
    ["고등부", "오전 9:00", "교육관 4층/고등부실"],
    ["대학부", "오후 2:50", "교육관 3층/대학부실"],
    ["청년부", "오후 2:50", "본관 2층/본당"],
    ["신혼교구", "오후 1:30", "비전센터"],
    ["30세대 공동체", "오후 1:30", "본관 4층/유아부실"],
    ["40세대 공동체", "오후 1:30", "본관 5층/유치부실"],
    ["50세대 공동체", "오후 1:00", "(첫째 주) 교육관 3층/중등부실"],
    ["60세대 공동체", "오후 1:00", "(셋째 주) 교육관 3층/중등부실"],
    ["시니어 공동체", "오전 10:30", "(수) 본관 2층/본당"],
  ],
  servants: [
    { label: "원로목사", names: "박희천" },
    { label: "담임목사", names: "박지웅" },
    { label: "부목사", names: "윤주남 김진웅 이정우 연한흠 조계웅 전홍구 오신영 최정현 고민영 김재달" },
    { label: "협동목사", names: "이동화" },
    { label: "교육전도사", names: "김지현 서희지 임예희" },
    { label: "원로장로", names: "이상하 배수봉" },
    { label: "시무장로", names: "박진수 고병식 김홍주 김종민 신성현 이종응" },
    { label: "휴직장로", names: "박무열" },
    { label: "은퇴장로", names: "김봉선 한성희 차승철 김일룡 한수부 유복식 서영석 정영호 홍종일 성덕수 안주태" },
  ],
  volunteer: {
    guide: [
      ["1부 2층", "이창송A 박옥순 황완숙 배윤경"],
      ["1부 3층", "문선희 오윤경 이선주 정덕우"],
      ["2부 2층", "김완준 이수진D 이경호 윤종헌 노현미 이정희D"],
      ["2부 3층", "유승화 장성희 반소영 박윤제"],
      ["3부 2·3층", "대학, 청년부"],
    ],
    meal: [
      ["1주", "40세대(소그룹3) 50세대(부부12) 60세대(부부4) 시니어(여성10)"],
      ["2주", "40세대(소그룹4) 50세대(여성1) 60세대(부부5) 시니어(부부1)"],
      ["3주", "신혼(부부1) 40세대(소그룹5) 50세대(여성2) 60세대(부부6) 시니어(부부2)"],
      ["4주", "신혼(부부2) 40세대(소그룹6) 50세대(여성3) 시니어(부부3)"],
    ],
    parking: "김현문 곽대성 권형필 김일문 노영식 심규호 오선철 이선국 임덕우 장형진 조재민 조한진 한종서",
  },
  directions: [
    { title: "지하철", body: "5호선 광화문역 8번 출구 하차, 서울지방경찰청 방향 도보 10분. 3호선 경복궁역 7번 출구 하차, 서울지방경찰청 방향 도보 10분." },
    { title: "버스", body: "세종문화회관 하차 후 서울지방경찰청 방향 도보 10분. 사직공원 앞 하차 후 교회 방향으로 이동." },
    { title: "주차", body: "주차권은 사무실로 문의. 국민카드 지하주차장, 경희궁의아침 3단지 오피스텔, 경희궁의아침 4단지 오피스텔 이용 가능." },
  ],
};

const bulletin = fs.existsSync(currentBulletinPath)
  ? JSON.parse(fs.readFileSync(currentBulletinPath, "utf8"))
  : embeddedBulletin;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", "&#10;");
}

function targetId(prefix, index) {
  return `${prefix}-${index + 1}`;
}

function formatServiceRange(labels) {
  const numbers = labels.map((label) => Number(label.replace("부", "")));
  const isContinuous = numbers.every((number, index) => index === 0 || number === numbers[index - 1] + 1);
  if (labels.length > 1 && isContinuous) {
    return `${numbers[0]}~${numbers[numbers.length - 1]}부`;
  }
  return labels.join(" · ");
}

function resolveWorshipValues(row) {
  const first = row.first || "-";
  const second = row.second || first;
  const third = row.third === null ? null : (row.third || second);
  return [
    ["1부", first],
    ["2부", second],
    ["3부", third],
  ];
}

function groupWorshipValues(row) {
  const groups = [];
  for (const [label, value] of resolveWorshipValues(row)) {
    if (value === null) continue;
    const last = groups[groups.length - 1];
    if (last && last.value === value) {
      last.labels.push(label);
    } else {
      groups.push({ labels: [label], value });
    }
  }
  return groups;
}

function isCommonWorshipRow(row) {
  return groupWorshipValues(row).length === 1;
}

function renderCommonWorshipRow(row) {
  const value = groupWorshipValues(row)[0].value;
  return `
    <div class="flow-item">
      <strong>${escapeHtml(row.label)}</strong>
      <span>${escapeHtml(value)}</span>
    </div>
  `;
}

function renderWorshipRow(row, index) {
  const groups = groupWorshipValues(row);
  const values = Object.fromEntries(resolveWorshipValues(row).map(([label, value]) => [label.replace("부", ""), value]));

  return `
    <div class="worship-row" id="${targetId("worship", index)}" data-jump-target data-worship-row data-worship-first="${escapeAttr(values["1"] || "")}" data-worship-second="${escapeAttr(values["2"] || "")}" data-worship-third="${escapeAttr(values["3"] || "")}">
      <div class="worship-label"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(row.label)}</div>
      <div class="worship-body">
        ${groups.map((group) => `<div class="part${group.value.length > 28 ? " is-long" : ""}"><strong>${formatServiceRange(group.labels)}</strong>${escapeHtml(group.value)}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderNewsCard(item, index) {
  const categoryLabel = categoryLabels[item.category] || "소식";
  const calendarIndex = item.calendar ? calendarEvents.findIndex((event) => event.sourceIndex === index) : -1;
  const lines = [
    `          <article class="list-card" id="${targetId("news", index)}" data-news-category="${item.category || "care"}" data-jump-target>`,
    `            <div class="news-meta">`,
    `              <span class="news-tag">${categoryLabel}</span>`,
  ];
  if (item.priority && item.priority !== categoryLabel) {
    lines.push(`              <span class="news-tag is-priority">${item.priority}</span>`);
  }
  lines.push(
    `            </div>`,
    `            <h3>${item.title}</h3>`,
  );
  if (item.body) {
    lines.push(`            <p>${item.body}</p>`);
  }
  if (item.bullets) {
    lines.push(`            <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`);
  }
  if (item.speakerSchedule) {
    lines.push(
      `            <div class="speaker-schedule" aria-label="강사 일정">`,
      `              <strong class="speaker-schedule-title">강사 일정</strong>`,
      item.speakerSchedule.map(([date, speaker]) => `<div class="speaker-row"><strong>${date}</strong><span>${speaker}</span></div>`).join(""),
      `            </div>`,
    );
  }
  if (calendarIndex >= 0) {
    lines.push(`            <div class="card-actions"><button class="card-action" type="button" data-calendar-index="${calendarIndex}">캘린더 추가</button></div>`);
  }
  lines.push(`          </article>`);
  return lines.join("\n");
}

const newsFilters = [
  ["all", "전체"],
  ["today", "오늘"],
  ["schedule", "일정"],
  ["apply", "신청"],
  ["care", "동정"],
];
const meetingGroups = [
  {
    title: "다음세대",
    items: bulletin.meetings.slice(0, 7),
  },
  {
    title: "청년·대학",
    items: bulletin.meetings.slice(7, 9),
  },
  {
    title: "공동체",
    items: bulletin.meetings.slice(9),
  },
];
const mapUrl = "https://m.place.naver.com/place/12212845/home";
const archiveItems = archiveIndex.issues.map((issue) => ({
  ...issue,
  current: issue.id === currentBulletinSlug,
}));
const scriptureVerses = [
  { reference: "시편 23:1", text: "여호와는 나의 목자시니 내게 부족함이 없으리로다" },
  { reference: "시편 27:1", text: "여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요" },
  { reference: "시편 46:1", text: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라" },
  { reference: "시편 73:28", text: "하나님께 가까이 함이 내게 복이라" },
  { reference: "시편 119:105", text: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다" },
  { reference: "잠언 3:5", text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라" },
  { reference: "잠언 16:9", text: "사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라" },
  { reference: "이사야 41:10", text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라" },
  { reference: "이사야 43:1", text: "두려워하지 말라 내가 너를 구속하였고 내가 너를 지명하여 불렀나니 너는 내 것이라" },
  { reference: "예레미야 29:11", text: "너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라" },
  { reference: "마태복음 6:33", text: "그런즉 너희는 먼저 그의 나라와 그의 의를 구하라" },
  { reference: "마태복음 11:28", text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라" },
  { reference: "마태복음 28:20", text: "볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라" },
  { reference: "요한복음 3:16", text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니" },
  { reference: "요한복음 14:27", text: "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라" },
  { reference: "요한복음 15:5", text: "나는 포도나무요 너희는 가지라 그가 내 안에, 내가 그 안에 거하면 사람이 열매를 많이 맺나니" },
  { reference: "로마서 8:28", text: "하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" },
  { reference: "로마서 12:12", text: "소망 중에 즐거워하며 환난 중에 참으며 기도에 항상 힘쓰며" },
  { reference: "고린도전서 13:13", text: "그런즉 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라" },
  { reference: "고린도후서 5:17", text: "그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라" },
  { reference: "갈라디아서 2:20", text: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요" },
  { reference: "에베소서 2:10", text: "우리는 그가 만드신 바라 그리스도 예수 안에서 선한 일을 위하여 지으심을 받은 자니" },
  { reference: "에베소서 6:10", text: "너희가 주 안에서와 그 힘의 능력으로 강건하여지고" },
  { reference: "빌립보서 4:13", text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" },
  { reference: "빌립보서 4:19", text: "나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라" },
  { reference: "골로새서 3:23", text: "무슨 일을 하든지 마음을 다하여 주께 하듯 하고 사람에게 하듯 하지 말라" },
  { reference: "데살로니가전서 5:16-18", text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라" },
  { reference: "디모데후서 1:7", text: "하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니" },
  { reference: "히브리서 11:1", text: "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니" },
  { reference: "히브리서 13:8", text: "예수 그리스도는 어제나 오늘이나 영원토록 동일하시니라" },
  { reference: "야고보서 1:5", text: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시는 하나님께 구하라" },
  { reference: "베드로전서 5:7", text: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라" },
];
const fallbackScriptureVerses = scriptureVerses.slice(0, 5);
const categoryLabels = {
  today: "오늘",
  schedule: "일정",
  apply: "신청",
  care: "동정",
};
const calendarEvents = bulletin.news
  .map((item, index) => item.calendar ? { ...item.calendar, sourceIndex: index, sourceTitle: item.title } : null)
  .filter(Boolean);
const archiveData = archiveIndex;
const searchItems = [
  ...bulletin.worship.rows.map((row, index) => ({
    tab: "worship",
    target: targetId("worship", index),
    type: "예배",
    location: "주일예배",
    title: row.label,
    body: resolveWorshipValues(row).map(([, value]) => value).join(" "),
    keywords: "예배 순서 주일예배",
    rank: row.label.includes("설교") || row.label.includes("성경") ? 3 : 1,
  })),
  ...bulletin.weekly.map((item, index) => ({
    tab: "worship",
    target: targetId("weekly", index),
    type: "주중예배",
    location: "예배",
    title: item.title,
    body: `${item.time} ${item.body}`,
    keywords: "예배 주중 수요 새벽 금요",
    rank: 1,
  })),
  ...bulletin.news.map((item, index) => ({
    tab: "news",
    target: targetId("news", index),
    type: categoryLabels[item.category] || "소식",
    location: "교회소식",
    title: item.title,
    body: [item.body, ...(item.bullets || []), ...(item.speakerSchedule || []).flat()].filter(Boolean).join(" "),
    keywords: [item.priority, item.category, categoryLabels[item.category]].filter(Boolean).join(" "),
    rank: item.category === "today" ? 3 : 1,
  })),
  {
    tab: "sermon",
    target: "sermon-main",
    type: "말씀",
    location: "주일설교요약",
    title: bulletin.sermon.title,
    body: [bulletin.sermon.passage, bulletin.sermon.preacher, ...bulletin.sermon.summary, ...bulletin.sermon.questions].join(" "),
    keywords: "설교 말씀 요약 본문 적용 질문 구역교회",
    rank: 5,
  },
  {
    tab: "sermon",
    target: "sermon-questions",
    type: "적용질문",
    location: "주일설교요약",
    title: "본문 질문과 적용 질문",
    body: bulletin.sermon.questions.join(" "),
    keywords: "적용 질문 나눔 묵상 구역교회",
    rank: 5,
  },
  {
    tab: "sermon",
    target: "district",
    type: "구역교회",
    location: "말씀",
    title: bulletin.district.title,
    body: [
      bulletin.district.theme,
      bulletin.district.welcome,
      bulletin.district.icebreaker,
      ...bulletin.district.praise,
      bulletin.district.prayer,
      bulletin.district.ministry,
      bulletin.district.closing,
      bulletin.district.song,
    ].join(" "),
    keywords: "구역 교회 구역교회 모임 순서 찬양 기도 사역 암송",
    rank: 4,
  },
  ...bulletin.meetings.map(([name, time, place], index) => ({
    tab: "meeting",
    target: targetId("meeting", index),
    type: "모임",
    location: "예배 및 모임 안내",
    title: name,
    body: `${time} ${place}`,
    keywords: "모임 부서 공동체 예배",
    rank: 1,
  })),
  ...bulletin.directions.map((item, index) => ({
    tab: "guide",
    target: targetId("guide", index),
    type: "안내",
    location: "오시는 길",
    title: item.title,
    body: item.body,
    keywords: "길 위치 교통 주차 지하철 버스 지도",
    rank: item.title.includes("주차") ? 4 : 2,
  })),
  ...bulletin.servants.map((item) => ({
    tab: "guide",
    target: "serve",
    type: "섬기는 사람들",
    location: "안내",
    title: item.label,
    body: item.names,
    keywords: "섬기는 사람들 교역자 장로 목사",
    rank: 1,
  })),
  {
    tab: "guide",
    target: "volunteer",
    type: "봉사위원",
    location: "안내",
    title: "6월 봉사위원",
    body: [
      ...bulletin.volunteer.guide.flat(),
      ...bulletin.volunteer.meal.flat(),
      bulletin.volunteer.parking,
    ].join(" "),
    keywords: "봉사위원 안내위원 식당 봉사 교구 주차봉사 주차",
    rank: 4,
  },
];
const featuredNews = bulletin.news.filter((item) => ["today", "apply", "schedule"].includes(item.category)).slice(0, 3);
const quickLinks = [
  { label: "설교요약", tab: "sermon", target: "sermon-main" },
  { label: "적용질문", tab: "sermon", target: "sermon-questions" },
  { label: "구역교회", tab: "sermon", target: "district" },
  { label: "오늘 소식", tab: "news", target: targetId("news", 0) },
  { label: "주차", tab: "guide", target: targetId("guide", 2) },
  { label: "봉사위원", tab: "guide", target: "volunteer" },
];

const navIcons = {
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.6 12 3.4l8.5 7.2"/><path d="M5.4 9.7V20h13.2V9.7"/><path d="M9.2 20v-6h5.6v6"/></svg>`,
  worship: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M7.5 8h9"/><path d="M5.2 21h13.6"/><path d="M8.2 21v-4.8a3.8 3.8 0 0 1 7.6 0V21"/></svg>`,
  news: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>`,
  sermon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.8h5.8A3.2 3.2 0 0 1 14 8v11.2a3.2 3.2 0 0 0-3.2-3.2H5Z"/><path d="M19 4.8h-5.8A3.2 3.2 0 0 0 10 8v11.2a3.2 3.2 0 0 1 3.2-3.2H19Z"/></svg>`,
  meeting: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.4 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M16.6 11.6a2.6 2.6 0 1 0 0-5.2"/><path d="M3.8 19.2a5.6 5.6 0 0 1 11.2 0"/><path d="M14.6 15a4.7 4.7 0 0 1 5.6 4.2"/></svg>`,
  guide: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6.2-5.4 6.2-11a6.2 6.2 0 0 0-12.4 0C5.8 15.6 12 21 12 21Z"/><path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"/></svg>`,
};

function renderNavButton(tab, label, selected = false) {
  return `<button type="button" data-tab="${tab}" aria-selected="${selected ? "true" : "false"}" aria-label="${label}">
        <span class="nav-icon" aria-hidden="true">${navIcons[tab]}</span>
        <span class="nav-label">${label}</span>
      </button>`;
}

function formatHomeServiceTime(time) {
  return time
    .replace(" 오전 ", " ")
    .replace(" 오후 ", " ");
}

const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#21483b" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="${bulletin.church.name}" />
  <meta name="description" content="${bulletin.issue.date} ${bulletin.church.name} 주일예배와 교회소식" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:title" content="${bulletin.church.name} 모바일 주보 · ${bulletin.issue.date}" />
  <meta property="og:description" content="주일예배 순서, 교회소식, 말씀과 모임 안내를 확인하세요." />
  <meta property="og:image" content="./app-icon-512.png" />
  <meta name="twitter:card" content="summary" />
  <link rel="manifest" href="./manifest.json" />
  <link rel="apple-touch-icon" sizes="180x180" href="./app-icon-192.png" />
  <title>${bulletin.church.name} 모바일 주보</title>
  <style>
    :root {
      color-scheme: light;
      --green: #13823f;
      --green-2: #1ea756;
      --green-soft: #edf8f0;
      --red: #d83a24;
      --orange: #f27522;
      --warm: #fff7f1;
      --warm-strong: #ffe9da;
      --surface: #ffffff;
      --surface-soft: #fbfdfb;
      --surface-warm: #fffaf7;
      --ink: #262122;
      --muted: #6c6364;
      --body-text: #3d3635;
      --line: #e4e1dc;
      --card-line: #e4e1dc;
      --card-line-strong: rgba(19, 130, 63, .20);
      --card-utility: #f7faf7;
      --glass: rgba(255, 255, 255, .56);
      --glass-strong: rgba(255, 255, 255, .70);
      --glass-soft: rgba(255, 255, 255, .44);
      --glass-line: rgba(255, 255, 255, .82);
      --glass-edge: rgba(255, 255, 255, .95);
      --glass-shine: rgba(255, 255, 255, .46);
      --glass-separator: rgba(19, 130, 63, .24);
      --glass-shadow: 0 18px 44px rgba(30, 70, 45, .16);
      --glass-card-shadow: 0 12px 30px rgba(30, 70, 45, .12);
      --glass-utility-shadow: 0 8px 20px rgba(30, 70, 45, .08);
      --glass-inset: inset 0 1px 0 rgba(255, 255, 255, .80), inset 0 -1px 0 rgba(19, 130, 63, .06);
      --paper: #ffffff;
      --bg: #faf8f5;
      --accent: #f27522;
      --shadow: 0 10px 24px rgba(30, 70, 45, .10);
      --notice-text: #234533;
      --nav-bg: rgba(255, 255, 255, .95);
      --filter-bg: linear-gradient(180deg, var(--paper) 72%, rgba(255, 255, 255, 0));
      --settings-overlay: rgba(38, 33, 34, .28);
      --green-border: rgba(19, 130, 63, .22);
      --accent-border: rgba(242, 117, 34, .30);
      --nav-height: 98px;
    }

    body.theme-dark {
      color-scheme: dark;
      --green: #49b86f;
      --green-2: #63c884;
      --green-soft: #1a3324;
      --red: #ef6d5c;
      --orange: #e88b48;
      --warm: #33251f;
      --warm-strong: #432b21;
      --surface: #1b211e;
      --surface-soft: #151c18;
      --surface-warm: #261f1b;
      --ink: #f1eee9;
      --muted: #ada49e;
      --body-text: #dcd5cf;
      --line: #303a34;
      --card-line: #3a463f;
      --card-line-strong: rgba(96, 190, 128, .34);
      --card-utility: #121814;
      --glass: rgba(27, 33, 30, .56);
      --glass-strong: rgba(27, 33, 30, .70);
      --glass-soft: rgba(21, 28, 24, .48);
      --glass-line: rgba(255, 255, 255, .18);
      --glass-edge: rgba(255, 255, 255, .26);
      --glass-shine: rgba(255, 255, 255, .12);
      --glass-separator: rgba(96, 190, 128, .30);
      --glass-shadow: 0 20px 52px rgba(0, 0, 0, .38);
      --glass-card-shadow: 0 14px 36px rgba(0, 0, 0, .28);
      --glass-utility-shadow: 0 10px 24px rgba(0, 0, 0, .22);
      --glass-inset: inset 0 1px 0 rgba(255, 255, 255, .14), inset 0 -1px 0 rgba(0, 0, 0, .18);
      --paper: #111613;
      --bg: #0d110f;
      --accent: #e88b48;
      --shadow: 0 14px 34px rgba(0, 0, 0, .34);
      --notice-text: #d9eadf;
      --nav-bg: rgba(17, 24, 21, .94);
      --filter-bg: linear-gradient(180deg, var(--paper) 72%, rgba(17, 24, 21, 0));
      --settings-overlay: rgba(0, 0, 0, .52);
      --green-border: rgba(73, 184, 111, .30);
      --accent-border: rgba(232, 139, 72, .36);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    [hidden] {
      display: none !important;
    }

    body {
      margin: 0;
      background:
        radial-gradient(circle at 12% -8%, rgba(242, 117, 34, .22), transparent 34vw),
        radial-gradient(circle at 88% 6%, rgba(30, 167, 86, .18), transparent 36vw),
        linear-gradient(180deg, var(--bg), var(--paper) 42%, var(--bg));
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
      font-size: 16px;
      line-height: 1.58;
      letter-spacing: 0;
      overscroll-behavior-y: none;
    }

    button, input, select { font: inherit; }

    .app {
      position: relative;
      max-width: 760px;
      min-height: 100svh;
      margin: 0 auto;
      background:
        radial-gradient(circle at 0 260px, rgba(242, 117, 34, .12), transparent 260px),
        radial-gradient(circle at 100% 520px, rgba(30, 167, 86, .11), transparent 280px),
        color-mix(in srgb, var(--paper) 86%, transparent);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, .03);
      overflow-x: clip;
    }

    .app::before {
      content: "";
      position: fixed;
      top: 0;
      bottom: 0;
      left: max(0px, calc((100vw - 760px) / 2));
      width: min(100vw, 760px);
      pointer-events: none;
      background:
        radial-gradient(circle at 18% 22%, rgba(242, 117, 34, .10), transparent 180px),
        radial-gradient(circle at 82% 34%, rgba(19, 130, 63, .10), transparent 210px),
        linear-gradient(120deg, rgba(255, 255, 255, .10), transparent 42%, rgba(255, 255, 255, .08));
      z-index: 0;
    }

    .hero,
    .quick,
    .content,
    .bottom-nav {
      position: relative;
    }

    .hero,
    .quick,
    .content {
      z-index: 1;
    }

    .hero {
      position: relative;
      min-height: 162px;
      padding: calc(9px + env(safe-area-inset-top)) 16px 10px;
      overflow: hidden;
      background:
        linear-gradient(110deg, rgba(25, 31, 28, .94) 0%, rgba(13, 112, 61, .78) 60%, rgba(216, 58, 36, .20) 100%),
        url("${heroBackground}") center / cover no-repeat,
        var(--green);
      color: #fff;
    }

    .hero::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0) 58%, rgba(38, 33, 34, .70) 100%),
        linear-gradient(90deg, rgba(242, 117, 34, .08), rgba(30, 167, 86, .10));
      pointer-events: none;
    }

    .hero .settings-button {
      position: absolute;
      top: calc(10px + env(safe-area-inset-top));
      right: 14px;
      z-index: 2;
      border-color: rgba(255, 255, 255, .50);
      background: rgba(255, 255, 255, .18);
      color: #fff;
      box-shadow: 0 10px 26px rgba(0, 0, 0, .18);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      backdrop-filter: blur(18px) saturate(160%);
    }

    .brand {
      position: relative;
      display: inline-flex;
      align-items: center;
      z-index: 1;
      max-width: calc(100% - 104px);
      padding: 5px 7px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, .72);
      background: rgba(255, 255, 255, .84);
      box-shadow: 0 8px 24px rgba(30, 18, 14, .26);
      -webkit-backdrop-filter: blur(16px) saturate(150%);
      backdrop-filter: blur(16px) saturate(150%);
    }

    .brand-logo {
      display: block;
      width: min(156px, 50vw);
      height: auto;
    }

    .issue { color: rgba(255, 255, 255, .78); }

    h1, h2, h3, p { margin: 0; }

    .issue {
      position: relative;
      z-index: 1;
      margin-top: 6px;
      font-size: 13px;
      font-weight: 600;
    }

    .slogan {
      position: relative;
      z-index: 1;
      margin-top: 6px;
      font-size: 16px;
      line-height: 1.32;
      font-weight: 700;
      text-shadow: 0 1px 10px rgba(0, 0, 0, .28);
    }

    .slogan span {
      display: inline-block;
      margin-bottom: 4px;
      padding: 2px 7px;
      border: 1px solid rgba(255, 255, 255, .72);
      border-left: 4px solid var(--green-2);
      color: rgba(255, 255, 255, .92);
      font-size: 12.5px;
      font-weight: 600;
    }

    .pastor {
      position: relative;
      z-index: 1;
      margin-top: 6px;
      color: rgba(255, 255, 255, .82);
      font-size: 13px;
    }

    .hero-contact {
      position: relative;
      z-index: 1;
      display: none;
      gap: 1px;
      margin-top: 6px;
      color: rgba(255, 255, 255, .82);
      font-size: 13px;
      line-height: 1.35;
    }

    .quick {
      position: sticky;
      top: env(safe-area-inset-top);
      z-index: 15;
      display: flex;
      gap: 6px;
      padding: 8px 10px;
      background: var(--glass-strong);
      border-bottom: 1px solid var(--glass-line);
      -webkit-backdrop-filter: blur(20px) saturate(170%);
      backdrop-filter: blur(20px) saturate(170%);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .quick::-webkit-scrollbar { display: none; }

    .quick button {
      flex: 1 0 auto;
      display: grid;
      place-items: center;
      min-width: 62px;
      min-height: 36px;
      border: 1px solid var(--glass-line);
      border-radius: 8px;
      background: var(--glass-soft);
      color: var(--ink);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: transform .18s ease, background-color .18s ease, border-color .18s ease, color .18s ease;
      box-shadow: var(--glass-inset);
    }

    .quick button[aria-selected="true"] {
      border-color: var(--red);
      background: linear-gradient(135deg, var(--red), var(--orange));
      color: #fff;
      transform: translateY(-1px);
    }

    .content {
      padding: 14px 10px calc(var(--nav-height) + 18px + env(safe-area-inset-bottom));
    }

    .home-stack {
      display: grid;
      gap: 13px;
    }

    .home-hero {
      position: relative;
      display: grid;
      gap: 10px;
      padding: 15px;
      border: 1px solid var(--glass-edge);
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(255, 255, 255, .08), rgba(255, 255, 255, 0)),
        var(--glass-strong);
      box-shadow: var(--glass-inset), var(--glass-shadow);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      backdrop-filter: blur(26px) saturate(180%);
      overflow: hidden;
      isolation: isolate;
    }

    .home-hero::before,
    .verse-card::before,
    .settings-sheet::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(135deg, var(--glass-shine), transparent 28%),
        linear-gradient(315deg, rgba(255, 255, 255, .10), transparent 42%);
      mix-blend-mode: screen;
      opacity: .82;
      z-index: 0;
    }

    .home-hero > *,
    .verse-card > *,
    .settings-sheet > * {
      position: relative;
      z-index: 1;
    }

    .home-title {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-title h2 {
      font-size: 22px;
    }

    .home-date {
      flex: 0 0 auto;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      text-align: right;
    }

    .settings-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      min-height: 36px;
      padding: 0 11px;
      border: 1px solid var(--green-border);
      border-radius: 999px;
      background: var(--glass);
      color: var(--green);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      -webkit-backdrop-filter: blur(14px) saturate(150%);
      backdrop-filter: blur(14px) saturate(150%);
      transition: transform .18s ease, background-color .18s ease, border-color .18s ease;
      box-shadow: var(--glass-inset), 0 8px 20px rgba(30, 70, 45, .08);
    }

    .settings-button:active,
    .home-card:active,
    .quick-link:active,
    .home-news-item:active,
    .action-link:active,
    .text-action:active,
    .card-action:active,
    .bottom-nav button:active {
      transform: scale(.985);
    }

    .settings-icon {
      font-size: 15px;
      line-height: 1;
    }

    .home-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
    }

    .home-card {
      position: relative;
      display: grid;
      gap: 4px;
      min-height: 88px;
      padding: 13px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass);
      box-shadow: var(--glass-inset), var(--glass-card-shadow);
      -webkit-backdrop-filter: blur(20px) saturate(165%);
      backdrop-filter: blur(20px) saturate(165%);
      transition: transform .18s ease, border-color .18s ease, background-color .18s ease;
      overflow: hidden;
      isolation: isolate;
    }

    .home-card::before,
    .quick-finder::before,
    .search-panel::before,
    .install-card::before,
    .sermon-feature::before,
    .list-card::before,
    .meeting-card::before,
    .card::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(140deg, rgba(255, 255, 255, .24), transparent 32%);
      opacity: .34;
      z-index: 0;
    }

    .home-card::before {
      opacity: .46;
    }

    .home-card > *,
    .quick-finder > *,
    .search-panel > *,
    .install-card > *,
    .sermon-feature > *,
    .list-card > *,
    .meeting-card > *,
    .card > * {
      position: relative;
      z-index: 1;
    }

    .home-card strong {
      color: var(--green);
      font-size: 15px;
      line-height: 1.25;
    }

    .home-card span {
      color: var(--ink);
      font-size: 14px;
      font-weight: 600;
      line-height: 1.35;
    }

    .home-card small {
      color: var(--muted);
      font-size: 13.5px;
      font-weight: 500;
      line-height: 1.35;
    }

    .home-card.is-worship {
      grid-column: 1 / -1;
      min-height: 104px;
      align-content: center;
      border-color: var(--green-border);
    }

    .home-card.is-sermon {
      grid-column: 1 / -1;
      min-height: 104px;
      align-content: center;
      border-color: var(--accent-border);
      background:
        linear-gradient(135deg, rgba(242, 117, 34, .12), rgba(19, 130, 63, .08)),
        var(--glass);
    }

    .home-card.is-sermon strong {
      color: var(--red);
      font-size: 16px;
    }

    .home-card.is-sermon span {
      font-size: 17px;
      line-height: 1.38;
    }

    .home-service-times {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7px;
      align-self: end;
    }

    .home-service-times span {
      display: grid;
      place-items: center;
      min-height: 34px;
      padding: 6px 5px;
      border: 1px solid var(--green-border);
      border-radius: 8px;
      background: var(--glass-soft);
      color: var(--ink);
      font-size: 13.5px;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
      white-space: nowrap;
    }

    .quick-finder {
      position: relative;
      display: grid;
      gap: 10px;
      padding: 13px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass-soft);
      box-shadow: var(--glass-inset), var(--glass-utility-shadow);
      -webkit-backdrop-filter: blur(20px) saturate(165%);
      backdrop-filter: blur(20px) saturate(165%);
      overflow: hidden;
      isolation: isolate;
    }

    .quick-finder .section-head {
      margin-bottom: 0;
    }

    .quick-link-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7px;
    }

    .quick-link {
      min-height: 40px;
      padding: 8px 7px;
      border: 1px solid var(--green-border);
      border-radius: 8px;
      background: var(--glass);
      color: var(--green);
      font-size: 14px;
      font-weight: 600;
      line-height: 1.25;
      cursor: pointer;
      box-shadow: var(--glass-inset);
      transition: transform .18s ease, border-color .18s ease, background-color .18s ease;
    }

    .verse-card {
      position: relative;
      display: grid;
      gap: 9px;
      padding: 15px;
      border: 1px solid var(--glass-edge);
      border-radius: 8px;
      background: var(--glass-strong);
      box-shadow: var(--glass-inset), var(--glass-shadow);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      backdrop-filter: blur(26px) saturate(180%);
      overflow: hidden;
      isolation: isolate;
    }

    .verse-card .section-head {
      margin-bottom: 0;
    }

    .text-action {
      min-height: 34px;
      padding: 0 10px;
      border: 1px solid var(--green-border);
      border-radius: 999px;
      background: var(--glass);
      color: var(--green);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      -webkit-backdrop-filter: blur(12px) saturate(145%);
      backdrop-filter: blur(12px) saturate(145%);
      transition: transform .18s ease, background-color .18s ease, border-color .18s ease;
    }

    .verse-text {
      color: var(--ink);
      font-size: 17px;
      font-weight: 600;
      line-height: 1.52;
      word-break: keep-all;
    }

    .verse-reference {
      justify-self: start;
      color: var(--green);
      font-size: 13px;
      font-weight: 600;
    }

    .home-news {
      display: grid;
      gap: 8px;
    }

    .home-news-item {
      display: grid;
      gap: 3px;
      padding: 12px;
      border: 1px solid var(--accent-border);
      border-left: 4px solid var(--orange);
      border-radius: 8px;
      background: linear-gradient(135deg, var(--surface-warm), var(--surface));
      text-align: left;
      transition: transform .18s ease, border-color .18s ease;
    }

    .home-news-item strong {
      color: var(--ink);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.35;
    }

    .home-news-meta {
      color: var(--muted);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
    }

    .home-tools {
      display: grid;
      gap: 10px;
      margin-top: 2px;
      padding-top: 2px;
    }

    .home-tools .section-head h2 {
      font-size: 18px;
    }

    .home-tools .eyebrow {
      color: var(--muted);
    }

    .status-pill {
      justify-self: start;
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--warm-strong);
      color: var(--red);
      font-size: 13px;
      font-weight: 600;
    }

    .search-panel {
      position: relative;
      display: grid;
      gap: 9px;
      padding: 12px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass-soft);
      box-shadow: var(--glass-inset), var(--glass-utility-shadow);
      -webkit-backdrop-filter: blur(20px) saturate(165%);
      backdrop-filter: blur(20px) saturate(165%);
      overflow: hidden;
      isolation: isolate;
    }

    .search-input {
      width: 100%;
      min-height: 42px;
      padding: 0 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--ink);
      font-size: 15px;
    }

    .search-input:focus {
      outline: 2px solid rgba(19, 130, 63, .18);
      border-color: var(--green);
    }

    .search-results {
      display: grid;
      gap: 8px;
    }

    .search-count {
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }

    .search-result {
      display: grid;
      gap: 4px;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass);
      color: var(--ink);
      text-align: left;
      cursor: pointer;
    }

    .search-result strong {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.35;
    }

    .search-result span {
      justify-self: start;
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--surface-soft);
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }

    .search-result small {
      color: var(--body-text);
      font-size: 13.5px;
      font-weight: 500;
      line-height: 1.42;
    }

    .search-location {
      color: var(--green);
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
    }

    .search-result mark {
      border-radius: 4px;
      background: var(--warm-strong);
      color: var(--red);
      font-weight: 700;
    }

    .search-empty {
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
    }

    .archive-select {
      width: 100%;
      min-height: 40px;
      padding: 0 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--ink);
      font-weight: 600;
    }

    .archive-note {
      margin-top: 7px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.45;
    }

    .install-card {
      position: relative;
      display: grid;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass-soft);
      box-shadow: var(--glass-inset), var(--glass-utility-shadow);
      -webkit-backdrop-filter: blur(20px) saturate(165%);
      backdrop-filter: blur(20px) saturate(165%);
      overflow: hidden;
      isolation: isolate;
    }

    .install-card p {
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.45;
    }

    .install-status,
    .ops-list {
      display: grid;
      gap: 5px;
      color: var(--body-text);
      font-size: 14px;
      line-height: 1.45;
    }

    .install-status strong,
    .ops-list strong {
      color: var(--green);
      font-weight: 700;
    }

    .jump-highlight {
      animation: jumpPulse 2.4s ease;
    }

    [data-jump-target],
    .sub-section {
      scroll-margin-top: calc(58px + env(safe-area-inset-top));
    }

    @keyframes jumpPulse {
      0%, 100% { box-shadow: none; }
      14%, 78% { box-shadow: 0 0 0 3px rgba(242, 117, 34, .24), var(--shadow); }
    }

    @keyframes pageSettle {
      from { opacity: .72; }
      to { opacity: 1; }
    }

    @keyframes pageHeadingSettle {
      from { opacity: .62; transform: translate3d(0, 16px, 0); }
      60% { opacity: 1; }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }

    @keyframes filterCardIn {
      from { transform: translate3d(0, 3px, 0); }
      to { transform: translate3d(0, 0, 0); }
    }

    section {
      scroll-margin-top: 10px;
      margin-bottom: 14px;
    }

    .sub-section {
      margin-top: 30px;
    }

    .view {
      display: none;
      margin-bottom: 0;
    }

    .view.is-active {
      display: block;
      animation: pageSettle .58s cubic-bezier(.22, .72, .2, 1) both;
    }

    .view.is-active > :first-child {
      animation: pageHeadingSettle .64s cubic-bezier(.16, .84, .24, 1) both;
    }

    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 8px;
    }

    .page-context {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: -2px 0 12px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.35;
    }

    .page-context strong {
      color: var(--green);
      font-weight: 700;
    }

    .page-context span {
      flex: 0 0 auto;
      padding: 2px 7px;
      border: 1px solid var(--glass-separator);
      border-radius: 999px;
      background: var(--glass-soft);
      color: var(--green);
      box-shadow: var(--glass-inset);
    }

    .eyebrow {
      color: var(--green);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    h2 {
      color: var(--ink);
      font-size: 20px;
      line-height: 1.25;
      font-weight: 700;
    }

    .chip {
      flex: 0 0 auto;
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--warm);
      color: var(--green);
      font-size: 13px;
      font-weight: 600;
    }

    .card {
      position: relative;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass-strong);
      overflow: hidden;
      box-shadow: var(--glass-inset), var(--glass-card-shadow);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      backdrop-filter: blur(18px) saturate(160%);
      isolation: isolate;
    }

    .card + .card,
    .list-card + .list-card {
      margin-top: 12px;
    }

    .card-pad {
      padding: 14px;
    }

    .notice {
      border-left: 5px solid var(--orange);
      background: var(--surface-warm);
      padding: 11px 13px;
      color: var(--body-text);
      font-weight: 500;
      font-size: 14px;
    }

    .service-times {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      padding: 8px;
      border-bottom: 1px solid var(--line);
      background: var(--surface-soft);
    }

    .service-times button {
      display: grid;
      place-items: center;
      min-height: 36px;
      padding: 0 8px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--surface);
      color: var(--green);
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--glass-inset);
    }

    .service-times button[aria-selected="true"] {
      border-color: rgba(255, 255, 255, .56);
      background: linear-gradient(135deg, var(--green), var(--green-2));
      color: #fff;
    }

    .worship-row {
      display: grid;
      grid-template-columns: 92px minmax(0, 1fr);
      gap: 0;
      border-top: 1px solid var(--line);
    }

    .worship-row:first-child { border-top: 0; }

    .worship-label {
      padding: 10px 8px;
      background: var(--green-soft);
      color: var(--ink);
      font-size: 14px;
      font-weight: 700;
      word-break: keep-all;
    }

    .worship-label span {
      display: block;
      margin-bottom: 3px;
      color: var(--green);
      font-size: 12px;
      line-height: 1;
      letter-spacing: .04em;
    }

    .worship-body {
      display: grid;
      gap: 6px;
      padding: 7px;
      align-content: start;
    }

    .part {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      min-height: 40px;
      padding: 7px 8px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      white-space: pre-line;
      font-size: 15px;
      word-break: keep-all;
    }

    .part strong {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 2px 6px;
      border-radius: 999px;
      background: var(--green-soft);
      color: var(--green);
      font-size: 12.5px;
      line-height: 1.2;
      font-weight: 600;
      margin-top: 1px;
    }

    .part.is-long {
      display: block;
    }

    .part.is-long strong {
      margin: 0 0 4px;
    }

    #worship > .sub-section:first-child {
      margin-top: 0;
    }

    #worship #campaign {
      margin-bottom: 16px;
    }

    #worship #campaign .section-head,
    #worship > .section-head {
      margin-bottom: 7px;
    }

    #worship > .card {
      margin-top: 0;
    }

    #worship #weekly {
      margin-top: 22px;
    }

    #worship .notice {
      padding-block: 8px;
    }

    .grid {
      display: grid;
      gap: 8px;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .action-link {
      display: grid;
      place-items: center;
      min-height: 40px;
      padding: 8px;
      border: 1px solid var(--green-border);
      border-radius: 8px;
      background: var(--green-soft);
      color: var(--green);
      text-align: center;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
    }

    .action-link.secondary {
      border-color: var(--line);
      background: var(--surface-soft);
      color: var(--body-text);
    }

    .filter-bar {
      position: sticky;
      top: env(safe-area-inset-top);
      z-index: 10;
      display: flex;
      gap: 6px;
      margin: 0 0 12px;
      padding: 0 0 2px;
      background: transparent;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .filter-bar::-webkit-scrollbar {
      display: none;
    }

    .filter-bar button {
      flex: 0 0 auto;
      min-height: 34px;
      padding: 0 11px;
      border: 1px solid var(--glass-separator);
      border-radius: 999px;
      background: var(--glass);
      color: var(--muted);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--glass-inset), var(--glass-utility-shadow);
      -webkit-backdrop-filter: blur(14px) saturate(150%);
      backdrop-filter: blur(14px) saturate(150%);
      transition: transform .18s ease, background-color .18s ease, color .18s ease, border-color .18s ease;
    }

    .filter-bar button[aria-selected="true"] {
      border-color: rgba(255, 255, 255, .56);
      background: linear-gradient(135deg, var(--green), var(--green-2));
      color: #fff;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, .22), 0 8px 20px rgba(19, 130, 63, .22);
      transform: translateY(-1px);
    }

    .news-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      align-items: center;
      min-height: 34px;
      padding: 10px 13px 0;
      margin-bottom: 0;
    }

    .news-tag {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--green-soft);
      color: var(--green);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
      box-shadow: var(--glass-inset);
    }

    .news-tag.is-priority {
      background: var(--warm-strong);
      color: var(--red);
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 10px 10px;
    }

    .card-action {
      min-height: 32px;
      padding: 0 10px;
      border: 1px solid var(--green-border);
      border-radius: 999px;
      background: var(--surface);
      color: var(--green);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .list-card.is-hidden {
      display: none;
    }

    .app.is-filtering-news .list-card:not(.is-hidden) {
      animation: filterCardIn .26s cubic-bezier(.2, .8, .2, 1) both;
    }

    .meeting-groups {
      display: grid;
      gap: 15px;
    }

    .meeting-group {
      display: grid;
      gap: 9px;
    }

    .meeting-group-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--green);
      font-size: 15px;
      font-weight: 700;
    }

    .meeting-group-title::before {
      content: "";
      width: 6px;
      height: 18px;
      border-radius: 999px;
      background: var(--green);
    }

    .meeting-card {
      position: relative;
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      gap: 8px;
      align-items: start;
      padding: 11px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass);
      box-shadow: var(--glass-inset), var(--glass-card-shadow);
      -webkit-backdrop-filter: blur(18px) saturate(155%);
      backdrop-filter: blur(18px) saturate(155%);
      overflow: hidden;
      isolation: isolate;
    }

    .meeting-card h3 {
      color: var(--ink);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
    }

    .meeting-meta {
      display: grid;
      gap: 4px;
    }

    .meeting-meta p {
      display: grid;
      grid-template-columns: 34px 1fr;
      gap: 6px;
      align-items: start;
      color: var(--body-text);
      font-size: 14px;
      line-height: 1.35;
    }

    .meeting-meta span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }

    @media (max-width: 360px) {
      .meeting-card { grid-template-columns: 96px minmax(0, 1fr); }
    }

    .list-card {
      position: relative;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass);
      overflow: hidden;
      box-shadow: var(--glass-inset), var(--glass-card-shadow);
      -webkit-backdrop-filter: blur(18px) saturate(155%);
      backdrop-filter: blur(18px) saturate(155%);
      isolation: isolate;
    }

    .list-card h3 {
      padding: 8px 13px 6px;
      color: var(--green);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.35;
    }

    .list-card p {
      padding: 0 13px 12px;
      color: var(--body-text);
      font-size: 15px;
    }

    .speaker-schedule {
      display: grid;
      gap: 1px;
      margin: 2px 12px 12px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--line);
    }

    .speaker-schedule-title {
      padding: 9px 11px;
      background: var(--surface-soft);
      color: var(--green);
      font-size: 14px;
      font-weight: 700;
    }

    .speaker-row {
      display: grid;
      grid-template-columns: minmax(108px, .9fr) minmax(0, 1.45fr);
      gap: 10px;
      align-items: start;
      padding: 9px 11px;
      background: var(--surface);
      font-size: 14px;
      line-height: 1.5;
    }

    .speaker-row > strong {
      color: var(--ink);
      font-weight: 600;
    }

    .speaker-row > span {
      color: var(--body-text);
    }

    @media (max-width: 360px) {
      .speaker-row {
        grid-template-columns: 1fr;
        gap: 3px;
      }
    }

    ul {
      margin: 0;
      padding: 0 11px 10px 28px;
    }

    li {
      font-size: 15px;
    }

    li + li { margin-top: 3px; }

    .two-col {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .mini {
      padding: 12px;
    }

    .mini h3 {
      margin-bottom: 3px;
      color: var(--green);
      font-size: 16px;
      font-weight: 600;
    }

    .mini time,
    .muted {
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
    }

    .sermon-feature {
      position: relative;
      display: grid;
      gap: 12px;
      padding: 15px;
      border: 1px solid var(--accent-border);
      border-left: 4px solid var(--orange);
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(242, 117, 34, .10), rgba(19, 130, 63, .06)),
        var(--glass-strong);
      box-shadow: var(--glass-inset), var(--glass-card-shadow);
      -webkit-backdrop-filter: blur(22px) saturate(170%);
      backdrop-filter: blur(22px) saturate(170%);
      overflow: hidden;
      isolation: isolate;
    }

    .sermon-feature h3 {
      color: var(--ink);
      font-size: 21px;
      font-weight: 700;
      line-height: 1.34;
      word-break: keep-all;
    }

    .sermon-feature-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .sermon-feature-meta span {
      padding: 4px 8px;
      border: 1px solid var(--green-border);
      border-radius: 999px;
      background: var(--surface-soft);
      color: var(--green);
      font-size: 13.5px;
      font-weight: 600;
    }

    .sermon-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .sermon-actions button {
      min-height: 40px;
      padding: 8px 10px;
      border: 1px solid var(--green-border);
      border-radius: 8px;
      background: var(--glass);
      color: var(--green);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--glass-inset);
    }

    .sermon-title {
      display: grid;
      gap: 4px;
      padding: 12px;
      background: var(--surface-soft);
      border-bottom: 1px solid var(--line);
    }

    .sermon-title strong {
      color: var(--ink);
      font-size: 20px;
      font-weight: 700;
      line-height: 1.35;
    }

    .summary-list {
      display: grid;
      gap: 9px;
      padding: 13px;
    }

    .summary-list p {
      padding-left: 13px;
      border-left: 3px solid var(--orange);
    }

    .district-detail {
      display: grid;
      gap: 16px;
      line-height: 1.65;
    }

    .district-detail p {
      margin: 0;
    }

    .district-detail p > strong {
      display: inline-block;
      margin-bottom: 5px;
      line-height: 1.4;
    }

    details {
      border-top: 1px solid var(--line);
      background: var(--surface);
    }

    details.collapsible-card {
      position: relative;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass-soft);
      box-shadow: var(--glass-inset), var(--glass-utility-shadow);
      -webkit-backdrop-filter: blur(16px) saturate(150%);
      backdrop-filter: blur(16px) saturate(150%);
      overflow: hidden;
      isolation: isolate;
    }

    details.collapsible-card + details.collapsible-card,
    details.collapsible-card + .list-card,
    .list-card + details.collapsible-card {
      margin-top: 9px;
    }

    summary {
      min-height: 42px;
      padding: 10px 12px;
      color: var(--green);
      font-weight: 700;
      cursor: pointer;
    }

    summary::marker {
      color: var(--orange);
    }

    .table-list {
      display: grid;
      gap: 6px;
      padding: 11px;
    }

    .table-item {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 8px;
      padding: 10px;
      border: 1px solid var(--glass-separator);
      border-radius: 8px;
      background: var(--glass-soft);
      font-size: 15px;
      box-shadow: var(--glass-inset), var(--glass-utility-shadow);
      -webkit-backdrop-filter: blur(12px) saturate(145%);
      backdrop-filter: blur(12px) saturate(145%);
    }

    .table-item strong {
      color: var(--green);
      font-size: 14px;
      font-weight: 600;
    }

    .bottom-nav {
      position: fixed;
      right: max(14px, calc((100vw - 760px) / 2 + 18px));
      bottom: calc(10px + env(safe-area-inset-bottom));
      left: max(14px, calc((100vw - 760px) / 2 + 18px));
      z-index: 20;
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 4px;
      min-height: 70px;
      padding: 8px 7px;
      border: 1px solid var(--glass-line);
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, .42), rgba(255, 255, 255, .12)),
        var(--glass-strong);
      box-shadow: var(--glass-inset), 0 16px 48px rgba(30, 70, 45, .18);
      -webkit-backdrop-filter: blur(30px) saturate(190%);
      backdrop-filter: blur(30px) saturate(190%);
      transform: translateZ(0);
      contain: layout paint;
    }

    .bottom-nav button {
      position: relative;
      display: grid;
      grid-template-rows: 24px auto;
      place-items: center;
      gap: 1px;
      min-width: 0;
      min-height: 54px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform .18s ease, background-color .18s ease, color .18s ease, box-shadow .18s ease;
    }

    .bottom-nav button:not([aria-selected="true"]) {
      background: transparent;
      box-shadow: none;
    }

    .bottom-nav button[aria-selected="true"] {
      background: rgba(38, 33, 34, .08);
      color: var(--ink);
      transform: translateY(-1px);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, .24), 0 8px 18px rgba(30, 70, 45, .12);
    }

    body.theme-dark .bottom-nav button[aria-selected="true"] {
      background: rgba(255, 255, 255, .14);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, .16), 0 8px 18px rgba(0, 0, 0, .24);
    }

    .bottom-nav button:focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 2px;
    }

    .nav-icon,
    .nav-icon svg {
      display: block;
      width: 22px;
      height: 22px;
    }

    .nav-icon svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .bottom-nav button[aria-selected="true"] .nav-icon svg {
      stroke-width: 2.35;
    }

    .bottom-nav button[aria-selected="true"] .nav-icon {
      transform: scale(1.04);
      transition: transform .22s cubic-bezier(.2, .8, .2, 1);
    }

    .nav-label {
      display: block;
      max-width: 100%;
      overflow: hidden;
      color: inherit;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .update-notice {
      position: fixed;
      left: 50%;
      bottom: calc(88px + env(safe-area-inset-bottom));
      z-index: 45;
      display: flex;
      align-items: center;
      width: min(calc(100% - 24px), 520px);
      min-height: 56px;
      padding: 10px 10px 10px 14px;
      border: 1px solid var(--glass-line);
      border-radius: 12px;
      background: var(--glass-strong);
      box-shadow: var(--glass-inset), 0 16px 40px rgba(21, 47, 37, .22);
      color: var(--ink);
      transform: translateX(-50%);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      backdrop-filter: blur(26px) saturate(180%);
    }

    .update-notice strong { flex: 1; font-size: 15px; }

    .update-notice button {
      min-height: 38px;
      padding: 0 14px;
      border: 0;
      border-radius: 8px;
      background: var(--green);
      color: #fff;
      font: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .update-notice[hidden],
    .settings-panel[hidden] {
      display: none;
    }

    .settings-panel {
      position: fixed;
      inset: 0;
      z-index: 40;
      display: grid;
      align-items: end;
      padding: 14px 10px calc(14px + env(safe-area-inset-bottom));
      background: var(--settings-overlay);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      animation: panelFade .22s ease both;
    }

    .settings-sheet {
      position: relative;
      width: min(100%, 760px);
      margin: 0 auto;
      padding: 14px;
      border: 1px solid var(--glass-line);
      border-radius: 12px;
      background: var(--glass-strong);
      box-shadow: var(--glass-inset), 0 28px 70px rgba(30, 30, 30, .30);
      -webkit-backdrop-filter: blur(34px) saturate(190%);
      backdrop-filter: blur(34px) saturate(190%);
      animation: sheetIn .26s cubic-bezier(.2, .8, .2, 1) both;
      overflow: hidden;
      isolation: isolate;
    }

    .settings-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    .settings-head h2 {
      font-size: 19px;
    }

    .settings-close {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--glass);
      color: var(--muted);
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      -webkit-backdrop-filter: blur(12px) saturate(145%);
      backdrop-filter: blur(12px) saturate(145%);
    }

    .setting-group {
      display: grid;
      gap: 8px;
    }

    .setting-group + .setting-group {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }

    .setting-label {
      color: var(--muted);
      font-size: 14px;
      font-weight: 600;
    }

    .font-options,
    .theme-options {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .theme-options {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .font-option,
    .theme-option {
      display: grid;
      gap: 2px;
      min-height: 58px;
      padding: 9px 10px;
      border: 1px solid var(--card-line);
      border-radius: 8px;
      background: var(--glass-soft);
      color: var(--ink);
      text-align: left;
      cursor: pointer;
      -webkit-backdrop-filter: blur(12px) saturate(140%);
      backdrop-filter: blur(12px) saturate(140%);
      transition: transform .18s ease, background-color .18s ease, border-color .18s ease;
    }

    .font-option strong,
    .theme-option strong {
      font-size: 15px;
      font-weight: 700;
      line-height: 1.25;
    }

    .font-option span,
    .theme-option span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
    }

    .font-option[aria-pressed="true"],
    .theme-option[aria-pressed="true"] {
      border-color: var(--green);
      background: var(--green-soft);
      color: var(--green);
      box-shadow: inset 0 0 0 1px rgba(19, 130, 63, .18);
    }

    @keyframes panelFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes sheetIn {
      from { opacity: 0; transform: translateY(18px) scale(.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *,
      *::before,
      *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .001ms !important;
      }
    }

    body.large-text {
      font-size: 18px;
      line-height: 1.7;
    }

    body.large-text .content {
      padding-bottom: calc(var(--nav-height) + 26px + env(safe-area-inset-bottom));
    }

    body.large-text .hero {
      min-height: 174px;
    }

    body.large-text .issue,
    body.large-text .pastor,
    body.large-text .hero-contact,
    body.large-text .home-date,
    body.large-text .status-pill,
    body.large-text .news-tag,
    body.large-text .verse-reference,
    body.large-text .search-result span,
    body.large-text .meeting-meta span,
    body.large-text .mini time,
    body.large-text .muted {
      font-size: 15px;
    }

    body.large-text .slogan,
    body.large-text .list-card h3,
    body.large-text .mini h3,
    body.large-text .meeting-group-title {
      font-size: 18px;
    }

    body.large-text .slogan span,
    body.large-text .eyebrow,
    body.large-text .part strong,
    body.large-text .worship-label span,
    body.large-text .bottom-nav button {
      font-size: 14px;
    }

    body.large-text h2,
    body.large-text .home-title h2,
    body.large-text .sermon-title strong {
      font-size: 22px;
    }

    body.large-text .home-card strong,
    body.large-text .home-card span,
    body.large-text .home-card small,
    body.large-text .home-service-times span,
    body.large-text .quick-link,
    body.large-text .verse-text,
    body.large-text .home-news-item strong,
    body.large-text .search-input,
    body.large-text .search-result strong,
    body.large-text .search-result small,
    body.large-text .search-empty,
    body.large-text .archive-select,
    body.large-text .archive-note,
    body.large-text .install-card p,
    body.large-text .notice,
    body.large-text .service-times button,
    body.large-text .sermon-feature-meta span,
    body.large-text .sermon-actions button,
    body.large-text .worship-label,
    body.large-text .part,
    body.large-text .filter-bar button,
    body.large-text .card-action,
    body.large-text .meeting-card h3,
    body.large-text .meeting-meta p,
    body.large-text .list-card p,
    body.large-text li,
    body.large-text .speaker-row,
    body.large-text .speaker-schedule-title,
    body.large-text .table-item,
    body.large-text .table-item strong,
    body.large-text .action-link,
    body.large-text .text-action,
    body.large-text .settings-button,
    body.large-text .setting-label,
    body.large-text .font-option strong,
    body.large-text .font-option span,
    body.large-text .theme-option strong,
    body.large-text .theme-option span {
      font-size: 16px;
      line-height: 1.55;
    }

    body.large-text .sermon-feature h3 {
      font-size: 22px;
    }

    body.large-text .verse-text {
      font-size: 19px;
      line-height: 1.62;
    }

    body.large-text .quick button,
    body.large-text .bottom-nav button,
    body.large-text .action-link,
    body.large-text .text-action,
    body.large-text .settings-button,
    body.large-text .filter-bar button,
    body.large-text .card-action,
    body.large-text .quick-link,
    body.large-text .sermon-actions button {
      min-height: 44px;
    }

    body.large-text .bottom-nav {
      min-height: 74px;
    }

    body.large-text .nav-icon,
    body.large-text .nav-icon svg {
      width: 24px;
      height: 24px;
    }

    body.large-text .nav-label {
      font-size: 12px;
    }

    body.large-text .home-card,
    body.large-text .quick-finder,
    body.large-text .sermon-feature,
    body.large-text .verse-card,
    body.large-text .home-news-item,
    body.large-text .search-panel,
    body.large-text .install-card,
    body.large-text .card-pad {
      padding: 13px;
    }

    body.large-text .home-stack,
    body.large-text .meeting-groups,
    body.large-text .summary-list {
      gap: 14px;
    }

    body.large-text .home-news {
      gap: 9px;
    }

    body.large-text .home-news-item {
      gap: 5px;
    }

    body.large-text .worship-body {
      gap: 8px;
      padding: 9px;
    }

    body.large-text .part {
      min-height: 48px;
      padding: 10px;
      line-height: 1.58;
    }

    body.large-text .part strong {
      margin-top: 0;
    }

    body.large-text .list-card p,
    body.large-text li,
    body.large-text .meeting-meta p,
    body.large-text .table-item {
      line-height: 1.62;
    }

    body.large-text .worship-row {
      grid-template-columns: 102px minmax(0, 1fr);
    }

    body.large-text .meeting-card {
      grid-template-columns: 112px minmax(0, 1fr);
    }

    @media (max-width: 380px) {
      .quick-link-grid,
      .sermon-actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .theme-options {
        grid-template-columns: 1fr;
      }

      body.large-text .home-grid,
      body.large-text .quick-link-grid,
      body.large-text .sermon-actions,
      body.large-text .action-grid {
        grid-template-columns: 1fr;
      }

      body.large-text .font-options {
        grid-template-columns: 1fr;
      }

      body.large-text .theme-options {
        grid-template-columns: 1fr;
      }

      body.large-text .service-times {
        grid-template-columns: 1fr;
      }

      body.large-text .worship-row,
      body.large-text .meeting-card {
        grid-template-columns: 1fr;
      }

      body.large-text .worship-label {
        border-bottom: 1px solid var(--line);
      }
    }

    .contact {
      display: grid;
      gap: 6px;
      margin-top: 10px;
      color: var(--muted);
      font-size: 14px;
    }

    @media (min-width: 660px) {
      .content { padding-inline: 20px; }
      .two-col { grid-template-columns: repeat(2, 1fr); }
      .worship-body { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
      .bottom-nav { max-width: 760px; margin: 0 auto; }
    }

    @media (max-width: 360px) {
      .worship-row { grid-template-columns: 90px minmax(0, 1fr); }
      .worship-label { padding-inline: 7px; }
      .part { padding-inline: 7px; }
    }

    @media print {
      body, .app { background: #fff; box-shadow: none; }
      .quick, .bottom-nav { display: none; }
      .view { display: block; }
      .card, .list-card { break-inside: avoid; }
    }

    body.preview-mode {
      min-height: 100svh;
      background: #201b1c;
      color: #fff;
      overflow: hidden;
    }

    body.preview-mode > .app {
      display: none;
    }

    .preview-lab {
      display: none;
    }

    body.preview-mode .preview-lab {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100svh;
    }

    .preview-toolbar {
      display: grid;
      gap: 10px;
      padding: calc(12px + env(safe-area-inset-top)) 12px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, .12);
      background: rgba(32, 27, 28, .96);
    }

    .preview-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-size: 13px;
      font-weight: 700;
    }

    .preview-title a {
      color: #ffd5c7;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
    }

    .preview-devices {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .preview-devices::-webkit-scrollbar {
      display: none;
    }

    .preview-devices button {
      flex: 0 0 auto;
      min-height: 34px;
      padding: 0 10px;
      border: 1px solid rgba(255, 255, 255, .18);
      border-radius: 8px;
      background: rgba(255, 255, 255, .08);
      color: rgba(255, 255, 255, .82);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .preview-devices button[aria-selected="true"] {
      border-color: var(--orange);
      background: linear-gradient(135deg, var(--red), var(--orange));
      color: #fff;
    }

    .preview-stage {
      min-width: 0;
      min-height: 0;
      overflow: auto;
      padding: 22px 16px 42px;
    }

    .preview-device {
      width: var(--device-width);
      height: var(--device-height);
      max-width: calc(100vw - 32px);
      margin: 0 auto;
      border: 10px solid #111;
      border-radius: 26px;
      background: #fff;
      box-shadow: 0 24px 70px rgba(0, 0, 0, .45);
      overflow: hidden;
    }

    .preview-frame {
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="hero">
      <button class="settings-button" type="button" aria-haspopup="dialog" aria-expanded="false" data-settings-open>
        <span class="settings-icon" aria-hidden="true">⚙</span>
        <span>설정</span>
      </button>
      <div class="brand">
        <img class="brand-logo" src="${churchLogo}" alt="${bulletin.church.name} CI" />
      </div>
      <p class="pastor">${bulletin.church.pastor}</p>
      <div class="hero-contact">
        <span>${bulletin.church.address}</span>
        <span>전화 ${bulletin.church.phone} · ${bulletin.church.website}</span>
      </div>
      <p class="slogan"><span>${bulletin.issue.sloganYear}</span><br />“${bulletin.issue.slogan}”</p>
      <p class="issue">${bulletin.issue.date} · ${bulletin.issue.volume}</p>
    </header>

    <main class="content">
      <section id="home" class="view is-active" data-view="home">
        <div class="home-stack">
          <article class="home-hero">
            <div class="home-title">
              <div>
                <div class="eyebrow">This Week</div>
                <h2>이번 주 주보</h2>
              </div>
              <div class="home-date">${bulletin.issue.date}<br />${bulletin.issue.volume}</div>
            </div>
            <div class="home-grid">
              <button class="home-card is-worship" type="button" data-tab="worship">
                <strong>주일예배</strong>
                <div class="home-service-times">
                  ${bulletin.worship.times.map((time) => `<span>${formatHomeServiceTime(time)}</span>`).join("")}
                </div>
              </button>
              <button class="home-card is-sermon" type="button" data-tab="sermon" data-target="sermon-main">
                <strong>설교</strong>
                <span>${bulletin.sermon.title}</span>
                <small>${bulletin.sermon.passage}</small>
              </button>
              <button class="home-card" type="button" data-tab="news">
                <strong>중요 소식</strong>
                <span>${featuredNews[0]?.title || "교회소식"}</span>
                <small>${featuredNews.length}건 확인</small>
              </button>
              <button class="home-card" type="button" data-tab="meeting">
                <strong>모임</strong>
                <span>예배 및 모임 안내</span>
                <small>${bulletin.meetings.length}개 모임</small>
              </button>
            </div>
          </article>

          <section class="quick-finder" aria-label="자주 찾는 항목">
            <div class="section-head">
              <div>
                <div class="eyebrow">Quick</div>
                <h2>자주 찾는 항목</h2>
              </div>
            </div>
            <div class="quick-link-grid">
              ${quickLinks.map((item) => `<button class="quick-link" type="button" data-tab="${item.tab}" data-target="${item.target}">${item.label}</button>`).join("")}
            </div>
          </section>

          <section class="verse-card" aria-label="오늘의 말씀">
            <div class="section-head">
              <div>
                <div class="eyebrow">Scripture</div>
                <h2>오늘의 말씀</h2>
              </div>
              <button class="text-action" type="button" data-verse-share>공유</button>
            </div>
            <p class="verse-text" data-verse-text>말씀을 불러오는 중입니다.</p>
            <span class="verse-reference" data-verse-reference>개역개정</span>
          </section>

          <section class="home-news" aria-label="이번 주 주요 소식">
            <div class="section-head">
              <div>
                <div class="eyebrow">Highlights</div>
                <h2>이번 주 핵심</h2>
              </div>
            </div>
            ${featuredNews.map((item) => {
              const newsIndex = bulletin.news.indexOf(item);
              return `
              <button class="home-news-item" type="button" data-tab="news" data-target="${targetId("news", newsIndex)}">
                <span class="status-pill">${categoryLabels[item.category] || "소식"}</span>
                <strong>${item.title}</strong>
                <small class="home-news-meta">${item.calendar ? "일정 추가 가능" : (item.priority || "바로 확인")}</small>
              </button>
            `;
            }).join("")}
          </section>

          <div class="home-tools" aria-label="찾기와 바로가기">
            <section class="search-panel" aria-label="주보 검색">
              <div class="section-head">
                <div>
                  <div class="eyebrow">Search</div>
                  <h2>주보 검색</h2>
                </div>
              </div>
              <input class="search-input" type="search" data-search-input placeholder="예: 주차, 청년부, 결혼, 시편" autocomplete="off" />
              <div class="search-results" role="status" aria-live="polite" aria-atomic="true" data-search-results>
                <p class="search-empty">궁금한 단어를 입력하면 예배, 소식, 모임, 안내에서 찾아드립니다.</p>
              </div>
            </section>

            <section class="card card-pad">
              <div class="section-head">
                <div>
                  <div class="eyebrow">Previous</div>
                  <h2>이전 주보 찾아보기</h2>
                </div>
              </div>
              <select class="archive-select" aria-label="이전 주보 날짜 선택" data-archive-select>
                ${archiveItems.map((item) => `<option value="${item.id}" data-url="${item.url}" ${item.current ? "selected" : ""}>${item.label} · ${item.date} · ${item.volume}</option>`).join("")}
              </select>
              <p class="archive-note" data-archive-note>이전 주보 데이터가 추가되면 이곳에서 날짜별로 바로 이동할 수 있습니다.</p>
            </section>

            <section class="action-grid" aria-label="빠른 실행">
              <a class="action-link" href="tel:${bulletin.church.phone.replaceAll("-", "")}">전화</a>
              <a class="action-link" href="${mapUrl}" target="_blank" rel="noopener">지도</a>
              <a class="action-link secondary" href="${bulletin.church.youtube}" target="_blank" rel="noopener">유튜브</a>
              <a class="action-link secondary" href="${bulletin.church.instagram}" target="_blank" rel="noopener">인스타그램</a>
              <a class="action-link secondary" href="${bulletin.church.website}" target="_blank" rel="noopener">홈페이지</a>
              <button class="action-link secondary" type="button" data-share-button>공유</button>
            </section>

            <section class="install-card" data-install-card>
              <div class="section-head">
                <div>
                  <div class="eyebrow">App</div>
                  <h2>홈 화면에 추가</h2>
                </div>
              </div>
              <div class="install-status" role="status" aria-live="polite" data-install-status>
                <p><strong>설치 상태 확인 중</strong></p>
                <p>휴대폰 홈 화면에 추가하면 매주 주보를 더 빠르게 열 수 있습니다.</p>
              </div>
              <button class="action-link secondary" type="button" data-install-button>추가 안내 보기</button>
            </section>
          </div>
        </div>
      </section>

      <section id="worship" class="view" data-view="worship">
        <div class="sub-section" id="campaign">
        <div class="section-head">
          <div>
            <div class="eyebrow">Campaign</div>
            <h2>경건한 예배 문화</h2>
          </div>
        </div>
        <article class="list-card">
          <h3>예배 캠페인</h3>
          <ul>${bulletin.worshipCampaign.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        </div>

        <div class="section-head">
          <div>
            <div class="eyebrow">Worship</div>
            <h2>${bulletin.worship.title}</h2>
          </div>
          <span class="chip">${bulletin.worship.times.length}회 예배</span>
        </div>
        <div class="card">
          <p class="notice">${bulletin.worship.note}</p>
          <div class="service-times">
            ${bulletin.worship.times.map((time, index) => `<button type="button" data-worship-part="${index + 1}" aria-selected="false">${time}</button>`).join("")}
          </div>
          ${bulletin.worship.rows.map(renderWorshipRow).join("")}
          <p class="notice">${bulletin.worship.nextPrayer}</p>
        </div>

        <div class="sub-section" id="weekly">
        <div class="section-head">
          <div>
            <div class="eyebrow">Weekday</div>
            <h2>주중예배</h2>
          </div>
        </div>
        <div class="grid two-col">
          ${bulletin.weekly.map((item, index) => `
            <article class="card mini" id="${targetId("weekly", index)}" data-jump-target>
              <h3>${item.title}</h3>
              <time>${item.time}</time>
              <p>${item.body}</p>
            </article>
          `).join("")}
        </div>
        </div>
      </section>

      <section id="news" class="view" data-view="news">
        <div class="section-head">
          <div>
            <div class="eyebrow">News</div>
            <h2>교회소식</h2>
          </div>
          <span class="chip">${bulletin.news.length}건</span>
        </div>
        <div class="page-context">
          <strong>필터로 필요한 소식만 보기</strong>
          <span role="status" aria-live="polite" aria-atomic="true" data-news-visible-count>${bulletin.news.length}건</span>
        </div>
        <div class="filter-bar" aria-label="교회소식 필터">
          ${newsFilters.map(([key, label]) => `<button type="button" data-news-filter="${key}" aria-selected="${key === "all"}">${label}</button>`).join("")}
        </div>
        ${bulletin.news.map(renderNewsCard).join("")}
      </section>

      <section id="sermon" class="view" data-view="sermon">
        <div class="section-head">
          <div>
            <div class="eyebrow">Sermon</div>
            <h2>주일설교요약</h2>
          </div>
        </div>
        <div class="sermon-feature">
          <div class="sermon-feature-meta">
            <span>${bulletin.sermon.passage}</span>
            <span>${bulletin.sermon.preacher}</span>
          </div>
          <h3>${bulletin.sermon.title}</h3>
          <div class="sermon-actions">
            <button type="button" data-scroll-target="sermon-main">설교요약 보기</button>
            <button type="button" data-scroll-target="sermon-questions">적용질문 보기</button>
          </div>
        </div>
        <article class="card" id="sermon-main" data-jump-target>
          <div class="sermon-title">
            <strong>${bulletin.sermon.title}</strong>
            <span class="muted">${bulletin.sermon.passage} · ${bulletin.sermon.preacher}</span>
          </div>
          <div class="summary-list">
            ${bulletin.sermon.summary.map((text) => `<p>${text}</p>`).join("")}
          </div>
          <details id="sermon-questions" data-jump-target open>
            <summary>본문 질문과 적용 질문</summary>
            <ul>${bulletin.sermon.questions.map((text) => `<li>${text}</li>`).join("")}</ul>
          </details>
        </article>

        <div class="sub-section" id="district">
        <div class="section-head">
          <div>
            <div class="eyebrow">Group</div>
            <h2>구역교회</h2>
          </div>
        </div>
        <article class="card">
          <div class="sermon-title">
            <strong>${bulletin.district.theme}</strong>
            <span class="muted">${bulletin.district.title}</span>
          </div>
          <details class="collapsible-card">
            <summary>환영과 찬양</summary>
            <div class="card-pad district-detail">
              <p><strong>구역원들을 환영</strong><br />${bulletin.district.welcome}</p>
              <p><strong>아이스브레이크</strong><br />${bulletin.district.icebreaker}</p>
              <p><strong>역동적인 찬양</strong><br />${bulletin.district.praise.join("<br />")}</p>
            </div>
          </details>
          <div class="table-list">
            ${bulletin.district.order.map(([name, type, time]) => `
              <div class="table-item">
                <strong>${time}</strong>
                <div>${type}<br /><span class="muted">${name}</span></div>
              </div>
            `).join("")}
          </div>
          <details class="collapsible-card">
            <summary>기도와 사역</summary>
            <div class="card-pad district-detail">
              <p><strong>회원들 간의 기도와 섬김</strong><br />${bulletin.district.prayer}</p>
              <p><strong>모든 구역원들의 사역에 참여</strong><br />${bulletin.district.ministry}</p>
            </div>
          </details>
          <details class="collapsible-card">
            <summary>마무리와 암송</summary>
            <p class="card-pad">${bulletin.district.closing}<br /><br />${bulletin.district.song}</p>
          </details>
        </article>
        </div>
      </section>

      <section id="meeting" class="view" data-view="meeting">
        <div class="section-head">
          <div>
            <div class="eyebrow">Guide</div>
            <h2>예배 및 모임 안내</h2>
          </div>
        </div>
        <div class="page-context">
          <strong>대상별 모임을 빠르게 확인</strong>
          <span>${bulletin.meetings.length}개</span>
        </div>
        <div class="meeting-groups">
          ${meetingGroups.map((group) => `
            <div class="meeting-group">
              <h3 class="meeting-group-title">${group.title}</h3>
              ${group.items.map(([name, time, place]) => {
                const meetingIndex = bulletin.meetings.findIndex(([meetingName, meetingTime, meetingPlace]) => meetingName === name && meetingTime === time && meetingPlace === place);
                return `
                <article class="meeting-card" id="${targetId("meeting", meetingIndex)}" data-jump-target>
                  <h3>${name}</h3>
                  <div class="meeting-meta">
                    <p><span>시간</span>${time}</p>
                    <p><span>장소</span>${place}</p>
                  </div>
                </article>
              `;
              }).join("")}
            </div>
          `).join("")}
        </div>
      </section>

      <section id="guide" class="view" data-view="guide">
        <div class="section-head">
          <div>
            <div class="eyebrow">Serve</div>
            <h2>안내</h2>
          </div>
        </div>
        <div class="page-context">
          <strong>오시는 길과 교회 정보를 한곳에서 확인</strong>
          <span>바로가기</span>
        </div>
        <div class="filter-bar guide-shortcuts" aria-label="안내 바로가기">
          <button type="button" data-scroll-target="guide-1">지하철</button>
          <button type="button" data-scroll-target="guide-2">버스</button>
          <button type="button" data-scroll-target="guide-3">주차</button>
          <button type="button" data-scroll-target="serve">섬기는 사람들</button>
          <button type="button" data-scroll-target="volunteer">봉사위원</button>
        </div>
        <div class="grid">
          ${bulletin.directions.map((item, index) => `
            <details class="collapsible-card mini" id="${targetId("guide", index)}" data-jump-target>
              <summary>${item.title}</summary>
              <p class="card-pad">${item.body}</p>
            </details>
          `).join("")}
        </div>
        <article class="card card-pad contact">
          <span>${bulletin.church.address}</span>
          <span>전화 ${bulletin.church.phone} · 팩스 ${bulletin.church.fax}</span>
          <span>${bulletin.church.website}</span>
          <span>${bulletin.church.email}</span>
          <div class="action-grid">
            <a class="action-link" href="tel:${bulletin.church.phone.replaceAll("-", "")}">전화 걸기</a>
            <a class="action-link" href="${mapUrl}" target="_blank" rel="noopener">지도 열기</a>
            <a class="action-link secondary" href="${bulletin.church.youtube}" target="_blank" rel="noopener">유튜브</a>
            <a class="action-link secondary" href="${bulletin.church.instagram}" target="_blank" rel="noopener">인스타그램</a>
            <a class="action-link secondary" href="${bulletin.church.website}" target="_blank" rel="noopener">홈페이지</a>
            <a class="action-link secondary" href="mailto:${bulletin.church.email}">메일 보내기</a>
          </div>
        </article>

        <details class="collapsible-card sub-section" id="serve" data-jump-target>
          <summary>섬기는 사람들</summary>
          <div class="grid card-pad">
            ${bulletin.servants.map((item) => `<article class="card mini">
              <h3>${item.label}</h3>
              <p>${item.names}</p>
            </article>`).join("")}
          </div>
        </details>

        <details class="collapsible-card sub-section" id="volunteer" data-jump-target>
          <summary>6월 봉사위원</summary>
          <article class="list-card">
            <h3>안내위원</h3>
            <div class="table-list">
              ${bulletin.volunteer.guide.map(([where, names]) => `<div class="table-item"><strong>${where}</strong><div>${names}</div></div>`).join("")}
            </div>
          </article>
          <article class="list-card">
            <h3>식당 봉사 교구</h3>
            <div class="table-list">
              ${bulletin.volunteer.meal.map(([week, names]) => `<div class="table-item"><strong>${week}</strong><div>${names}</div></div>`).join("")}
            </div>
          </article>
          <article class="list-card">
            <h3>주차봉사</h3>
            <p>${bulletin.volunteer.parking}</p>
          </article>
        </details>
      </section>
    </main>

    <div class="update-notice" role="status" aria-live="polite" hidden data-update-notice>
      <strong>새 주보가 업데이트되었습니다.</strong>
      <button type="button" data-update-button>새로고침</button>
    </div>

    <div class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" hidden data-settings-panel>
      <div class="settings-sheet">
        <div class="settings-head">
          <div>
            <div class="eyebrow">Settings</div>
            <h2 id="settings-title">설정</h2>
          </div>
          <button class="settings-close" type="button" aria-label="설정 닫기" data-settings-close>×</button>
        </div>
        <div class="setting-group" aria-label="글씨 크기">
          <div class="setting-label">글씨 크기</div>
          <div class="font-options">
            <button class="font-option" type="button" aria-pressed="true" data-font-size-option="default">
              <strong>기본글씨</strong>
              <span>기본 크기로 보기</span>
            </button>
            <button class="font-option" type="button" aria-pressed="false" data-font-size-option="large">
              <strong>큰글씨</strong>
              <span>글씨와 버튼을 크게 보기</span>
            </button>
          </div>
        </div>
        <div class="setting-group" aria-label="화면 모드">
          <div class="setting-label">화면 모드</div>
          <div class="theme-options">
            <button class="theme-option" type="button" aria-pressed="true" data-theme-option="system">
              <strong>기기 설정</strong>
              <span>휴대폰 설정 따름</span>
            </button>
            <button class="theme-option" type="button" aria-pressed="false" data-theme-option="light">
              <strong>라이트</strong>
              <span>밝은 화면</span>
            </button>
            <button class="theme-option" type="button" aria-pressed="false" data-theme-option="dark">
              <strong>다크</strong>
              <span>어두운 화면</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav class="bottom-nav" aria-label="하단 메뉴">
      ${[
        ["home", "홈", true],
        ["worship", "예배"],
        ["news", "소식"],
        ["sermon", "말씀"],
        ["meeting", "모임"],
        ["guide", "안내"],
      ].map(([tab, label, selected]) => renderNavButton(tab, label, selected)).join("")}
    </nav>
  </div>

  <div class="preview-lab" aria-label="디바이스 미리보기">
    <div class="preview-toolbar">
      <div class="preview-title">
        <span>모바일 미리보기</span>
        <a data-preview-exit href="./index.html#worship">주보로 돌아가기</a>
      </div>
      <div class="preview-devices" aria-label="미리보기 기기 선택">
        <button type="button" data-device="iphone" aria-selected="true">iPhone 15</button>
        <button type="button" data-device="galaxy">Galaxy S</button>
        <button type="button" data-device="foldCover">Fold 커버</button>
        <button type="button" data-device="foldOpen">Fold 펼침</button>
        <button type="button" data-device="flip">Flip</button>
        <button type="button" data-device="flipFlex">Flip Flex</button>
      </div>
    </div>
    <div class="preview-stage">
      <div class="preview-device">
        <iframe class="preview-frame" title="모바일 주보 미리보기"></iframe>
      </div>
    </div>
  </div>

  <script>
    const previewDevices = {
      iphone: { width: 393, height: 852 },
      galaxy: { width: 384, height: 854 },
      foldCover: { width: 344, height: 882 },
      foldOpen: { width: 812, height: 882 },
      flip: { width: 360, height: 880 },
      flipFlex: { width: 360, height: 440 },
    };

    const params = new URLSearchParams(location.search);
    const isPreviewMode = params.get("preview") === "1" || params.has("device");
    if (isPreviewMode) {
      document.body.classList.add("preview-mode");
      const previewButtons = [...document.querySelectorAll("[data-device]")];
      const previewDevice = document.querySelector(".preview-device");
      const previewFrame = document.querySelector(".preview-frame");
      const previewExit = document.querySelector("[data-preview-exit]");
      const frameParams = new URLSearchParams(location.search);
      frameParams.delete("preview");
      frameParams.delete("device");
      const frameQuery = frameParams.toString();
      const frameHash = location.hash || "#worship";
      const frameSrc = location.pathname + (frameQuery ? "?" + frameQuery : "") + frameHash;
      previewFrame.src = frameSrc;
      previewExit.href = frameSrc;

      function setPreviewDevice(name) {
        const device = previewDevices[name] || previewDevices.iphone;
        previewDevice.style.setProperty("--device-width", device.width + "px");
        previewDevice.style.setProperty("--device-height", device.height + "px");
        previewButtons.forEach((button) => {
          button.setAttribute("aria-selected", String(button.dataset.device === name));
        });
      }

      previewButtons.forEach((button) => {
        button.addEventListener("click", () => setPreviewDevice(button.dataset.device));
      });
      setPreviewDevice(params.get("device") || "iphone");
    }

    const routeButtons = [...document.querySelectorAll("[data-tab]")];
    const tabButtons = [...document.querySelectorAll(".bottom-nav [data-tab]")];
    const views = [...document.querySelectorAll("[data-view]")];
    const appShell = document.querySelector(".app");
    const newsFilterButtons = [...document.querySelectorAll("[data-news-filter]")];
    const newsCards = [...document.querySelectorAll("[data-news-category]")];
    const newsVisibleCount = document.querySelector("[data-news-visible-count]");
    const worshipPartButtons = [...document.querySelectorAll("[data-worship-part]")];
    const worshipRows = [...document.querySelectorAll("[data-worship-row]")];
    const searchItems = ${JSON.stringify(searchItems)};
    const calendarEvents = ${JSON.stringify(calendarEvents)};
    const fallbackScriptureVerses = ${JSON.stringify(fallbackScriptureVerses)};
    const searchInput = document.querySelector("[data-search-input]");
    const searchResults = document.querySelector("[data-search-results]");
    const shareButton = document.querySelector("[data-share-button]");
    const shortcutButtons = [...document.querySelectorAll("[data-scroll-target]")];
    const verseText = document.querySelector("[data-verse-text]");
    const verseReference = document.querySelector("[data-verse-reference]");
    const verseShareButton = document.querySelector("[data-verse-share]");
    const archiveSelect = document.querySelector("[data-archive-select]");
    const archiveNote = document.querySelector("[data-archive-note]");
    const installCard = document.querySelector("[data-install-card]");
    const installButton = document.querySelector("[data-install-button]");
    const installStatus = document.querySelector("[data-install-status]");
    const updateNotice = document.querySelector("[data-update-notice]");
    const updateButton = document.querySelector("[data-update-button]");
    const settingsOpenButton = document.querySelector("[data-settings-open]");
    const settingsPanel = document.querySelector("[data-settings-panel]");
    const settingsCloseButton = document.querySelector("[data-settings-close]");
    const fontSizeButtons = [...document.querySelectorAll("[data-font-size-option]")];
    const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const storageKey = "naesoo-mobile-state";
    const darkModeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    let deferredInstallPrompt = null;

    function readState() {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "{}");
      } catch {
        return {};
      }
    }

    function writeState(nextState) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ ...readState(), ...nextState }));
      } catch {}
    }

    function applyLargeText(enabled, options = {}) {
      document.body.classList.toggle("large-text", enabled);
      fontSizeButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.fontSizeOption === (enabled ? "large" : "default")));
      });
      if (options.save !== false) {
        writeState({ largeText: enabled });
      }
    }

    function getResolvedTheme(mode) {
      if (mode === "dark" || mode === "light") return mode;
      return darkModeQuery && darkModeQuery.matches ? "dark" : "light";
    }

    function applyThemeMode(mode = "system", options = {}) {
      const normalized = ["system", "light", "dark"].includes(mode) ? mode : "system";
      const resolved = getResolvedTheme(normalized);
      document.body.classList.toggle("theme-dark", resolved === "dark");
      document.body.dataset.themeMode = normalized;
      themeButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.themeOption === normalized));
      });
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", resolved === "dark" ? "#111815" : "#21483b");
      }
      if (options.save !== false) {
        writeState({ themeMode: normalized });
      }
    }

    function setSettingsOpen(open) {
      if (!settingsPanel) return;
      settingsPanel.hidden = !open;
      if (settingsOpenButton) settingsOpenButton.setAttribute("aria-expanded", String(open));
      if (open && settingsCloseButton) settingsCloseButton.focus();
    }

    function escapeClientHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function highlightClientText(value, query) {
      const text = String(value || "");
      const normalizedQuery = String(query || "").trim().toLowerCase();
      if (!normalizedQuery) return escapeClientHtml(text);
      const lowerText = text.toLowerCase();
      let cursor = 0;
      let output = "";
      while (cursor < text.length) {
        const foundIndex = lowerText.indexOf(normalizedQuery, cursor);
        if (foundIndex < 0) {
          output += escapeClientHtml(text.slice(cursor));
          break;
        }
        output += escapeClientHtml(text.slice(cursor, foundIndex));
        output += "<mark>" + escapeClientHtml(text.slice(foundIndex, foundIndex + normalizedQuery.length)) + "</mark>";
        cursor = foundIndex + normalizedQuery.length;
      }
      return output;
    }

    function setInstallStatus(title, body) {
      if (!installStatus) return;
      installStatus.innerHTML = "<p><strong>" + escapeClientHtml(title) + "</strong></p><p>" + escapeClientHtml(body) + "</p>";
    }

    function scrollToTarget(targetId) {
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      const detailTarget = target.tagName === "DETAILS" ? target : target.closest("details");
      if (detailTarget) {
        detailTarget.open = true;
      }
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("jump-highlight");
      window.setTimeout(() => target.classList.add("jump-highlight"), 120);
      window.setTimeout(() => target.classList.remove("jump-highlight"), 2800);
    }

    function getWorshipPartValue(row, part) {
      return {
        "1": row.dataset.worshipFirst,
        "2": row.dataset.worshipSecond,
        "3": row.dataset.worshipThird,
      }[part] || "";
    }

    function renderWorshipPart(row, part) {
      const body = row.querySelector(".worship-body");
      const number = row.querySelector(".worship-label span");
      const value = getWorshipPartValue(row, part);
      if (!body) return;
      if (!row.dataset.worshipOriginal) {
        row.dataset.worshipOriginal = body.innerHTML;
      }
      if (number && !row.dataset.worshipOriginalNumber) {
        row.dataset.worshipOriginalNumber = number.textContent;
      }
      if (!part) {
        row.hidden = false;
        body.innerHTML = row.dataset.worshipOriginal;
        if (number) number.textContent = row.dataset.worshipOriginalNumber;
        return;
      }
      const hasValue = value.trim().length > 0;
      row.hidden = !hasValue;
      if (hasValue) {
        const isLong = value.length > 28 ? " is-long" : "";
        body.innerHTML = '<div class="part' + isLong + '"><strong>' + part + '부</strong>' + escapeClientHtml(value) + '</div>';
      }
    }

    function renumberWorshipRows(part) {
      let visibleIndex = 1;
      worshipRows.forEach((row) => {
        const number = row.querySelector(".worship-label span");
        if (!number) return;
        if (!part) {
          number.textContent = row.dataset.worshipOriginalNumber || number.textContent;
          return;
        }
        if (!row.hidden) {
          number.textContent = String(visibleIndex).padStart(2, "0");
          visibleIndex += 1;
        }
      });
    }

    function activateWorshipPart(part) {
      const activePart = worshipPartButtons.some((button) => button.dataset.worshipPart === part && button.getAttribute("aria-selected") === "true") ? "" : part;
      worshipPartButtons.forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.worshipPart === activePart));
      });
      worshipRows.forEach((row) => renderWorshipPart(row, activePart));
      renumberWorshipRows(activePart);
    }

    function getSeoulDateKey(date = new Date()) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date).reduce((result, part) => {
        result[part.type] = part.value;
        return result;
      }, {});
      return parts.year + "-" + parts.month + "-" + parts.day;
    }

    function hashString(value) {
      let hash = 0;
      for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
      }
      return Math.abs(hash);
    }

    function selectDailyVerse(verses) {
      const validVerses = verses.filter((verse) => verse && verse.reference && verse.text);
      if (validVerses.length === 0) return null;
      return validVerses[hashString(getSeoulDateKey()) % validVerses.length];
    }

    function renderDailyVerse(verses) {
      if (!verseText || !verseReference) return;
      const verse = selectDailyVerse(verses);
      if (!verse) return;
      verseText.textContent = "“" + verse.text + "”";
      verseReference.textContent = verse.reference + " · 개역개정";
    }

    async function loadDailyVerse() {
      try {
        const response = await fetch("./verses.json", { cache: "no-cache" });
        if (!response.ok) throw new Error("Verse data unavailable");
        const data = await response.json();
        renderDailyVerse(Array.isArray(data.verses) ? data.verses : fallbackScriptureVerses);
      } catch {
        renderDailyVerse(fallbackScriptureVerses);
      }
    }

    function getActiveViewName() {
      const activeView = views.find((view) => view.classList.contains("is-active"));
      return activeView ? activeView.dataset.view : "home";
    }

    function getViewLabel(name) {
      return {
        home: "홈",
        worship: "예배",
        news: "교회소식",
        sermon: "말씀",
        meeting: "모임",
        guide: "안내",
      }[name] || "주보";
    }

    async function shareContent(data, feedbackButton) {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.url || data.text);
        if (feedbackButton) {
          const previousText = feedbackButton.textContent;
          feedbackButton.textContent = "복사됨";
          window.setTimeout(() => { feedbackButton.textContent = previousText; }, 1400);
        }
      }
    }

    function formatCalendarDate(value) {
      return new Date(value).toISOString().replaceAll("-", "").replaceAll(":", "").replace(".000", "");
    }

    function escapeCalendarText(value) {
      return String(value || "")
        .replaceAll("\\\\", "\\\\\\\\")
        .replaceAll(";", "\\\\;")
        .replaceAll(",", "\\\\,")
        .replaceAll("\\n", "\\\\n");
    }

    function downloadCalendarEvent(eventData) {
      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Naesoo Mobile Bulletin//KO",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "-" + eventData.sourceIndex + "@naesoo-mobile",
        "DTSTAMP:" + formatCalendarDate(new Date()),
        "DTSTART:" + formatCalendarDate(eventData.start),
        "DTEND:" + formatCalendarDate(eventData.end),
        "SUMMARY:" + escapeCalendarText(eventData.title),
        "LOCATION:" + escapeCalendarText(eventData.location),
        "DESCRIPTION:" + escapeCalendarText(eventData.description),
        "END:VEVENT",
        "END:VCALENDAR",
      ];
      const blob = new Blob([lines.join("\\r\\n")], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = (eventData.sourceTitle || eventData.title).replaceAll(/[\\\\/:*?"<>|]/g, "") + ".ics";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();
    }

    async function loadArchiveOptions() {
      if (!archiveSelect) return;
      try {
        const response = await fetch("./archive.json", { cache: "no-cache" });
        if (!response.ok) throw new Error("Archive unavailable");
        const archive = await response.json();
        if (!Array.isArray(archive.issues) || archive.issues.length === 0) return;
        archiveSelect.innerHTML = archive.issues.map((issue) =>
          '<option value="' + escapeClientHtml(issue.id) + '" data-url="' + escapeClientHtml(issue.url || "./index.html#home") + '">' +
          escapeClientHtml(issue.label + " · " + issue.date + " · " + issue.volume) +
          '</option>'
        ).join("");
        archiveSelect.value = archive.current || archive.issues[0].id;
        if (archiveNote) {
          archiveNote.textContent = archive.issues.length > 1
            ? "원하는 날짜를 선택하면 해당 주보로 이동합니다."
            : "이전 주보가 추가되면 이곳에서 날짜별로 바로 이동할 수 있습니다.";
        }
      } catch {}
    }

    function activateTab(name, options = {}) {
      if (options.scroll !== false) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      views.forEach((view) => {
        view.classList.toggle("is-active", view.dataset.view === name);
      });
      tabButtons.forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.tab === name));
      });
      if (options.history !== false && location.hash !== "#" + name) {
        history.pushState({ tab: name }, "", "#" + name);
      }
      if (options.save !== false) {
        writeState({ tab: name });
      }
      if (options.target) {
        window.setTimeout(() => scrollToTarget(options.target), 80);
      }
    }

    function getHashTab() {
      return location.hash.replace("#", "");
    }

    function syncRouteFromHash(options = {}) {
      const hashTab = getHashTab();
      if (views.some((view) => view.dataset.view === hashTab)) {
        activateTab(hashTab, { scroll: false, animate: false, save: false, history: false, ...options });
        return true;
      }
      return false;
    }

    function activateNewsFilter(name, options = {}) {
      let visibleCount = 0;
      if (appShell && options.animate !== false) {
        appShell.classList.remove("is-filtering-news");
        void appShell.offsetWidth;
        appShell.classList.add("is-filtering-news");
        window.clearTimeout(appShell._newsFilterTimer);
        appShell._newsFilterTimer = window.setTimeout(() => {
          appShell.classList.remove("is-filtering-news");
        }, 320);
      }
      newsFilterButtons.forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.newsFilter === name));
      });
      newsCards.forEach((card) => {
        const visible = name === "all" || card.dataset.newsCategory === name;
        card.classList.toggle("is-hidden", !visible);
        if (visible) visibleCount += 1;
      });
      if (newsVisibleCount) {
        newsVisibleCount.textContent = visibleCount + "건";
      }
      if (options.save !== false) {
        writeState({ newsFilter: name });
      }
    }

    function goToTarget(tab, target) {
      if (tab === "news" && target) {
        activateNewsFilter("all");
      }
      activateTab(tab, { target });
    }

    function renderSearchResults(query) {
      if (!searchResults) return;
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        searchResults.innerHTML = '<p class="search-empty">궁금한 단어를 입력하면 예배, 소식, 모임, 안내에서 찾아드립니다.</p>';
        return;
      }
      const results = searchItems
        .map((item) => ({
          ...item,
          haystack: [item.type, item.location, item.title, item.body, item.keywords].join(" ").toLowerCase(),
        }))
        .filter((item) => item.haystack.includes(normalized))
        .map((item) => {
          const titleHit = String(item.title || "").toLowerCase().includes(normalized) ? 6 : 0;
          const typeHit = String(item.type || "").toLowerCase().includes(normalized) ? 4 : 0;
          const keywordHit = String(item.keywords || "").toLowerCase().includes(normalized) ? 3 : 0;
          const bodyHit = String(item.body || "").toLowerCase().includes(normalized) ? 1 : 0;
          return { ...item, score: (item.rank || 0) + titleHit + typeHit + keywordHit + bodyHit };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      if (results.length === 0) {
        searchResults.innerHTML = '<p class="search-count">검색 결과 0건</p><p class="search-empty">검색 결과가 없습니다. 다른 단어로 찾아보세요.</p>';
        return;
      }
      searchResults.innerHTML = '<p class="search-count">검색 결과 ' + results.length + '건</p>' + results.map((item) => {
        const snippet = item.body.length > 72 ? item.body.slice(0, 72) + "..." : item.body;
        return '<button class="search-result" type="button" data-result-tab="' + item.tab + '" data-result-target="' + item.target + '">' +
          '<span>' + escapeClientHtml(item.type) + '</span>' +
          '<strong>' + highlightClientText(item.title, normalized) + '</strong>' +
          '<em class="search-location">' + escapeClientHtml(item.location || getViewLabel(item.tab)) + '</em>' +
          '<small>' + highlightClientText(snippet, normalized) + '</small>' +
        '</button>';
      }).join("");
    }

    routeButtons.forEach((button) => {
      button.addEventListener("click", () => goToTarget(button.dataset.tab, button.dataset.target));
    });

    newsFilterButtons.forEach((button) => {
      button.addEventListener("click", () => activateNewsFilter(button.dataset.newsFilter));
    });

    worshipPartButtons.forEach((button) => {
      button.addEventListener("click", () => activateWorshipPart(button.dataset.worshipPart));
    });

    shortcutButtons.forEach((button) => {
      button.addEventListener("click", () => scrollToTarget(button.dataset.scrollTarget));
    });

    document.addEventListener("click", (event) => {
      const calendarButton = event.target.closest("[data-calendar-index]");
      if (!calendarButton) return;
      const calendarEvent = calendarEvents[Number(calendarButton.dataset.calendarIndex)];
      if (calendarEvent) downloadCalendarEvent(calendarEvent);
    });

    if (archiveSelect) {
      archiveSelect.addEventListener("change", () => {
        const selectedOption = archiveSelect.selectedOptions[0];
        const url = selectedOption ? selectedOption.dataset.url : "";
        if (url) location.href = url;
      });
      loadArchiveOptions();
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      setInstallStatus("설치 가능", "이 기기에서는 버튼을 눌러 바로 홈 화면에 추가할 수 있습니다.");
      if (installButton) installButton.textContent = "홈 화면에 추가";
    });

    if (window.matchMedia("(display-mode: standalone)").matches && installCard) {
      setInstallStatus("앱으로 실행 중", "이미 홈 화면에서 앱처럼 열고 있습니다.");
      installCard.hidden = true;
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setInstallStatus("iPhone 안내", "Safari 공유 버튼에서 홈 화면에 추가를 선택하면 앱처럼 사용할 수 있습니다.");
    } else {
      setInstallStatus("홈 화면에 추가", "설치 버튼이 보이면 바로 추가할 수 있고, 보이지 않으면 브라우저 메뉴에서 추가할 수 있습니다.");
    }

    if (installButton) {
      installButton.addEventListener("click", async () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          await deferredInstallPrompt.userChoice;
          deferredInstallPrompt = null;
          installButton.textContent = "추가됨";
          return;
        }
        const previousText = installButton.textContent;
        installButton.textContent = "공유 메뉴에서 추가";
        window.setTimeout(() => { installButton.textContent = previousText; }, 1800);
      });
    }

    const initialState = readState();
    applyLargeText(Boolean(initialState.largeText), { save: false });
    applyThemeMode(initialState.themeMode || "system", { save: false });

    if (settingsOpenButton) {
      settingsOpenButton.addEventListener("click", () => setSettingsOpen(true));
    }

    if (settingsCloseButton) {
      settingsCloseButton.addEventListener("click", () => setSettingsOpen(false));
    }

    if (settingsPanel) {
      settingsPanel.addEventListener("click", (event) => {
        if (event.target === settingsPanel) setSettingsOpen(false);
      });
    }

    fontSizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyLargeText(button.dataset.fontSizeOption === "large");
        setSettingsOpen(false);
      });
    });

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyThemeMode(button.dataset.themeOption || "system");
        setSettingsOpen(false);
      });
    });

    if (darkModeQuery) {
      darkModeQuery.addEventListener("change", () => {
        const currentMode = readState().themeMode || "system";
        if (currentMode === "system") {
          applyThemeMode("system", { save: false });
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && settingsPanel && !settingsPanel.hidden) {
        setSettingsOpen(false);
      }
    });

    loadDailyVerse();

    if (verseShareButton) {
      verseShareButton.addEventListener("click", () => {
        const text = [verseText?.textContent, verseReference?.textContent].filter(Boolean).join("\\n");
        shareContent({
          title: "오늘의 말씀",
          text,
          url: location.origin + location.pathname + "#home",
        }, verseShareButton).catch(() => {});
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
      searchResults.addEventListener("click", (event) => {
        const target = event.target.closest("[data-result-tab]");
        if (target) goToTarget(target.dataset.resultTab, target.dataset.resultTarget);
      });
    }

    if (shareButton) {
      shareButton.addEventListener("click", async () => {
        const activeView = getActiveViewName();
        const viewLabel = getViewLabel(activeView);
        const shareData = {
          title: "${bulletin.church.name} 모바일 주보 · " + viewLabel,
          text: "${bulletin.issue.date} ${bulletin.church.name} 모바일 주보 " + viewLabel + " 페이지",
          url: location.origin + location.pathname + "#" + activeView,
        };
        shareContent(shareData, shareButton).catch(() => {});
      });
    }

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      const isLocalPreview = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
      if (isLocalPreview) {
        navigator.serviceWorker.getRegistrations()
          .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
          .catch(() => {});
      } else {
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          location.reload();
        });
        navigator.serviceWorker.register("./sw.js").then((registration) => {
          const showUpdate = (worker) => {
            if (!worker || !navigator.serviceWorker.controller || !updateNotice) return;
            updateNotice.hidden = false;
            if (updateButton) {
              updateButton.onclick = () => worker.postMessage({ type: "SKIP_WAITING" });
            }
          };
          if (registration.waiting) showUpdate(registration.waiting);
          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed") showUpdate(worker);
            });
          });
          registration.update().catch(() => {});
        }).catch(() => {});
      }
    }

    window.addEventListener("hashchange", () => {
      syncRouteFromHash({ animate: true });
    });

    window.addEventListener("popstate", () => {
      syncRouteFromHash({ animate: true });
    });

    window.addEventListener("load", () => {
      syncRouteFromHash();
    });

    const initial = getHashTab();
    if (views.some((view) => view.dataset.view === initial)) {
      activateTab(initial, { scroll: false, animate: false, save: false, history: false });
    } else {
      const storedTab = readState().tab;
      const fallbackTab = views.some((view) => view.dataset.view === storedTab) ? storedTab : "home";
      history.replaceState({ tab: fallbackTab }, "", "#" + fallbackTab);
      activateTab(fallbackTab, { animate: false, history: false });
    }
    activateNewsFilter(readState().newsFilter || "all", { save: false, animate: false });
  </script>
</body>
</html>`;

const manifest = {
  name: `${bulletin.church.name} 모바일 주보`,
  short_name: "내수동 주보",
  description: `${bulletin.church.name} 주일예배와 교회소식을 확인하는 모바일 주보입니다.`,
  lang: "ko-KR",
  start_url: "./index.html#home",
  scope: "./",
  display: "standalone",
  background_color: "#faf8f5",
  theme_color: "#13823f",
  icons: [
    {
      src: "./app-icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "./app-icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "./app-icon-maskable-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "./app-icon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any",
    },
  ],
};

const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#13823f"/>
  <path d="M72 352c72-82 170-115 322-106-80 12-150 46-210 103-35 34-70 54-112 63z" fill="#34b65f"/>
  <path d="M73 334c31-151 139-240 307-250-82 42-131 111-147 205-45 0-95 13-160 45z" fill="#f27522"/>
  <path d="M168 130h72v92h85v70h-85v132h-72V292H85v-70h83z" fill="#fff"/>
  <path d="M168 130h72v92h85v70h-85v132h-72V292H85v-70h83z" fill="#fff" opacity=".92"/>
</svg>`;

const cacheVersion = crypto.createHash("sha256").update(html).digest("hex").slice(0, 10);
const coreAssets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app-icon.svg",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./app-icon-maskable-512.png",
  "./verses.json",
  "./archive.json",
  "./archive.html",
  ...archiveData.issues.map((issue) => issue.json).filter(Boolean),
];
const serviceWorker = `const CACHE_NAME = "naesoo-mobile-${cacheVersion}";
const CORE_ASSETS = ${JSON.stringify(coreAssets)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const isNavigation = event.request.mode === "navigate";
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (isNavigation) return caches.match("./index.html");
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
`;

fs.writeFileSync(outPath, html);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
fs.writeFileSync(serviceWorkerPath, serviceWorker);
fs.writeFileSync(appIconSvgPath, appIconSvg);
fs.writeFileSync(versesPath, JSON.stringify({ translation: "개역개정", timezone: "Asia/Seoul", verses: scriptureVerses }, null, 2));
console.log(outPath);
