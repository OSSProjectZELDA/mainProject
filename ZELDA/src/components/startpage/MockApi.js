const API_URL = 'https://69363e59f8dc350aff30362b.mockapi.io/users'; 

// 1. 로그인 함수
export const loginAPI = async (email, password) => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append('email', email);
    url.searchParams.append('password', password);

    const response = await fetch(url);

    // MockAPI는 검색 결과가 없으면 404를 줍니다. -> 로그인 실패 처리
    if (response.status === 404) {
      throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const data = await response.json();

    // 데이터가 배열인지 확실하게 확인
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const user = data[0];
    return { 
      success: true, 
      user: { email: user.email, name: user.name, id: user.id } 
    };

  } catch (error) {
    throw { success: false, message: error.message };
  }
};

// 2. 회원가입 함수 (여기가 문제였음!)
export const signupAPI = async (userInfo) => {
  try {
    // --- [1단계] 중복 체크 ---
    const url = new URL(API_URL);
    url.searchParams.append('email', userInfo.email);

    const checkRes = await fetch(url);

    // 🚨 핵심 수정: 404(Not Found)가 뜨면 -> "중복 없음(가입 가능)"으로 판단!
    if (checkRes.status === 404) {
       // 아무것도 안 하고 통과! (가입 진행)
       console.log("이메일 중복 없음 (404 확인)"); 
    } else {
       // 404가 아니면(200 OK면), 데이터가 있다는 뜻이니 중복인지 확인
       const data = await checkRes.json();
       
       // 데이터가 배열이고 내용이 있으면 중복 에러 발생
       if (Array.isArray(data) && data.length > 0) {
          throw new Error("이미 존재하는 이메일입니다.");
       }
       // 만약 배열이 아니라면("Not found" 문자열 등), 그냥 무시하고 가입 진행
    }

    // --- [2단계] 회원가입 저장 ---
    const saveRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name,
      }),
    });

    if (!saveRes.ok) {
      throw new Error("회원가입 저장 실패");
    }

    return { success: true, message: "회원가입 성공! 로그인해주세요." };

  } catch (error) {
    console.error("회원가입 처리 중 에러:", error);
    throw { success: false, message: error.message };
  }
};