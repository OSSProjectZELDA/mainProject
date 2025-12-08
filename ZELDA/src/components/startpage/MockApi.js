// mockApi.js

// 가상의 데이터베이스 (새로고침하면 초기화됩니다)
let users = [
    { email: "test@example.com", password: "password123", name: "테스트유저" }
  ];
  
  // 로그인 시뮬레이션
  export const loginAPI = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          resolve({ success: true, user: { email: user.email, name: user.name } });
        } else {
          reject({ success: false, message: "이메일 또는 비밀번호가 일치하지 않습니다." });
        }
      }, 1000); // 1초 딜레이
    });
  };
  
  // 회원가입 시뮬레이션
  export const signupAPI = (userInfo) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find((u) => u.email === userInfo.email);
        if (existingUser) {
          reject({ success: false, message: "이미 존재하는 이메일입니다." });
        } else {
          users.push(userInfo);
          resolve({ success: true, message: "회원가입 성공! 로그인해주세요." });
        }
      }, 1000);
    });
  };