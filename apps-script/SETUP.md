# Apps Script Web App 설치 가이드

15분이면 끝납니다. 한 번만 하면 평생 작동.

## 0단계: 준비

비밀 토큰 (이걸 코드에 넣으세요)

```
32521223767f7834b1de4189ac52f3c3
```

## 1단계: Apps Script 프로젝트 만들기

1. https://script.google.com 열기 (Google 로그인 필요)
2. 좌측 상단 "새 프로젝트" 클릭
3. 프로젝트 이름 변경: 좌측 상단 "Untitled project" 클릭 → "Habit Quest Bridge"

## 2단계: 코드 붙여넣기

1. 기본으로 보이는 `Code.gs`의 내용을 모두 지움
2. `apps-script/Code.gs` 파일 전체 내용을 복사 → 붙여넣기
3. 11번째 줄 `var SHARED_SECRET = 'PUT_YOUR_SECRET_HERE';`에서 토큰을 위 0단계 토큰으로 교체
   ```javascript
   var SHARED_SECRET = '32521223767f7834b1de4189ac52f3c3';
   ```
4. 저장 (⌘S 또는 좌측 상단 디스크 아이콘)

## 3단계: Tasks API 활성화

1. 좌측 메뉴 "서비스" (➕ 모양) 클릭
2. "Tasks API" 검색 → 선택
3. "추가" 클릭
4. 좌측에 Tasks 항목 추가됨 확인

## 4단계: 권한 부여 (테스트 실행)

1. 상단 함수 선택 드롭다운에서 `testRun` 선택
2. "실행" 버튼 클릭
3. 권한 동의 화면 뜸:
   - "권한 검토" 클릭
   - 본인 Google 계정 선택
   - "이 앱은 Google에서 확인하지 않았습니다" → "고급" → "Habit Quest Bridge(안전하지 않음)으로 이동"
   - 권한 목록 확인 → "허용"
4. 실행 완료 후 좌측 하단 "실행 로그" 확인
   - "Today events: N", "Open tasks: N" 같은 로그 보이면 OK

## 5단계: Web App으로 배포

1. 우측 상단 "배포" → "새 배포"
2. 톱니바퀴 ⚙️ 아이콘 → "웹 앱" 선택
3. 설정:
   - 설명: "Habit Quest v1"
   - 다음 사용자로 실행: "나(본인 이메일)"
   - 액세스 권한: "모든 사용자" ⚠️ (토큰으로 보호하므로 OK)
4. "배포" 클릭
5. 권한 다시 확인 (위와 동일)
6. **Web App URL** 표시됨 — 복사
   - 예: `https://script.google.com/macros/s/AKfy.../exec`

## 6단계: URL을 텔레그램으로 보내주세요

복사한 URL을 텔레그램에 붙여넣어 주시면 제가 Habit Quest와 연동합니다.

⚠️ URL은 토큰 없이는 데이터 못 받으니 외부 노출되어도 거의 안전. 단 가능하면 비공개로 보관.

## 테스트

URL 받은 후 브라우저에서 직접 테스트 가능:

```
https://script.google.com/macros/s/AKfy.../exec?action=both&date=today&token=32521223767f7834b1de4189ac52f3c3
```

JSON 응답 보이면 성공.

## 향후 코드 수정 시

코드 변경 후 반드시:
1. 저장
2. "배포" → "배포 관리" → 기존 배포 옆 ✏️ → "새 버전" → 배포

URL은 그대로 유지됩니다.

## 문제 해결

❌ "Tasks가 정의되지 않았습니다"
→ 3단계 Tasks API 활성화 누락

❌ "401 unauthorized"
→ URL의 token 파라미터가 코드의 SHARED_SECRET과 다름

❌ "이 앱이 인증되지 않았습니다" 무한 반복
→ 4단계 "고급" 옵션 클릭, 강제 진행

❌ 캘린더 이벤트 0개
→ Calendar API는 권한 동의 시 자동 활성화됨. 4단계 testRun 다시 실행.

## 참고

- 무료 한도: 1일 6시간 실행 시간 (개인용은 절대 안 넘음)
- 응답 시간: 캘린더 6개 + 태스크 시 보통 2~3초
- 보안: 토큰을 git에 절대 commit X (gitignore에 .secret 같은 파일로 보관)
