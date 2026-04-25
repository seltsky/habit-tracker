# Habit Tracker — AI Maintainer Guide

이 프로젝트를 인계받는 AI 에이전트를 위한 가이드입니다.

## 무엇인가

일일 습관 + 게임화된 퀘스트 PWA. 사용자(seltsky)의 건강·연구·관계·운동 루틴을 통합 추적합니다.

- Live: https://seltsky.github.io/habit-tracker/
- Repo: github.com/seltsky/habit-tracker

## 사용자 프로파일

- 의사·연구자, 프로그래밍 기초 부족
- 텔레그램으로 소통 (chat_id 6656604831)
- 한국어 답변, 존댓말, 마크다운 금지(불릿 OK)
- 임신한 부인 (2026-12-08 EDC)
- 다이어트 목표 (78→68-72kg)

## 기술 스택

- HTML + vanilla JS + CSS
- localStorage + GitHub repo data sync (data/quests/, data/sync/)
- PWA (manifest.json + sw.js)
- launchd 자동화 연동 (~/tools/habit-quest-gen/)
- GitHub Actions로 외부 데이터 fetch (data/external/)

## 핵심 컨셉

- 매일 5시 launchd가 새 퀘스트 자동 생성 → GitHub commit → GitHub Pages 자동 반영
- 8-12개 quests/day, XP·레벨·스트릭으로 게임화
- weekly_theme (회복/근력/관계/연구 등 7종 로테이션)
- 오늘의 새로움 (novelty pool, 매일 1개 신규 작업)
- 숨은 퀘스트 (30% 확률 랜덤 보너스)
- 임신 주차 dad_action 자동 매핑

## 파일 구조

```
habit-tracker/
├── index.html, app.js, style.css      현재 사용
├── index-legacy.html, app-legacy.js   이전 버전 (참고용, 건드리지 마세요)
├── sw.js, manifest.json               PWA
├── data/
│   ├── quests/YYYY-MM-DD.json         일일 퀘스트 (launchd가 자동 생성)
│   ├── external/YYYY-MM-DD.json       Google 캘린더·tasks 데이터
│   ├── sync/state.json                현재 상태
│   ├── novelty-pool.json              "오늘의 새로움" 풀 55개
│   ├── weekly-themes.json             주간 테마 7종
│   ├── bonus-pool.json                숨은 퀘스트 + 마일스톤 보상
│   ├── rest-rules.json                휴식·미니멈 모드
│   ├── pregnancy-weeks.json           임신 1-41주 매핑
│   ├── schema.md                      JSON 스키마 문서
│   └── wireframe.md                   UI 와이어프레임
├── scripts/                           외부 데이터 fetch 스크립트
└── apps-script/                       Google Apps Script 연동 코드
```

## 절대 하지 말 것

1. **기존 quest 파일 삭제·변경 금지** — 사용자 진행 기록임
2. **launchd 자동 생성 결과를 임의로 수정 금지** — 사용자가 보고 인지하기 전에 변경하면 혼란
3. **민감 정보 commit 금지** — 임신·건강·관계 데이터가 있어 신중. 다만 이 repo는 user 개인용 (현재 public이지만 데이터가 본인 것)
4. **legacy 파일 (app-legacy.js 등) 건드리지 마세요** — 백업 목적
5. **PWA 캐시 갱신 잊지 말 것** — sw.js의 CACHE 버전 ↑

## 자주 받을 요청

### "퀘스트 추가/수정"
- 보통 launchd가 자동 생성하므로 수동 수정 불필요
- 그래도 필요하면 `data/quests/YYYY-MM-DD.json` 직접 수정
- 변경 후 GitHub commit → GitHub Pages 1-3분 후 반영

### "테마/풀 항목 추가"
- weekly-themes.json, novelty-pool.json, bonus-pool.json 직접 수정
- 코드 변경 불필요

### "launchd 코치 시간 변경"
- ~/Library/LaunchAgents/com.seltsky.habit-quest-gen.plist
- StartCalendarInterval Hour/Minute 수정
- launchctl unload + load

### "새 카테고리 (예: 명상) 추가"
- 단순 task 추가는 launchd 프롬프트(generate.sh) 수정으로 가능
- UI 표시 변경 필요하면 app.js 검토

### "사모님 관련 알림 강화"
- pregnancy-weeks.json의 dad_action 활용
- weekly_theme adaptive_triggers에 family 조건 추가

## 변경 후 검증

- [ ] localStorage 기존 데이터 호환 (스키마 변경 시 마이그레이션)
- [ ] 폰 사이즈 OK (max-width 480px)
- [ ] sw.js 캐시 버전 ↑
- [ ] launchd 자동 생성 흐름 깨지지 않는지 확인 (generate.sh가 만드는 JSON 형식 검증)
- [ ] 텔레그램으로 사용자 보고

## 연결된 시스템

- **launchd 코치**: ~/tools/habit-quest-gen/generate.sh — 매일 5시 실행
- **routine 스킬**: ~/.claude/skills/routine/skill.md — 텔레그램 알림 (오후 5시·밤 10시)
- **메모리**: project_habit_webapp.md
- **다른 앱**: paper-pilot, soom, dosimetry-app, doppler-waveform 모두 같은 사용자

## 텔레그램 응답 톤

- 마크다운 금지 (`**`, `*`, `#`, `|`)
- 불릿(`-`) OK
- 존댓말, "선생님" OK
- 한 답변에 너무 많은 옵션 제시 금지

마지막 업데이트: 2026-04-26
