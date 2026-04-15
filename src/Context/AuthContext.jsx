import { createContext, useState, useEffect, useContext } from "react";

/*
    context : 여러 컴포넌트가 함께 쓸 수 있는 전역 공간
*/

const AuthContext = createContext(null);

/*
    provider : context를 사용할 수 있도록 감싸주는 컴포넌트
*/

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name"));

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    // state를 바꾸면 context를 사용하는 모든 컴포넌트가 즉시 랜더링
    setToken(data.token);
    setName(data.name);
  };

  // 로그아웃 : localStorafe + state 초기화
  const logout = () => {
    // localStorage에서 토큰과 이름 제거
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅 : context를 쉽게 사용할 수 있도록 하는 함수
export const useAuth = () => useContext(AuthContext);
