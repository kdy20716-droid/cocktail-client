import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../api/recipes";
import "./RecipeDetailPage.css";

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL 주소에 있는 id 값을 가져옵니다.
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (error) {
        console.error("레시피를 불러오는데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // 로딩 중이거나 데이터가 없을 때의 화면
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>
    );
  }
  if (!recipe) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        레시피 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // DB에 문자열(JSON)로 저장된 재료와 만드는 방법을 배열로 변환 (오류 방지를 위해 try-catch 사용)
  let ingredients = [];
  let directions = [];
  try {
    ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
    if (!Array.isArray(ingredients)) ingredients = []; // 배열이 아니면 빈 배열로 강제 변환
  } catch (e) {
    console.error("재료 데이터 파싱 오류:", e);
  }
  try {
    directions = recipe.directions ? JSON.parse(recipe.directions) : [];
    if (!Array.isArray(directions)) directions = []; // 배열이 아니면 빈 배열로 강제 변환
  } catch (e) {
    console.error("만드는 방법 데이터 파싱 오류:", e);
  }

  return (
    <div className="detail-page">
      {/* 레시피 이미지 */}
      {recipe.image && <img src={recipe.image} alt={recipe.name} />}

      {/* 레시피 제목과 설명 */}
      <h2>{recipe.name}</h2>
      <p style={{ fontSize: "14px", color: "#888", marginBottom: "15px" }}>
        작성자: {recipe.author_name || "알 수 없음"}
      </p>
      <p>{recipe.description}</p>

      <h3>재료</h3>
      <ul className="ingredient-list">
        {ingredients.map((ing, index) => (
          <li key={index}>
            <span>{ing.name}</span>
            <span style={{ fontWeight: "bold", color: "#4b3a2f" }}>
              {ing.amount}
            </span>
          </li>
        ))}
      </ul>

      <h3>만드는 방법</h3>
      <ol className="direction-list">
        {directions.map((dir, index) => (
          <li key={index}>
            <span className="step-num">{index + 1}</span>
            <span>{dir}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetailPage;
