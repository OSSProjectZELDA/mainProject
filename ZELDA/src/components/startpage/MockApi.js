const API_URL = 'https://69363e59f8dc350aff30362b.mockapi.io/users'; 

export const loginAPI = async (email) => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append('email', email);
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store', 
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    if (response.status === 404) {
      throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    
    // 이메일이 고유하다고 가정하고 첫 번째 사용자 반환
    return data[0];

  } catch (error) {
    throw { success: false, message: error.message };
  }
};

export const signupAPI = async (userInfo) => {
  try {
    // --- [1단계] 중복 체크 ---
    const url = new URL(API_URL);
    url.searchParams.append('email', userInfo.email);

    const checkRes = await fetch(url);

    
    if (checkRes.status === 404) {
       console.log("이메일 중복 없음 (404 확인)"); 
    } else {
       const data = await checkRes.json();
       
       if (Array.isArray(data) && data.length > 0) {
          throw new Error("이미 존재하는 이메일입니다.");
       }
    }

    // --- [2단계] 회원가입 저장 ---
    const saveRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        hashedPassword: userInfo.hashedPassword,
        salt: userInfo.salt,
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

export const updateUserAPI = async (userId, newInfo) => {
  try {
    const url = `${API_URL}/${userId}`; // ID로 특정 유저 지정
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInfo),
    });

    if (!response.ok) throw new Error("정보 수정 실패");
    
    return await response.json(); // 수정된 유저 정보 반환
  } catch (error) {
    throw { message: error.message };
  }
};

// 4. 회원 탈퇴
export const deleteUserAPI = async (userId) => {
  try {
    const url = `${API_URL}/${userId}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error("회원 탈퇴 실패");
    
    return await response.json();
  } catch (error) {
    throw { message: error.message };
  }
};