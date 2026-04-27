import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/users"; // login 함수 이름 충돌을 피하기 위해 이름 변경
import { useAuth } from "../context/AuthContext"; // AuthContext에서 useAuth hook 가져오기 (직접 생성 필요)
import "./LoginPage.css"; // CSS 파일 불러오기

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext의 login 함수 사용

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiLogin({ email, password });
      if (response.ok) {
        const data = await response.json();
        // 1. AuthContext를 통해 로그인 상태를 전역으로 업데이트합니다.
        login(data.user);
        alert(`${data.user.name}님 환영합니다!`);
        // 이제 navigate를 사용해도 Context의 영향으로 상단 메뉴바가 정상적으로 업데이트됩니다.
        navigate("/");
      } else {
        const data = await response.json();
        alert(`로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          required
        />
        <button className="login-button" type="submit">
          로그인
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        계정이 없으신가요? <Link to="/signup">회원가입하기</Link>
      </p>
    </div>
  );
};

export default LoginPage;
