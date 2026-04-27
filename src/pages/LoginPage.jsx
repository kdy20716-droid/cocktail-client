import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/users";
import { toast } from "sonner";
import { useAuth } from "../Context/AuthContext";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .login-box {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-title {
    text-align: center;
    margin-bottom: 32px;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #444;
  }

  .form-group input {
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    border-color: #6c63ff;
  }

  .login-button {
    margin-top: 8px;
    padding: 12px;
    background-color: #6c63ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .login-button:hover {
    background-color: #574fd6;
  }

  .login-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #666;
  }

  .login-footer a {
    color: #6c63ff;
    font-weight: 500;
  }

  .login-footer a:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // AuthContsxt에서 login 함수를 가져옵니다.
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 서버에 로그인 요청을 보냅니다.
      const response = await loginApi(form);
      const data = await response.json();

      if (response.ok) {
        login(data); // 로그인 성공 시 context의 login 함수를 호출하여 상태 업데이트
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
    <LoginContainer>
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
    </LoginContainer>
  );
};

export default LoginPage;
