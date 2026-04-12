/* ========= Habit Tracker — Main App ========= */
(function () {
  'use strict';

  // ====== Config ======
  const HEALTH_HABITS = [
    { id: 'supplements', name: '영양제 섭취', icon: '💊', stack: '기상 → 물 한 잔 → 영양제 → 세수', identity: 'liver' },
    { id: 'water', name: '물 1.5L 이상', icon: '💧', stack: '아침 물 한 잔이 시작', identity: 'skin' },
    { id: 'veggies', name: '채소 먼저 먹기', icon: '🥗', stack: '식사 시작 → 채소부터', identity: 'liver' },
    { id: 'sleep', name: '11시 전 취침', icon: '😴', stack: '양치 → 폰 내려놓기 → 침대', identity: 'skin' },
    { id: 'no_alcohol', name: '술 안 마신 날', icon: '🚫', stack: '술 생각 → 물 한 잔', identity: 'liver' },
  ];

  const ROUTINES = {
    0: [ // 월
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
    ],
    1: [ // 화
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'run', name: '달리기', icon: '🏃' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
    ],
    2: [ // 수
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
      { id: 'run', name: '달리기', icon: '🏃' },
      { id: 'golf', name: '골프 연습', icon: '⛳' },
      { id: 'wife', name: '와이프와 저녁', icon: '❤️' },
    ],
    3: [ // 목
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'gym', name: '헬스', icon: '💪' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
      { id: 'research', name: '연구 작업', icon: '✍️' },
    ],
    4: [ // 금
      { id: 'english', name: '영어 (스픽)', icon: '🇺🇸' },
      { id: 'run', name: '달리기', icon: '🏃' },
      { id: 'date', name: '와이프 데이트', icon: '🎉' },
    ],
    5: [ // 토
      { id: 'golf_or_run', name: '골프/달리기', icon: '⛳🏃' },
      { id: 'wife', name: '와이프와 시간', icon: '❤️' },
      { id: 'research', name: '연구 작업 (여유시)', icon: '✍️' },
    ],
    6: [ // 일
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

  const MILESTONES = [
    { days: 7, label: '1주 완주', emoji: '🌱' },
    { days: 14, label: '2주 챌린지', emoji: '🌿' },
    { days: 30, label: '한 달!', emoji: '🌳' },
    { days: 66, label: '습관 형성 중간값', emoji: '⭐' },
    { days: 100, label: '100일 달성', emoji: '🏆' },
    { days: 365, label: '1년!', emoji: '👑' },
  ];

  const IDENTITY_MESSAGES = [
    '매일의 체크가 새로운 나를 만듭니다.',
    '당신이 하는 모든 행동은 되고 싶은 사람에게 투표하는 것입니다.',
    '오늘도 한 표를 던져주세요.',
    '두 번 연속 빠지지 않는 것이 핵심입니다.',
    '완벽하지 않아도 괜찮습니다. 나타나는 것이 중요합니다.',
    '2분만 시작하세요. 시작이 반입니다.',
    '어제보다 1%만 나아지면 됩니다.',
    '습관은 의지가 아니라 시스템입니다.',
    '작은 습관이 큰 변화를 만듭니다.',
  ];

  const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
  const STORAGE_KEY = 'habit_tracker_data';

  // ====== State ======
  let currentDate = todayStr();
  let data = loadData();

  // ====== Helpers ======
  function todayStr() {
    return formatDate(new Date());
  }

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function addDays(str, n) {
    const d = parseDate(str);
    d.setDate(d.getDate() + n);
    return formatDate(d);
  }

  function getWeekday(str) {
    return parseDate(str).getDay(); // 0=Sun
  }

  function getWeekdayIdx(str) {
    // Convert to Mon=0 format for ROUTINES
    const d = getWeekday(str);
    return d === 0 ? 6 : d - 1;
  }

  function formatDisplayDate(str) {
    const d = parseDate(str);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dow = DAYS_KO[d.getDay()];
    const isToday = str === todayStr();
    return `${m}/${day} (${dow})${isToday ? ' 오늘' : ''}`;
  }

  function diffDays(a, b) {
    return Math.round((parseDate(b) - parseDate(a)) / 86400000);
  }

  // ====== Data ======
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getDayData(dateStr) {
    if (!data[dateStr]) data[dateStr] = { health: {}, routine: {} };
    return data[dateStr];
  }

  function toggleHabit(dateStr, type, habitId) {
    const day = getDayData(dateStr);
    day[type][habitId] = !day[type][habitId];
    saveData();
  }

  // ====== Streak & Strength ======
  function calcStreak() {
    let streak = 0;
    let d = todayStr();
    // Check today first
    const todayDone = getHealthDoneCount(d);
    const todayTotal = HEALTH_HABITS.length;
    if (todayDone < todayTotal) {
      // Check yesterday
      d = addDays(d, -1);
    }
    while (true) {
      const done = getHealthDoneCount(d);
      const total = HEALTH_HABITS.length;
      if (done >= Math.ceil(total * 0.6)) { // 60%+ counts as done
        streak++;
        d = addDays(d, -1);
      } else {
        break;
      }
    }
    return streak;
  }

  function calcStrength() {
    // Gradual decay model: each day contributes, recent days matter more
    let strength = 0;
    const today = todayStr();
    const lookback = 30;
    for (let i = 0; i < lookback; i++) {
      const d = addDays(today, -i);
      const done = getHealthDoneCount(d);
      const total = HEALTH_HABITS.length;
      const pct = total > 0 ? done / total : 0;
      const weight = 1 - (i / lookback) * 0.7; // recent days weighted more
      strength += pct * weight;
    }
    const maxStrength = Array.from({ length: lookback }, (_, i) => 1 - (i / lookback) * 0.7)
      .reduce((a, b) => a + b, 0);
    return Math.round((strength / maxStrength) * 100);
  }

  function getHealthDoneCount(dateStr) {
    const day = data[dateStr];
    if (!day || !day.health) return 0;
    return HEALTH_HABITS.filter(h => day.health[h.id]).length;
  }

  function getRoutineDoneCount(dateStr) {
    const day = data[dateStr];
    if (!day || !day.routine) return 0;
    const wdi = getWeekdayIdx(dateStr);
    const routines = ROUTINES[wdi] || [];
    return routines.filter(r => day.routine[r.id]).length;
  }

  function getTotalDoneCount(dateStr) {
    return getHealthDoneCount(dateStr) + getRoutineDoneCount(dateStr);
  }

  function getTotalCount(dateStr) {
    const wdi = getWeekdayIdx(dateStr);
    return HEALTH_HABITS.length + (ROUTINES[wdi] || []).length;
  }

  // ====== Render: Tabs ======
  function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        if (tab.dataset.tab === 'dashboard') renderDashboard();
      });
    });
  }

  // ====== Render: Health Tab ======
  function renderHealth() {
    const container = document.getElementById('healthHabits');
    const dayData = getDayData(currentDate);
    const isToday = currentDate === todayStr();
    const isFuture = currentDate > todayStr();

    container.innerHTML = HEALTH_HABITS.map(h => {
      const done = dayData.health[h.id];
      return `
        <div class="habit-item ${done ? 'done' : ''} fade-in" data-id="${h.id}" data-type="health" ${isFuture ? 'style="opacity:0.4;pointer-events:none"' : ''}>
          <div class="habit-check">${done ? '✓' : ''}</div>
          <div class="habit-info">
            <div class="habit-name">${h.name}</div>
            <div class="habit-stack">${h.stack}</div>
          </div>
          <div class="habit-icon">${h.icon}</div>
        </div>
      `;
    }).join('');

    // Stats
    const done = getHealthDoneCount(currentDate);
    const total = HEALTH_HABITS.length;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    document.getElementById('healthStats').innerHTML = `
      <div class="stats-text"><strong>${done}/${total}</strong> 완료 (${pct}%)</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    `;

    document.getElementById('currentDate').textContent = formatDisplayDate(currentDate);

    // Click handlers
    container.querySelectorAll('.habit-item').forEach(el => {
      el.addEventListener('click', () => {
        if (isFuture) return;
        const id = el.dataset.id;
        toggleHabit(currentDate, 'health', id);
        el.classList.toggle('done');
        const check = el.querySelector('.habit-check');
        check.textContent = el.classList.contains('done') ? '✓' : '';
        check.classList.add('pop');
        setTimeout(() => check.classList.remove('pop'), 300);
        renderHealthStats();
        updateHeader();
        if (el.classList.contains('done')) showToast(getCompletionMsg());
      });
    });
  }

  function renderHealthStats() {
    const done = getHealthDoneCount(currentDate);
    const total = HEALTH_HABITS.length;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    document.getElementById('healthStats').innerHTML = `
      <div class="stats-text"><strong>${done}/${total}</strong> 완료 (${pct}%)</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    `;
  }

  // ====== Render: Routine Tab ======
  function renderRoutine() {
    const today = todayStr();
    const wdi = getWeekdayIdx(today);
    const routines = ROUTINES[wdi] || [];
    const dayData = getDayData(today);
    const container = document.getElementById('routineHabits');

    document.getElementById('routineDay').textContent = formatDisplayDate(today);

    container.innerHTML = routines.map(r => {
      const done = dayData.routine[r.id];
      return `
        <div class="habit-item ${done ? 'done' : ''} fade-in" data-id="${r.id}" data-type="routine">
          <div class="habit-check">${done ? '✓' : ''}</div>
          <div class="habit-info">
            <div class="habit-name">${r.name}</div>
          </div>
          <div class="habit-icon">${r.icon}</div>
        </div>
      `;
    }).join('');

    // Stats
    const done = getRoutineDoneCount(today);
    const total = routines.length;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    document.getElementById('routineStats').innerHTML = `
      <div class="stats-text"><strong>${done}/${total}</strong> 완료 (${pct}%)</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    `;

    // Click handlers
    container.querySelectorAll('.habit-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        toggleHabit(today, 'routine', id);
        el.classList.toggle('done');
        const check = el.querySelector('.habit-check');
        check.textContent = el.classList.contains('done') ? '✓' : '';
        check.classList.add('pop');
        setTimeout(() => check.classList.remove('pop'), 300);
        // Update stats
        const doneN = getRoutineDoneCount(today);
        const totalN = routines.length;
        const pctN = totalN > 0 ? Math.round(doneN / totalN * 100) : 0;
        document.getElementById('routineStats').innerHTML = `
          <div class="stats-text"><strong>${doneN}/${totalN}</strong> 완료 (${pctN}%)</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pctN}%"></div></div>
        `;
        updateHeader();
        if (el.classList.contains('done')) showToast(getCompletionMsg());
      });
    });
  }

  // ====== Render: Dashboard ======
  function renderDashboard() {
    renderStrength();
    renderHeatmap();
    renderWeeklyChart();
    renderMilestones();
    renderIdentityVotes();
  }

  function renderStrength() {
    const strength = calcStrength();
    document.getElementById('strengthFill').style.width = `${strength}%`;
    document.getElementById('strengthText').textContent = `${strength}%`;
    let label = '';
    if (strength < 20) label = '시작 단계 — 의식적 노력이 필요합니다';
    else if (strength < 40) label = '형성 중 — 조금씩 자동화되고 있습니다';
    else if (strength < 60) label = '발전 중 — 좋은 흐름입니다!';
    else if (strength < 80) label = '안정 단계 — 거의 습관이 되었습니다';
    else label = '자동화 — 습관이 당신의 일부입니다!';
    document.getElementById('strengthLabel').textContent = label;
  }

  function renderHeatmap() {
    const container = document.getElementById('heatmap');
    const monthsContainer = document.getElementById('heatmapMonths');
    const today = new Date();
    const cells = [];

    // Go back 12 weeks (84 days)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 83);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // to Saturday

    let d = new Date(startDate);
    const months = new Set();

    while (d <= endDate) {
      const dateStr = formatDate(d);
      const isFuture = dateStr > todayStr();
      const done = getTotalDoneCount(dateStr);
      const total = getTotalCount(dateStr);
      const pct = total > 0 ? done / total : 0;

      let lvl = '';
      if (isFuture) lvl = 'future';
      else if (pct === 0 && !data[dateStr]) lvl = '';
      else if (pct <= 0.25) lvl = 'l1';
      else if (pct <= 0.5) lvl = 'l2';
      else if (pct <= 0.8) lvl = 'l3';
      else lvl = 'l4';

      cells.push(`<div class="heatmap-cell ${lvl}" title="${dateStr}: ${Math.round(pct * 100)}%"></div>`);

      if (d.getDate() <= 7 && d.getDay() === 0) {
        months.add(d.toLocaleDateString('ko', { month: 'short' }));
      }

      d.setDate(d.getDate() + 1);
    }

    container.innerHTML = cells.join('');
  }

  function renderWeeklyChart() {
    const container = document.getElementById('weeklyChart');
    const today = todayStr();
    const weeks = [];

    for (let w = 6; w >= 0; w--) {
      const weekStart = addDays(today, -((diffDays(addDays(today, 0), today) % 7) + w * 7));
      let totalDone = 0, totalAll = 0;

      for (let i = 0; i < 7; i++) {
        const d = addDays(today, -(w * 7 + (6 - i)));
        if (d > today) continue;
        totalDone += getHealthDoneCount(d);
        totalAll += HEALTH_HABITS.length;
      }

      const pct = totalAll > 0 ? Math.round(totalDone / totalAll * 100) : 0;
      const isCurrent = w === 0;
      weeks.push({ pct, isCurrent, label: w === 0 ? '이번주' : `${w}주전` });
    }

    container.innerHTML = weeks.map(w => `
      <div class="week-bar-container">
        <div class="week-bar-pct">${w.pct}%</div>
        <div class="week-bar ${w.isCurrent ? 'current' : ''}" style="height:${Math.max(4, w.pct)}px"></div>
        <div class="week-bar-label">${w.label}</div>
      </div>
    `).join('');
  }

  function renderMilestones() {
    const streak = calcStreak();
    const container = document.getElementById('milestones');
    container.innerHTML = MILESTONES.map(m => {
      const achieved = streak >= m.days;
      return `<div class="milestone ${achieved ? 'achieved' : 'pending'}">${m.emoji} ${m.label} (${m.days}일)${achieved ? ' ✓' : ''}</div>`;
    }).join('');
  }

  function renderIdentityVotes() {
    const container = document.getElementById('identityVotes');
    const today = todayStr();
    const lookback = 7;

    container.innerHTML = IDENTITIES.map(identity => {
      let votes = 0, total = 0;

      for (let i = 0; i < lookback; i++) {
        const d = addDays(today, -i);
        const dayData = data[d];

        if (identity.habitIds) {
          identity.habitIds.forEach(hid => {
            total++;
            if (dayData && dayData.health && dayData.health[hid]) votes++;
          });
        }
        if (identity.routineIds) {
          const wdi = getWeekdayIdx(d);
          const routines = ROUTINES[wdi] || [];
          identity.routineIds.forEach(rid => {
            if (routines.find(r => r.id === rid)) {
              total++;
              if (dayData && dayData.routine && dayData.routine[rid]) votes++;
            }
          });
        }
      }

      const pct = total > 0 ? Math.round(votes / total * 100) : 0;
      return `
        <div class="identity-item">
          <div class="identity-label">"나는 ${identity.label}이다" — ${votes}/${total} 투표</div>
          <div class="identity-bar-bg">
            <div class="identity-bar-fill ${identity.class}" style="width:${pct}%"></div>
          </div>
          <div class="identity-pct">${pct}% 일치</div>
        </div>
      `;
    }).join('');
  }

  // ====== Header ======
  function updateHeader() {
    const streak = calcStreak();
    document.getElementById('streakBadge').textContent = streak;
    document.getElementById('identityMsg').textContent =
      IDENTITY_MESSAGES[Math.floor(Math.random() * IDENTITY_MESSAGES.length)];
  }

  // ====== Toast ======
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function getCompletionMsg() {
    const msgs = [
      '한 표 투표 완료! 👍',
      '좋아요! 계속 가세요! 💪',
      '나타나는 것이 가장 중요합니다 ✨',
      '오늘도 한 걸음 더! 🚀',
      '잘하고 계세요! 🌟',
      '습관이 되어가고 있어요! 🌱',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  // ====== Date Navigation ======
  function initDateNav() {
    document.getElementById('prevDay').addEventListener('click', () => {
      currentDate = addDays(currentDate, -1);
      renderHealth();
    });
    document.getElementById('nextDay').addEventListener('click', () => {
      if (currentDate < todayStr()) {
        currentDate = addDays(currentDate, 1);
        renderHealth();
      }
    });
  }

  // ====== Init ======
  function init() {
    initTabs();
    initDateNav();
    updateHeader();
    renderHealth();
    renderRoutine();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
