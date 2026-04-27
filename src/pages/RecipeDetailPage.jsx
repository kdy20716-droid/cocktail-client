import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../api/recipes";
import "./RecipeDetailPage.css";

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL에서 레시피 ID를 가져옵니다.
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error("레시피 정보를 불러오는 데 실패했습니다.", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // id가 바뀔 때마다 데이터를 다시 불러옵니다.

  if (loading) return <div className="loading-message">로딩 중...</div>;
  if (error)
    return (
      <div className="error-message">
        레시피 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  if (!recipe)
    return <div className="error-message">레시피를 찾을 수 없습니다.</div>;

  return (
    <div className="detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; 뒤로 가기
      </button>
      <h1>{recipe.name}</h1>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="recipe-image-detail"
        />
      )}
      <p className="recipe-author">
        작성자: {recipe.author_name || "알 수 없음"}
      </p>
      <div className="recipe-description-detail">{recipe.description}</div>
      {/* TODO: 재료, 만드는 방법, 댓글, 좋아요 기능 추가 */}
    </div>
  );
};

export default RecipeDetailPage;
