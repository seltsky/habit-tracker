/* Habit Quest v5 — Quest Mode App */
(function () {
  'use strict';

  const LEVEL_TITLES = [
    { min: 1, max: 10, label: '견습생', desc: '갓 시작한 모험가. 첫 발걸음을 떼는 중입니다.' },
    { min: 11, max: 25, label: '수련자', desc: '꾸준함의 미덕을 익혀가는 단계.' },
    { min: 26, max: 50, label: '숙련자', desc: '동료가 비결을 묻기 시작합니다.' },
    { min: 51, max: 75, label: '마스터', desc: '체중·습관 목표를 달성한 자.' },
    { min: 76, max: 99, label: '전설', desc: '1년간 95% 출석한 인플루언서급.' },
    { min: 100, max: 999, label: '각성', desc: '습관이 곧 정체성이 된 자.' },
  ];

  const REASON_LABELS = {
    time: '시간 부족', condition: '컨디션', schedule: '일정·약속',
    forgot: '잊음', willpower: '의지 부족', weather: '날씨',
    emergency: '응급/돌발', other: '기타'
  };

  const TIER_COLORS = {
    easy: '#7be0a3', normal: '#4ecca3', elite: '#ff9a3c', boss: '#ff4757'
  };

  const TYPE_ICONS = {
    main: '⚔️', daily: '📜', bonus: '✨', challenge: '🏆'
  };

  const STAT_LABELS = {
    stamina: '체력', discipline: '의지', focus: '집중',
    wellness: '웰니스', research: '연구'
  };

  const DOMAIN_LABELS = {
    exercise: { icon: '🏋️', name: '운동', color: '#ff9a3c' },
    health: { icon: '🩺', name: '건강', color: '#4ecca3' },
    relationship: { icon: '❤️', name: '관계', color: '#ff6b6b' },
    faith: { icon: '⛪', name: '신앙', color: '#b78aff' },
    study: { icon: '📚', name: '학습', color: '#a3e0ff' },
    recovery: { icon: '🌿', name: '회복', color: '#7be0a3' },
  };

  const SUBDOMAIN_LABELS = {
    run: '달리기', gym: '헬스', golf: '골프',
    supplements: '영양제', protein: '단백질', veggies: '채소',
    water: '수분', no_alcohol: '절주', sleep: '수면',
    wife: '와이프', family: '가족',
    church: '교회',
    english: '영어', research: '연구',
    stretch: '스트레칭', meditation: '명상',
  };

  let state = {
    user: null,
    quest: null,
    log: null,
    inbox: { items: [] },
    pendingSkip: null,
  };

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getLevelInfo(level) {
    return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0];
  }

  function nextLevelXp(level) {
    return 100 + (level * 25);
  }

  function fetchJson(path) {
    return fetch(path + '?t=' + Date.now()).then(r => r.ok ? r.json() : null).catch(() => null);
  }

  function loadLocal(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }

  function saveLocal(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function showToast(text) {
    const toast = document.getElementById('xpToast');
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  async function loadAll() {
    const today = todayStr();

    state.quest = await fetchJson(`data/quests/${today}.json`);
    if (!state.quest) {
      state.quest = await fetchJson('data/quests/2026-04-19.json');
    }

    state.user = loadLocal('hq_user', {
      name: '선생님',
      character_class: ['doctor', 'researcher', 'father-to-be'],
      started_at: today,
      level: 1,
      current_xp: 0,
      total_xp_lifetime: 0,
      stats: { stamina: 10, discipline: 10, focus: 10, wellness: 10, research: 10 },
      streak_current: 0,
      streak_longest: 0,
      season: today.slice(0, 7),
      season_progress: 0,
      badges: [],
      boss_record: { won: 0, lost: 0 },
      lifetime_completed: 0,
      total_quests_seen: 0,
    });

    state.log = loadLocal(`hq_log_${today}`, {
      date: today,
      completed: [],
      skipped: [],
      energy_score: null,
      mood_score: null,
      memo: '',
    });

    state.inbox = loadLocal('hq_inbox', { items: [] });
  }

  function render() {
    renderHeader();
    renderQuests();
    renderDashboard();
    renderInbox();
  }

  function renderHeader() {
    const u = state.user;
    const li = getLevelInfo(u.level);
    document.getElementById('headerDate').textContent =
      todayStr() + (state.quest ? ` (${state.quest.weekday_kr || ''})` : '');
    document.getElementById('levelNum').textContent = u.level;
    document.getElementById('streakNum').textContent = u.streak_current;
    document.getElementById('levelLabel').textContent = li.label;
    const next = nextLevelXp(u.level);
    const pct = Math.min(100, Math.round((u.current_xp / next) * 100));
    document.getElementById('xpFill').style.width = pct + '%';
    document.getElementById('xpText').textContent = `${u.current_xp} / ${next} XP`;
    document.getElementById('morningMessage').textContent =
      state.quest?.morning_message || '오늘의 퀘스트를 불러오는 중...';
  }

  function renderQuests() {
    const container = document.getElementById('questGroups');
    if (!state.quest) {
      container.innerHTML = '<div class="empty">오늘의 퀘스트가 아직 없습니다.<br>매일 5시에 자동 생성됩니다.</div>';
      document.getElementById('bossCard').innerHTML = '';
      return;
    }

    const groups = { main: [], daily: [], bonus: [], challenge: [] };
    state.quest.quests.forEach(q => {
      (groups[q.type] || groups.daily).push(q);
    });

    const groupTitles = { main: '메인 퀘스트', daily: '일일 퀘스트', bonus: '보너스', challenge: '도전' };
    let html = '';
    for (const type of ['main', 'daily', 'bonus', 'challenge']) {
      if (groups[type].length === 0) continue;
      html += `<div class="quest-group"><h3>${TYPE_ICONS[type]} ${groupTitles[type]}</h3>`;
      groups[type].forEach(q => html += renderQuestCard(q));
      html += `</div>`;
    }
    container.innerHTML = html;

    container.querySelectorAll('.btn-complete').forEach(btn => {
      btn.addEventListener('click', () => completeQuest(btn.dataset.id));
    });
    container.querySelectorAll('.btn-skip').forEach(btn => {
      btn.addEventListener('click', () => openSkipModal(btn.dataset.id));
    });

    const boss = state.quest.weekly_boss;
    if (boss) {
      const bossEl = document.getElementById('bossCard');
      const pct = Math.round((boss.progress || 0) * 100);
      bossEl.innerHTML = `
        <h3>👹 이번 주 보스</h3>
        <div class="boss-title">${boss.title}</div>
        ${boss.current ? `<div class="boss-current">${boss.current}</div>` : ''}
        <div class="boss-bar"><div class="boss-fill" style="width:${pct}%"></div></div>
        <div class="boss-meta">${pct}% · 보상 ${boss.reward_xp} XP · 마감 ${boss.deadline}</div>
        ${boss.note ? `<div class="boss-note">💡 ${boss.note}</div>` : ''}
      `;
    } else {
      document.getElementById('bossCard').innerHTML = '';
    }
  }

  function renderQuestCard(q) {
    const isDone = state.log.completed.includes(q.id);
    const skipObj = state.log.skipped.find(s => s.quest_id === q.id);
    const tierColor = TIER_COLORS[q.tier] || '#4ecca3';
    let statusClass = '';
    if (isDone) statusClass = 'done';
    else if (skipObj) statusClass = 'skipped';

    const tags = q.tags ? q.tags.join(' ') : '';
    let actionsHtml;
    if (isDone) {
      actionsHtml = '<div class="quest-status">✅ 완료</div>';
    } else if (skipObj) {
      const label = REASON_LABELS[skipObj.reason_code] || skipObj.reason_code;
      actionsHtml = `<div class="quest-status skip">⏭️ 건너뜀 (${label})</div>`;
    } else {
      actionsHtml = `<div class="quest-actions">
        <button class="btn-complete" data-id="${q.id}">완료</button>
        <button class="btn-skip" data-id="${q.id}">건너뜀</button>
      </div>`;
    }

    const dom = DOMAIN_LABELS[q.domain];
    const subLabel = SUBDOMAIN_LABELS[q.subdomain] || q.subdomain || '';
    const breadcrumbHtml = dom ? `
      <div class="quest-breadcrumb" style="color:${dom.color}">
        ${dom.icon} ${dom.name}${subLabel ? ' → ' + subLabel : ''}
      </div>
    ` : '';

    return `
      <div class="quest-card ${statusClass}" style="border-left-color:${tierColor}">
        ${breadcrumbHtml}
        <div class="quest-head">
          <div class="quest-title">${q.title}</div>
          <div class="quest-xp">+${q.xp}</div>
        </div>
        <div class="quest-desc">${q.description}</div>
        <div class="quest-meta">
          <span class="tier" style="color:${tierColor}">${q.tier}</span>
          <span>·</span>
          <span>${q.estimated_minutes}분</span>
          ${tags ? `<span>·</span><span>${tags}</span>` : ''}
        </div>
        ${q.reasoning ? `<div class="quest-reason">💭 ${q.reasoning}</div>` : ''}
        ${actionsHtml}
      </div>
    `;
  }

  function renderDashboard() {
    const u = state.user;
    const li = getLevelInfo(u.level);

    document.getElementById('characterClass').textContent = u.character_class.join(' / ');
    document.getElementById('characterLevel').textContent = `Lv.${u.level} — ${li.label}`;
    document.getElementById('characterQuote').textContent = `"${li.desc}"`;

    const statsHtml = Object.entries(u.stats).map(([k, v]) => `
      <div class="stat-row">
        <span class="stat-label">${STAT_LABELS[k] || k}</span>
        <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100, v)}%"></div></div>
        <span class="stat-val">${v}</span>
      </div>
    `).join('');
    document.getElementById('statsList').innerHTML = statsHtml;

    const sp = u.season_progress || 0;
    document.getElementById('seasonInfo').innerHTML = `
      <div class="season-name">${u.season}</div>
      <div class="season-bar"><div class="season-fill" style="width:${Math.round(sp * 100)}%"></div></div>
      <div>${Math.round(sp * 100)}% 진행</div>
    `;

    document.getElementById('streakInfo').innerHTML = `
      <div>🔥 현재 ${u.streak_current}일</div>
      <div>🏔️ 최장 ${u.streak_longest}일</div>
    `;

    const br = u.boss_record;
    const total = br.won + br.lost;
    const rate = total > 0 ? Math.round((br.won / total) * 100) : 0;
    document.getElementById('bossRecord').innerHTML = `승 ${br.won} / 패 ${br.lost} (${rate}%)`;

    document.getElementById('badgesList').innerHTML = u.badges.length
      ? u.badges.map(b => `<span class="badge">🏅 ${b}</span>`).join('')
      : '<span class="empty">아직 뱃지 없음</span>';

    document.getElementById('lifetimeStats').innerHTML = `
      <div>총 XP: ${u.total_xp_lifetime.toLocaleString()}</div>
      <div>완료 퀘스트: ${u.lifetime_completed}개</div>
    `;

    let recentHtml = '';
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const log = loadLocal(`hq_log_${ds}`, null);
      const t = (log?.completed.length || 0) + (log?.skipped.length || 0);
      const r = t > 0 ? Math.round((log.completed.length / t) * 100) : 0;
      const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
      const color = r >= 80 ? '#4ecca3' : r >= 50 ? '#ff9a3c' : r > 0 ? '#ff4757' : '#1a1a2e';
      recentHtml += `
        <div class="day-cell" title="${ds}: ${r}%">
          <div class="day-name">${day}</div>
          <div class="day-bar" style="background:${color}"></div>
          <div class="day-pct">${r}%</div>
        </div>
      `;
    }
    document.getElementById('recentDays').innerHTML = recentHtml;
  }

  function renderInbox() {
    const list = document.getElementById('inboxList');
    if (state.inbox.items.length === 0) {
      list.innerHTML = '<div class="empty">대기 중인 항목 없음</div>';
      return;
    }
    list.innerHTML = state.inbox.items.map(item => `
      <div class="inbox-item ${item.applied_at ? 'applied' : ''}">
        <div class="inbox-text">${item.text}</div>
        <div class="inbox-meta">${item.added_at.slice(0, 16)}${item.applied_at ? ' · 반영됨' : ''}</div>
      </div>
    `).join('');
  }

  function completeQuest(id) {
    const q = state.quest.quests.find(x => x.id === id);
    if (!q) return;
    if (state.log.completed.includes(id)) return;

    state.log.completed.push(id);
    state.log.skipped = state.log.skipped.filter(s => s.quest_id !== id);

    state.user.current_xp += q.xp;
    state.user.total_xp_lifetime += q.xp;
    state.user.lifetime_completed += 1;

    const statMap = {
      health: 'wellness', routine: 'discipline', research: 'research',
      wife: 'wellness', user_request: 'discipline', self_care: 'stamina'
    };
    const statKey = statMap[q.category] || 'discipline';
    state.user.stats[statKey] = Math.min(100, (state.user.stats[statKey] || 0) + 1);

    const need = nextLevelXp(state.user.level);
    if (state.user.current_xp >= need) {
      state.user.current_xp -= need;
      state.user.level += 1;
      const li = getLevelInfo(state.user.level);
      showToast(`🎉 레벨업! Lv.${state.user.level} ${li.label}`);
    } else {
      showToast(`+${q.xp} XP`);
    }

    persist();
    render();
  }

  function openSkipModal(id) {
    state.pendingSkip = id;
    const q = state.quest.quests.find(x => x.id === id);
    document.getElementById('modalQuestTitle').textContent = q.title;
    document.querySelectorAll('input[name="reason"]').forEach(i => i.checked = false);
    document.getElementById('reasonMemo').value = '';
    document.getElementById('skipModal').classList.add('show');
  }

  function closeSkipModal() {
    document.getElementById('skipModal').classList.remove('show');
    state.pendingSkip = null;
  }

  function saveSkip() {
    const reason = document.querySelector('input[name="reason"]:checked');
    if (!reason) {
      alert('사유를 선택해주세요');
      return;
    }
    const memo = document.getElementById('reasonMemo').value;
    state.log.skipped.push({
      quest_id: state.pendingSkip,
      reason_code: reason.value,
      reason_text: memo,
      skipped_at: new Date().toISOString(),
    });
    state.log.completed = state.log.completed.filter(id => id !== state.pendingSkip);
    closeSkipModal();
    persist();
    render();
  }

  function addInboxItem() {
    const text = document.getElementById('inboxText').value.trim();
    if (!text) return;
    state.inbox.items.unshift({
      id: 'in-' + Date.now(),
      added_at: new Date().toISOString(),
      text: text,
      applied_at: null,
      applied_to: [],
    });
    document.getElementById('inboxText').value = '';
    persist();
    renderInbox();
    showToast('인박스에 추가됨');
  }

  function saveReflection() {
    state.log.energy_score = parseInt(document.getElementById('energyScore').value);
    state.log.mood_score = parseInt(document.getElementById('moodScore').value);
    state.log.memo = document.getElementById('memoText').value;
    persist();
    showToast('회고 저장됨');
  }

  function persist() {
    saveLocal('hq_user', state.user);
    saveLocal(`hq_log_${state.log.date}`, state.log);
    saveLocal('hq_inbox', state.inbox);
  }

  function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + target).classList.add('active');
      });
    });
  }

  async function init() {
    await loadAll();
    setupTabs();
    render();

    document.getElementById('modalCancel').addEventListener('click', closeSkipModal);
    document.getElementById('modalSave').addEventListener('click', saveSkip);
    document.getElementById('inboxAdd').addEventListener('click', addInboxItem);

    const er = document.getElementById('energyScore');
    const mr = document.getElementById('moodScore');
    er.addEventListener('input', () => document.getElementById('energyValue').textContent = er.value);
    mr.addEventListener('input', () => document.getElementById('moodValue').textContent = mr.value);
    document.getElementById('reflectionSave').addEventListener('click', saveReflection);

    if (state.log.energy_score) {
      er.value = state.log.energy_score;
      document.getElementById('energyValue').textContent = state.log.energy_score;
    }
    if (state.log.mood_score) {
      mr.value = state.log.mood_score;
      document.getElementById('moodValue').textContent = state.log.mood_score;
    }
    if (state.log.memo) {
      document.getElementById('memoText').value = state.log.memo;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
