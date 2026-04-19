# Habit Tracker v5 Quest System — Data Schema

## 1. 디렉토리 구조

```
data/
├── schema.md              # 이 문서
├── user.json              # 사용자 프로필·레벨·스탯 (PWA가 업데이트)
├── identity.json          # 정체성·캐릭터 클래스 (수동 편집)
├── quests/
│   ├── 2026-04-19.json    # 일일 퀘스트 (클로드가 매일 5시 생성)
│   ├── 2026-04-20.json
│   └── ...
├── logs/
│   ├── 2026-04-19.json    # 일일 완료/미완료 + 사유 (PWA가 저장)
│   └── ...
└── inbox.json             # 사용자가 추가하고 싶은 항목 (PWA → 클로드)
```

## 2. 일일 퀘스트 (`quests/YYYY-MM-DD.json`)

```json
{
  "date": "2026-04-19",
  "generated_at": "2026-04-19T05:00:00+09:00",
  "generator": "claude-opus-4-7",
  "context": {
    "weekday": 6,
    "season": "month-april-2026",
    "weather_summary": "맑음 14~26°C",
    "yesterday_completion": 0.6,
    "recent_failure_pattern": ["시간부족", "잊음"],
    "user_inbox": ["내일 단백질 챙기고 싶음"]
  },
  "quests": [
    {
      "id": "q-2026-04-19-01",
      "type": "main",
      "category": "health",
      "identity": "liver",
      "title": "영양제 풀세트 + 물 한 잔",
      "description": "기상 후 우루사·비타민·양배추환·프로바이오틱스 + 물 500ml",
      "tier": "normal",
      "xp": 20,
      "estimated_minutes": 3,
      "tags": ["morning", "supplements"],
      "reasoning": "지난 7일 평균 80% 달성, 안정 단계 → 기본 유지"
    },
    {
      "id": "q-2026-04-19-02",
      "type": "daily",
      "category": "routine",
      "identity": "move",
      "title": "달리기 5km",
      "description": "공원 또는 트레드밀 5km 또는 30분 이상",
      "tier": "elite",
      "xp": 50,
      "estimated_minutes": 35,
      "tags": ["evening", "cardio"],
      "reasoning": "토요일 달리기 루틴, 최근 2주 75% 출석"
    },
    {
      "id": "q-2026-04-19-03",
      "type": "bonus",
      "category": "user_request",
      "identity": "liver",
      "title": "단백질 30g 추가 (사용자 요청)",
      "description": "끼니마다 단백질 챙기기 — 닭가슴살·계란·두부·요거트 중 택",
      "tier": "normal",
      "xp": 15,
      "estimated_minutes": 5,
      "tags": ["nutrition"],
      "reasoning": "어제 인박스에서 요청: '내일 단백질 챙기고 싶음'"
    },
    {
      "id": "q-2026-04-19-04",
      "type": "challenge",
      "category": "wife",
      "identity": "family",
      "title": "와이프와 산책 30분",
      "description": "임신 6주차 — 가벼운 산책으로 함께 시간",
      "tier": "easy",
      "xp": 10,
      "estimated_minutes": 30,
      "tags": ["evening", "family"],
      "reasoning": "주말 + 임신 초기 컨디션 케어"
    },
    {
      "id": "q-2026-04-19-05",
      "type": "main",
      "category": "research",
      "identity": "researcher",
      "title": "논문 30분",
      "description": "Dosimetry 논문 작성 또는 자료 정리 30분",
      "tier": "normal",
      "xp": 25,
      "estimated_minutes": 30,
      "tags": ["evening", "study"],
      "reasoning": "주말이지만 평일 부족분 보완"
    }
  ],
  "weekly_boss": {
    "id": "boss-2026-w16",
    "title": "운동 주 4회 + 11시 전 취침 5일",
    "deadline": "2026-04-20",
    "progress": 0.625,
    "reward_xp": 200
  },
  "morning_message": "토요일이네요. 어제 80% 완료하셨습니다. 오늘 단백질 챙기시는 거 잊지 마시고, 와이프와 산책도 잠깐. 충분히 할 수 있는 양으로 짰어요."
}
```

## 3. 일일 로그 (`logs/YYYY-MM-DD.json`) — PWA가 저장

```json
{
  "date": "2026-04-19",
  "updated_at": "2026-04-19T22:30:00+09:00",
  "completion_rate": 0.8,
  "completed": ["q-2026-04-19-01", "q-2026-04-19-02", "q-2026-04-19-03", "q-2026-04-19-04"],
  "skipped": [
    {
      "quest_id": "q-2026-04-19-05",
      "reason_code": "time",
      "reason_text": "병원 호출로 늦게 귀가, 논문 시간 못 냄",
      "skipped_at": "2026-04-19T22:25:00+09:00"
    }
  ],
  "mood_score": 7,
  "energy_score": 6,
  "memo": "주말 잘 보냈음. 운동 후 회복 빨랐음.",
  "tomorrow_request": "내일은 일요일이라 교회 + 가족시간이 메인. 짧은 운동만"
}
```

## 4. 사용자 프로필 (`user.json`) — PWA가 업데이트

