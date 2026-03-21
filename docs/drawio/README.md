# draw.io 다이어그램 (블로그용)

로그아웃 시 invalidateQueries 500 에러 문제 해결 과정을 정리한 다이어그램입니다.

## 파일 목록

| 파일                            | 설명                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| `01_workflow_overview.xml`      | 1) 워크플로우 개요 - 로그인 체크, 로그인 후/로그아웃 시 상태관리          |
| `02_my_understanding.xml`       | 2) 내가 이해했던 플로우 - enable 제어, invalidate로 캐시 초기화           |
| `03_actual_flow.xml`            | 3) 실제 동작 플로우 - 로그아웃 클릭 → 세션삭제 → redirect → invalidate    |
| `04_solution.xml`               | 4) 해결 방법 - setQueryData / removeQueries 코드                          |
| `05_invalidate_cache_cycle.xml` | 5) invalidateQueries 캐시 사이클 - refetch 시 enable가 동작하지 않는 이유 |

## 사용 방법

1. [draw.io](https://app.diagrams.net/) 또는 VS Code draw.io 확장 실행
2. **파일 → 열기** → 각 `.xml` 파일 선택
3. 또는 `.xml` 파일 확장자를 `.drawio`로 변경 후 draw.io에서 열기

## 블로그 포스팅 구조 제안

1. **문제발견**: 로그아웃 시 헤더의 값이 바로 바뀌지 않음 (로그인된 상태로 남음)
2. **과정**
    - 2-1: 워크플로우 확인 → `01_workflow_overview.xml`
    - 2-2: 내가 이해했던 플로우 → `02_my_understanding.xml`
    - 2-3: 콘솔 500 에러 확인 (캡처 첨부)
    - 2-4: 실제 동작 플로우 → `03_actual_flow.xml`
    - 2-5: invalidateQueries 캐시 사이클 → `05_invalidate_cache_cycle.xml`
3. **해결**: `04_solution.xml` + removeQueries 코드
4. **결과**: 정상 동작 확인
