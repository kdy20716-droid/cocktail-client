import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/users";
import "./LoginPage.css";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 서버에 로그인 요청을 보냅니다.
      const response = await login(form);
      const data = await response.json();

      if (response.ok) {
        alert("로그인에 성공했습니다.");

        console.log("🔑 발급된 토큰:", data.token); // 콘솔창에 토큰 출력

        localStorage.setItem("user", JSON.stringify(data.user)); // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("token", data.token); // 발급받은 토큰도 로컬 스토리지에 함께 저장 (추후 API 인증에 사용)
        navigate("/"); // 전체 새로고침 없이 메인 페이지로 이동 (콘솔창 로그 유지)
      } else {
        alert(`로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <p className="login-footer">
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
