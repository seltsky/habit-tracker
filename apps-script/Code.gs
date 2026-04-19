/**
 * Habit Quest Bridge — Google Apps Script Web App
 *
 * 선생님 Google 계정으로 배포하면 영구 작동.
 * Calendar (모든 캘린더) + Tasks (모든 리스트) 데이터 제공.
 *
 * 엔드포인트
 *   GET ?action=both&date=today&token=YOUR_SECRET    → 캘린더+태스크
 *   GET ?action=calendar&date=2026-04-19&token=...   → 캘린더만
 *   GET ?action=tasks&token=...                      → 태스크만
 */

// ⚠️ 이 토큰은 본인만 알아야 함. 배포 후 절대 공개 X
var SHARED_SECRET = 'PUT_YOUR_SECRET_HERE';  // 아래 메시지에서 받은 토큰으로 교체

function doGet(e) {
  var token = (e && e.parameter && e.parameter.token) || '';
  if (token !== SHARED_SECRET) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  var action = (e.parameter.action || 'both').toLowerCase();
  var dateStr = (e.parameter.date || 'today').toLowerCase();

  var result = { generated_at: new Date().toISOString() };

  try {
    if (action === 'calendar' || action === 'both') {
      result.calendar = getCalendarEvents(dateStr);
    }
    if (action === 'tasks' || action === 'both') {
      result.tasks = getAllTasks();
    }
  } catch (err) {
    result.error = String(err);
  }

  return jsonResponse(result);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function getCalendarEvents(dateStr) {
  // KST 기준으로 날짜 경계 계산 (timezone-safe)
  var TZ_OFFSET_HOURS = 9; // Asia/Seoul = UTC+9
  var nowUtc = new Date();
  var nowKstMs = nowUtc.getTime() + TZ_OFFSET_HOURS * 3600 * 1000;
  var todayKst = new Date(nowKstMs);
  // KST 기준 0시
  todayKst.setUTCHours(0, 0, 0, 0);

  var start, end;
  if (dateStr === 'today') {
    start = todayKst;
  } else if (dateStr === 'tomorrow') {
    start = new Date(todayKst.getTime() + 24 * 3600 * 1000);
  } else if (dateStr === 'week') {
    start = todayKst;
  } else {
    // YYYY-MM-DD 입력 → KST 기준 그날 0시
    var parts = dateStr.split('-');
    start = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2], 0, 0, 0));
  }

  // KST 0시 → UTC 변환 (start는 UTC 기준 -9시간)
  var startUtc = new Date(start.getTime() - TZ_OFFSET_HOURS * 3600 * 1000);
  var days = (dateStr === 'week') ? 7 : 1;
  var endUtc = new Date(startUtc.getTime() + days * 24 * 3600 * 1000);

  start = startUtc;
  end = endUtc;

  var calendars = CalendarApp.getAllCalendars();
  var events = [];

  calendars.forEach(function (cal) {
    try {
      var calEvents = cal.getEvents(start, end);
      calEvents.forEach(function (ev) {
        events.push({
          calendar: cal.getName(),
          calendar_id: cal.getId(),
          title: ev.getTitle(),
          start: ev.getStartTime().toISOString(),
          end: ev.getEndTime().toISOString(),
          all_day: ev.isAllDayEvent(),
          location: ev.getLocation() || '',
          description: (ev.getDescription() || '').slice(0, 300)
        });
      });
    } catch (err) {
      // skip calendars with errors (e.g., 휴일 캘린더 일부)
    }
  });

  events.sort(function (a, b) {
    return a.start.localeCompare(b.start);
  });

  return events;
}

function getAllTasks() {
  // Tasks API는 Advanced Service로 활성화 필요 (설정 가이드 참고)
  if (typeof Tasks === 'undefined') {
    return { error: 'Tasks API 미활성화 — Apps Script 좌측 Services에서 Tasks API 추가 필요' };
  }

  var taskLists = (Tasks.Tasklists.list().items) || [];
  var allTasks = [];

  taskLists.forEach(function (list) {
    try {
      var tasks = (Tasks.Tasks.list(list.id, { showHidden: false, maxResults: 100 }).items) || [];
      tasks.forEach(function (t) {
        if (t.status !== 'completed') {
          allTasks.push({
            list_name: list.title,
            list_id: list.id,
            title: t.title,
            due: t.due || '',
            status: t.status,
            notes: (t.notes || '').slice(0, 300),
            updated: t.updated || ''
          });
        }
      });
    } catch (err) {
      // skip lists with errors
    }
  });

  return allTasks;
}

/**
 * 테스트 함수 — Apps Script 에디터에서 직접 실행해 권한 부여 트리거.
 * 실행 후 권한 동의 화면이 뜨면 Allow.
 */
function testRun() {
  var events = getCalendarEvents('today');
  Logger.log('Today events: ' + events.length);
  events.slice(0, 5).forEach(function (e) {
    Logger.log(e.start + ' [' + e.calendar + '] ' + e.title);
  });

  var tasks = getAllTasks();
  if (Array.isArray(tasks)) {
    Logger.log('Open tasks: ' + tasks.length);
    tasks.slice(0, 5).forEach(function (t) {
      Logger.log('- ' + t.title);
    });
  } else {
    Logger.log('Tasks: ' + JSON.stringify(tasks));
  }
}
