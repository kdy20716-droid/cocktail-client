import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <div className="container">
      <h2>회원가입</h2>
      <form>
        <input className="input" type="text" placeholder="이름" />
        <input className="input" type="text" placeholder="아이디" />
        <input className="input" type="password" placeholder="비밀번호" />
        <button className="btn">회원가입</button>
      </form>
    </div>
  );
};
export default RegisterPage;
