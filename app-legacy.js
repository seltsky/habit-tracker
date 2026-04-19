/* ========= Habit Tracker — Main App v2 (Identity Enhanced) ========= */
(function () {
  'use strict';

  // ====== Config ======
  const HEALTH_HABITS = [
    { id: 'supplements', name: '영양제 섭취', icon: '💊', stack: '기상 → 물 한 잔 → 영양제 → 세수', identity: 'liver' },
    { id: 'water', name: '물 1.5L 이상', icon: '💧', stack: '아침 물 한 잔이 시작', identity: 'skin' },
    { id: 'veggies', name: '채소 먼저 먹기', icon: '🥗', stack: '식사 시작 → 채소부터', identity: 'liver' },
    { id: 'sleep', name: '11시 전 취침', icon: '😴', stack: '양치 → 폰 내려놓기 → 침대', identity: 'skin' },
    { id: 'no_alcohol', name: '술 안 마신 날', icon: '🚫', stack: '술 생각 → 물 한 잔', identity: 'liver' },
    { id: 'exercise', name: '운동 30분', icon: '🏃', stack: '퇴근 → 운동복 갈아입기 → 30분', identity: 'move' },
  ];

  const ROUTINES = {
    0: [
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
    ],
    1: [
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'run', name: '달리기', icon: '🏃' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
    ],
    2: [
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
      { id: 'run', name: '달리기', icon: '🏃' },
      { id: 'golf', name: '골프 연습', icon: '⛳' },
      { id: 'wife', name: '와이프와 저녁', icon: '❤️' },
    ],
    3: [
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'gym', name: '헬스', icon: '💪' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
    ],
    4: [
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'run', name: '달리기', icon: '🏃' },
      { id: 'date', name: '와이프 데이트', icon: '🎉' },
    ],
    5: [
      { id: 'golf_or_run', name: '골프/달리기', icon: '⛳🏃' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
      { id: 'research', name: '연구 작업 (여유시)', icon: '✍️' },
    ],
    6: [
      { id: 'church', name: '교회', icon: '⛪' },
      { id: 'family', name: '가족 시간', icon: '👨‍👩‍👧' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
      { id: 'plan', name: '주간 계획', icon: '📋' },
    ],
  };

  const IDENTITIES = [
    { id: 'skin', label: '깨끗한 피부를 가진 사람', class: 'skin', habitIds: ['water', 'sleep'] },
    { id: 'liver', label: '간을 지키는 사람', class: 'liver', habitIds: ['supplements', 'veggies', 'no_alcohol'] },
    { id: 'move', label: '매일 움직이는 사람', class: 'move', routineIds: ['run', 'gym', 'golf', 'golf_or_run'] },
  ];

  // Running goal
  const MONTHLY_RUN_GOAL_KM = 100;

  // Identity-specific completion messages per habit
  const IDENTITY_FEEDBACK = {
    supplements: [
      '💊 간을 지키는 사람으로 한 표!',
      '💊 오늘도 간에게 선물을 줬습니다',
      '💊 우루사+비타민+양배추환+프로바이오틱스 — 간이 감사합니다',
      '💊 아침 영양제 완료! 간을 지키는 습관이 뿌리내리고 있어요',
    ],
    water: [
      '💧 깨끗한 피부를 가진 사람답네요!',
      '💧 물 한 잔이 피부 세포를 살립니다',
      '💧 수분 충전 완료! 피부가 기뻐하고 있어요',
      '💧 물은 가장 싼 피부 관리입니다',
    ],
    veggies: [
      '🥗 간을 지키는 사람은 채소를 먼저 먹습니다',
      '🥗 식이섬유가 간의 해독을 돕고 있어요',
      '🥗 채소 먼저 → 혈당 스파이크 방지 → 간 부담 감소',
      '🥗 좋은 선택! 간과 피부 모두에게 이로운 한 끼',
    ],
    sleep: [
      '😴 깨끗한 피부는 밤에 만들어집니다',
      '😴 수면 중 성장호르몬이 피부를 재생합니다',
      '😴 11시 전 취침 — 간 재생의 골든타임을 잡았습니다',
      '😴 충분한 수면이 내일의 피부를 결정합니다',
    ],
    no_alcohol: [
      '🚫 간을 지키는 사람으로 강력한 한 표!',
      '🚫 오늘 간이 쉴 수 있게 해줬습니다. 48시간 재생 시작!',
      '🚫 술 없는 하루 — 간세포가 회복 중입니다',
      '🚫 매일의 금주가 간경변을 예방합니다',
      '🚫 대단합니다! 이게 가장 어려운 습관인데 해냈어요',
    ],
    exercise: [
      '🏃 매일 움직이는 사람으로 한 표!',
      '🏃 30분 운동 완료! 몸과 마음이 감사합니다',
      '🏃 아이를 위해 건강한 아빠가 되는 중입니다',
      '🏃 운동은 기분을 바꾸는 가장 빠른 방법입니다',
      '🏃 체력이 올라가면 연구 효율도 올라갑니다',
    ],
  };

  // Messages when unchecking (drinking, missing sleep, etc.)
  const UNCHECK_FEEDBACK = {
    no_alcohol: [
      '괜찮아요. 한 번은 사고입니다. 내일 다시 투표하면 됩니다.',
      '오늘은 쉬어가는 날. 두 번 연속만 아니면 괜찮습니다.',
    ],
    sleep: [
      '오늘은 늦었지만, 내일은 11시 전에 도전해봐요.',
    ],
  };

  // Streak milestone messages
  const STREAK_MESSAGES = {
    1: '첫 날을 시작했습니다! 모든 여정은 첫 걸음부터 🌱',
    3: '3일 연속! 뇌가 패턴을 인식하기 시작합니다 🧠',
    7: '🌱 1주 완주! 당신은 "시작하는 사람"에서 "지속하는 사람"으로 변하고 있습니다',
    14: '🌿 2주! 주변 사람들이 변화를 눈치채기 시작할 때입니다',
    21: '21일 — 옛날 사람들이 습관이 된다고 했지만, 실제로는 66일. 아직 갈 길이 있지만 잘하고 있어요!',
    30: '🌳 한 달! 이제 새 습관을 1개 추가할 수 있는 자격이 생겼습니다',
    50: '50일! 절반 넘었습니다. 이제 안 하면 오히려 불편하지 않나요?',
    66: '⭐ 66일! 연구 기준 습관 형성 중간값을 돌파했습니다. 이제 자동화 단계로 진입 중!',
    100: '🏆 100일 달성! 당신은 이미 변했습니다. 처음의 나와 지금의 나는 다른 사람입니다',
    200: '200일! 이 정도면 이건 습관이 아니라 정체성입니다 👑',
    365: '👑 1년! 인생이 바뀌었습니다. 당신은 증명했습니다',
  };

  // "Never miss twice" messages
  const MISS_MESSAGES = {
    1: [
      '어제 하루 쉬었군요. 괜찮습니다 — 한 번 빠지는 건 사고예요.',
      '실수는 누구나 합니다. 중요한 건 오늘 다시 나타나는 것입니다.',
      '어제의 미스가 당신의 정체성을 바꾸지 않습니다. 오늘 다시 투표하세요.',
    ],
    2: [
      '⚠️ 이틀 연속 빠졌습니다. "두 번 빠지면 새 습관의 시작"입니다.',
      '⚠️ 지금이 중요한 순간입니다. 오늘 돌아오면 모든 게 괜찮습니다.',
      '⚠️ 2일 빠졌지만, 그 전에 쌓은 것은 사라지지 않습니다. 습관 강도가 아직 남아있어요.',
    ],
    3: [
      '🚨 3일 연속입니다. 혹시 무리한 목표는 아닌지 점검해볼까요?',
      '🚨 괜찮으세요? 항목을 줄이는 것도 방법입니다. 작게라도 다시 시작해보세요.',
    ],
  };

  // Phase messages (2-minute rule progression)
  const PHASE_LABELS = {
    1: { name: '나타나기', desc: '2분 버전만 해도 성공!' },
    2: { name: '확장하기', desc: '조금 더 해보세요' },
    3: { name: '목표의 절반', desc: '절반까지 왔습니다!' },
    4: { name: '최종 목표', desc: '완전체! 습관의 달인' },
  };

  // Weekly reflection questions
  const REFLECTION_QUESTIONS = [
    '이번 주 가장 뿌듯했던 순간은?',
    '가장 어려웠던 습관은 무엇이었나요?',
    '다음 주 한 가지만 더 잘한다면?',
    '이번 주 당신의 정체성 중 가장 강해진 것은?',
    '환경에서 바꿀 수 있는 것이 있나요?',
  ];

  const MILESTONES = [
    { days: 3, label: '3일 시작', emoji: '🌱' },
    { days: 7, label: '1주 완주', emoji: '🌿' },
    { days: 14, label: '2주 챌린지', emoji: '☘️' },
    { days: 21, label: '3주 (옛 기준)', emoji: '🍀' },
    { days: 30, label: '한 달!', emoji: '🌳' },
    { days: 50, label: '50일', emoji: '🔥' },
    { days: 66, label: '습관 형성 중간값', emoji: '⭐' },
    { days: 100, label: '100일 달성', emoji: '🏆' },
    { days: 200, label: '200일', emoji: '💎' },
    { days: 365, label: '1년!', emoji: '👑' },
  ];

  // ====== Baby / Pregnancy ======
  const DUE_DATE = '2026-12-08';
  const LMP_DATE = '2026-03-03'; // estimated from due date (40 weeks back)

  const BABY_WEEKS = {
    4:  { emoji: '🌰', size: '양귀비 씨', length: '1mm', weight: '-', dev: '심장이 뛰기 시작합니다' },
    5:  { emoji: '🫘', size: '참깨', length: '2mm', weight: '-', dev: '뇌와 척수가 형성되기 시작합니다' },
    6:  { emoji: '🫐', size: '렌즈콩', length: '4mm', weight: '-', dev: '코, 입, 귀가 형태를 잡기 시작합니다' },
    7:  { emoji: '🫐', size: '블루베리', length: '1cm', weight: '-', dev: '손과 발이 생기기 시작합니다' },
    8:  { emoji: '🍇', size: '라즈베리', length: '1.6cm', weight: '1g', dev: '손가락과 발가락이 구분됩니다' },
    9:  { emoji: '🍒', size: '체리', length: '2.3cm', weight: '2g', dev: '근육이 생기고 움직이기 시작합니다' },
    10: { emoji: '🍓', size: '딸기', length: '3.1cm', weight: '4g', dev: '모든 주요 장기가 형성되었습니다' },
    11: { emoji: '🍋', size: '무화과', length: '4.1cm', weight: '7g', dev: '손톱이 자라기 시작합니다' },
    12: { emoji: '🍑', size: '라임', length: '5.4cm', weight: '14g', dev: '반사 작용이 시작됩니다. 안정기 진입!' },
    13: { emoji: '🍋', size: '레몬', length: '7.4cm', weight: '23g', dev: '지문이 형성되기 시작합니다' },
    14: { emoji: '🍊', size: '복숭아', length: '8.7cm', weight: '43g', dev: '표정을 지을 수 있게 됩니다' },
    15: { emoji: '🍎', size: '사과', length: '10.1cm', weight: '70g', dev: '맛을 느끼기 시작합니다' },
    16: { emoji: '🥑', size: '아보카도', length: '11.6cm', weight: '100g', dev: '태동을 느낄 수 있습니다!' },
    17: { emoji: '🍐', size: '배', length: '13cm', weight: '140g', dev: '지방이 축적되기 시작합니다' },
    18: { emoji: '🫑', size: '피망', length: '14.2cm', weight: '190g', dev: '청각이 발달하여 소리를 듣습니다' },
    19: { emoji: '🥭', size: '망고', length: '15.3cm', weight: '240g', dev: '태지가 피부를 보호합니다' },
    20: { emoji: '🍌', size: '바나나', length: '16.4cm', weight: '300g', dev: '절반 왔습니다! 성별 확인 가능' },
    21: { emoji: '🥕', size: '당근', length: '26.7cm', weight: '360g', dev: '눈썹과 속눈썹이 자랍니다' },
    22: { emoji: '🌽', size: '옥수수', length: '27.8cm', weight: '430g', dev: '눈을 뜨기 시작합니다' },
    23: { emoji: '🥝', size: '참외', length: '28.9cm', weight: '500g', dev: '빠르게 체중이 늘고 있습니다' },
    24: { emoji: '🌶️', size: '큰 옥수수', length: '30cm', weight: '600g', dev: '폐가 발달 중, 생존 가능성 시작' },
    25: { emoji: '🥬', size: '콜라비', length: '34.6cm', weight: '660g', dev: '뇌가 빠르게 발달합니다' },
    26: { emoji: '🥒', size: '큰 파', length: '35.6cm', weight: '760g', dev: '눈을 뜨고 감을 수 있습니다' },
    27: { emoji: '🥦', size: '콜리플라워', length: '36.6cm', weight: '875g', dev: '수면/각성 패턴이 생깁니다' },
    28: { emoji: '🍆', size: '가지', length: '37.6cm', weight: '1kg', dev: '꿈을 꾸기 시작합니다' },
    29: { emoji: '🎃', size: '애호박', length: '38.6cm', weight: '1.15kg', dev: '뼈가 단단해집니다' },
    30: { emoji: '🥥', size: '큰 양배추', length: '39.9cm', weight: '1.3kg', dev: '적혈구를 스스로 만듭니다' },
    31: { emoji: '🥥', size: '코코넛', length: '41.1cm', weight: '1.5kg', dev: '체온 조절 능력이 발달합니다' },
    32: { emoji: '🍈', size: '참외', length: '42.4cm', weight: '1.7kg', dev: '발톱이 자랍니다' },
    33: { emoji: '🍍', size: '파인애플', length: '43.7cm', weight: '1.9kg', dev: '면역 시스템이 발달합니다' },
    34: { emoji: '🍈', size: '멜론', length: '45cm', weight: '2.1kg', dev: '폐 발달이 거의 완성됩니다' },
    35: { emoji: '🍈', size: '허니듀 멜론', length: '46.2cm', weight: '2.4kg', dev: '대부분의 장기 발달이 완료됩니다' },
    36: { emoji: '🥬', size: '로메인 상추', length: '47.4cm', weight: '2.6kg', dev: '머리가 아래로 내려갑니다' },
    37: { emoji: '🥬', size: '근대', length: '48.6cm', weight: '2.9kg', dev: '만삭! 언제든 나올 수 있습니다' },
    38: { emoji: '🍉', size: '리크(대파)', length: '49.8cm', weight: '3.1kg', dev: '장기 기능이 모두 준비되었습니다' },
    39: { emoji: '🍉', size: '작은 수박', length: '50.7cm', weight: '3.3kg', dev: '폐에서 계면활성제를 만듭니다' },
    40: { emoji: '🍉', size: '수박', length: '51.2cm', weight: '3.5kg', dev: '만나러 갈 준비 완료! 🎉' },
  };

  const BABY_DAD_TIPS = {
    5:  '초음파에서 아기집이 보이기 시작해요. 와이프가 입덧이 시작될 수 있어요.',
    6:  '입덧이 심할 수 있어요. 레몬물, 생강차가 도움됩니다. 냄새에 민감해질 거예요.',
    7:  '피로감이 심한 시기예요. 집안일을 더 도와주세요.',
    8:  '첫 심장소리를 들을 수 있어요! 병원 같이 가세요.',
    10: '유산 위험이 줄어드는 시기. 주변에 알려도 괜찮아요.',
    12: '안정기 진입! 입덧이 줄어들기 시작합니다. 태교여행 계획 세워보세요.',
    16: '태동을 처음 느낄 수 있어요. 와이프가 "뭔가 움직인다"고 하면 같이 기뻐해주세요!',
    20: '정밀 초음파 시기. 성별도 알 수 있어요! 반환점 통과!',
    24: '배가 눈에 띄게 커집니다. 임산부석 양보 받을 때가 되었어요.',
    28: '아이 이름 정하셨나요? 출산 준비물 목록 확인할 시기예요.',
    32: '출산 준비 교실 등록하세요. 호흡법을 배워두면 도움됩니다.',
    36: '출산 가방 싸두세요. 카시트도 미리 설치하세요.',
    37: '만삭! 항상 연락 가능하게 해두세요. 병원까지 동선 확인!',
    40: '곧 만나요! 진통 시작하면 침착하게. 파이팅! 🎉',
  };

  const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
  const STORAGE_KEY = 'habit_tracker_data';
  const META_KEY = 'habit_tracker_meta';

  // ====== State ======
  let currentDate = todayStr();
  let data = loadData();
  let meta = loadMeta();

  // ====== Helpers ======
  function todayStr() { return formatDate(new Date()); }
  function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function parseDate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); }
  function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate()+n); return formatDate(d); }
  function getWeekday(s) { return parseDate(s).getDay(); }
  function getWeekdayIdx(s) { const d = getWeekday(s); return d===0?6:d-1; }
  function formatDisplayDate(s) {
    const d = parseDate(s);
    return `${d.getMonth()+1}/${d.getDate()} (${DAYS_KO[d.getDay()]})${s===todayStr()?' 오늘':''}`;
  }

  // ====== Data ======
  function loadData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); } catch { return {}; } }
  function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function loadMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)||'{}'); } catch { return {}; } }
  function saveMeta() { localStorage.setItem(META_KEY, JSON.stringify(meta)); }
  function getDayData(ds) { if (!data[ds]) data[ds]={health:{},routine:{},mood:null,reflection:null}; return data[ds]; }

  function toggleHabit(ds, type, id) {
    const day = getDayData(ds);
    day[type][id] = !day[type][id];
    saveData();
    return day[type][id];
  }

  // ====== Calculations ======
  function getHealthDoneCount(ds) {
    const d = data[ds]; if (!d||!d.health) return 0;
    return HEALTH_HABITS.filter(h=>d.health[h.id]).length;
  }
  function getRoutineDoneCount(ds) {
    const d = data[ds]; if (!d||!d.routine) return 0;
    const r = ROUTINES[getWeekdayIdx(ds)]||[];
    return r.filter(x=>d.routine[x.id]).length;
  }
  function getTotalDoneCount(ds) { return getHealthDoneCount(ds)+getRoutineDoneCount(ds); }
  function getTotalCount(ds) { return HEALTH_HABITS.length+(ROUTINES[getWeekdayIdx(ds)]||[]).length; }

  function calcStreak() {
    let streak=0, d=todayStr();
    if (getHealthDoneCount(d) < HEALTH_HABITS.length) d = addDays(d,-1);
    while(true) {
      if (getHealthDoneCount(d)>=Math.ceil(HEALTH_HABITS.length*0.6)) { streak++; d=addDays(d,-1); }
      else break;
    }
    return streak;
  }

  function calcStrength() {
    let str=0; const t=todayStr(), lb=30;
    for (let i=0;i<lb;i++) {
      const d=addDays(t,-i), done=getHealthDoneCount(d), total=HEALTH_HABITS.length;
      const pct=total>0?done/total:0, w=1-(i/lb)*0.7;
      str+=pct*w;
    }
    const max=Array.from({length:lb},(_,i)=>1-(i/lb)*0.7).reduce((a,b)=>a+b,0);
    return Math.round((str/max)*100);
  }

  function calcConsecutiveMisses() {
    let misses=0, d=addDays(todayStr(),-1);
    while(misses<7) {
      if (getHealthDoneCount(d)===0 && data[d]) { misses++; d=addDays(d,-1); }
      else break;
    }
    return misses;
  }

  function getIdentityScore(identity, days=7) {
    let votes=0, total=0; const t=todayStr();
    for (let i=0;i<days;i++) {
      const d=addDays(t,-i), dd=data[d];
      if (identity.habitIds) {
        identity.habitIds.forEach(hid => {
          total++; if (dd&&dd.health&&dd.health[hid]) votes++;
        });
      }
      if (identity.routineIds) {
        const r=ROUTINES[getWeekdayIdx(d)]||[];
        identity.routineIds.forEach(rid => {
          if (r.find(x=>x.id===rid)) { total++; if (dd&&dd.routine&&dd.routine[rid]) votes++; }
        });
      }
    }
    return { votes, total, pct: total>0?Math.round(votes/total*100):0 };
  }

  // ====== Render: Tabs ======
  function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc=>tc.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        if (tab.dataset.tab==='dashboard') renderDashboard();
      });
    });
  }

  // ====== Render: Health Tab ======
  function renderHealth() {
    const container = document.getElementById('healthHabits');
    const dayData = getDayData(currentDate);
    const isToday = currentDate===todayStr();
    const isFuture = currentDate>todayStr();

    // Show miss warning if applicable and today
    let missWarning = '';
    if (isToday) {
      const misses = calcConsecutiveMisses();
      if (misses > 0 && misses <= 3) {
        const msgs = MISS_MESSAGES[Math.min(misses,3)];
        missWarning = `<div class="miss-warning fade-in">${msgs[Math.floor(Math.random()*msgs.length)]}</div>`;
      }
    }

    container.innerHTML = missWarning + HEALTH_HABITS.map(h => {
      const done = dayData.health[h.id];
      return `
        <div class="habit-item ${done?'done':''} fade-in" data-id="${h.id}" data-type="health" ${isFuture?'style="opacity:0.4;pointer-events:none"':''}>
          <div class="habit-check">${done?'✓':''}</div>
          <div class="habit-info">
            <div class="habit-name">${h.name}</div>
            <div class="habit-stack">${h.stack}</div>
          </div>
          <div class="habit-icon">${h.icon}</div>
        </div>
      `;
    }).join('');

    renderHealthStats();
    document.getElementById('currentDate').textContent = formatDisplayDate(currentDate);

    // Click handlers
    container.querySelectorAll('.habit-item').forEach(el => {
      el.addEventListener('click', () => {
        if (isFuture) return;
        const id = el.dataset.id;
        const nowDone = toggleHabit(currentDate, 'health', id);
        el.classList.toggle('done', nowDone);
        const check = el.querySelector('.habit-check');
        check.textContent = nowDone ? '✓' : '';
        check.classList.add('pop');
        setTimeout(()=>check.classList.remove('pop'), 300);
        renderHealthStats();
        updateHeader();

        // Identity feedback
        if (nowDone) {
          const msgs = IDENTITY_FEEDBACK[id];
          if (msgs) showToast(msgs[Math.floor(Math.random()*msgs.length)]);
          // Check if all done
          if (getHealthDoneCount(currentDate) === HEALTH_HABITS.length) {
            setTimeout(()=>showToast('🎉 오늘 건강습관 올클리어! 모든 정체성에 투표 완료!'), 2500);
          }
        } else {
          const msgs = UNCHECK_FEEDBACK[id];
          if (msgs) showToast(msgs[Math.floor(Math.random()*msgs.length)]);
        }
      });
    });
  }

  function renderHealthStats() {
    const done = getHealthDoneCount(currentDate);
    const total = HEALTH_HABITS.length;
    const pct = total>0?Math.round(done/total*100):0;
    document.getElementById('healthStats').innerHTML = `
      <div class="stats-text"><strong>${done}/${total}</strong> 완료 (${pct}%)</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    `;
  }

  // ====== Render: Routine Tab ======
  function renderRoutine() {
    const today = todayStr();
    const wdi = getWeekdayIdx(today);
    const routines = ROUTINES[wdi]||[];
    const dayData = getDayData(today);
    const container = document.getElementById('routineHabits');

    document.getElementById('routineDay').textContent = formatDisplayDate(today);

    container.innerHTML = routines.map(r => {
      const done = dayData.routine[r.id];
      return `
        <div class="habit-item ${done?'done':''} fade-in" data-id="${r.id}" data-type="routine">
          <div class="habit-check">${done?'✓':''}</div>
          <div class="habit-info"><div class="habit-name">${r.name}</div></div>
          <div class="habit-icon">${r.icon}</div>
        </div>
      `;
    }).join('');

    const done = getRoutineDoneCount(today), total = routines.length;
    const pct = total>0?Math.round(done/total*100):0;
    document.getElementById('routineStats').innerHTML = `
      <div class="stats-text"><strong>${done}/${total}</strong> 완료 (${pct}%)</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    `;

    container.querySelectorAll('.habit-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const nowDone = toggleHabit(today, 'routine', id);
        el.classList.toggle('done', nowDone);
        const check = el.querySelector('.habit-check');
        check.textContent = nowDone ? '✓' : '';
        check.classList.add('pop');
        setTimeout(()=>check.classList.remove('pop'), 300);
        // Update stats
        const doneN = getRoutineDoneCount(today), totalN = routines.length;
        const pctN = totalN>0?Math.round(doneN/totalN*100):0;
        document.getElementById('routineStats').innerHTML = `
          <div class="stats-text"><strong>${doneN}/${totalN}</strong> 완료 (${pctN}%)</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pctN}%"></div></div>
        `;
        updateHeader();
        if (nowDone) {
          // Movement identity
          if (['run','gym','golf','golf_or_run'].includes(id)) {
            showToast('💪 매일 움직이는 사람으로 한 표!');
          } else {
            showToast(getRoutineMsg(id));
          }
          if (getRoutineDoneCount(today)===routines.length) {
            setTimeout(()=>showToast('🎉 오늘 루틴 올클리어! 완벽한 하루!'), 2500);
          }
        }
      });
    });
  }

  function getRoutineMsg(id) {
    const msgs = {
      english: ['🇺🇸 영어 완료! 글로벌 연구자로 한 걸음', '🇺🇸 스픽 끝! 꾸준함이 유창함을 만듭니다'],
      research: ['✍️ 연구 한 걸음! 논문은 매일의 작은 작업에서 완성됩니다', '✍️ 오늘의 연구가 내일의 논문이 됩니다'],
      wife: ['❤️ 소중한 시간! 관계도 매일의 투자입니다', '❤️ 함께하는 시간은 최고의 투자입니다'],
      date: ['🎉 데이트 완료! 행복한 금요일!'],
      church: ['⛪ 감사한 하루의 시작'],
      family: ['👨‍👩‍👧 가족과 함께하는 소중한 시간'],
      plan: ['📋 계획 세우기 완료! 준비된 한 주가 될 거예요'],
    };
    const m = msgs[id] || ['잘했어요! 👍'];
    return m[Math.floor(Math.random()*m.length)];
  }

  // ====== Render: Dashboard ======
  function renderDashboard() {
    renderStrength();
    renderRunGoal();
    renderStreakInfo();
    renderHeatmap();
    renderWeeklyChart();
    renderMilestones();
    renderIdentityVotes();
    renderMoodTracker();
    renderWeeklyReflection();
    renderPhaseProgress();
  }

  function renderStrength() {
    const s = calcStrength();
    document.getElementById('strengthFill').style.width = `${s}%`;
    document.getElementById('strengthText').textContent = `${s}%`;
    let label = '';
    if (s<20) label='시작 단계 — 의식적 노력이 필요합니다';
    else if (s<40) label='형성 중 — 조금씩 자동화되고 있습니다';
    else if (s<60) label='발전 중 — 좋은 흐름입니다!';
    else if (s<80) label='안정 단계 — 거의 습관이 되었습니다';
    else label='🌟 자동화 — 이건 이제 당신의 일부입니다!';
    document.getElementById('strengthLabel').textContent = label;
  }

  function renderStreakInfo() {
    const streak = calcStreak();
    const el = document.getElementById('streakInfo');
    if (!el) return;
    let msg = '';
    // Find highest achieved milestone message
    const keys = Object.keys(STREAK_MESSAGES).map(Number).sort((a,b)=>b-a);
    for (const k of keys) { if (streak >= k) { msg = STREAK_MESSAGES[k]; break; } }
    el.innerHTML = msg ? `<p class="streak-msg">${msg}</p>` : '';
  }

  function renderHeatmap() {
    const container = document.getElementById('heatmap');
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate()-83);
    startDate.setDate(startDate.getDate()-startDate.getDay());
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate()+(6-endDate.getDay()));

    let d=new Date(startDate); const cells=[];
    while(d<=endDate) {
      const ds=formatDate(d), isFuture=ds>todayStr();
      const done=getTotalDoneCount(ds), total=getTotalCount(ds);
      const pct=total>0?done/total:0;
      let lvl='';
      if (isFuture) lvl='future';
      else if (pct===0&&!data[ds]) lvl='';
      else if (pct<=0.25) lvl='l1';
      else if (pct<=0.5) lvl='l2';
      else if (pct<=0.8) lvl='l3';
      else lvl='l4';
      cells.push(`<div class="heatmap-cell ${lvl}" title="${ds}: ${Math.round(pct*100)}%"></div>`);
      d.setDate(d.getDate()+1);
    }
    container.innerHTML = cells.join('');
  }

  function renderWeeklyChart() {
    const container = document.getElementById('weeklyChart');
    const today = todayStr();
    const weeks = [];
    for (let w=6;w>=0;w--) {
      let totalDone=0, totalAll=0;
      for (let i=0;i<7;i++) {
        const d=addDays(today,-(w*7+(6-i)));
        if (d>today) continue;
        totalDone+=getHealthDoneCount(d);
        totalAll+=HEALTH_HABITS.length;
      }
      const pct=totalAll>0?Math.round(totalDone/totalAll*100):0;
      weeks.push({pct, isCurrent:w===0, label:w===0?'이번주':`${w}주전`});
    }
    container.innerHTML = weeks.map(w=>`
      <div class="week-bar-container">
        <div class="week-bar-pct">${w.pct}%</div>
        <div class="week-bar ${w.isCurrent?'current':''}" style="height:${Math.max(4,w.pct)}px"></div>
        <div class="week-bar-label">${w.label}</div>
      </div>
    `).join('');
  }

  function renderMilestones() {
    const streak = calcStreak();
    document.getElementById('milestones').innerHTML = MILESTONES.map(m=>{
      const achieved = streak>=m.days;
      return `<div class="milestone ${achieved?'achieved':'pending'}">${m.emoji} ${m.label} (${m.days}일)${achieved?' ✓':''}</div>`;
    }).join('');
  }

  function renderIdentityVotes() {
    const container = document.getElementById('identityVotes');
    container.innerHTML = IDENTITIES.map(identity => {
      const s7 = getIdentityScore(identity, 7);
      const s30 = getIdentityScore(identity, 30);
      const trend = s7.pct > s30.pct ? '📈' : s7.pct < s30.pct ? '📉' : '➡️';
      let level = '';
      if (s7.pct >= 90) level = '🏆 마스터';
      else if (s7.pct >= 70) level = '⭐ 안정';
      else if (s7.pct >= 50) level = '🌿 성장 중';
      else if (s7.pct >= 30) level = '🌱 시작';
      else level = '💤 아직';

      return `
        <div class="identity-item">
          <div class="identity-label">"나는 ${identity.label}이다" ${level}</div>
          <div class="identity-bar-bg">
            <div class="identity-bar-fill ${identity.class}" style="width:${s7.pct}%"></div>
          </div>
          <div class="identity-pct">이번 주 ${s7.votes}/${s7.total} (${s7.pct}%) ${trend} 월간 ${s30.pct}%</div>
        </div>
      `;
    }).join('');
  }

  // ====== Mood Tracker ======
  function renderMoodTracker() {
    const el = document.getElementById('moodTracker');
    if (!el) return;
    const dayData = getDayData(todayStr());
    const moods = ['😫','😟','😐','🙂','😄'];
    const selected = dayData.mood;

    el.innerHTML = `
      <div class="mood-row">
        ${moods.map((m,i)=>`<span class="mood-btn ${selected===i?'selected':''}" data-mood="${i}">${m}</span>`).join('')}
      </div>
      <div class="mood-label">${selected!==null&&selected!==undefined ? '오늘 기분: '+moods[selected] : '오늘 기분은 어떠세요?'}</div>
    `;

    el.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = parseInt(btn.dataset.mood);
        dayData.mood = mood;
        saveData();
        renderMoodTracker();
        showToast(`기분 기록 완료 ${moods[mood]}`);
      });
    });
  }

  // ====== Weekly Reflection ======
  function renderWeeklyReflection() {
    const el = document.getElementById('weeklyReflection');
    if (!el) return;
    const today = new Date();
    if (today.getDay() !== 0) { // Sunday only
      el.innerHTML = '<div class="reflection-note">일요일에 주간 회고가 열립니다</div>';
      return;
    }
    const dayData = getDayData(todayStr());
    const q = REFLECTION_QUESTIONS[Math.floor(Date.now()/604800000) % REFLECTION_QUESTIONS.length];

    el.innerHTML = `
      <div class="reflection-q">${q}</div>
      <textarea class="reflection-input" placeholder="한 줄이라도 적어보세요...">${dayData.reflection||''}</textarea>
      <button class="reflection-save">저장</button>
    `;

    el.querySelector('.reflection-save').addEventListener('click', () => {
      dayData.reflection = el.querySelector('.reflection-input').value;
      saveData();
      showToast('회고 저장 완료 📝');
    });
  }

  // ====== Monthly Running Goal ======
  function renderRunGoal() {
    const el = document.getElementById('runGoal');
    if (!el) return;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = today.getDate();
    const monthStr = `${year}-${String(month+1).padStart(2,'0')}`;

    // Get running data for this month
    if (!meta.running) meta.running = {};
    let totalKm = 0;
    const runs = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${monthStr}-${String(d).padStart(2,'0')}`;
      if (meta.running[ds]) {
        totalKm += meta.running[ds];
        runs.push({ date: ds, km: meta.running[ds] });
      }
    }

    const pct = Math.min(100, Math.round(totalKm / MONTHLY_RUN_GOAL_KM * 100));
    const remaining = Math.max(0, MONTHLY_RUN_GOAL_KM - totalKm);
    const daysLeft = daysInMonth - currentDay;
    const paceNeeded = daysLeft > 0 ? (remaining / (daysLeft / 3)).toFixed(1) : 0; // assuming 3 runs/week

    let status = '';
    if (pct >= 100) status = '🎉 목표 달성!';
    else if (pct >= 70) status = '💪 좋은 페이스!';
    else if (pct >= 40) status = '🏃 계속 가세요!';
    else status = '🌱 시작이 반입니다';

    el.innerHTML = `
      <div class="run-summary">
        <div class="run-big-number">${totalKm.toFixed(1)}<span class="run-unit">km</span></div>
        <div class="run-goal-text">/ ${MONTHLY_RUN_GOAL_KM}km ${status}</div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,#ff6b6b,#ffd93d,#4ecca3)"></div></div>
      <div class="run-details">
        <span>남은 거리: ${remaining.toFixed(1)}km</span>
        <span>남은 일수: ${daysLeft}일</span>
      </div>
      ${remaining > 0 && daysLeft > 0 ? `<div class="run-pace">주 3회 기준 회당 ${paceNeeded}km 필요</div>` : ''}
      <div class="run-input-row">
        <input type="number" id="runKmInput" class="run-input" placeholder="오늘 달린 거리 (km)" step="0.1" min="0">
        <button id="runKmBtn" class="run-btn">기록</button>
      </div>
      ${runs.length > 0 ? `<div class="run-log">${runs.slice(-7).map(r => `<span class="run-log-item">${r.date.slice(5)} ${r.km}km</span>`).join('')}</div>` : ''}
    `;

    document.getElementById('runKmBtn').addEventListener('click', () => {
      const input = document.getElementById('runKmInput');
      const km = parseFloat(input.value);
      if (!km || km <= 0) return;
      const todayKey = todayStr();
      if (!meta.running) meta.running = {};
      meta.running[todayKey] = (meta.running[todayKey] || 0) + km;
      saveMeta();
      input.value = '';
      renderRunGoal();
      showToast(`🏃 ${km}km 기록! 이번 달 ${(totalKm + km).toFixed(1)}/${MONTHLY_RUN_GOAL_KM}km`);
    });
  }

  // ====== Phase Progress (2-minute rule) ======
  function renderPhaseProgress() {
    const el = document.getElementById('phaseProgress');
    if (!el) return;
    if (!meta.phases) meta.phases = {};
    const streak = calcStreak();

    // Auto-advance phases based on streak
    HEALTH_HABITS.forEach(h => {
      if (!meta.phases[h.id]) meta.phases[h.id] = 1;
      if (streak >= 14 && meta.phases[h.id] < 2) meta.phases[h.id] = 2;
      if (streak >= 30 && meta.phases[h.id] < 3) meta.phases[h.id] = 3;
      if (streak >= 66 && meta.phases[h.id] < 4) meta.phases[h.id] = 4;
    });
    saveMeta();

    el.innerHTML = HEALTH_HABITS.map(h => {
      const phase = meta.phases[h.id] || 1;
      const p = PHASE_LABELS[phase];
      return `
        <div class="phase-item">
          <span class="phase-habit">${h.icon} ${h.name}</span>
          <span class="phase-badge phase-${phase}">Phase ${phase}: ${p.name}</span>
        </div>
      `;
    }).join('');
  }

  // ====== Header ======
  function updateHeader() {
    const streak = calcStreak();
    const badge = document.getElementById('streakBadge');
    badge.textContent = streak;

    // Check for new milestone
    if (STREAK_MESSAGES[streak] && meta.lastMilestone !== streak) {
      meta.lastMilestone = streak;
      saveMeta();
      setTimeout(() => showToast(STREAK_MESSAGES[streak]), 1000);
    }

    // Rotate identity messages with context
    const strength = calcStrength();
    let msg = '';
    if (strength >= 80) {
      msg = '🌟 당신의 습관은 이제 정체성입니다';
    } else if (strength >= 60) {
      const best = IDENTITIES.reduce((a,b) => getIdentityScore(a).pct > getIdentityScore(b).pct ? a : b);
      msg = `가장 강한 정체성: "${best.label}" (${getIdentityScore(best).pct}%)`;
    } else {
      const msgs = [
        '매일의 체크가 새로운 나를 만듭니다',
        '당신이 하는 모든 행동은 되고 싶은 사람에게 투표하는 것입니다',
        '두 번 연속 빠지지 않는 것이 핵심입니다',
        '완벽하지 않아도 괜찮습니다. 나타나는 것이 중요합니다',
        '2분만 시작하세요. 시작이 반입니다',
        `현재 습관 강도: ${strength}% — ${strength<40?'조금씩 쌓이고 있어요':'좋은 흐름입니다!'}`,
      ];
      msg = msgs[Math.floor(Math.random()*msgs.length)];
    }
    document.getElementById('identityMsg').textContent = msg;
  }

  // ====== Toast ======
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) { toast=document.createElement('div'); toast.className='toast'; document.body.appendChild(toast); }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(()=>toast.classList.remove('show'), 3000);
  }

  // ====== Date Navigation ======
  function initDateNav() {
    document.getElementById('prevDay').addEventListener('click', () => {
      currentDate = addDays(currentDate,-1);
      renderHealth();
    });
    document.getElementById('nextDay').addEventListener('click', () => {
      if (currentDate < todayStr()) { currentDate = addDays(currentDate,1); renderHealth(); }
    });
  }

  // ====== Baby Banner ======
  function calcPregnancyWeek() {
    const lmp = parseDate(LMP_DATE);
    const today = new Date();
    const diffMs = today - lmp;
    const totalDays = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    return { weeks, days, totalDays };
  }

  function calcDaysUntilDue() {
    const due = parseDate(DUE_DATE);
    const today = new Date();
    return Math.ceil((due - today) / 86400000);
  }

  function renderBabyBanner() {
    const el = document.getElementById('babyBanner');
    const { weeks, days } = calcPregnancyWeek();
    const daysLeft = calcDaysUntilDue();
    const progressPct = Math.min(100, Math.round((weeks / 40) * 100));

    const weekData = BABY_WEEKS[weeks] || BABY_WEEKS[Math.min(weeks, 40)] || BABY_WEEKS[40];
    const clampedWeek = Math.max(4, Math.min(weeks, 40));

    // Find dad tip (closest week <= current)
    let dadTip = '';
    const tipKeys = Object.keys(BABY_DAD_TIPS).map(Number).sort((a, b) => b - a);
    for (const k of tipKeys) {
      if (clampedWeek >= k) { dadTip = BABY_DAD_TIPS[k]; break; }
    }

    const svg = typeof getBabySvg === 'function' ? getBabySvg(clampedWeek) : `<span style="font-size:48px">${weekData.emoji}</span>`;

    if (weeks < 4) {
      el.innerHTML = `
        <div class="baby-top">
          <div class="baby-illust">${svg}</div>
          <div class="baby-info">
            <div class="baby-week">임신 ${weeks}주 ${days}일</div>
            <div class="baby-size">아직 아주 작은 생명이에요</div>
            <div class="baby-dday">D-${daysLeft} | 출산예정일 12월 8일</div>
          </div>
        </div>
        <div class="baby-progress-bar"><div class="baby-progress-fill" style="width:${progressPct}%"></div></div>
        <div class="baby-progress-label"><span>임신</span><span>${progressPct}%</span><span>출산</span></div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="baby-top">
        <div class="baby-illust">${svg}</div>
        <div class="baby-info">
          <div class="baby-week">임신 ${weeks}주 ${days}일</div>
          <div class="baby-size">${weekData.emoji} 아기 크기: ${weekData.size} (${weekData.length}${weekData.weight !== '-' ? ', ' + weekData.weight : ''})</div>
          <div class="baby-dday">D-${daysLeft} | 출산예정일 12월 8일</div>
        </div>
      </div>
      <div class="baby-msg">
        👶 ${weekData.dev}
        ${dadTip ? '<br>👨 아빠 TIP: ' + dadTip : ''}
      </div>
      <div class="baby-progress-bar"><div class="baby-progress-fill" style="width:${progressPct}%"></div></div>
      <div class="baby-progress-label"><span>임신</span><span>${progressPct}%</span><span>출산</span></div>
    `;
  }

  // ====== Init ======
  function init() {
    renderBabyBanner();
    initTabs();
    initDateNav();
    updateHeader();
    renderHealth();
    renderRoutine();
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
