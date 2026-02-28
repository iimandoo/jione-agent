# Update Portfolio from PDF

주어진 PDF 파일을 읽고 `/data/data.ts`를 실제 내용으로 재구성합니다.

## Steps

1. **PDF 읽기**
   - `/resource/이력서.pdf` PDF를 Read 툴로 읽으세요
   - 읽을 수 없으면 사용자에게 경로를 다시 확인해달라고 요청하세요

2. **정보 추출**
   PDF에서 아래 항목을 추출하세요:
   - 이름, 직군/포지션, 한줄 소개 또는 요약문
   - 프로젝트 목록 (프로젝트명, 설명, 사용 기술/태그)
   - 기술스택 (카테고리별로 구분)
   - 연락처 (GitHub URL, 이메일)

3. **data.ts 업데이트**
   - `/data/data.ts`를 Read 툴로 먼저 읽은 뒤
   - 추출한 내용으로 `personal`, `socialLinks`, `projects`, `skills` 를 교체하고, data 를 좀 더 풍성하게 구성.
   - 기존 타입 구조(`Project`, `Skill`, `SocialLink`)는 유지하고, 다른 타입도 추가.
   - 프로젝트 이미지(`image`, `screenshots`)는 /resource 에 있는 png 파일명을 참고하여 프로젝트와 매칭시키고 포트폴리오를 완성.

4. **빌드 확인**

   ```bash
   cd portfolio && npm run build
   ```

   빌드 에러가 있으면 수정 후 재시도

5. **완료 보고**
   변경된 내용을 항목별로 요약 출력

## Rules

- PDF에 없는 정보는 임의로 추측하지 말고 기존 값 유지 또는 `TODO` 주석 처리
- 빌드 성공까지 완료로 간주

ARGUMENTS: $ARGUMENTS
