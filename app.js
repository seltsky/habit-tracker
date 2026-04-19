/* Habit Quest v6 — Sync + Charts + Duo + Confetti + Push */
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

  // EDD: 2026-12-08 (사모님 임신)
  const EDD = new Date('2026-12-08');
  const LMP = new Date('2026-03-03');

  let state = {
    user: null,
    quest: null,
    log: null,
    inbox: { items: [] },
    pendingSkip: null,
    settings: { theme: 'dark', ghToken: '', ghRepo: 'seltsky/habit-tracker', notif: false },
    wifeLog: {},
    lastModified: 0,
  };

  // ====== Util ======
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function getLevelInfo(level) {
    return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[0];
  }
  function nextLevelXp(level) { return 100 + (level * 25); }
  function fetchJson(path) {
    return fetch(path + '?t=' + Date.now()).then(r => r.ok ? r.json() : null).catch(() => null);
  }
  function loadLocal(key, fb) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; }
  }
  function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function showToast(text) {
    const t = document.getElementById('xpToast');
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  // ====== Confetti ======
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const colors = ['#4ecca3','#ff9a3c','#a3e0ff','#ff6b6b','#b78aff','#ffd166'];
    const pieces = [];
    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: canvas.width/2,
        y: canvas.height/2,
        vx: (Math.random()-0.5)*15,
        vy: (Math.random()-1.5)*15,
        color: colors[Math.floor(Math.random()*colors.length)],
        size: 6 + Math.random()*6,
        rot: Math.random()*Math.PI*2,
        vrot: (Math.random()-0.5)*0.3,
        life: 0,
      });
    }
    let frames = 0;
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.4;
        p.rot += p.vrot;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life/100);
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
      });
      frames++;
      if (frames < 100) requestAnimationFrame(draw);
      else { canvas.style.display = 'none'; ctx.clearRect(0,0,canvas.width,canvas.height); }
    }
    draw();
  }

  // ====== Sync (GitHub API) ======
  async function syncPush() {
    if (!state.settings.ghToken || !state.settings.ghRepo) {
      showToast('GitHub 토큰·repo 입력 필요');
      return;
    }
    state.lastModified = Date.now();
    const payload = {
      lastModified: state.lastModified,
      user: state.user,
      logs: getAllLogs(),
      inbox: state.inbox,
      wifeLog: state.wifeLog,
    };
    const path = 'data/sync/state.json';
    const url = `https://api.github.com/repos/${state.settings.ghRepo}/contents/${path}`;
    let sha = null;
    try {
      const r = await fetch(url, { headers: { Authorization: `token ${state.settings.ghToken}` }});
      if (r.ok) sha = (await r.json()).sha;
    } catch {}
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
    const body = { message: `sync: ${new Date().toISOString()}`, content };
    if (sha) body.sha = sha;
    const resp = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `token ${state.settings.ghToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (resp.ok) {
      saveLocal('hq_lastSync', state.lastModified);
      updateSyncStatus('✅ 동기화 완료 ' + new Date().toLocaleTimeString());
      saveLocal('hq_settings', state.settings);
    } else {
      const err = await resp.json().catch(() => ({}));
      updateSyncStatus('❌ 실패: ' + (err.message || resp.status));
    }
  }

  async function syncPull() {
    if (!state.settings.ghToken || !state.settings.ghRepo) {
      showToast('GitHub 토큰·repo 입력 필요');
      return;
    }
    const path = 'data/sync/state.json';
    const url = `https://api.github.com/repos/${state.settings.ghRepo}/contents/${path}`;
    try {
      const r = await fetch(url, { headers: { Authorization: `token ${state.settings.ghToken}` }});
      if (!r.ok) {
        updateSyncStatus('❌ 가져오기 실패: ' + r.status);
        return;
      }
      const j = await r.json();
      const decoded = JSON.parse(decodeURIComponent(escape(atob(j.content))));
      const remoteLM = decoded.lastModified || 0;
      const localLM = state.lastModified || 0;
      if (remoteLM <= localLM) {
        updateSyncStatus('ℹ️ 로컬이 최신 (서버 ' + new Date(remoteLM).toLocaleString() + ')');
        return;
      }
      // Apply remote
      state.user = decoded.user;
      state.inbox = decoded.inbox;
      state.wifeLog = decoded.wifeLog || {};
      state.lastModified = remoteLM;
      Object.entries(decoded.logs || {}).forEach(([k,v]) => saveLocal('hq_log_' + k, v));
      // Reload today's log
      state.log = loadLocal(`hq_log_${todayStr()}`, state.log);
      saveLocal('hq_user', state.user);
      saveLocal('hq_inbox', state.inbox);
      saveLocal('hq_wifeLog', state.wifeLog);
      saveLocal('hq_lastModified', remoteLM);
      updateSyncStatus('✅ 가져오기 완료 ' + new Date(remoteLM).toLocaleString());
      render();
    } catch (e) {
      updateSyncStatus('❌ 오류: ' + e.message);
    }
  }

  function getAllLogs() {
    const logs = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('hq_log_')) {
        const date = key.replace('hq_log_', '');
        logs[date] = loadLocal(key, null);
      }
    }
    return logs;
  }

  function updateSyncStatus(text) {
    const el = document.getElementById('syncStatus');
    if (el) el.textContent = text;
    const meta = document.getElementById('syncMeta');
    if (meta) meta.textContent = text;
  }

  // ====== QR Pairing ======
  function generatePairQR() {
    const token = document.getElementById('ghToken').value.trim() || state.settings.ghToken;
    const repo = document.getElementById('ghRepo').value.trim() || state.settings.ghRepo;
    if (!token || !repo) {
      showToast('먼저 토큰·repo 입력 후 QR 만들기');
      return;
    }
    if (typeof qrcode === 'undefined') {
      showToast('QR 라이브러리 로드 실패. 새로고침하세요.');
      return;
    }
    const payload = btoa(JSON.stringify({ t: token, r: repo }));
    const url = `${location.origin}${location.pathname}#sync=${payload}`;
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    document.getElementById('qrDisplay').innerHTML = `
      ${qr.createImgTag(5, 8)}
      <p class="qr-hint">📷 다른 기기 카메라로 스캔하세요<br>(또는 길게 눌러 이미지 저장)</p>
    `;
  }

  function checkUrlHashForSync() {
    if (location.hash.startsWith('#sync=')) {
      try {
        const decoded = atob(location.hash.replace('#sync=', ''));
        const { t, r } = JSON.parse(decoded);
        state.settings.ghToken = t;
        state.settings.ghRepo = r;
        saveLocal('hq_settings', state.settings);
        history.replaceState(null, '', location.pathname);
        showToast('✅ QR 페어링 완료, 동기화 시작');
        setTimeout(syncPull, 500);
      } catch (e) {
        showToast('❌ QR 페어링 실패: ' + e.message);
      }
    }
  }

  // ====== Notifications ======
  async function requestNotifPerm() {
    if (!('Notification' in window)) { showToast('이 브라우저는 알림 미지원'); return; }
    const p = await Notification.requestPermission();
    state.settings.notif = (p === 'granted');
    saveLocal('hq_settings', state.settings);
    showToast(p === 'granted' ? '✅ 알림 켜짐' : '❌ 알림 거부됨');
    if (p === 'granted') scheduleNotif();
  }

  function scheduleNotif() {
    // 7시 알림 — 다음 7시까지의 시간 계산
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const target = new Date();
    target.setHours(7, 0, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);
    const ms = target - now;
    setTimeout(() => {
      new Notification('🎮 Habit Quest', {
        body: '오늘의 퀘스트가 도착했습니다',
        icon: 'icon-192.png',
      });
      scheduleNotif(); // recurse for tomorrow
    }, ms);
  }

  // ====== Data Loading ======
  async function loadAll() {
    const today = todayStr();
    state.quest = await fetchJson(`data/quests/${today}.json`);
    if (!state.quest) state.quest = await fetchJson('data/quests/2026-04-19.json');

    state.user = loadLocal('hq_user', {
      name: '선생님',
      character_class: ['doctor', 'researcher', 'father-to-be'],
      started_at: today,
      level: 1, current_xp: 0, total_xp_lifetime: 0,
      stats: { stamina: 10, discipline: 10, focus: 10, wellness: 10, research: 10 },
      streak_current: 0, streak_longest: 0,
      season: today.slice(0, 7), season_progress: 0,
      badges: [], boss_record: { won: 0, lost: 0 },
      lifetime_completed: 0, total_quests_seen: 0,
    });

    state.log = loadLocal(`hq_log_${today}`, {
      date: today, completed: [], skipped: [],
      energy_score: null, mood_score: null, memo: '',
    });

    state.inbox = loadLocal('hq_inbox', { items: [] });
    state.wifeLog = loadLocal('hq_wifeLog', {});
    state.settings = Object.assign(state.settings, loadLocal('hq_settings', {}));
    state.lastModified = loadLocal('hq_lastModified', 0);

    document.body.dataset.theme = state.settings.theme || 'dark';
  }

  // ====== Render ======
  function render() {
    renderHeader();
    renderQuests();
    renderDashboard();
    renderDuo();
    renderInbox();
    document.body.dataset.theme = state.settings.theme || 'dark';
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
    const xpPct = Math.min(100, Math.round((u.current_xp / next) * 100));
    document.getElementById('xpFill').style.width = xpPct + '%';
    document.getElementById('xpText').textContent = `${u.current_xp} / ${next} XP`;
    document.getElementById('morningMessage').textContent =
      state.quest?.morning_message || '오늘의 퀘스트 로드 중...';

    // Today's progress circle
    const total = state.quest?.quests?.length || 0;
    const done = state.log.completed.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const circ = 2 * Math.PI * 34;
    const fill = document.getElementById('cpFill');
    fill.style.strokeDasharray = circ;
    fill.style.strokeDashoffset = circ * (1 - pct/100);
    document.getElementById('cpPct').textContent = pct + '%';
    document.getElementById('cpFrac').textContent = `${done}/${total}`;
  }

  function renderQuests() {
    const container = document.getElementById('questGroups');
    if (!state.quest) {
      container.innerHTML = '<div class="empty">오늘의 퀘스트가 아직 없습니다.<br>매일 5시에 자동 생성됩니다.</div>';
      document.getElementById('bossCard').innerHTML = '';
      return;
    }
    const groups = { main: [], daily: [], bonus: [], challenge: [] };
    state.quest.quests.forEach(q => (groups[q.type] || groups.daily).push(q));

    const groupTitles = { main: '메인 퀘스트', daily: '일일 퀘스트', bonus: '보너스', challenge: '도전' };
    let html = '';
    for (const type of ['main', 'daily', 'bonus', 'challenge']) {
      if (groups[type].length === 0) continue;
      html += `<div class="quest-group"><h3>${TYPE_ICONS[type]} ${groupTitles[type]}</h3>`;
      groups[type].forEach(q => html += renderQuestCard(q));
      html += `</div>`;
    }
    container.innerHTML = html;

    container.querySelectorAll('.btn-complete').forEach(b => b.addEventListener('click', () => completeQuest(b.dataset.id)));
    container.querySelectorAll('.btn-skip').forEach(b => b.addEventListener('click', () => openSkipModal(b.dataset.id)));
    container.querySelectorAll('.btn-undo').forEach(b => b.addEventListener('click', () => undoQuest(b.dataset.id)));

    const boss = state.quest.weekly_boss;
    if (boss) {
      const pct = Math.round((boss.progress || 0) * 100);
      document.getElementById('bossCard').innerHTML = `
        <h3>👹 이번 주 보스</h3>
        <div class="boss-title">${boss.title}</div>
        ${boss.current ? `<div class="boss-current">${boss.current}</div>` : ''}
        <div class="boss-bar"><div class="boss-fill" style="width:${pct}%"></div></div>
        <div class="boss-meta">${pct}% · 보상 ${boss.reward_xp} XP · 마감 ${boss.deadline}</div>
        ${boss.note ? `<div class="boss-note">💡 ${boss.note}</div>` : ''}
      `;
    } else document.getElementById('bossCard').innerHTML = '';
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
      actionsHtml = `<div class="quest-status-row">
        <div class="quest-status">✅ 완료</div>
        <button class="btn-undo" data-id="${q.id}">↩️ 취소</button>
      </div>`;
    } else if (skipObj) {
      const label = REASON_LABELS[skipObj.reason_code] || skipObj.reason_code;
      actionsHtml = `<div class="quest-status-row">
        <div class="quest-status skip">⏭️ 건너뜀 (${label})</div>
        <button class="btn-undo" data-id="${q.id}">↩️ 취소</button>
      </div>`;
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

    drawRadar();
    drawReasonChart();

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
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const log = loadLocal(`hq_log_${ds}`, null);
      const t = (log?.completed.length || 0) + (log?.skipped.length || 0);
      const r = t > 0 ? Math.round((log.completed.length / t) * 100) : 0;
      const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
      const color = r >= 80 ? '#4ecca3' : r >= 50 ? '#ff9a3c' : r > 0 ? '#ff4757' : 'var(--bg-card-2)';
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

  function drawRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W/2, cy = H/2, R = 100;

    // Calculate domain completion this week
    const domains = ['exercise', 'health', 'relationship', 'faith', 'study', 'recovery'];
    const counts = {}; const dones = {};
    domains.forEach(d => { counts[d] = 0; dones[d] = 0; });
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const log = loadLocal(`hq_log_${ds}`, null);
      if (!log) continue;
      // Need to fetch quest for that date, but for v1 use today's quest as baseline
      const q = (i === 0 ? state.quest : null);
      if (!q) continue;
      q.quests.forEach(qq => {
        if (counts[qq.domain] !== undefined) {
          counts[qq.domain]++;
          if (log.completed.includes(qq.id)) dones[qq.domain]++;
        }
      });
    }

    // Draw axes
    const isDark = (state.settings.theme || 'dark') === 'dark';
    ctx.strokeStyle = isDark ? '#2a2d4a' : '#d0d4e0';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      domains.forEach((_, i) => {
        const angle = -Math.PI/2 + (Math.PI*2*i)/domains.length;
        const x = cx + Math.cos(angle) * (R*r/4);
        const y = cy + Math.sin(angle) * (R*r/4);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }
    // Spokes
    domains.forEach((_, i) => {
      const angle = -Math.PI/2 + (Math.PI*2*i)/domains.length;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle)*R, cy + Math.sin(angle)*R);
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = isDark ? '#9aa0b4' : '#6a7080';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    domains.forEach((d, i) => {
      const angle = -Math.PI/2 + (Math.PI*2*i)/domains.length;
      const x = cx + Math.cos(angle) * (R+18);
      const y = cy + Math.sin(angle) * (R+18) + 4;
      ctx.fillText(DOMAIN_LABELS[d].name, x, y);
    });

    // Data polygon
    ctx.fillStyle = 'rgba(78, 204, 163, 0.3)';
    ctx.strokeStyle = '#4ecca3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    domains.forEach((d, i) => {
      const v = counts[d] > 0 ? dones[d] / counts[d] : 0;
      const angle = -Math.PI/2 + (Math.PI*2*i)/domains.length;
      const x = cx + Math.cos(angle) * R * v;
      const y = cy + Math.sin(angle) * R * v;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawReasonChart() {
    const container = document.getElementById('reasonChart');
    if (!container) return;
    const counts = {};
    Object.keys(REASON_LABELS).forEach(k => counts[k] = 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const log = loadLocal(`hq_log_${ds}`, null);
      if (!log) continue;
      log.skipped.forEach(s => { if (counts[s.reason_code] !== undefined) counts[s.reason_code]++; });
    }
    const max = Math.max(1, ...Object.values(counts));
    const sorted = Object.entries(counts).filter(([,v]) => v > 0).sort((a,b) => b[1] - a[1]);
    if (sorted.length === 0) {
      container.innerHTML = '<div class="empty">이번 주 미실행 없음 ✨</div>';
      return;
    }
    container.innerHTML = sorted.map(([k, v]) => `
      <div class="reason-bar-row">
        <span class="reason-label">${REASON_LABELS[k]}</span>
        <div class="reason-bar"><div class="reason-fill" style="width:${(v/max)*100}%"></div></div>
        <span class="reason-val">${v}</span>
      </div>
    `).join('');
  }

  // ====== Duo (Wife) ======
  function renderDuo() {
    const now = new Date();
    const weeks = Math.floor((now - LMP) / (7*24*3600*1000));
    const days = Math.floor((now - LMP) / (24*3600*1000));
    const dWeeks = weeks; const dDays = days % 7;
    const dDay = Math.ceil((EDD - now) / (24*3600*1000));
    document.getElementById('duoWeek').textContent = `임신 ${dWeeks}주차 ${dDays}일`;
    document.getElementById('duoEdd').textContent = `출산 예정 ${EDD.toISOString().slice(0,10)} (D-${dDay})`;

    // Wife care quests (today's wife-tagged quests + extras)
    const wifeQuests = (state.quest?.quests || []).filter(q => q.subdomain === 'wife');
    let qHtml = wifeQuests.length ? wifeQuests.map(q => {
      const isDone = state.log.completed.includes(q.id);
      return `<div class="duo-quest ${isDone?'done':''}">
        ${isDone ? '✅' : '⬜'} ${q.title}
      </div>`;
    }).join('') : '<div class="empty">오늘 와이프 케어 퀘스트 없음</div>';
    qHtml += `
      <div class="duo-quest-extra">추가 케어 활동 (선택)
        <ul>
          <li>엽산 챙겨드리기</li>
          <li>입덧 음식 준비</li>
          <li>편안한 자세 잡기</li>
          <li>10분 안마</li>
          <li>태교 음악·책 읽기</li>
        </ul>
      </div>
    `;
    document.getElementById('duoQuests').innerHTML = qHtml;

    // Progress: 임신 진행도
    const totalDays = (EDD - LMP) / (24*3600*1000);
    const elapsed = (now - LMP) / (24*3600*1000);
    const pct = Math.round((elapsed/totalDays)*100);
    document.getElementById('duoProgress').innerHTML = `
      <div class="season-bar"><div class="season-fill" style="width:${pct}%; background:linear-gradient(90deg,#ff6b6b,#ff9a3c)"></div></div>
      <div style="margin-top:6px;font-size:13px">임신 진행도 ${pct}%</div>
    `;

    // Weekly challenge
    document.getElementById('duoChallenge').innerHTML = `
      <div class="duo-challenge-item">🚶 함께 산책 30분 × 4회</div>
      <div class="duo-challenge-item">🥗 임산부 영양식 함께 1회</div>
      <div class="duo-challenge-item">📖 태교책 30분 × 1회</div>
    `;

    // Wife memo restore
    const todayWife = state.wifeLog[todayStr()] || {};
    if (todayWife.condition !== undefined) {
      document.getElementById('wifeCondition').value = todayWife.condition;
      document.getElementById('wifeConditionVal').textContent = todayWife.condition;
    }
    if (todayWife.memo) document.getElementById('wifeMemo').value = todayWife.memo;
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

  // ====== Actions ======
  function completeQuest(id) {
    const q = state.quest.quests.find(x => x.id === id);
    if (!q || state.log.completed.includes(id)) return;
    state.log.completed.push(id);
    state.log.skipped = state.log.skipped.filter(s => s.quest_id !== id);
    state.user.current_xp += q.xp;
    state.user.total_xp_lifetime += q.xp;
    state.user.lifetime_completed += 1;
    const statMap = {
      health: 'wellness', routine: 'discipline', research: 'research',
      wife: 'wellness', user_request: 'discipline', self_care: 'stamina',
      family: 'wellness', church: 'wellness'
    };
    const sk = statMap[q.category] || 'discipline';
    state.user.stats[sk] = Math.min(100, (state.user.stats[sk] || 0) + 1);

    const need = nextLevelXp(state.user.level);
    if (state.user.current_xp >= need) {
      state.user.current_xp -= need;
      state.user.level += 1;
      const li = getLevelInfo(state.user.level);
      showToast(`🎉 레벨업! Lv.${state.user.level} ${li.label}`);
    } else {
      showToast(`+${q.xp} XP`);
    }

    // Check if all complete → confetti
    const total = state.quest.quests.length;
    if (state.log.completed.length === total) {
      setTimeout(fireConfetti, 200);
      showToast('🎊 모든 퀘스트 완료! 대단합니다');
    }

    persist();
    render();
  }

  function undoQuest(id) {
    const q = state.quest.quests.find(x => x.id === id);
    if (!q) return;
    const wasDone = state.log.completed.includes(id);
    const wasSkipped = state.log.skipped.find(s => s.quest_id === id);
    if (wasDone) {
      state.log.completed = state.log.completed.filter(x => x !== id);
      state.user.current_xp -= q.xp;
      state.user.total_xp_lifetime -= q.xp;
      state.user.lifetime_completed -= 1;
      const statMap = {
        health: 'wellness', routine: 'discipline', research: 'research',
        wife: 'wellness', user_request: 'discipline', self_care: 'stamina',
        family: 'wellness', church: 'wellness'
      };
      const sk = statMap[q.category] || 'discipline';
      state.user.stats[sk] = Math.max(0, (state.user.stats[sk] || 0) - 1);
      while (state.user.current_xp < 0 && state.user.level > 1) {
        state.user.level -= 1;
        state.user.current_xp += nextLevelXp(state.user.level);
      }
      if (state.user.current_xp < 0) state.user.current_xp = 0;
      showToast(`↩️ 취소 (-${q.xp} XP)`);
    } else if (wasSkipped) {
      state.log.skipped = state.log.skipped.filter(s => s.quest_id !== id);
      showToast('↩️ 건너뜀 취소');
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
    if (!reason) { alert('사유를 선택해주세요'); return; }
    state.log.skipped.push({
      quest_id: state.pendingSkip,
      reason_code: reason.value,
      reason_text: document.getElementById('reasonMemo').value,
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
      text, applied_at: null, applied_to: [],
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

  function saveWifeMemo() {
    const today = todayStr();
    state.wifeLog[today] = {
      condition: parseInt(document.getElementById('wifeCondition').value),
      memo: document.getElementById('wifeMemo').value,
      saved_at: new Date().toISOString(),
    };
    saveLocal('hq_wifeLog', state.wifeLog);
    showToast('사모님 기록 저장됨');
  }

  function persist() {
    state.lastModified = Date.now();
    saveLocal('hq_user', state.user);
    saveLocal(`hq_log_${state.log.date}`, state.log);
    saveLocal('hq_inbox', state.inbox);
    saveLocal('hq_lastModified', state.lastModified);
    // Auto-sync if enabled (debounced)
    if (state.settings.ghToken && state.settings.ghRepo) {
      clearTimeout(window._syncTimer);
      window._syncTimer = setTimeout(syncPush, 3000);
    }
  }

  function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + target).classList.add('active');
        if (target === 'dashboard') { drawRadar(); drawReasonChart(); }
      });
    });
  }

  function setupSettings() {
    document.getElementById('settingsBtn').addEventListener('click', () => {
      document.getElementById('settingsModal').classList.add('show');
      document.getElementById('ghToken').value = state.settings.ghToken || '';
      document.getElementById('ghRepo').value = state.settings.ghRepo || 'seltsky/habit-tracker';
      document.querySelectorAll('.theme-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === (state.settings.theme || 'dark'));
      });
    });
    document.getElementById('settingsClose').addEventListener('click', () => {
      state.settings.ghToken = document.getElementById('ghToken').value.trim();
      state.settings.ghRepo = document.getElementById('ghRepo').value.trim();
      saveLocal('hq_settings', state.settings);
      document.getElementById('settingsModal').classList.remove('show');
    });
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.addEventListener('click', () => {
        state.settings.theme = b.dataset.theme;
        saveLocal('hq_settings', state.settings);
        document.body.dataset.theme = b.dataset.theme;
        document.querySelectorAll('.theme-btn').forEach(x => x.classList.toggle('active', x === b));
      });
    });
    document.getElementById('enableNotif').addEventListener('click', requestNotifPerm);
    document.getElementById('syncPushBtn').addEventListener('click', () => {
      state.settings.ghToken = document.getElementById('ghToken').value.trim();
      state.settings.ghRepo = document.getElementById('ghRepo').value.trim();
      saveLocal('hq_settings', state.settings);
      syncPush();
    });
    document.getElementById('syncPullBtn').addEventListener('click', () => {
      state.settings.ghToken = document.getElementById('ghToken').value.trim();
      state.settings.ghRepo = document.getElementById('ghRepo').value.trim();
      saveLocal('hq_settings', state.settings);
      syncPull();
    });
    document.getElementById('genQrBtn').addEventListener('click', generatePairQR);
    document.getElementById('clearLocal').addEventListener('click', () => {
      if (confirm('정말 모든 로컬 데이터를 초기화할까요?')) {
        const keep = state.settings;
        localStorage.clear();
        saveLocal('hq_settings', keep);
        location.reload();
      }
    });
  }

  async function init() {
    await loadAll();
    checkUrlHashForSync();
    // Reload settings if hash applied
    state.settings = Object.assign(state.settings, loadLocal('hq_settings', {}));
    setupTabs();
    setupSettings();
    render();

    // Modal events
    document.getElementById('modalCancel').addEventListener('click', closeSkipModal);
    document.getElementById('modalSave').addEventListener('click', saveSkip);
    document.getElementById('inboxAdd').addEventListener('click', addInboxItem);

    const er = document.getElementById('energyScore');
    const mr = document.getElementById('moodScore');
    er.addEventListener('input', () => document.getElementById('energyValue').textContent = er.value);
    mr.addEventListener('input', () => document.getElementById('moodValue').textContent = mr.value);
    document.getElementById('reflectionSave').addEventListener('click', saveReflection);

    if (state.log.energy_score) { er.value = state.log.energy_score; document.getElementById('energyValue').textContent = state.log.energy_score; }
    if (state.log.mood_score) { mr.value = state.log.mood_score; document.getElementById('moodValue').textContent = state.log.mood_score; }
    if (state.log.memo) document.getElementById('memoText').value = state.log.memo;

    const wc = document.getElementById('wifeCondition');
    wc.addEventListener('input', () => document.getElementById('wifeConditionVal').textContent = wc.value);
    document.getElementById('wifeSave').addEventListener('click', saveWifeMemo);

    if (state.settings.notif) scheduleNotif();
    // Auto-pull on startup if sync configured
    if (state.settings.ghToken && state.settings.ghRepo) syncPull();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
