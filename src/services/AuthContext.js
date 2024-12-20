import { isAccessTokenValid, checkAndReissueToken } from './TokenUtil';
import { jwtDecode } from 'jwt-decode';

const getAuth = () => {
  const token = localStorage.getItem('access');
  if (token) {
    if (isAccessTokenValid(token)) { //엑세스 토큰 검증
      assignRole(true); // 회원 권한 부여
    } else {
      handleRefreshToken(); //리프레쉬토큰로직
    }
  } else {
    handleRefreshToken(); //리프레쉬토큰로직
  }
}


// 리프레시 토큰 확인 및 처리 함수 -> 토큰 유틸로 분리해서 삽입
function handleRefreshToken (){
  if (checkRefreshToken) {
    // 엑세스 토큰 재발급 후 스토리지 저장
    console.log('엑세스 토큰 재발급');
    assignRole(true); // 회원 권한 부여
  } else {
    assignRole(false); // 비회원 권한 부여
  }
}


//권한부여
function assignRole(isUser) {
  if (isUser) {
    const decodedToken = jwtDecode(token);
    return {
      email: decodedToken.email,
      isLogIn: true,
      role: decodedToken.role === 'ROLE_ADMIN' ? 'admin' : decodedToken.role === 'ROLE_USER' ? 'user' : false,
  };
    console.log('회원 권한 부여');
  } else {
    return {
      email: null,
      isLogIn: false,
      role: false,
    };
    console.log('비회원 권한 부여');
  }
}