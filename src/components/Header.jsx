import { Link } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { token } = useAuth();
  console.log("🔑 현재 저장된 토큰:", token); // 콘솔창에 현재 토큰 출력
  return (
    <>
      <header className="site-header">
        <div className="site-header__brand">
          <Link to="/" className="site-header__logo">
            칵테일 레시피
          </Link>
        </div>

        <nav className="site-header__nav">
          <Link className="site-header__link" to="/add">
            레시피 추가
          </Link>

          <Link className="site-header__link" to="/login">
            로그인
          </Link>

          <Link className="site-header__link" to="/signup">
            회원가입
          </Link>
        </nav>
      </header>
    </>
  );
};
export default Header;
