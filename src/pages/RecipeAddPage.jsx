import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext"; // AuthContext에서 useAuth hook 가져오기 (직접 생성 필요)
import "./RecipeAddPage.css";

const RecipeAddPage = () => {
  // 입력창에 들어가는 값들은 state로 관리
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth(); // AuthContext에서 user 정보 가져오기

  // 컴포넌트가 처음 화면에 나타날 때 로그인 상태를 확인합니다.
  useEffect(() => {
    // 이 로직은 라우터에서 <ProtectedRoute>를 구현하면 더 깔끔하게 관리할 수 있습니다.
    if (!user) {
      alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. useAuth() hook으로 이미 user 정보를 가지고 있으므로, 바로 사용합니다.
    if (!user) {
      alert("세션이 만료되었거나 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // 2. 서버로 보낼 데이터에 user_id를 포함시킵니다.
      const response = await addRecipe({
        user_id: user.id,
        name,
        image,
        description,
      });
      if (response.ok) {
        alert("레시피가 추가되었습니다.");
        navigate("/"); // 성공 시 메인 페이지로 이동
      } else {
        alert("레시피 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("레시피 추가 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className="recipe-add-container">
      <h2>레시피 추가</h2>
      <form className="recipe-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="레시피 이름 입력"
          required
        />
        <input
          type="text"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="레시피 이미지 URL 입력"
          required
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="레시피 설명 입력"
          required
        />
        <button className="recipe-add-button" type="submit">
          레시피 추가
        </button>
      </form>
    </div>
  );
};
export default RecipeAddPage;