```json
{
  "name": "선생님",
  "character_class": ["doctor", "researcher", "father-to-be"],
  "started_at": "2026-04-13",
  "level": 12,
  "current_xp": 240,
  "next_level_xp": 350,
  "total_xp_lifetime": 2840,
  "stats": {
    "stamina": 45,
    "discipline": 60,
    "focus": 38,
    "wellness": 52,
    "research": 30
  },
  "streak_current": 7,
  "streak_longest": 14,
  "season": "2026-04",
  "season_progress": 0.6,
  "badges": ["first_week", "no_alcohol_7", "run_50km"],
  "boss_record": {
    "won": 2,
    "lost": 1
  }
}
```

## 5. 사용자 인박스 (`inbox.json`) — PWA가 추가, 클로드가 읽고 비움

```json
{
  "items": [
    {
      "id": "in-001",
      "added_at": "2026-04-18T22:00:00+09:00",
      "text": "내일 단백질 챙기고 싶음",
      "applied_at": "2026-04-19T05:00:00+09:00",
      "applied_to": ["q-2026-04-19-03"]
    },
    {
      "id": "in-002",
      "added_at": "2026-04-19T21:00:00+09:00",
      "text": "다음주부터 매일 명상 5분",
      "applied_at": null,
      "applied_to": []
    }
  ]
}
```

## 6. 정체성 (`identity.json`) — 수동 편집

```json
{
  "identities": [
    { "id": "liver", "label": "간을 지키는 사람", "color": "#4ecca3" },
    { "id": "skin", "label": "깨끗한 피부를 가진 사람", "color": "#a3e0ff" },
    { "id": "move", "label": "매일 움직이는 사람", "color": "#ff9a3c" },
    { "id": "researcher", "label": "꾸준히 연구하는 의사", "color": "#b78aff" },
    { "id": "family", "label": "좋은 남편·아빠가 될 사람", "color": "#ff6b6b" }
  ]
}
```

## 7. 레벨 시스템

```
Lv 1~10  견습생       (1~2주, "갓 시작한 모험가")
Lv 11~25 수련자       (1~2개월, "꾸준함을 익힌 자")
Lv 26~50 숙련자       (3~6개월, "동료가 비결을 묻는다")
Lv 51~75 마스터       (6개월~1년, "체중·습관 목표 달성자")
Lv 76~99 전설         (1~2년, "1년간 95% 출석한 인플루언서급")
Lv 100   각성         (2년+, "습관이 곧 정체성이 된 자")
```

XP 계산: `next_level_xp = 100 + (level * 25)` (선형 증가)

## 7-A. 도메인 계층 (큰 그림)

각 퀘스트는 `domain`(큰 영역) + `subdomain`(세부 카테고리) 두 단계로 분류.
UI에서는 카드 상단에 `도메인 → 세부` breadcrumb으로 표시.

### 도메인 정의

```
🏋️ 운동 (exercise)
  ├─ 달리기 (run)
  ├─ 헬스 (gym)
  └─ 골프 (golf)

🩺 건강 (health)
  ├─ 영양제 (supplements)
  ├─ 단백질 (protein)
  ├─ 채소 (veggies)
  ├─ 수분 (water)
  ├─ 절주 (no_alcohol)
  └─ 수면 (sleep)

❤️ 관계 (relationship)
  ├─ 와이프 (wife)
  └─ 가족 (family)

⛪ 신앙 (faith)
  └─ 교회 (church)

📚 학습 (study)
  ├─ 영어 (english)
  └─ 연구 (research)

🌿 회복 (recovery)
  ├─ 스트레칭 (stretch)
  └─ 명상 (meditation)
```

### 도메인-정체성 매핑

```
운동       → 매일 움직이는 사람 (move)
건강       → 간을 지키는 사람 (liver) + 깨끗한 피부 (skin)
관계       → 좋은 남편·아빠 (family)
신앙       → 좋은 남편·아빠 (family)
학습       → 꾸준히 연구하는 의사 (researcher)
회복       → 깨끗한 피부 (skin) + 간 (liver)
```

### Quest JSON 필드 추가

```json
{
  "domain": "exercise",
  "subdomain": "run",
  ...
}
```

UI 표시: `🏋️ 운동 → 달리기`

## 8. 퀘스트 설계 원칙 (중요)

1. 단일 행동 원칙 — 한 퀘스트는 한 가지 행동만. "A + B" 묶음 금지.
   - 나쁨: "교회 + 가족 시간" (둘 중 하나만 했을 때 추적 불가)
   - 좋음: "교회 예배 참석" / "가족 점심"

2. 카테고리 정의
   - wife: 와이프 단독 시간 (임신 케어, 데이트, 대화)
   - family: 본가·처가·자녀 등 와이프 외 가족
   - church: 교회·신앙 활동
   - 위 셋은 의미가 겹치지 않게 명확히 구분

3. 같은 시간대에 동시 진행 가능한 활동은 별도 퀘스트로
   - 예: 가족 점심 + 와이프와 산책 → 둘 다 별도 퀘스트
   - 한 시간대에 여러 퀘스트 가능, 추적은 독립적

## 9. 사유 코드 (skipped reason_code)

```
time       시간부족
condition  컨디션 안 좋음
schedule   일정·약속
forgot     잊음
willpower  의지 부족
weather    날씨
emergency  응급/돌발
other      기타 (자유 입력)
```

클로드는 이 패턴을 분석해 다음날 퀘스트 난이도·시간·종류를 조정.
