# NextJsProject
간단한 개발자 커뮤니티 사이트

# 프로젝트 정보
### 1. 제작기간
> 2024.9.8 ~ 2024.9.24

# 사용 기술
- NextJs
- Node.js
- Javascript
- MariaDB

# ERD
<details>
  <summary>ERD</summary>
  <img width="792" height="777" alt="Image" src="https://github.com/user-attachments/assets/5ff47960-a52a-4be5-9992-f74daa93c229" />
</details>

# 기능
로그인 & 회원가입
> nextauth 라이브러리, nodemailer 라이브러리, 토큰을 활용한 이메일 인증 회원가입

게시글
> 게시글 작성 및 삭제, 태그 추가, 이미지 업로드

Todo 리스트
> 로그인 후 Todo 리스트 사용 가능

다크모드
> next-themes 라이브러리 사용

# 스크린샷
<details>
  <summary>펼쳐보기</summary>
    <img width="1864" height="807" alt="Image" src="https://github.com/user-attachments/assets/8ad3d790-a937-4e45-afe0-eea90992f094" />
    <img width="1855" height="727" alt="Image" src="https://github.com/user-attachments/assets/21f52f2d-aec9-4fd8-9229-4b0903cc9b2e" />
    <img width="1856" height="680" alt="Image" src="https://github.com/user-attachments/assets/290973ea-daf7-4bb1-aa4d-9943b4522631" />
    <img width="1864" height="936" alt="Image" src="https://github.com/user-attachments/assets/787d5606-4349-473f-9a88-5841c181fa1c" />
</details>

# 느낀 점
- Nextjs에서 Css를 사용하기가 굉장히 불편해서 tailwind를 사용했는데 적용이 힘들었습니다
- 대부분의 로딩을 CSR로 해놨는데 게시글같은건 SSR로 하는게 좋을수도 있을 것 같습니다
